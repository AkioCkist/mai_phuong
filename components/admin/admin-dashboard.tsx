'use client'

import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react'
import { AlertDialog } from '@base-ui/react/alert-dialog'
import { useRouter } from 'next/navigation'
import { Check, ExternalLink, LoaderCircle, LogOut, Plus, Save, Trash2, Upload } from 'lucide-react'
import type { EventCategory, Photo, SiteContent } from '@/lib/content'
import { cn } from '@/lib/utils'

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

const inputClass = 'mt-1.5 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm text-ink outline-none focus:border-rose focus:ring-2 focus:ring-rose/20'

export function AdminDashboard({ initialContent }: { initialContent: SiteContent }) {
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

  return (
    <main className="min-h-dvh bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div>
            <p className="font-display text-xl font-bold">Quản trị nội dung</p>
            <p className="text-xs text-mauve">Mai Phương · Portfolio</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-mauve hover:bg-petal hover:text-ink">
              Xem trang <ExternalLink className="size-4" aria-hidden="true" />
            </a>
            <button type="button" onClick={logout} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-mauve hover:bg-petal hover:text-ink">
              <LogOut className="size-4" aria-hidden="true" /> Đăng xuất
            </button>
            <button type="button" onClick={save} disabled={!dirty || saving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-45">
              {saving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
              {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="Các nhóm nội dung" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {sections.map((section) => (
              <li key={section.id} className="shrink-0 lg:shrink">
                <button type="button" onClick={() => setActive(section.id)} className={cn('min-h-11 w-full rounded-lg px-3 py-2 text-left', active === section.id ? 'bg-ink text-paper' : 'text-mauve hover:bg-petal hover:text-ink')}>
                  <span className="block text-sm font-semibold">{section.label}</span>
                  <span className={cn('hidden text-xs lg:block', active === section.id ? 'text-paper/60' : 'text-mauve/70')}>{section.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          {message && (
            <div role={message.type === 'error' ? 'alert' : 'status'} className={cn('mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm', message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800')}>
              {message.type === 'success' && <Check className="size-4" aria-hidden="true" />}{message.text}
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
  )
}

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <section className="mb-5 rounded-xl border border-line bg-sheet p-4 sm:p-6"><h2 className="text-balance font-display text-2xl font-bold">{title}</h2>{description && <p className="mt-1 text-pretty text-sm text-mauve">{description}</p>}<div className="mt-5">{children}</div></section>
}

function Field({ label, value, onChange, kind = 'text', options, placeholder }: { label: string; value: unknown; onChange: (value: unknown) => void; kind?: FieldKind; options?: { value: string; label: string }[]; placeholder?: string }) {
  if (kind === 'checkbox') return <label className="flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-rose" />{label}</label>
  return <label className="block text-sm font-semibold text-ink">{label}{kind === 'textarea' ? <textarea value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} rows={4} placeholder={placeholder} className={`${inputClass} resize-y py-3`} /> : kind === 'select' ? <select value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} className={inputClass}>{options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input type={kind === 'number' ? 'number' : 'text'} value={String(value ?? '')} onChange={(event) => onChange(kind === 'number' ? Number(event.target.value) : event.target.value)} placeholder={placeholder} className={inputClass} />}</label>
}

function MediaField({ label, media, onChange }: { label: string; media: Photo; onChange: (media: Photo) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true); setError('')
    try {
      const form = new FormData(); form.append('file', file)
      const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const result = (await response.json()) as { src?: string; type?: 'image' | 'video'; originalName?: string; error?: string }
      if (!response.ok || !result.src) throw new Error(result.error || 'Không thể upload.')
      onChange({ ...media, src: result.src, type: result.type, alt: media.alt || result.originalName || '' })
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể upload.') } finally { setUploading(false); event.target.value = '' }
  }
  return <div className="rounded-lg border border-line bg-paper p-3"><p className="text-sm font-semibold">{label}</p>{media.src && <div className="mt-3 aspect-video max-w-sm overflow-hidden rounded-lg bg-petal">{media.type === 'video' ? <video src={media.src} controls className="size-full object-cover" /> : <img src={media.src} alt={media.alt || ''} className="size-full object-cover" />}</div>}<div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Đường dẫn" value={media.src} onChange={(src) => onChange({ ...media, src: String(src) })} /><Field label="Mô tả thay thế" value={media.alt} onChange={(alt) => onChange({ ...media, alt: String(alt) })} /></div><label className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-line bg-sheet px-4 text-sm font-semibold hover:border-rose"><Upload className="size-4" aria-hidden="true" />{uploading ? 'Đang upload…' : 'Chọn ảnh hoặc video'}<input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" onChange={upload} disabled={uploading} className="sr-only" /></label>{error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}</div>
}

function GeneralSection({ content, update }: EditorProps) {
  const copy = content.copy
  const setProfile = (key: keyof SiteContent['profile'], value: string) => update({ ...content, profile: { ...content.profile, [key]: value } })
  const setCopy = (key: keyof SiteContent['copy'], value: unknown) => update({ ...content, copy: { ...copy, [key]: value } })
  const sectionFields: { key: 'highlights' | 'about' | 'experience' | 'achievements' | 'gallery' | 'contact'; label: string }[] = [{ key: 'highlights', label: 'Nổi bật' }, { key: 'about', label: 'Giới thiệu' }, { key: 'experience', label: 'Kinh nghiệm' }, { key: 'achievements', label: 'Thành tích' }, { key: 'gallery', label: 'Thư viện' }, { key: 'contact', label: 'Liên hệ' }]
  return <><Panel title="Thông tin chính"><div className="grid gap-4 sm:grid-cols-2"><Field label="Tên" value={content.profile.name} onChange={(v) => setProfile('name', String(v))} /><Field label="Biệt danh" value={content.profile.nickname} onChange={(v) => setProfile('nickname', String(v))} /><div className="sm:col-span-2"><Field label="Giới thiệu ngắn" kind="textarea" value={content.profile.overview} onChange={(v) => setProfile('overview', String(v))} /></div><Field label="Dòng nhãn đầu trang" value={copy.heroEyebrow} onChange={(v) => setCopy('heroEyebrow', v)} /><Field label="Lĩnh vực" value={copy.heroSpecialties} onChange={(v) => setCopy('heroSpecialties', v)} /><Field label="Nút chính" value={copy.heroPrimaryCta} onChange={(v) => setCopy('heroPrimaryCta', v)} /><Field label="Nút liên hệ" value={copy.heroSecondaryCta} onChange={(v) => setCopy('heroSecondaryCta', v)} /></div></Panel><Panel title="SEO và menu"><div className="grid gap-4 sm:grid-cols-2"><Field label="Tiêu đề trình duyệt" value={copy.siteTitle} onChange={(v) => setCopy('siteTitle', v)} /><Field label="Tên thương hiệu trên menu" value={copy.navBrand} onChange={(v) => setCopy('navBrand', v)} /><div className="sm:col-span-2"><Field label="Mô tả SEO" kind="textarea" value={copy.siteDescription} onChange={(v) => setCopy('siteDescription', v)} /></div>{(['navHome','navEvents','navAbout','navGallery','navContact'] as const).map((key) => <Field key={key} label={`Menu ${key.replace('nav','')}`} value={copy[key]} onChange={(v) => setCopy(key, v)} />)}</div></Panel><Panel title="Media chính" description="Có thể dán đường dẫn hoặc upload trực tiếp từ thiết bị."><div className="grid gap-4 lg:grid-cols-2"><MediaField label="Ảnh/video bìa" media={copy.heroMedia} onChange={(v) => setCopy('heroMedia', v)} /><MediaField label="Ảnh/video câu chuyện" media={copy.storyMedia} onChange={(v) => setCopy('storyMedia', v)} /></div></Panel><Panel title="Tiêu đề các mục"><div className="grid gap-4">{sectionFields.map(({ key, label }) => <div key={key} className="rounded-lg border border-line p-4"><p className="font-semibold">{label}</p><div className="mt-3 grid gap-3 sm:grid-cols-3"><Field label="Nhãn" value={copy[key].label} onChange={(v) => setCopy(key, { ...copy[key], label: String(v) })} /><Field label="Tiêu đề" value={copy[key].title} onChange={(v) => setCopy(key, { ...copy[key], title: String(v) })} /><Field label="Mô tả" value={copy[key].description} onChange={(v) => setCopy(key, { ...copy[key], description: String(v) })} /></div></div>)}</div></Panel><Panel title="Nhãn và footer"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nhãn mục tiêu" value={copy.aboutGoalsLabel} onChange={(v) => setCopy('aboutGoalsLabel', v)} /><Field label="Nhãn chứng chỉ" value={copy.certificatesLabel} onChange={(v) => setCopy('certificatesLabel', v)} /><Field label="Nhãn ngôn ngữ" value={copy.languagesLabel} onChange={(v) => setCopy('languagesLabel', v)} /><Field label="Footer" value={copy.footer} onChange={(v) => setCopy('footer', v)} /><Field label="Nút về đầu trang" value={copy.backToTop} onChange={(v) => setCopy('backToTop', v)} /></div></Panel></>
}

type EditorProps = { content: SiteContent; update: (content: SiteContent) => void }

function CollectionEditor({ title, description, items, fields, empty, onChange, renderExtra }: { title: string; description?: string; items: Row[]; fields: FieldSpec[]; empty: Row; onChange: (items: Row[]) => void; renderExtra?: (item: Row, index: number, change: (item: Row) => void) => ReactNode }) {
  const change = (index: number, item: Row) => onChange(items.map((current, i) => i === index ? item : current))
  return <Panel title={title} description={description}><div className="flex flex-col gap-4">{items.length === 0 && <div className="rounded-lg border border-dashed border-line p-6 text-center"><p className="text-sm text-mauve">Chưa có nội dung.</p><button type="button" onClick={() => onChange([{ ...empty }])} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-paper"><Plus className="size-4" aria-hidden="true" />Thêm mục đầu tiên</button></div>}{items.map((item, index) => <article key={index} className="rounded-lg border border-line bg-paper p-4"><div className="mb-4 flex items-center justify-between gap-3"><p className="font-mono text-xs tabular-nums text-mauve">Mục {index + 1}</p><DeleteButton label={`mục ${index + 1}`} onDelete={() => onChange(items.filter((_, i) => i !== index))} /></div><div className="grid gap-4 sm:grid-cols-2">{fields.map(({ key, ...field }) => <div key={key} className={field.kind === 'textarea' ? 'sm:col-span-2' : ''}><Field {...field} value={item[key]} onChange={(value) => change(index, { ...item, [key]: value })} /></div>)}</div>{renderExtra?.(item, index, (next) => change(index, next))}</article>)}{items.length > 0 && <button type="button" onClick={() => onChange([...items, { ...empty }])} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-dashed border-line px-4 text-sm font-semibold text-mauve hover:border-rose hover:text-ink"><Plus className="size-4" aria-hidden="true" />Thêm mục</button>}</div></Panel>
}

function DeleteButton({ label, onDelete }: { label: string; onDelete: () => void }) {
  return <AlertDialog.Root><AlertDialog.Trigger className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-red-700 hover:bg-red-50"><Trash2 className="size-4" aria-hidden="true" />Xóa</AlertDialog.Trigger><AlertDialog.Portal><AlertDialog.Backdrop className="fixed inset-0 z-50 bg-ink/50" /><AlertDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4"><AlertDialog.Popup className="w-full max-w-md rounded-xl bg-sheet p-6 shadow-xl"><AlertDialog.Title className="font-display text-2xl font-bold">Xóa {label}?</AlertDialog.Title><AlertDialog.Description className="mt-2 text-pretty text-sm text-mauve">Mục này sẽ bị xóa khỏi bản nháp. Thay đổi chỉ có hiệu lực sau khi bạn bấm “Lưu thay đổi”.</AlertDialog.Description><div className="mt-6 flex justify-end gap-2"><AlertDialog.Close className="min-h-11 rounded-lg px-4 text-sm font-semibold text-mauve hover:bg-petal">Hủy</AlertDialog.Close><AlertDialog.Close onClick={onDelete} className="min-h-11 rounded-lg bg-red-700 px-4 text-sm font-semibold text-white">Xóa mục</AlertDialog.Close></div></AlertDialog.Popup></AlertDialog.Viewport></AlertDialog.Portal></AlertDialog.Root>
}

function HighlightsSection({ content, update }: EditorProps) { return <CollectionEditor title="Các sự kiện nổi bật" items={content.highlights as unknown as Row[]} fields={[{ key: 'eventId', label: 'ID sự kiện liên kết' }, { key: 'meta', label: 'Thông tin ngắn' }, { key: 'title', label: 'Tiêu đề' }, { key: 'text', label: 'Mô tả', kind: 'textarea' }]} empty={{ eventId: '', meta: '', title: '', text: '' }} onChange={(items) => update({ ...content, highlights: items as unknown as SiteContent['highlights'] })} /> }

function StorySection({ content, update }: EditorProps) { return <><CollectionEditor title="Các chương câu chuyện" items={content.storyChapters as unknown as Row[]} fields={[{ key: 'label', label: 'Nhãn' }, { key: 'text', label: 'Nội dung', kind: 'textarea' }]} empty={{ label: '', text: '' }} onChange={(items) => update({ ...content, storyChapters: items as unknown as SiteContent['storyChapters'] })} /><CollectionEditor title="Mục tiêu" items={content.goals as unknown as Row[]} fields={[{ key: 'horizon', label: 'Thời gian' }, { key: 'role', label: 'Vai trò' }, { key: 'text', label: 'Mô tả', kind: 'textarea' }]} empty={{ horizon: '', role: '', text: '' }} onChange={(items) => update({ ...content, goals: items as unknown as SiteContent['goals'] })} /><CollectionEditor title="Thống kê" items={content.stats as unknown as Row[]} fields={[{ key: 'value', label: 'Giá trị' }, { key: 'label', label: 'Nhãn' }]} empty={{ value: '', label: '' }} onChange={(items) => update({ ...content, stats: items as unknown as SiteContent['stats'] })} /></> }

function EventsSection({ content, update }: EditorProps) {
  return <CollectionEditor title="Kinh nghiệm và sự kiện" description="Media đầu tiên trong album được dùng làm ảnh bìa nếu chưa đặt đường dẫn bìa riêng." items={content.events as unknown as Row[]} fields={[{ key: 'id', label: 'ID duy nhất' }, { key: 'year', label: 'Năm', kind: 'number' }, { key: 'title', label: 'Tên sự kiện' }, { key: 'role', label: 'Vai trò' }, { key: 'org', label: 'Đơn vị' }, { key: 'category', label: 'Nhóm', kind: 'select', options: categoryOptions }, { key: 'period', label: 'Thời gian' }, { key: 'cover', label: 'Ảnh bìa riêng (URL)' }, { key: 'inGallery', label: 'Hiện trong thư viện', kind: 'checkbox' }, { key: 'current', label: 'Đang làm hiện tại', kind: 'checkbox' }]} empty={{ id: `event-${Date.now()}`, year: new Date().getFullYear(), title: '', role: '', org: '', category: 'organizer', inGallery: true, current: false, period: '', cover: '', photos: [] }} onChange={(items) => update({ ...content, events: items as unknown as SiteContent['events'] })} renderExtra={(item, _index, change) => <MediaCollection media={(item.photos as Photo[]) || []} onChange={(photos) => change({ ...item, photos })} />} />
}

function MediaCollection({ media, onChange }: { media: Photo[]; onChange: (media: Photo[]) => void }) {
  return <div className="mt-5 border-t border-line pt-5"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Album ảnh/video</h3><span className="font-mono text-xs tabular-nums text-mauve">{media.length} tệp</span></div><div className="grid gap-3 md:grid-cols-2">{media.map((item, index) => <div key={`${item.src}-${index}`} className="rounded-lg border border-line bg-sheet p-3"><MediaField label={`Media ${index + 1}`} media={item} onChange={(next) => onChange(media.map((current, i) => i === index ? next : current))} /><div className="mt-3"><Field label="Chú thích" value={item.caption} onChange={(caption) => onChange(media.map((current, i) => i === index ? { ...current, caption: String(caption) } : current))} /></div><div className="mt-2 flex justify-end"><DeleteButton label={`media ${index + 1}`} onDelete={() => onChange(media.filter((_, i) => i !== index))} /></div></div>)}</div><button type="button" onClick={() => onChange([...media, { src: '', type: 'image', alt: '', caption: '' }])} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-dashed border-line px-4 text-sm font-semibold text-mauve hover:border-rose hover:text-ink"><Plus className="size-4" aria-hidden="true" />Thêm media</button></div>
}

function CredentialsSection({ content, update }: EditorProps) { return <><CollectionEditor title="Giải thưởng" items={content.achievements as unknown as Row[]} fields={[{ key: 'title', label: 'Tên' }, { key: 'badge', label: 'Kết quả' }, { key: 'detail', label: 'Chi tiết', kind: 'textarea' }, { key: 'icon', label: 'Mã biểu tượng' }]} empty={{ title: '', badge: '', detail: '', icon: 'trophy' }} onChange={(items) => update({ ...content, achievements: items as unknown as SiteContent['achievements'] })} /><CollectionEditor title="Chứng chỉ" items={content.certificates as unknown as Row[]} fields={[{ key: 'title', label: 'Tên chứng chỉ' }, { key: 'detail', label: 'Thời gian / chi tiết' }]} empty={{ title: '', detail: '' }} onChange={(items) => update({ ...content, certificates: items as unknown as SiteContent['certificates'] })} /><CollectionEditor title="Ngôn ngữ" items={content.languages.map((value) => ({ value }))} fields={[{ key: 'value', label: 'Ngôn ngữ' }]} empty={{ value: '' }} onChange={(items) => update({ ...content, languages: items.map((item) => String(item.value)) })} /></> }

function ContactSection({ content, update }: EditorProps) {
  const contacts = content.contacts
  const set = (key: keyof SiteContent['contacts'], value: unknown) => update({ ...content, contacts: { ...contacts, [key]: value } })
  return <><Panel title="Thông tin liên hệ"><div className="grid gap-4 sm:grid-cols-2"><Field label="Email" value={contacts.email} onChange={(v) => set('email', v)} /><Field label="LinkedIn URL" value={contacts.linkedin} onChange={(v) => set('linkedin', v)} /><Field label="Facebook URL" value={contacts.facebook} onChange={(v) => set('facebook', v)} /><Field label="Số WhatsApp hiển thị" value={contacts.whatsappDisplay} onChange={(v) => set('whatsappDisplay', v)} /><div className="sm:col-span-2"><Field label="WhatsApp URL" value={contacts.whatsappLink} onChange={(v) => set('whatsappLink', v)} /></div></div></Panel><CollectionEditor title="Số điện thoại" items={contacts.phones.map((value) => ({ value }))} fields={[{ key: 'value', label: 'Số điện thoại' }]} empty={{ value: '' }} onChange={(items) => set('phones', items.map((item) => String(item.value)))} /></>
}
