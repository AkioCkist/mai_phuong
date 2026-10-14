import type { GoalItem, SiteCopy, StatItem, StoryChapter } from '@/lib/content'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { StickyBounce } from './sticky-bounce'
import { ContentMedia } from './content-media'

export function AboutStory({ chapters, goals, stats, copy }: { chapters: StoryChapter[]; goals: GoalItem[]; stats: StatItem[]; copy: SiteCopy }) {
  return (
    <div className="px-4 pb-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="about-title"
          label={copy.about.label}
          title={copy.about.title}
          description={copy.about.description}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
          <StickyBounce className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative mx-auto aspect-[4/5] max-w-xs overflow-hidden rounded-2xl bg-[#f9ecdf] lg:max-w-none">
              <ContentMedia
                media={copy.storyMedia}
                sizes="(min-width: 1024px) 300px, 320px"
                className="object-cover object-center"
              />
            </div>

            <dl className="mx-auto mt-6 grid max-w-xs grid-cols-2 border-t border-line lg:max-w-none">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1 border-b border-line py-4 pr-3 odd:border-r odd:pr-4 even:pl-4">
                  <dt className="order-2 text-[13px] leading-snug text-mauve">{stat.label}</dt>
                  <dd className="order-1 font-display text-3xl font-bold tracking-tight text-ink [font-stretch:85%]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </StickyBounce>

          <ol className="flex flex-col">
            {chapters.map((chapter) => (
              <li
                key={chapter.label}
                className="reveal grid gap-2 border-t border-line py-7 first:border-t-0 first:pt-0 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-8"
              >
                <h3 className="label-mono pt-1.5 text-rose">{chapter.label}</h3>
                <p className="max-w-[62ch] text-pretty text-[17px] leading-[1.8] text-ink/85">{chapter.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="mt-20">
          <p className="label-mono text-mauve">{copy.aboutGoalsLabel}</p>
          <div className="mt-5 grid gap-10 md:grid-cols-2 md:gap-12">
            {goals.map((goal) => (
              <article key={goal.horizon} className="border-t-2 border-ink pt-5">
                <p className="label-mono text-rose">{goal.horizon}</p>
                <h3 className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.01em] text-ink [font-stretch:90%] sm:text-[28px]">
                  {goal.role}
                </h3>
                <p className="mt-4 max-w-[52ch] text-pretty text-[15px] leading-relaxed text-mauve">{goal.text}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
