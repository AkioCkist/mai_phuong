import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'

export const ADMIN_COOKIE = 'mai_phuong_admin'
const SESSION_SECONDS = 60 * 60 * 12

function pin() {
  return process.env.ADMIN_PIN ?? ''
}

function signature(expires: string) {
  return createHmac('sha256', `mai-phuong-admin:${pin()}`).update(expires).digest('base64url')
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function isPinConfigured() {
  return pin().length >= 6
}

export function verifyPin(candidate: string) {
  return isPinConfigured() && safeEqual(candidate, pin())
}

export function createSessionValue() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS)
  return `${expires}.${signature(expires)}`
}

export function verifySessionValue(value?: string) {
  if (!value || !isPinConfigured()) return false
  const [expires, received, extra] = value.split('.')
  if (!expires || !received || extra || !/^\d+$/.test(expires)) return false
  if (Number(expires) <= Math.floor(Date.now() / 1000)) return false
  return safeEqual(received, signature(expires))
}

export async function isAdminAuthenticated() {
  return verifySessionValue((await cookies()).get(ADMIN_COOKIE)?.value)
}

export function isRequestAuthenticated(request: NextRequest) {
  return verifySessionValue(request.cookies.get(ADMIN_COOKIE)?.value)
}

export function setAdminCookie(response: NextResponse, value: string) {
  response.cookies.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_SECONDS,
  })
}

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === request.headers.get('host')
  } catch {
    return false
  }
}

