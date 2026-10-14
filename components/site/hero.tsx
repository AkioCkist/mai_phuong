import Image from 'next/image'
import { ArrowDown, Heart } from 'lucide-react'
import { profile } from '@/lib/content'
import { Reveal } from './reveal'
import { Sparkle } from './sparkle'

function Dice({ className, rotate, slow }: { className: string; rotate: string; slow?: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{ '--r': rotate } as React.CSSProperties}
      className={`absolute ${slow ? 'animate-float-slow' : 'animate-float'} ${className}`}
    >
      <Image
        src="/images/dice-cutout.png"
        alt=""
        fill
        sizes="200px"
        className="object-contain drop-shadow-[0_18px_22px_rgba(214,86,120,0.28)]"
      />
    </div>
  )
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-[#fbc3cf] via-[#fddbe1] to-cream px-5 pb-20 pt-28 sm:px-8 sm:pt-32"
    >
      <Sparkle className="left-[3%] top-56 size-6 text-coral" />
      <Sparkle className="right-[8%] top-52 size-10 text-coral" delay={1.2} />
      <Sparkle className="right-[6%] top-[28rem] size-5 text-white" delay={0.6} />
      <Sparkle className="left-[4%] top-[34rem] size-8 text-white" delay={1.8} />

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 font-display text-base font-soft text-berry sm:text-xl">
            <span>/Event Management/</span>
            <span className="hidden sm:inline">/Truyền thông & HR Admin/</span>
            <span>
              /{profile.name} – {profile.nickname}/
            </span>
          </div>
        </Reveal>

        <div className="relative mt-10 sm:mt-14">
          <Reveal delay={100}>
            <p aria-hidden="true" className="font-display text-xl font-soft text-berry sm:text-3xl">
              /2026/
            </p>
            <h1 className="font-display font-soft text-[clamp(3rem,15.5vw,14rem)] font-light uppercase leading-[0.9] tracking-tight text-gradient-rose">
              <span className="sr-only">{profile.name} ({profile.nickname}) — </span>
              Portfolio
            </h1>
          </Reveal>
        </div>

        <Reveal delay={250}>
          <div className="relative mx-auto mt-6 max-w-5xl sm:mt-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#ffe1e8] via-[#ffc3d0] to-[#f8a0ae] shadow-lift sm:aspect-[16/7] sm:rounded-full">
              <Image
                src="/images/mascot.png"
                alt="Nhân vật hoạt hình dễ thương đeo kính, ôm thanh phô mai que hồng giữa những đám mây"
                fill
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover mix-blend-multiply"
              />
            </div>
            <Dice className="-left-3 bottom-2 size-28 sm:-left-8 sm:-bottom-6 sm:size-48" rotate="-10deg" />
            <Dice className="-right-2 -top-6 size-24 sm:-right-6 sm:-top-12 sm:size-44" rotate="12deg" slow />
            <Dice className="right-[18%] bottom-0 hidden size-24 opacity-70 blur-[1px] sm:block" rotate="20deg" slow />
          </div>
          <p
            aria-hidden="true"
            className="mt-6 text-center font-display text-xl font-soft uppercase tracking-widest text-rose sm:text-3xl"
          >
            /Welcome/
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-white/80 bg-white/70 p-6 text-center shadow-soft backdrop-blur-sm sm:p-9">
            <p className="text-pretty text-base leading-relaxed text-berry sm:text-lg">{profile.overview}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#about"
                className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-rose px-6 text-sm font-bold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
              >
                Xem hành trình của mình
                <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-candy bg-white px-6 text-sm font-bold text-rose transition-all duration-300 hover:-translate-y-0.5 hover:bg-petal"
              >
                Nhắn mình nhé
                <Heart className="size-4 transition-transform duration-300 group-hover:scale-125" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
