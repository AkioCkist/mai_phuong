export type StorageMode = 'blob' | 'local'

export function hasBlobCredentials() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  )
}

export function storageMode(): StorageMode {
  return hasBlobCredentials() ? 'blob' : 'local'
}

export function assertWritableStorage() {
  if (process.env.VERCEL && !hasBlobCredentials()) {
    throw new Error(
      'Chưa kết nối Vercel Blob. Vào Vercel → Storage → Create Database → Blob, tạo Public store và kết nối với project.',
    )
  }
}

