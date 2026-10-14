export type StorageMode = 'blob' | 'local'

export function hasBlobCredentials() {
  // VERCEL_OIDC_TOKEN is injected and rotated at runtime, so it is not a
  // reliable deployment-time capability check. A connected store exposes its
  // BLOB_STORE_ID; the SDK resolves the short-lived OIDC token when it calls
  // Blob. Keep the static token as a local-development fallback.
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN)
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

