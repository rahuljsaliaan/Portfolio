import { Section } from '@/components/layout/Section'
import { Reveal } from '@/components/ui/Reveal'
import { RichTextView } from '@/components/ui/RichText'
import { about } from '@/data/hero'

export function About() {
  return (
    <Section id="about" containerClassName="max-w-4xl">
      <div className="space-y-6 text-lg leading-relaxed text-foam-white/85 sm:text-xl">
        {about.paragraphs.map((para, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <p>
              <RichTextView segments={para} />
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
