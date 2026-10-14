import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { isRequestAuthenticated, isSameOrigin } from '@/lib/admin-auth'

const allowed = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
])

const extensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
}

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 })
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 })

  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'Chưa chọn tệp.' }, { status: 400 })
  if (!allowed.has(file.type)) return NextResponse.json({ error: 'Chỉ hỗ trợ ảnh JPG/PNG/WebP/GIF/AVIF và video MP4/WebM/MOV.' }, { status: 415 })

  const maxMb = Math.max(1, Number(process.env.MAX_UPLOAD_MB) || 100)
  if (file.size > maxMb * 1024 * 1024) {
    return NextResponse.json({ error: `Tệp vượt quá giới hạn ${maxMb} MB.` }, { status: 413 })
  }

  const uploadRoot = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadRoot, { recursive: true })
  const filename = `${Date.now()}-${randomUUID()}.${extensions[file.type]}`
  await writeFile(path.join(uploadRoot, filename), Buffer.from(await file.arrayBuffer()))
  return NextResponse.json({
    src: `/uploads/${filename}`,
    type: file.type.startsWith('video/') ? 'video' : 'image',
    originalName: file.name,
  })
}

