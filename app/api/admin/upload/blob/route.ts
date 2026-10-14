import { issueSignedToken } from '@vercel/blob'
import {
  handleUploadPresigned,
  type HandleUploadPresignedBody,
} from '@vercel/blob/client'
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
  const body = (await request.json()) as HandleUploadPresignedBody
  try {
    const response = await handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname) => {
        if (!isRequestAuthenticated(request)) throw new Error('Phiên đăng nhập đã hết hạn.')
        if (!isSameOrigin(request)) throw new Error('Yêu cầu không hợp lệ.')
        const maxMb = Math.max(1, Number(process.env.MAX_UPLOAD_MB) || 100)
        const maximumSizeInBytes = maxMb * 1024 * 1024
        const validUntil = Date.now() + 10 * 60 * 1000
        return {
          token: await issueSignedToken({
            pathname,
            operations: ['put'],
            allowedContentTypes,
            maximumSizeInBytes,
            validUntil,
          }),
          urlOptions: {
            allowedContentTypes,
            maximumSizeInBytes,
            validUntil,
            addRandomSuffix: true,
            allowOverwrite: false,
          },
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
