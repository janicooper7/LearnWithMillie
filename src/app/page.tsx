import Hero from './sections/Hero'
import About from './sections/About'
import Testimonials from './sections/Testimonials'
import Pricing from './sections/Pricing'
import Contact from './sections/Contact'
import DebateGenerator from './sections/DebateGenerator'
import FAQ from './sections/FAQ'
import LessonOptions from './sections/LessonOptions'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <LessonOptions />
      <Testimonials />
      <Pricing />
      <section id='debate-generator'>
        <DebateGenerator />
      </section>
      <section id='faq'>
        <FAQ />
      </section>
      <Contact />
    </>
  )
}
