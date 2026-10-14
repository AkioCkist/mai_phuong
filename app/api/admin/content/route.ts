import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { isRequestAuthenticated, isSameOrigin } from '@/lib/admin-auth'
import { getSiteContent, saveSiteContent } from '@/lib/content-store'

export async function GET(request: NextRequest) {
  if (!isRequestAuthenticated(request)) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 })
  return NextResponse.json(await getSiteContent())
}

export async function PUT(request: NextRequest) {
  if (!isRequestAuthenticated(request)) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 })
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 })
  try {
    const content = await saveSiteContent(await request.json())
    revalidatePath('/')
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Không thể lưu nội dung.' }, { status: 400 })
  }
}

