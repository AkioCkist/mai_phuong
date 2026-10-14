import { ArrowUp, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-cream to-petal px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-berry">
          Làm với
          <Heart className="size-4 fill-coral text-coral" aria-label="tình yêu" />
          bởi Mai Phương – Calliope · 2026
        </p>
        <a
          href="#home"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-rose shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
        >
          Về đầu trang
          <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  )
}
