'use client'

import { createContext, useContext, useEffect, useId, useState, type ChangeEvent, type ReactNode } from 'react'
import { AlertDialog } from '@base-ui/react/alert-dialog'
import { uploadPresigned as uploadToBlob } from '@vercel/blob/client'
import { useRouter } from 'next/navigation'
import { Check, ChevronDown, ExternalLink, ImageIcon, LoaderCircle, LogOut, Plus, Save, Trash2, TriangleAlert, Upload } from 'lucide-react'
import type { EventCategory, Photo, SiteContent } from '@/lib/content'
import { cn } from '@/lib/utils'
import type { StorageMode } from '@/lib/storage-mode'

type Section = 'general' | 'highlights' | 'story' | 'events' | 'credentials' | 'contact'
type FieldKind = 'text' | 'textarea' | 'number' | 'checkbox' | 'select'
type FieldSpec = { key: string; label: string; kind?: FieldKind; options?: { value: string; label: string }[]; placeholder?: string }
type Row = Record<string, unknown>

const sections: { id: Section; label: string; description: string }[] = [
  { id: 'general', label: 'Tổng quan', description: 'Hero, hình ảnh và tiêu đề các mục' },
  { id: 'highlights', label: 'Nổi bật', description: 'Các dấu mốc nổi bật' },
  { id: 'story', label: 'Câu chuyện', description: 'Chương, mục tiêu và thống kê' },
  { id: 'events', label: 'Sự kiện', description: 'Kinh nghiệm và album media' },
  { id: 'credentials', label: 'Thành tích', description: 'Giải thưởng, chứng chỉ, ngôn ngữ' },
  { id: 'contact', label: 'Liên hệ', description: 'Email, mạng xã hội và số điện thoại' },
]

const categoryOptions: { value: EventCategory; label: string }[] = [
  { value: 'media', label: 'Truyền thông' },
  { value: 'logistics', label: 'Hậu cần' },
  { value: 'organizer', label: 'Ban tổ chức' },
  { value: 'backstage', label: 'Backstage' },
  { value: 'mentor', label: 'Mentor' },
  { value: 'volunteer', label: 'Tình nguyện' },
  { value: 'intern', label: 'Thực tập' },
]

const inputClass = 'mt-1.5 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm font-normal text-ink outline-none transition-colors placeholder:text-mauve/50 hover:border-mauve/40 focus:border-rose focus:bg-sheet focus:ring-4 focus:ring-rose/10'
const ghostButton = 'inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-mauve transition-colors hover:bg-petal hover:text-ink'
const addButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-dashed border-line px-4 text-sm font-semibold text-mauve transition-colors hover:border-rose hover:bg-petal/40 hover:text-ink'
const StorageModeContext = createContext<StorageMode>('local')

const pad = (n: number) => String(n).padStart(2, '0')

