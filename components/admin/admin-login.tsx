'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { KeyRound, LoaderCircle } from 'lucide-react'

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(configured ? '' : 'Chưa cấu hình ADMIN_PIN tối thiểu 6 ký tự trong môi trường chạy.')
  const [loading, setLoading] = useState(false)

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
    <main className="flex min-h-dvh items-center justify-center bg-paper px-4 py-12">
      <section aria-labelledby="login-title" className="w-full max-w-md rounded-2xl border border-line bg-sheet p-6 shadow-sm sm:p-8">
        <div className="flex size-11 items-center justify-center rounded-xl bg-petal text-rose">
          <KeyRound className="size-5" aria-hidden="true" />
        </div>
        <h1 id="login-title" className="mt-6 text-balance font-display text-3xl font-bold text-ink">
          Quản trị nội dung
        </h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-mauve">
          Nhập mã PIN quản trị để chỉnh sửa website. Phiên đăng nhập tự hết hạn sau 12 giờ.
        </p>
        <form onSubmit={submit} className="mt-7">
          <label htmlFor="admin-pin" className="text-sm font-semibold text-ink">Mã PIN</label>
          <input
            id="admin-pin"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            disabled={!configured || loading}
            className="mt-2 min-h-12 w-full rounded-lg border border-line bg-paper px-3 text-base text-ink outline-none focus:border-rose focus:ring-2 focus:ring-rose/20"
          />
          {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={!configured || loading || !pin}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
            {loading ? 'Đang kiểm tra…' : 'Đăng nhập'}
          </button>
        </form>
        <a href="/" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-mauve hover:text-rose">
          ← Về trang chính
        </a>
      </section>
    </main>
  )
}

