import { Award, GraduationCap, Languages, Leaf, Medal, Rocket, Trophy, type LucideIcon } from 'lucide-react'
import { achievements, certificates, events, languages } from '@/lib/content'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

const achievementIcons: Record<(typeof achievements)[number]['icon'], LucideIcon> = {
  trophy: Trophy,
  rocket: Rocket,
  medal: Medal,
  graduation: GraduationCap,
  leaf: Leaf,
}

const years = [2026, 2025, 2024] as const

export function Experience() {
  return (
    <div className="bg-gradient-to-b from-transparent via-blush to-transparent px-5 pb-24 pt-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <section aria-labelledby="exp-title">
            <SectionHeading id="exp-title" index="03" label="Experience" description="Mới nhất ở trên cùng." />

            <div className="mt-10 flex flex-col gap-10">
              {years.map((year) => {
                const items = events.filter((event) => event.year === year).reverse()
                return (
                  <Reveal key={year}>
                    <h3 className="mb-4 font-display text-3xl font-light text-rose font-soft">/{year}/</h3>
                    <ol className="ml-2 border-l-2 border-dashed border-candy">
                      {items.map((item) => (
                        <li key={item.id} className="group relative pb-5 pl-6 last:pb-0">
                          <span
                            aria-hidden="true"
                            className="absolute -left-[7px] top-5 size-3 rounded-full bg-gradient-to-br from-coral to-rose ring-4 ring-cream transition-transform duration-300 group-hover:scale-150"
                          />
                          <div className="rounded-2xl border border-transparent bg-white/70 p-4 transition-all duration-300 group-hover:border-candy group-hover:bg-white group-hover:shadow-soft">
                            {item.current && (
                              <span className="mb-2 inline-block rounded-full bg-butter px-3 py-0.5 text-xs font-bold text-berry">
                                {item.period}
                              </span>
                            )}
                            <p className="text-sm font-bold text-rose">{item.role}</p>
                            <p className="mt-0.5 text-pretty font-display text-lg font-medium leading-snug text-berry font-soft">
                              {item.title}
                            </p>
                            {item.org && <p className="mt-1 text-sm text-mauve">{item.org}</p>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </Reveal>
                )
              })}
            </div>
          </section>

          <section aria-labelledby="achievements-title" className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeading id="achievements-title" index="04" label="Certificate & Achievement" />

            <ul className="mt-10 flex flex-col gap-3">
              {achievements.map((item, index) => {
                const Icon = achievementIcons[item.icon]
                return (
                  <li key={item.title}>
                    <Reveal delay={index * 70}>
                      <article className="flex gap-4 rounded-3xl bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-5">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-candy to-petal text-rose">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <span className="inline-block rounded-full bg-petal px-2.5 py-0.5 text-xs font-bold text-rose">
                            {item.badge}
                          </span>
                          <h3 className="mt-1.5 font-display text-lg font-medium leading-snug text-berry font-soft">
                            {item.title}
                          </h3>
                          <p className="mt-0.5 text-pretty text-sm leading-relaxed text-mauve">{item.detail}</p>
                        </div>
                      </article>
                    </Reveal>
                  </li>
                )
              })}
            </ul>

            <Reveal className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-petal bg-white/80 p-5">
                <h3 className="flex items-center gap-2 font-display text-lg font-medium text-berry font-soft">
                  <Award className="size-4 text-rose" aria-hidden="true" />
                  Chứng chỉ
                </h3>
                <ul className="mt-3 flex flex-col gap-3">
                  {certificates.map((cert) => (
                    <li key={cert.title}>
                      <p className="text-sm font-bold text-berry">{cert.title}</p>
                      <p className="text-sm text-mauve">{cert.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-petal bg-white/80 p-5">
                <h3 className="flex items-center gap-2 font-display text-lg font-medium text-berry font-soft">
                  <Languages className="size-4 text-rose" aria-hidden="true" />
                  Ngôn ngữ
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <li
                      key={language}
                      className="rounded-full bg-petal px-3 py-1 text-sm font-semibold text-berry transition-colors hover:bg-candy"
                    >
                      {language}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </div>
  )
}
