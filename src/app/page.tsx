import Hero from './sections/Hero'
import About from './sections/About'
import Testimonials from './sections/Testimonials'
import Pricing from './sections/Pricing'
import Contact from './sections/Contact'
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
      <section id='faq'>
        <FAQ />
      </section>
      <Contact />
    </>
  )
}
