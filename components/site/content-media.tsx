import Image from 'next/image'
import type { Photo } from '@/lib/content'
import { cn } from '@/lib/utils'

export function ContentMedia({ media, fill = true, priority = false, sizes, className, controls = false }: { media: Photo; fill?: boolean; priority?: boolean; sizes?: string; className?: string; controls?: boolean }) {
  if (media.type === 'video') {
    return <video src={media.src} controls={controls} muted={!controls} autoPlay={!controls} loop={!controls} playsInline className={cn('size-full object-cover', className)} aria-label={media.alt} />
  }
  return fill ? <Image src={media.src} alt={media.alt ?? ''} fill priority={priority} sizes={sizes} className={className} /> : <Image src={media.src} alt={media.alt ?? ''} width={1200} height={800} priority={priority} sizes={sizes} className={className} />
}

