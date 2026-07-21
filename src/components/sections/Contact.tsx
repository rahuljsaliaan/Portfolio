import { m } from 'framer-motion'
import { Mail } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { brandIcons } from '@/components/icons/brandIconMap'
import { contact } from '@/data/contact'
import type { Social } from '@/data/types'
import { useMagnetic } from '@/hooks/useMagnetic'

function SocialLink({ social }: { social: Social }) {
  const { ref, magneticProps, style } = useMagnetic<HTMLDivElement>()
  const Icon = brandIcons[social.id]
  return (
    <m.div ref={ref} {...magneticProps} style={style}>
      <a
        href={social.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${social.label} — ${social.handle}`}
        className="grid size-14 place-items-center rounded-2xl border border-current-cyan/15 bg-ocean-deep/60 text-drift-gray transition-colors hover:border-current-cyan/50 hover:text-current-cyan hover:shadow-[0_0_28px_-8px_var(--color-current-cyan)]"
      >
        <Icon className="size-6" />
      </a>
    </m.div>
  )
}

export function Contact() {
  return (
    <Section id="contact" containerClassName="max-w-3xl text-center">
      <Reveal>
        <p className="mx-auto max-w-xl text-lg text-drift-gray">{contact.blurb}</p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Button href={`mailto:${contact.email}`} icon={Mail}>
            {contact.ctaLabel}
          </Button>
          <a
            href={`mailto:${contact.email}`}
            className="font-mono text-sm text-drift-gray transition-colors hover:text-current-cyan"
          >
            {contact.email}
          </a>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {contact.socials.map((social) => (
            <SocialLink key={social.id} social={social} />
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
