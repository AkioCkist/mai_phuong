import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { get, put } from '@vercel/blob'
import { defaultSiteContent, type SiteContent } from './content'
import { assertWritableStorage, hasBlobCredentials } from './storage-mode'

const contentFile = process.env.CONTENT_DATA_PATH
  ? path.resolve(process.env.CONTENT_DATA_PATH)
  : path.join(process.cwd(), 'data', 'site-content.json')
const blobPathname = 'cms/site-content.json'

function cloneDefaults(): SiteContent {
  return JSON.parse(JSON.stringify(defaultSiteContent)) as SiteContent
}

function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<SiteContent>
  return Boolean(
    item.profile &&
      item.copy &&
      item.contacts &&
      Array.isArray(item.highlights) &&
      Array.isArray(item.storyChapters) &&
      Array.isArray(item.goals) &&
      Array.isArray(item.stats) &&
      Array.isArray(item.events) &&
      Array.isArray(item.achievements) &&
      Array.isArray(item.certificates) &&
      Array.isArray(item.languages),
  )
}

function withDefaults(stored: SiteContent): SiteContent {
  const defaults = cloneDefaults()
  return {
    ...defaults,
    ...stored,
    profile: { ...defaults.profile, ...stored.profile },
    copy: { ...defaults.copy, ...stored.copy },
    contacts: { ...defaults.contacts, ...stored.contacts },
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  if (hasBlobCredentials()) {
    try {
      const result = await get(blobPathname, { access: 'public', useCache: false })
      if (result?.statusCode === 200 && result.stream) {
        const stored = JSON.parse(await new Response(result.stream).text()) as unknown
        if (isSiteContent(stored)) return withDefaults(stored)
      }
    } catch (error) {
      console.error('Không thể đọc nội dung từ Vercel Blob:', error)
    }
  }

  try {
    const stored = JSON.parse(await readFile(contentFile, 'utf8')) as unknown
    return isSiteContent(stored) ? withDefaults(stored) : cloneDefaults()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return cloneDefaults()
    console.error('Không thể đọc nội dung website:', error)
    return cloneDefaults()
  }
}

export async function saveSiteContent(value: unknown): Promise<SiteContent> {
  if (!isSiteContent(value)) throw new Error('Dữ liệu nội dung không đúng định dạng.')
  const serialized = JSON.stringify(value, null, 2)
  if (Buffer.byteLength(serialized, 'utf8') > 2_000_000) {
    throw new Error('Dữ liệu nội dung vượt quá giới hạn 2 MB.')
  }

  if (hasBlobCredentials()) {
    await put(blobPathname, `${serialized}\n`, {
      access: 'public',
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      contentType: 'application/json; charset=utf-8',
    })
    return value
  }

  assertWritableStorage()
  await mkdir(path.dirname(contentFile), { recursive: true })
  await writeFile(contentFile, `${serialized}\n`, 'utf8')
  return value
}

