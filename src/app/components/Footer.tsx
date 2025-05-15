export default function Footer() {
  return (
    <footer className='bg-gray-50 py-12'>
      <div className='container'>
        <div className='grid md:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <h3 className='text-xl font-bold text-primary'>iFluentify</h3>
            <p className='text-gray-600'>
              Connecting worlds through words. Professional English tutoring
              tailored to your needs.
            </p>
          </div>

          <div>
            <h4 className='font-semibold mb-4'>Quick Links</h4>
            <ul className='space-y-2'>
              <li>
                <a href='#about' className='text-gray-600 hover:text-primary'>
                  About
                </a>
              </li>
              <li>
                <a
                  href='#services'
                  className='text-gray-600 hover:text-primary'
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href='#testimonials'
                  className='text-gray-600 hover:text-primary'
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a href='#pricing' className='text-gray-600 hover:text-primary'>
                  Pricing
                </a>
              </li>
              <li>
                <a href='#contact' className='text-gray-600 hover:text-primary'>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold mb-4'>Services</h4>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#services'
                  className='text-gray-600 hover:text-primary'
                >
                  Business English
                </a>
              </li>
              <li>
                <a
                  href='#services'
                  className='text-gray-600 hover:text-primary'
                >
                  Conversational English
                </a>
              </li>
              <li>
                <a
                  href='#services'
                  className='text-gray-600 hover:text-primary'
                >
                  Interview Preparation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold mb-4'>Contact</h4>
            <ul className='space-y-2 text-gray-600'>
              <li>London, United Kingdom</li>
            </ul>
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-gray-200'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-600 text-sm'>
              © {new Date().getFullYear()} iFluentify. All rights reserved.
            </p>
            <div className='flex gap-6'>
              <a href='#' className='text-gray-600 hover:text-primary'>
                Privacy Policy
              </a>
              <a href='#' className='text-gray-600 hover:text-primary'>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
