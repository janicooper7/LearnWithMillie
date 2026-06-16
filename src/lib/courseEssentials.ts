// "Course must-haves" — Amazon hub lists shown beneath every module's content.
// Two lists are generic across all three BOOKED courses (tech setup + the general
// "everything for online teaching" list); the must-read books list is per-course.
// We link out to the whole Amazon list rather than individual products.

export type CourseEssential = {
  title: string
  description: string
  url: string // Amazon list (rendered with rel="sponsored")
  kind: 'tech' | 'books' | 'tools'
}

// Shown on every course/module.
const GENERIC_ESSENTIALS: CourseEssential[] = [
  {
    title: 'Must-have tech setup',
    description: 'Every webcam, mic, light and stand we recommend for teaching from home — in one Amazon list.',
    url: 'https://www.amazon.co.uk/shop/milliecooper26/list/3C93P315S3L4J?tag=milliecooper-21&ref_=aip_sf_list_spv_ofs_mixed_d',
    kind: 'tech',
  },
  {
    title: 'Everything to make online teaching easier',
    description: 'All the extra tools and gadgets we use to make teaching online smoother — gathered in one Amazon list.',
    url: 'https://www.amazon.co.uk/shop/milliecooper26/list/LMS9EADDDRQ?tag=milliecooper-21&ref_=aip_sf_list_spv_ofs_mixed_d_f',
    kind: 'tools',
  },
]

// Per-course must-read books list. Courses without an entry just show the generics.
const COURSE_BOOKS: Record<string, CourseEssential> = {
  // GET READY (BOOKED · Course 1)
  'get-ready': {
    title: 'Must-read books',
    description: 'The books referenced throughout the course, gathered together in one Amazon list.',
    url: 'https://www.amazon.co.uk/shop/milliecooper26/list/29ZAINY6574IG?tag=milliecooper-21&ref_=aip_sf_list_spv_ofs_mixed_d',
    kind: 'books',
  },
  // GET BOOKED (BOOKED · Course 2)
  'get-booked': {
    title: 'Must-read books',
    description: 'The books referenced throughout the course, gathered together in one Amazon list.',
    url: 'https://www.amazon.co.uk/shop/milliecooper26/list/3BFMUSLJVMZWY?tag=milliecooper-21&ref_=aip_sf_list_spv_ofs_mixed_d_f',
    kind: 'books',
  },
  // STAY BOOKED (BOOKED · Course 3)
  'stay-booked': {
    title: 'Must-read books',
    description: 'The books referenced throughout the course, gathered together in one Amazon list.',
    url: 'https://www.amazon.co.uk/shop/milliecooper26/list/1SO150VRELMJG?tag=milliecooper-21&ref_=aipsflist',
    kind: 'books',
  },
}

export function getCourseEssentials(courseSlug: string): CourseEssential[] {
  const books = COURSE_BOOKS[courseSlug]
  return [...(books ? [books] : []), ...GENERIC_ESSENTIALS]
}
