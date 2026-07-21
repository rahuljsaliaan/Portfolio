import { EnvProvider } from '@/providers/EnvProvider'
import { MotionConfigProvider } from '@/providers/MotionConfigProvider'
import { Navbar } from '@/components/layout/Navbar'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { SkipLink } from '@/components/layout/SkipLink'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/cursor/CustomCursor'
import { OceanBackground } from '@/components/decor/OceanBackground'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { Achievements } from '@/components/sections/Achievements'
import { Contact } from '@/components/sections/Contact'

export default function App() {
  return (
    <EnvProvider>
      <MotionConfigProvider>
        <OceanBackground />
        <SkipLink />
        <CustomCursor />
        <ScrollProgress />
        <Navbar />
        <main id="main-content" className="overflow-x-clip">
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Achievements />
          <Contact />
        </main>
        <Footer />
      </MotionConfigProvider>
    </EnvProvider>
  )
}
