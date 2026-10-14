'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const MIN_SLOTS = 6

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(configured ? '' : 'Chưa cấu hình ADMIN_PIN tối thiểu 6 ký tự trong môi trường chạy.')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  // PIN can be longer than 6, so boxes grow with input instead of capping it
  const slots = Math.max(MIN_SLOTS, pin.length)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(result.error || 'Không thể đăng nhập.')
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể đăng nhập.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-dvh flex-col bg-paper px-4 py-6 sm:px-8">
      <a href="/" className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-mauve hover:text-rose">
        <ArrowLeft className="size-4" aria-hidden="true" /> Về trang chính
      </a>

      <div className="flex flex-1 items-center justify-center py-10">
        <section aria-labelledby="login-title" className="w-full max-w-[400px] animate-settle drop-shadow-[0_18px_32px_rgb(46_21_32/0.12)]">
          <div className="ticket rounded-2xl bg-sheet">
            <div className="px-6 pt-6 sm:px-8 sm:pt-8">
              <div className="flex items-center justify-between">
                <p className="label-mono text-rose">Backstage pass</p>
                <p className="label-mono text-mauve/70">Admin</p>
              </div>
              <h1 id="login-title" className="mt-8 font-display text-[2.5rem] font-bold leading-none tracking-[-0.02em] text-ink [font-stretch:88%]">
                Quản trị nội dung
              </h1>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-mauve">
                Nhập mã PIN để vào chỉnh sửa website.
              </p>

              <form onSubmit={submit} className="mt-8 pb-8">
                <label htmlFor="admin-pin" className="label-mono text-ink">Mã PIN</label>
                <div className="relative mt-3">
                  <div aria-hidden="true" className="flex gap-2">
                    {Array.from({ length: slots }, (_, index) => {
                      const filled = index < pin.length
                      const current = focused && (index === pin.length || (pin.length >= slots && index === slots - 1))
                      return (
                        <span
                          key={index}
                          className={cn(
                            'relative flex h-14 min-w-0 flex-1 items-center justify-center rounded-lg border bg-paper transition-colors',
                            error ? 'border-rose/60' : current ? 'border-rose bg-sheet ring-4 ring-rose/10' : filled ? 'border-mauve/40 bg-sheet' : 'border-line',
                            (!configured || loading) && 'opacity-60',
                          )}
                        >
                          {filled && <span className="size-2.5 animate-pop rounded-full bg-ink" />}
                          {current && !filled && <span className="h-6 w-px animate-pulse bg-rose" />}
                        </span>
                      )
                    })}
                  </div>
                  <input
                    id="admin-pin"
                    type="password"
                    inputMode="numeric"
                    autoComplete="current-password"
                    autoFocus
                    value={pin}
                    onChange={(event) => setPin(event.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    disabled={!configured || loading}
                    aria-invalid={Boolean(error) || undefined}
                    aria-describedby={error ? 'admin-pin-error' : 'admin-pin-hint'}
                    className="absolute inset-0 size-full cursor-text bg-transparent text-base text-transparent caret-transparent outline-none selection:bg-transparent disabled:cursor-not-allowed"
                  />
                </div>
                {error ? (
                  <p id="admin-pin-error" role="alert" className="mt-3 border-l-2 border-rose pl-3 text-sm text-rose">
                    {error}
                  </p>
                ) : (
                  <p id="admin-pin-hint" className="mt-3 text-xs text-mauve/80">Tối thiểu 6 ký tự · nhấn Enter để vào</p>
                )}
                <button
                  type="submit"
                  disabled={!configured || loading || !pin}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-paper transition-colors hover:bg-rose disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-mauve"
                >
                  {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
                  {loading ? 'Đang kiểm tra…' : 'Đăng nhập'}
                  {!loading && <ArrowRight className="size-4" aria-hidden="true" />}
                </button>
              </form>
            </div>

            <div className="flex h-[3.25rem] items-center justify-between border-t border-dashed border-line px-6 sm:px-8">
              <p className="label-mono text-mauve/80">Phiên · 12 giờ</p>
              <p className="label-mono text-mauve/80">Mai Phương</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
