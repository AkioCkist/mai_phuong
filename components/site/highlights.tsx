import Image from 'next/image'
import { events, highlights } from '@/lib/content'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

export function Highlights() {
  return (
    <section id="highlights" aria-labelledby="highlights-title" className="scroll-mt-16 px-4 pb-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="highlights-title"
          label="Highlights"
          title="Các sự kiện nổi bật"
          description="Sáu dấu mốc mình nhớ nhất, từ sự kiện đầu tiên đến mùa Trung thu năm nay."
        />

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, index) => {
            const event = events.find((candidate) => candidate.id === item.eventId)
            const cover = event?.photos?.[0]
            return (
              <li key={item.title} className="reveal">
                <article className="ticket group flex h-full flex-col bg-sheet transition-transform duration-200 ease-out hover:-translate-y-1">
                  {cover && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl border border-b-0 border-line bg-petal">
                      <Image
                        src={cover.src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col border border-b-0 border-line p-5 first:rounded-t-xl sm:p-6">
                    <p className="label-mono text-rose">{item.meta}</p>
                    <h3 className="mt-3 font-display text-xl font-bold leading-[1.15] tracking-[-0.01em] text-ink [font-stretch:92%]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-pretty text-[15px] leading-relaxed text-mauve">{item.text}</p>
                  </div>
                  <div aria-hidden="true" className="mx-4 border-t border-dashed border-ink/20" />
                  <div className="label-mono flex h-13 items-center justify-between gap-4 rounded-b-xl border border-t-0 border-line bg-petal/50 px-5 text-ink/70 transition-colors duration-200 group-hover:bg-petal sm:px-6">
                    <span aria-hidden="true">Admit one</span>
                    <span aria-hidden="true" className="text-rose">
                      № {index + 1}
                    </span>
                  </div>
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