export function AdminDashboard({ initialContent, storageMode }: { initialContent: SiteContent; storageMode: StorageMode }) {
  const router = useRouter()
  const [content, setContent] = useState(initialContent)
  const [active, setActive] = useState<Section>('general')
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  function update(next: SiteContent) {
    setContent(next)
    setDirty(true)
    setMessage(null)
  }

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(content),
      })
      const result = (await response.json()) as SiteContent & { error?: string }
      if (!response.ok) throw new Error(result.error || 'Không thể lưu nội dung.')
      setContent(result)
      setDirty(false)
      setMessage({ type: 'success', text: 'Đã lưu và cập nhật trang chính.' })
    } catch (cause) {
      setMessage({ type: 'error', text: cause instanceof Error ? cause.message : 'Không thể lưu nội dung.' })
    } finally {
      setSaving(false)
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.refresh()
  }

  const activeIndex = sections.findIndex((section) => section.id === active)
  const current = sections[activeIndex]

  return (
    <StorageModeContext.Provider value={storageMode}>
    <main className="min-h-dvh bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <div className="min-w-0">
              <p className="label-mono text-rose">Backstage</p>
              <p className="truncate font-display text-lg font-bold leading-tight">Mai Phương</p>
            </div>
            <span className="hidden h-8 w-px bg-line sm:block" aria-hidden="true" />
            <p aria-live="polite" className="hidden items-center gap-2 text-sm text-mauve sm:flex">
              <span className={cn('size-2 rounded-full', saving ? 'animate-pulse bg-butter ring-1 ring-mauve/30' : dirty ? 'bg-rose' : 'bg-line ring-1 ring-mauve/30')} aria-hidden="true" />
              {saving ? 'Đang lưu…' : dirty ? 'Có thay đổi chưa lưu' : 'Đã lưu'}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <a href="/" target="_blank" rel="noreferrer" className={ghostButton} aria-label="Xem trang">
              <ExternalLink className="size-4" aria-hidden="true" /><span className="hidden md:inline">Xem trang</span>
            </a>
            <button type="button" onClick={logout} className={ghostButton} aria-label="Đăng xuất">
              <LogOut className="size-4" aria-hidden="true" /><span className="hidden md:inline">Đăng xuất</span>
            </button>
            <button type="button" onClick={save} disabled={!dirty || saving} className={cn('ml-1 inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed', dirty ? 'bg-rose text-white hover:bg-ink' : 'bg-ink/10 text-mauve')}>
              {saving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
              {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-10 lg:py-10">
        <nav aria-label="Các nhóm nội dung" className="-mx-4 min-w-0 px-4 sm:mx-0 sm:px-0 lg:sticky lg:top-24 lg:self-start">
          <p className="label-mono mb-3 hidden text-mauve/70 lg:block">Nội dung</p>
          <ul className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:gap-0.5 lg:overflow-visible">
            {sections.map((section, index) => {
              const isActive = active === section.id
              return (
                <li key={section.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setActive(section.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group relative flex min-h-11 w-full items-baseline gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                      isActive ? 'bg-sheet text-ink shadow-[inset_0_0_0_1px_var(--color-line)]' : 'text-mauve hover:bg-petal/60 hover:text-ink',
                    )}
                  >
                    {isActive && <span className="absolute inset-y-2 left-0 hidden w-0.5 rounded-full bg-rose lg:block" aria-hidden="true" />}
                    <span className={cn('font-mono text-xs tabular-nums', isActive ? 'text-rose' : 'text-mauve/60')}>{pad(index + 1)}</span>
                    <span className="min-w-0">
                      <span className="block whitespace-nowrap text-sm font-semibold">{section.label}</span>
                      <span className="hidden text-xs leading-snug text-mauve/80 lg:block">{section.description}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="mt-6 hidden border-t border-line pt-4 lg:block">
            <p className="label-mono text-mauve/70">Lưu trữ</p>
            <p className="mt-1 text-sm text-mauve">{storageMode === 'blob' ? 'Vercel Blob' : 'Ổ đĩa cục bộ'}</p>
          </div>
        </nav>

        <div className="min-w-0">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-line pb-5">
            <div>
              <p className="label-mono text-rose">{pad(activeIndex + 1)} / {pad(sections.length)}</p>
              <h1 className="mt-2 font-display text-[clamp(1.875rem,4vw,2.5rem)] font-bold leading-none tracking-[-0.02em] [font-stretch:88%]">{current.label}</h1>
              <p className="mt-2 text-pretty text-sm text-mauve">{current.description}</p>
            </div>
            <p aria-hidden="true" className="flex items-center gap-2 text-sm text-mauve sm:hidden">
              <span className={cn('size-2 rounded-full', dirty ? 'bg-rose' : 'bg-line ring-1 ring-mauve/30')} />
              {saving ? 'Đang lưu…' : dirty ? 'Chưa lưu' : 'Đã lưu'}
            </p>
          </header>

          {message && (
            <div role={message.type === 'error' ? 'alert' : 'status'} className={cn('mb-5 flex items-start gap-3 rounded-lg border-l-2 px-4 py-3 text-sm', message.type === 'success' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-rose bg-petal text-ink')}>
              {message.type === 'success' ? <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <TriangleAlert className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden="true" />}
              {message.text}
            </div>
          )}
          {active === 'general' && <GeneralSection content={content} update={update} />}
          {active === 'highlights' && <HighlightsSection content={content} update={update} />}
          {active === 'story' && <StorySection content={content} update={update} />}
          {active === 'events' && <EventsSection content={content} update={update} />}
          {active === 'credentials' && <CredentialsSection content={content} update={update} />}
          {active === 'contact' && <ContactSection content={content} update={update} />}
        </div>
      </div>
    </main>
    </StorageModeContext.Provider>
  )
}

function Panel({ title, description, aside, children }: { title: string; description?: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-6 rounded-xl border border-line bg-sheet">
      <div className="flex items-start justify-between gap-4 border-b border-line/70 px-4 py-4 sm:px-6">
        <div>
          <h2 className="text-balance font-display text-xl font-bold leading-tight">{title}</h2>
          {description && <p className="mt-1 text-pretty text-sm text-mauve">{description}</p>}
        </div>
        {aside}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  )
}

function Field({ label, value, onChange, kind = 'text', options, placeholder }: { label: string; value: unknown; onChange: (value: unknown) => void; kind?: FieldKind; options?: { value: string; label: string }[]; placeholder?: string }) {
  if (kind === 'checkbox') {
    return (
      <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-line bg-paper px-3 text-sm font-medium transition-colors hover:border-mauve/40 has-checked:border-rose/50 has-checked:bg-petal/50">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-rose" />
        {label}
      </label>
    )
  }
  return (
    <label className="block text-[13px] font-semibold text-ink/80">
      {label}
      {kind === 'textarea' ? (
        <textarea value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} rows={4} placeholder={placeholder} className={`${inputClass} resize-y py-2.5 leading-relaxed`} />
      ) : kind === 'select' ? (
        <span className="relative block">
          <select value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} className={`${inputClass} appearance-none pr-9`}>
            {options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 mt-[3px] size-4 -translate-y-1/2 text-mauve" aria-hidden="true" />
        </span>
      ) : (
        <input type={kind === 'number' ? 'number' : 'text'} value={String(value ?? '')} onChange={(event) => onChange(kind === 'number' ? Number(event.target.value) : event.target.value)} placeholder={placeholder} className={cn(inputClass, kind === 'number' && 'font-mono tabular-nums')} />
      )}
    </label>
  )
}

function MediaField({ label, media, onChange, imageOnly = false, showAlt = true }: { label: string; media: Photo; onChange: (media: Photo) => void; imageOnly?: boolean; showAlt?: boolean }) {
  const storageMode = useContext(StorageModeContext)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true); setError('')
    try {
      if (storageMode === 'blob') {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-')
        const blob = await uploadToBlob(`uploads/${safeName}`, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/upload/blob',
          multipart: file.size > 4 * 1024 * 1024,
        })
        onChange({ ...media, src: blob.url, type: file.type.startsWith('video/') ? 'video' : 'image', alt: media.alt || file.name })
      } else {
        const form = new FormData(); form.append('file', file)
        const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
        const result = (await response.json()) as { src?: string; type?: 'image' | 'video'; originalName?: string; error?: string }
        if (!response.ok || !result.src) throw new Error(result.error || 'Không thể upload.')
        onChange({ ...media, src: result.src, type: result.type, alt: media.alt || result.originalName || '' })
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể upload.') } finally { setUploading(false); event.target.value = '' }
  }
  return (
    <div>
      <p className="text-[13px] font-semibold text-ink/80">{label}</p>
      <div className="mt-1.5 flex flex-col gap-4 sm:flex-row">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border border-line bg-paper sm:w-44">
          {media.src ? (
            media.type === 'video' ? <video src={media.src} controls className="size-full object-cover" /> : <img src={media.src} alt={media.alt || ''} className="size-full object-cover" />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-1.5 text-mauve/60">
              <ImageIcon className="size-5" aria-hidden="true" />
              <span className="label-mono">Trống</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-sheet/80">
              <LoaderCircle className="size-5 animate-spin text-rose" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Field label="Đường dẫn" value={media.src} onChange={(src) => onChange({ ...media, src: String(src) })} />
          {showAlt && <Field label="Mô tả thay thế" value={media.alt} onChange={(alt) => onChange({ ...media, alt: String(alt) })} />}
          <label className={cn('inline-flex min-h-10 w-fit cursor-pointer items-center gap-2 rounded-lg border border-line bg-sheet px-3.5 text-sm font-semibold text-ink transition-colors hover:border-rose hover:text-rose has-focus-visible:outline-2 has-focus-visible:outline-rose', uploading && 'pointer-events-none opacity-60')}>
            <Upload className="size-4" aria-hidden="true" />
            {uploading ? 'Đang upload…' : imageOnly ? 'Chọn ảnh bìa' : 'Chọn ảnh hoặc video'}
            <input type="file" accept={imageOnly ? 'image/*' : 'image/*,video/mp4,video/webm,video/quicktime'} onChange={upload} disabled={uploading} className="sr-only" />
          </label>
        </div>
      </div>
      {error && <p role="alert" className="mt-2 border-l-2 border-rose pl-3 text-sm text-rose">{error}</p>}
    </div>
  )
}

function SubGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-line/70 pt-5 first:border-t-0 first:pt-0">
      <p className="label-mono mb-3 text-mauve">{title}</p>
      {children}
    </div>
  )
}

function GeneralSection({ content, update }: EditorProps) {
  const copy = content.copy
  const setProfile = (key: keyof SiteContent['profile'], value: string) => update({ ...content, profile: { ...content.profile, [key]: value } })
  const setCopy = (key: keyof SiteContent['copy'], value: unknown) => update({ ...content, copy: { ...copy, [key]: value } })
  const sectionFields: { key: 'highlights' | 'about' | 'experience' | 'achievements' | 'gallery' | 'contact'; label: string }[] = [{ key: 'highlights', label: 'Nổi bật' }, { key: 'about', label: 'Giới thiệu' }, { key: 'experience', label: 'Kinh nghiệm' }, { key: 'achievements', label: 'Thành tích' }, { key: 'gallery', label: 'Thư viện' }, { key: 'contact', label: 'Liên hệ' }]
  return (
    <>
      <Panel title="Thông tin chính" description="Hiển thị ở phần đầu trang chủ.">
        <div className="grid gap-5">
          <SubGroup title="Hồ sơ">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tên" value={content.profile.name} onChange={(v) => setProfile('name', String(v))} />
              <Field label="Biệt danh" value={content.profile.nickname} onChange={(v) => setProfile('nickname', String(v))} />
              <div className="sm:col-span-2"><Field label="Giới thiệu ngắn" kind="textarea" value={content.profile.overview} onChange={(v) => setProfile('overview', String(v))} /></div>
            </div>
          </SubGroup>
          <SubGroup title="Hero">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Dòng nhãn đầu trang" value={copy.heroEyebrow} onChange={(v) => setCopy('heroEyebrow', v)} />
              <Field label="Lĩnh vực" value={copy.heroSpecialties} onChange={(v) => setCopy('heroSpecialties', v)} />
              <Field label="Nút chính" value={copy.heroPrimaryCta} onChange={(v) => setCopy('heroPrimaryCta', v)} />
              <Field label="Nút liên hệ" value={copy.heroSecondaryCta} onChange={(v) => setCopy('heroSecondaryCta', v)} />
            </div>
          </SubGroup>
        </div>
      </Panel>
      <Panel title="Media chính" description="Có thể dán đường dẫn hoặc upload trực tiếp từ thiết bị.">
        <div className="grid gap-6 xl:grid-cols-2">
          <MediaField label="Ảnh/video bìa" media={copy.heroMedia} onChange={(v) => setCopy('heroMedia', v)} />
          <MediaField label="Ảnh/video câu chuyện" media={copy.storyMedia} onChange={(v) => setCopy('storyMedia', v)} />
        </div>
      </Panel>
      <Panel title="SEO và menu">
        <div className="grid gap-5">
          <SubGroup title="SEO">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tiêu đề trình duyệt" value={copy.siteTitle} onChange={(v) => setCopy('siteTitle', v)} />
              <Field label="Tên thương hiệu trên menu" value={copy.navBrand} onChange={(v) => setCopy('navBrand', v)} />
              <div className="sm:col-span-2"><Field label="Mô tả SEO" kind="textarea" value={copy.siteDescription} onChange={(v) => setCopy('siteDescription', v)} /></div>
            </div>
          </SubGroup>
          <SubGroup title="Menu">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {(['navHome','navEvents','navAbout','navGallery','navContact'] as const).map((key) => <Field key={key} label={`Menu ${key.replace('nav','')}`} value={copy[key]} onChange={(v) => setCopy(key, v)} />)}
            </div>
          </SubGroup>
        </div>
      </Panel>
      <Panel title="Tiêu đề các mục" description="Nhãn nhỏ, tiêu đề và mô tả cho từng phần trên trang chủ.">
        <div className="divide-y divide-line/70">
          {sectionFields.map(({ key, label }, index) => (
            <div key={key} className="grid gap-3 py-4 first:pt-0 last:pb-0 lg:grid-cols-[140px_minmax(0,1fr)] lg:gap-6">
              <p className="flex items-baseline gap-2 pt-1 font-semibold lg:pt-8">
                <span className="font-mono text-xs tabular-nums text-mauve/60">{pad(index + 1)}</span>{label}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Nhãn" value={copy[key].label} onChange={(v) => setCopy(key, { ...copy[key], label: String(v) })} />
                <Field label="Tiêu đề" value={copy[key].title} onChange={(v) => setCopy(key, { ...copy[key], title: String(v) })} />
                <Field label="Mô tả" value={copy[key].description} onChange={(v) => setCopy(key, { ...copy[key], description: String(v) })} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Nhãn và footer">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nhãn mục tiêu" value={copy.aboutGoalsLabel} onChange={(v) => setCopy('aboutGoalsLabel', v)} />
          <Field label="Nhãn chứng chỉ" value={copy.certificatesLabel} onChange={(v) => setCopy('certificatesLabel', v)} />
          <Field label="Nhãn ngôn ngữ" value={copy.languagesLabel} onChange={(v) => setCopy('languagesLabel', v)} />
          <Field label="Footer" value={copy.footer} onChange={(v) => setCopy('footer', v)} />
          <Field label="Nút về đầu trang" value={copy.backToTop} onChange={(v) => setCopy('backToTop', v)} />
        </div>
      </Panel>
    </>
  )
}

type EditorProps = { content: SiteContent; update: (content: SiteContent) => void }

const titleKeys = ['title', 'label', 'value', 'horizon']
const metaKeys = ['year', 'badge', 'meta', 'role', 'detail']
const texts = (item: Row, keys: string[]) => keys.map((key) => item[key]).filter((value) => (typeof value === 'string' && value.trim()) || typeof value === 'number').map(String)

function CollectionEditor({ title, description, items, fields, empty, onChange, renderExtra }: { title: string; description?: string; items: Row[]; fields: FieldSpec[]; empty: Row; onChange: (items: Row[]) => void; renderExtra?: (item: Row, index: number, change: (item: Row) => void) => ReactNode }) {
  const change = (index: number, item: Row) => onChange(items.map((current, i) => i === index ? item : current))
  return (
    <Panel title={title} description={description} aside={<span className="shrink-0 rounded-full bg-petal px-2.5 py-1 font-mono text-xs tabular-nums text-mauve">{items.length}</span>}>
      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <div className="rounded-lg border border-dashed border-line px-6 py-10 text-center">
            <p className="text-sm text-mauve">Chưa có nội dung.</p>
            <button type="button" onClick={() => onChange([{ ...empty }])} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-paper transition-colors hover:bg-rose">
              <Plus className="size-4" aria-hidden="true" />Thêm mục đầu tiên
            </button>
          </div>
        )}
        {items.map((item, index) => (
          <CollectionItem
            key={index}
            index={index}
            item={item}
            defaultOpen={items.length <= 4}
            onDelete={() => onChange(items.filter((_, i) => i !== index))}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(({ key, ...field }) => <div key={key} className={field.kind === 'textarea' ? 'sm:col-span-2' : field.kind === 'checkbox' ? 'self-end' : ''}><Field {...field} value={item[key]} onChange={(value) => change(index, { ...item, [key]: value })} /></div>)}
            </div>
            {renderExtra?.(item, index, (next) => change(index, next))}
          </CollectionItem>
        ))}
        {items.length > 0 && (
          <button type="button" onClick={() => onChange([...items, { ...empty }])} className={addButton}>
            <Plus className="size-4" aria-hidden="true" />Thêm mục
          </button>
        )}
      </div>
    </Panel>
  )
}

function CollectionItem({ index, item, defaultOpen, onDelete, children }: { index: number; item: Row; defaultOpen: boolean; onDelete: () => void; children: ReactNode }) {
  const heading = texts(item, titleKeys)[0] ?? ''
  const meta = texts(item, metaKeys).filter((text) => text !== heading).slice(0, 2).join(' · ')
  // new, still-empty items open so they can be filled straight away
  const [open, setOpen] = useState(defaultOpen || !heading)
  const bodyId = useId()
  return (
    <article className={cn('rounded-lg border bg-paper transition-colors', open ? 'border-line' : 'border-line/70 hover:border-line')}>
      <div className="flex items-center gap-2 pr-2">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={bodyId} className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-lg px-4 py-2 text-left">
          <span className="font-mono text-xs tabular-nums text-rose">{pad(index + 1)}</span>
          <span className="min-w-0 flex-1">
            <span className={cn('block truncate text-sm font-semibold', !heading && 'italic text-mauve/70')}>{heading || 'Chưa đặt tên'}</span>
            {meta && <span className="block truncate text-xs text-mauve">{meta}</span>}
          </span>
          <ChevronDown className={cn('size-4 shrink-0 text-mauve transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
        <DeleteButton label={`mục ${index + 1}`} onDelete={onDelete} />
      </div>
      {open && <div id={bodyId} className="border-t border-line/70 px-4 pb-5 pt-4">{children}</div>}
    </article>
  )
}

function DeleteButton({ label, onDelete }: { label: string; onDelete: () => void }) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger aria-label={`Xóa ${label}`} title={`Xóa ${label}`} className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-mauve/70 transition-colors hover:bg-red-50 hover:text-red-700">
        <Trash2 className="size-4" aria-hidden="true" />
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <AlertDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <AlertDialog.Popup className="w-full max-w-sm rounded-xl border border-line bg-sheet p-6 shadow-[0_24px_48px_-24px_rgb(46_21_32/0.4)] transition-[opacity,transform] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-50 text-red-700">
              <Trash2 className="size-4" aria-hidden="true" />
            </div>
            <AlertDialog.Title className="mt-4 font-display text-xl font-bold">Xóa {label}?</AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-pretty text-sm leading-relaxed text-mauve">Mục này sẽ bị xóa khỏi bản nháp. Thay đổi chỉ có hiệu lực sau khi bạn bấm “Lưu thay đổi”.</AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Close className="min-h-11 rounded-lg px-4 text-sm font-semibold text-mauve transition-colors hover:bg-petal hover:text-ink">Hủy</AlertDialog.Close>
              <AlertDialog.Close onClick={onDelete} className="min-h-11 rounded-lg bg-red-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-800">Xóa mục</AlertDialog.Close>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

function HighlightsSection({ content, update }: EditorProps) { return <CollectionEditor title="Các sự kiện nổi bật" items={content.highlights as unknown as Row[]} fields={[{ key: 'eventId', label: 'ID sự kiện liên kết' }, { key: 'meta', label: 'Thông tin ngắn' }, { key: 'title', label: 'Tiêu đề' }, { key: 'text', label: 'Mô tả', kind: 'textarea' }]} empty={{ eventId: '', meta: '', title: '', text: '' }} onChange={(items) => update({ ...content, highlights: items as unknown as SiteContent['highlights'] })} /> }

function StorySection({ content, update }: EditorProps) { return <><CollectionEditor title="Các chương câu chuyện" items={content.storyChapters as unknown as Row[]} fields={[{ key: 'label', label: 'Nhãn' }, { key: 'text', label: 'Nội dung', kind: 'textarea' }]} empty={{ label: '', text: '' }} onChange={(items) => update({ ...content, storyChapters: items as unknown as SiteContent['storyChapters'] })} /><CollectionEditor title="Mục tiêu" items={content.goals as unknown as Row[]} fields={[{ key: 'horizon', label: 'Thời gian' }, { key: 'role', label: 'Vai trò' }, { key: 'text', label: 'Mô tả', kind: 'textarea' }]} empty={{ horizon: '', role: '', text: '' }} onChange={(items) => update({ ...content, goals: items as unknown as SiteContent['goals'] })} /><CollectionEditor title="Thống kê" items={content.stats as unknown as Row[]} fields={[{ key: 'value', label: 'Giá trị' }, { key: 'label', label: 'Nhãn' }]} empty={{ value: '', label: '' }} onChange={(items) => update({ ...content, stats: items as unknown as SiteContent['stats'] })} /></> }

function EventsSection({ content, update }: EditorProps) {
  return <CollectionEditor title="Kinh nghiệm và sự kiện" description="Media đầu tiên trong album được dùng làm ảnh bìa nếu chưa đặt ảnh bìa riêng." items={content.events as unknown as Row[]} fields={[{ key: 'id', label: 'ID duy nhất' }, { key: 'year', label: 'Năm', kind: 'number' }, { key: 'title', label: 'Tên sự kiện' }, { key: 'role', label: 'Vai trò' }, { key: 'org', label: 'Đơn vị' }, { key: 'category', label: 'Nhóm', kind: 'select', options: categoryOptions }, { key: 'period', label: 'Thời gian' }, { key: 'inGallery', label: 'Hiện trong thư viện', kind: 'checkbox' }, { key: 'current', label: 'Đang làm hiện tại', kind: 'checkbox' }]} empty={{ id: `event-${Date.now()}`, year: new Date().getFullYear(), title: '', role: '', org: '', category: 'organizer', inGallery: true, current: false, period: '', cover: '', photos: [] }} onChange={(items) => update({ ...content, events: items as unknown as SiteContent['events'] })} renderExtra={(item, _index, change) => <><div className="mt-6 border-t border-line/70 pt-5"><MediaField label="Ảnh bìa riêng" media={{ src: String(item.cover || ''), type: 'image', alt: String(item.title || '') }} imageOnly showAlt={false} onChange={(cover) => change({ ...item, cover: cover.src })} /></div><MediaCollection media={(item.photos as Photo[]) || []} onChange={(photos) => change({ ...item, photos })} /></>} />
}

function MediaCollection({ media, onChange }: { media: Photo[]; onChange: (media: Photo[]) => void }) {
  return (
    <div className="mt-6 border-t border-line/70 pt-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-semibold">Album ảnh/video</h3>
        <span className="font-mono text-xs tabular-nums text-mauve">{media.length} tệp</span>
      </div>
      <div className="grid gap-3 2xl:grid-cols-2">
        {media.map((item, index) => (
          <div key={`${item.src}-${index}`} className="rounded-lg border border-line bg-sheet p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="label-mono text-rose">Media {pad(index + 1)}</span>
              <DeleteButton label={`media ${index + 1}`} onDelete={() => onChange(media.filter((_, i) => i !== index))} />
            </div>
            <MediaField label="Tệp" media={item} onChange={(next) => onChange(media.map((current, i) => i === index ? next : current))} />
            <div className="mt-3"><Field label="Chú thích" value={item.caption} onChange={(caption) => onChange(media.map((current, i) => i === index ? { ...current, caption: String(caption) } : current))} /></div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...media, { src: '', type: 'image', alt: '', caption: '' }])} className={cn(addButton, 'mt-3 w-full')}>
        <Plus className="size-4" aria-hidden="true" />Thêm media
      </button>
    </div>
  )
}

function CredentialsSection({ content, update }: EditorProps) { return <><CollectionEditor title="Giải thưởng" items={content.achievements as unknown as Row[]} fields={[{ key: 'title', label: 'Tên' }, { key: 'badge', label: 'Kết quả' }, { key: 'detail', label: 'Chi tiết', kind: 'textarea' }, { key: 'icon', label: 'Mã biểu tượng' }]} empty={{ title: '', badge: '', detail: '', icon: 'trophy' }} onChange={(items) => update({ ...content, achievements: items as unknown as SiteContent['achievements'] })} /><CollectionEditor title="Chứng chỉ" items={content.certificates as unknown as Row[]} fields={[{ key: 'title', label: 'Tên chứng chỉ' }, { key: 'detail', label: 'Thời gian / chi tiết' }]} empty={{ title: '', detail: '' }} onChange={(items) => update({ ...content, certificates: items as unknown as SiteContent['certificates'] })} /><CollectionEditor title="Ngôn ngữ" items={content.languages.map((value) => ({ value }))} fields={[{ key: 'value', label: 'Ngôn ngữ' }]} empty={{ value: '' }} onChange={(items) => update({ ...content, languages: items.map((item) => String(item.value)) })} /></> }

function ContactSection({ content, update }: EditorProps) {
  const contacts = content.contacts
  const set = (key: keyof SiteContent['contacts'], value: unknown) => update({ ...content, contacts: { ...contacts, [key]: value } })
  return <><Panel title="Thông tin liên hệ"><div className="grid gap-4 sm:grid-cols-2"><Field label="Email" value={contacts.email} onChange={(v) => set('email', v)} /><Field label="LinkedIn URL" value={contacts.linkedin} onChange={(v) => set('linkedin', v)} /><Field label="Facebook URL" value={contacts.facebook} onChange={(v) => set('facebook', v)} /><Field label="Số WhatsApp hiển thị" value={contacts.whatsappDisplay} onChange={(v) => set('whatsappDisplay', v)} /><div className="sm:col-span-2"><Field label="WhatsApp URL" value={contacts.whatsappLink} onChange={(v) => set('whatsappLink', v)} /></div></div></Panel><CollectionEditor title="Số điện thoại" items={contacts.phones.map((value) => ({ value }))} fields={[{ key: 'value', label: 'Số điện thoại' }]} empty={{ value: '' }} onChange={(items) => set('phones', items.map((item) => String(item.value)))} /></>
}
