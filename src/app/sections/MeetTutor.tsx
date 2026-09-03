import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const credentials = [
  { label: 'TEFL Certified', sub: 'Qualified Teacher' },
  { label: "UCL Master's", sub: 'Public Policy' },
  { label: "King's College", sub: 'International Politics' },
  { label: '4+ Years', sub: 'Online Teaching' },
]

export default function MeetTutor() {
  return (
    <section className='section-padding' style={{ backgroundColor: '#F4EDE4' }}>
      <div className='container'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>

          {/* Left — photo composition */}
          <div className='relative hidden lg:block'>
            <div className='relative mx-auto' style={{ maxWidth: '420px' }}>
              {/* Gold vertical accent */}
              <div
                className='absolute rounded-full'
                style={{ left: '-20px', top: '10%', bottom: '10%', width: '2px', backgroundColor: '#C2AA6A', opacity: 0.55 }}
              />
              {/* Offset green block */}
              <div
                className='absolute rounded-2xl'
                style={{ top: '22px', left: '22px', right: '-22px', bottom: '-22px', backgroundColor: '#1F3A34', zIndex: 1 }}
              />
              {/* Photo */}
              <div className='relative rounded-2xl overflow-hidden' style={{ aspectRatio: '3/4', zIndex: 2 }}>
                <Image
                  src='/images/aboutme.png'
                  alt='Millie — English Tutor'
                  fill
                  className='object-cover object-top'
                  sizes='420px'
                  quality={75}
                />
                <div
                  className='absolute inset-0 pointer-events-none'
                  style={{ background: 'linear-gradient(to top, rgba(31,58,52,0.2) 0%, transparent 50%)' }}
                />
              </div>
            </div>
          </div>

          {/* Right — text */}
          <div>
            <div className='flex items-center gap-3 mb-6'>
              <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
              <span
                className='text-xs uppercase tracking-[0.25em] font-medium'
                style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Meet Your Tutor
              </span>
            </div>

            <h2 className='heading-lg mb-5' style={{ color: '#1F3A34' }}>
              Hi, I&apos;m Millie
            </h2>

            <p
              className='text-lg leading-relaxed mb-4'
              style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              A certified TEFL teacher from London, passionate about helping students speak English with real confidence.
            </p>
            <p
              className='text-base leading-relaxed mb-8'
              style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              With four years of experience teaching online, I tailor every lesson to your individual goals in a calm,
              supportive, and engaging environment. My background in management, local government, and accounting makes
              me especially effective for Business English learners.
            </p>

            {/* Credential chips */}
            <div className='flex flex-wrap gap-2.5 mb-8'>
              {credentials.map((c) => (
                <div
                  key={c.label}
                  className='px-4 py-2.5 rounded-xl'
                  style={{ backgroundColor: 'white', border: '1px solid #EDE4D8' }}
                >
                  <p className='text-xs font-semibold' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {c.label}
                  </p>
                  <p className='text-[11px]' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {c.sub}
                  </p>
                </div>
              ))}
            </div>

            <a href='/auth/signup' className='btn-primary inline-flex items-center gap-2'>
              Book Your First Lesson
              <ArrowRight className='w-4 h-4' />
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
