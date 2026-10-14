import { AboutStory } from '@/components/site/about-story'
import { Contact } from '@/components/site/contact'
import { Experience } from '@/components/site/experience'
import { Footer } from '@/components/site/footer'
import { Gallery } from '@/components/site/gallery'
import { Hero } from '@/components/site/hero'
import { ScrollRuler } from '@/components/site/scroll-ruler'
import { Highlights } from '@/components/site/highlights'
import { SiteNav } from '@/components/site/site-nav'
import { getSiteContent } from '@/lib/content-store'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const content = await getSiteContent()
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-sheet px-4 py-2 font-semibold text-rose focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Bỏ qua điều hướng
      </a>
      <SiteNav copy={content.copy} />
      <ScrollRuler />
      <main id="main">
        <Hero profile={content.profile} copy={content.copy} events={content.events} />
        <Highlights items={content.highlights} events={content.events} copy={content.copy.highlights} />
        <section id="about" aria-labelledby="about-title" className="scroll-mt-14">
          <AboutStory chapters={content.storyChapters} goals={content.goals} stats={content.stats} copy={content.copy} />
          <Experience events={content.events} achievements={content.achievements} certificates={content.certificates} languages={content.languages} copy={content.copy} />
        </section>
        <section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-14">
          <Gallery events={content.events} copy={content.copy.gallery} />
        </section>
        <section id="contact" aria-labelledby="contact-title" className="scroll-mt-14">
          <Contact contacts={content.contacts} copy={content.copy.contact} />
        </section>
      </main>
      <Footer text={content.copy.footer} backToTop={content.copy.backToTop} />
    </>
  )
}
