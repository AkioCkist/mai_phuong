import { NextRequest, NextResponse } from 'next/server'
import { createSessionValue, isPinConfigured, isSameOrigin, setAdminCookie, verifyPin } from '@/lib/admin-auth'

const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 })
  if (!isPinConfigured()) {
    return NextResponse.json({ error: 'Chưa cấu hình ADMIN_PIN (tối thiểu 6 ký tự).' }, { status: 503 })
  }

  const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const now = Date.now()
  const current = attempts.get(key)
  const attempt = !current || current.resetAt <= now ? { count: 0, resetAt: now + WINDOW_MS } : current
  if (attempt.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: 'Thử quá nhiều lần. Vui lòng chờ 10 phút.' }, { status: 429 })
  }

  const body = (await request.json().catch(() => ({}))) as { pin?: unknown }
  if (typeof body.pin !== 'string' || !verifyPin(body.pin)) {
    attempt.count += 1
    attempts.set(key, attempt)
    return NextResponse.json({ error: 'Mã PIN không đúng.' }, { status: 401 })
  }

  attempts.delete(key)
  const response = NextResponse.json({ ok: true })
  setAdminCookie(response, createSessionValue())
  return response
}

