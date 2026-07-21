import { Section } from '@/components/layout/Section'
import { Reveal } from '@/components/ui/Reveal'
import { RichTextView } from '@/components/ui/RichText'
import { about } from '@/data/hero'

export function About() {
  return (
    <Section id="about" containerClassName="max-w-4xl">
      <Reveal>
        <p className="mb-10 font-display text-2xl leading-snug text-foam-white sm:text-3xl">
          {about.lead}
        </p>
      </Reveal>
      <div className="space-y-6 text-lg leading-relaxed text-foam-white/80 sm:text-xl">
        {about.paragraphs.map((para, i) => (
          <Reveal key={i} delay={0.05 + i * 0.05}>
            <p>
              <RichTextView segments={para} />
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
