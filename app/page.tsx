import { AboutStory } from '@/components/site/about-story'
import { Contact } from '@/components/site/contact'
import { Experience } from '@/components/site/experience'
import { Footer } from '@/components/site/footer'
import { Gallery } from '@/components/site/gallery'
import { Hero } from '@/components/site/hero'
import { Highlights } from '@/components/site/highlights'
import { SiteNav } from '@/components/site/site-nav'

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-sheet px-4 py-2 font-semibold text-rose focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Bỏ qua điều hướng
      </a>
      <SiteNav />
      <main id="main">
        <Hero />
        <Highlights />
        <section id="about" aria-labelledby="about-title" className="scroll-mt-14">
          <AboutStory />
          <Experience />
        </section>
        <section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-14">
          <Gallery />
        </section>
        <section id="contact" aria-labelledby="contact-title" className="scroll-mt-14">
          <Contact />
        </section>
      </main>
      <Footer />
    </>
  )
}
