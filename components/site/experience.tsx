import { achievements, certificates, events, languages } from '@/lib/content'
import { SectionHeading } from './section-heading'

const years = [2026, 2025, 2024] as const

export function Experience() {
  return (
    <div className="border-y border-line bg-sheet px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <section aria-labelledby="exp-title">
            <SectionHeading id="exp-title" label="Experience" title="Kinh nghiệm" description="Mới nhất ở trên cùng." />

            <div className="mt-10 flex flex-col gap-12">
              {years.map((year) => {
                const items = events.filter((event) => event.year === year).reverse()
                return (
                  <div key={year} className="reveal grid gap-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-6">
                    <h3 className="font-display text-4xl font-extrabold leading-none tracking-[-0.03em] text-rose [font-stretch:80%] sm:sticky sm:top-20 sm:self-start">
                      {year}
                      <span className="sr-only"> · {items.length} hoạt động</span>
                    </h3>
                    <ol className="flex flex-col">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="group border-t border-line py-4 transition-colors first:border-t-0 first:pt-1 sm:first:pt-1.5"
                        >
                          {item.current && (
                            <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-butter px-2 py-0.5 text-xs font-semibold text-ink">
                              <span aria-hidden="true" className="size-1.5 rounded-full bg-rose" />
                              {item.period}
                            </p>
                          )}
                          <p className="label-mono text-mauve">{item.role}</p>
                          <p className="mt-1.5 text-pretty font-display text-lg font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-rose">
                            {item.title}
                          </p>
                          {item.org && <p className="mt-1 text-sm text-mauve">{item.org}</p>}
                        </li>
                      ))}
                    </ol>
                  </div>
                )
              })}
            </div>
          </section>

          <section aria-labelledby="achievements-title" className="lg:sticky lg:top-20 lg:self-start">
            <SectionHeading id="achievements-title" label="Certificate & Achievement" title="Giải thưởng" />

            <ul className="mt-10 flex flex-col">
              {achievements.map((item) => (
                <li key={item.title} className="reveal border-t border-line py-5 first:border-t-0 first:pt-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-lg font-semibold leading-snug text-ink">{item.title}</h3>
                    <span className="label-mono shrink-0 text-rose">{item.badge}</span>
                  </div>
                  <p className="mt-1 max-w-[52ch] text-pretty text-sm leading-relaxed text-mauve">{item.detail}</p>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-8 rounded-xl bg-paper p-6 sm:grid-cols-2">
              <div>
                <h3 className="label-mono text-mauve">Chứng chỉ</h3>
                <ul className="mt-3 flex flex-col gap-3">
                  {certificates.map((cert) => (
                    <li key={cert.title}>
                      <p className="text-sm font-semibold text-ink">{cert.title}</p>
                      <p className="font-mono text-xs text-mauve">{cert.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="label-mono text-mauve">Ngôn ngữ</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <li key={language} className="rounded-md border border-line bg-sheet px-2.5 py-1 text-sm font-medium text-ink">
                      {language}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
