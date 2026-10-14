import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, isSameOrigin } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 })
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 })
  return response
}

