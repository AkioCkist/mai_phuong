import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextRequest, NextResponse } from 'next/server'
import { isRequestAuthenticated, isSameOrigin } from '@/lib/admin-auth'

const allowedContentTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]

export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody
  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!isRequestAuthenticated(request)) throw new Error('Phiên đăng nhập đã hết hạn.')
        if (!isSameOrigin(request)) throw new Error('Yêu cầu không hợp lệ.')
        const maxMb = Math.max(1, Number(process.env.MAX_UPLOAD_MB) || 100)
        return {
          allowedContentTypes,
          maximumSizeInBytes: maxMb * 1024 * 1024,
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Không thể upload tệp.' },
      { status: 400 },
    )
  }
}
