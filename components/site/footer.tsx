import { ArrowUp } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-line px-4 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="label-mono text-mauve">Mai Phương – Calliope · 2026</p>
        <a
          href="#home"
          className="group label-mono inline-flex min-h-11 items-center gap-2 text-ink transition-colors hover:text-rose"
        >
          Về đầu trang
          <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  )
}
