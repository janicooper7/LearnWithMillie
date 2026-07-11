export type TeflRequirement = 'required' | 'preferred' | 'not_required'
export type StudentAge = 'young_learners' | 'k12' | 'teens_adults' | 'adults' | 'all_ages'
export type LocationGroup =
  | 'worldwide'
  | 'native_5' // USA/UK/CA/AU/NZ
  | 'native_6' // USA/UK/CA/AU/NZ + Ireland
  | 'usa_only'
  | 'usa_uk_only'
  | 'usa_canada'
  | 'outschool_countries' // USA/CA/UK/AU/NZ/Mexico/Spain/S.Korea
  | 'berlitz_countries' // Select countries

export type Platform = {
  name: string
  hourlyRate: string
  rateMidpoint: number | null // for ranking; null = "set own rate"
  tefl: TeflRequirement
  students: StudentAge
  minHoursPerWeek: number // 0 = no minimum
  minYearsExperience: number // 0 = none required
  location: LocationGroup
  nativeOnly: boolean
  degreeRequired: boolean
  notes: string
  signupUrl?: string
}

export const PLATFORMS: Platform[] = [
  {
    name: 'AmazingTalker',
    hourlyRate: 'Set own rate',
    rateMidpoint: null,
    tefl: 'preferred',
    students: 'all_ages',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Non-natives need strong credentials to compete.',
    signupUrl: 'https://www.amazingtalker.com/',
  },
  {
    name: 'Berlitz',
    hourlyRate: '$15–20/hr',
    rateMidpoint: 17.5,
    tefl: 'not_required',
    students: 'adults',
    minHoursPerWeek: 4.5,
    minYearsExperience: 0, // "preferred"
    location: 'berlitz_countries',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Proprietary method; full training provided. Experience preferred.',
    signupUrl: 'https://careers.berlitz.com/',
  },
  {
    name: 'Busuu',
    hourlyRate: '$25–41/hr',
    rateMidpoint: 33,
    tefl: 'required',
    students: 'adults',
    minHoursPerWeek: 0,
    minYearsExperience: 2,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Corporate B2B; selective 3-stage application process.',
    signupUrl: 'https://www.busuu.com/en/teachers',
  },
  {
    name: 'Cambly',
    hourlyRate: '$10.20/hr',
    rateMidpoint: 10.2,
    tefl: 'not_required',
    students: 'all_ages',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'native_5',
    nativeOnly: true,
    degreeRequired: false,
    notes: 'Native speakers only from USA/UK/CA/AU/NZ. No prep required.',
    signupUrl: 'https://www.cambly.com/en/tutors',
  },
  {
    name: 'Classgap',
    hourlyRate: 'Set own rate',
    rateMidpoint: null,
    tefl: 'not_required',
    students: 'all_ages',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Flexible marketplace; you control rates and schedule.',
    signupUrl: 'https://www.classgap.com/',
  },
  {
    name: 'Dada ABC',
    hourlyRate: '$14–18/hr',
    rateMidpoint: 16,
    tefl: 'required',
    students: 'young_learners',
    minHoursPerWeek: 4,
    minYearsExperience: 0,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Minimum ~4 hrs/wk (2 days × 2 hrs).',
    signupUrl: 'https://www.dadaabc.com/',
  },
  {
    name: '51Talk',
    hourlyRate: '$10–18/hr',
    rateMidpoint: 14,
    tefl: 'preferred',
    students: 'young_learners',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Chinese platform; popular with Filipino teachers. Native speakers can apply but it is competitive.',
    signupUrl: 'https://www.51talk.com/',
  },
  {
    name: 'EF Education First',
    hourlyRate: '$8–10/hr',
    rateMidpoint: 9,
    tefl: 'required',
    students: 'all_ages',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'usa_uk_only',
    nativeOnly: true,
    degreeRequired: false,
    notes: 'Native speakers based in US or UK only.',
    signupUrl: 'https://www.ef.com/wwen/careers/',
  },
  {
    name: 'Engoo',
    hourlyRate: '$10/hr',
    rateMidpoint: 10,
    tefl: 'not_required',
    students: 'adults',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Non-natives are paid significantly less ($2–5/hr).',
    signupUrl: 'https://engoo.com/app/teachers',
  },
  {
    name: 'English Hunt',
    hourlyRate: '$15/hr',
    rateMidpoint: 15,
    tefl: 'not_required',
    students: 'adults',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'usa_only',
    nativeOnly: true,
    degreeRequired: false,
    notes: 'US citizens with a US bank account required.',
    signupUrl: 'https://www.englishhunt.com/',
  },
  {
    name: 'GoStudent',
    hourlyRate: 'Set own rate',
    rateMidpoint: null,
    tefl: 'not_required',
    students: 'k12',
    minHoursPerWeek: 0,
    minYearsExperience: 0, // "preferred"
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Highly selective — roughly 8% of applicants are accepted.',
    signupUrl: 'https://www.gostudent.org/en/jobs',
  },
  {
    name: 'iTalki',
    hourlyRate: 'Set own rate',
    rateMidpoint: null,
    tefl: 'not_required',
    students: 'all_ages',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Community Tutor (no credentials) or Professional Teacher (credentials required).',
    signupUrl: 'https://www.italki.com/teach',
  },
  {
    name: 'Learnlight',
    hourlyRate: '$12–16/hr',
    rateMidpoint: 14,
    tefl: 'required',
    students: 'adults',
    minHoursPerWeek: 0,
    minYearsExperience: 2,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Corporate B2B focus. Solid quality bar for trainers.',
    signupUrl: 'https://www.learnlight.com/',
  },
  {
    name: 'Lessonface',
    hourlyRate: 'Set own rate',
    rateMidpoint: null,
    tefl: 'not_required',
    students: 'all_ages',
    minHoursPerWeek: 0,
    minYearsExperience: 0, // 2+ yrs teaching or 5+ yrs subject experience expected
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: '2+ yrs teaching or 5+ yrs subject experience expected.',
    signupUrl: 'https://lessonface.com/teach',
  },
  {
    name: 'LingoAce',
    hourlyRate: '$14–20/hr',
    rateMidpoint: 17,
    tefl: 'required',
    students: 'young_learners',
    minHoursPerWeek: 0,
    minYearsExperience: 2,
    location: 'native_5',
    nativeOnly: true,
    degreeRequired: false,
    notes: 'Native speakers only; some US states excluded.',
    signupUrl: 'https://www.lingoace.com/teacher',
  },
  {
    name: 'Lingoda',
    hourlyRate: '$11–22/hr',
    rateMidpoint: 16.5,
    tefl: 'required',
    students: 'all_ages',
    minHoursPerWeek: 0,
    minYearsExperience: 2,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Steady demand; structured curriculum.',
    signupUrl: 'https://www.lingoda.com/en/jobs/teacher/',
  },
  {
    name: 'Magic Ears',
    hourlyRate: '$18–26/hr',
    rateMidpoint: 22,
    tefl: 'required',
    students: 'young_learners',
    minHoursPerWeek: 6,
    minYearsExperience: 1,
    location: 'usa_canada',
    nativeOnly: true,
    degreeRequired: false,
    notes: 'Very low work availability due to China regulations.',
    signupUrl: 'https://t.mmears.com/',
  },
  {
    name: 'NativeCamp',
    hourlyRate: '$10–12/hr',
    rateMidpoint: 11,
    tefl: 'not_required',
    students: 'all_ages',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Japanese platform; lesson materials provided; non-natives accepted.',
    signupUrl: 'https://nativecamp.net/en/teacher',
  },
  {
    name: 'NovakidSchool',
    hourlyRate: '$8–14/hr',
    rateMidpoint: 11,
    tefl: 'preferred',
    students: 'young_learners',
    minHoursPerWeek: 20,
    minYearsExperience: 1,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Degree OR TEFL required; experience with children needed.',
    signupUrl: 'https://www.novakidschool.com/teach',
  },
  {
    name: 'Open English',
    hourlyRate: '$9–15/hr',
    rateMidpoint: 12,
    tefl: 'not_required',
    students: 'adults',
    minHoursPerWeek: 10,
    minYearsExperience: 0,
    location: 'usa_canada',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Latin American students; pay rate increases over time.',
    signupUrl: 'https://www.openenglish.com/',
  },
  {
    name: 'Outschool',
    hourlyRate: 'Set own rate',
    rateMidpoint: null,
    tefl: 'not_required',
    students: 'k12',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'outschool_countries',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Eligible countries: USA, Canada, UK, Australia, New Zealand, Mexico, Spain, South Korea.',
    signupUrl: 'https://outschool.com/teach',
  },
  {
    name: 'PalFish',
    hourlyRate: '$18–22/hr',
    rateMidpoint: 20,
    tefl: 'required',
    students: 'all_ages',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'App-based; FreeTalk (non-native OK) or Kids Course (native only).',
    signupUrl: 'https://www.ipalfish.com/',
  },
  {
    name: 'Preply',
    hourlyRate: 'Set own rate',
    rateMidpoint: null,
    tefl: 'not_required',
    students: 'all_ages',
    minHoursPerWeek: 0,
    minYearsExperience: 0, // preferred
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Marketplace; rankings reward consistency and good reviews.',
    signupUrl: 'https://preply.com/en/teach',
  },
  {
    name: 'Qkids',
    hourlyRate: '$16–20/hr',
    rateMidpoint: 18,
    tefl: 'required',
    students: 'young_learners',
    minHoursPerWeek: 6,
    minYearsExperience: 0,
    location: 'usa_canada',
    nativeOnly: true,
    degreeRequired: false,
    notes: 'Native speakers; US/CA bank account required for payment.',
    signupUrl: 'https://teacher.qkids.com/',
  },
  {
    name: 'Rype',
    hourlyRate: '$9–11/hr',
    rateMidpoint: 10,
    tefl: 'preferred',
    students: 'adults',
    minHoursPerWeek: 10,
    minYearsExperience: 1,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Adult learners; predictable schedule.',
    signupUrl: 'https://www.rypeapp.com/',
  },
  {
    name: 'Skima Talk',
    hourlyRate: '$10–15/hr',
    rateMidpoint: 12.5,
    tefl: 'not_required',
    students: 'adults',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'native_6',
    nativeOnly: true,
    degreeRequired: false,
    notes: 'Native speakers only (US, UK, Canada, Australia, NZ, Ireland).',
    signupUrl: 'https://www.skimatalk.com/',
  },
  {
    name: 'Skyeng',
    hourlyRate: '$3–20/hr',
    rateMidpoint: 11.5,
    tefl: 'required',
    students: 'all_ages',
    minHoursPerWeek: 15,
    minYearsExperience: 0,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Limited international hiring currently.',
    signupUrl: 'https://skyeng.ru/',
  },
  {
    name: 'Skooli',
    hourlyRate: '$18.44/hr',
    rateMidpoint: 18.44,
    tefl: 'required',
    students: 'teens_adults',
    minHoursPerWeek: 0,
    minYearsExperience: 0, // preferred
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: true,
    notes: 'Professional teachers; degree + TEFL expected.',
    signupUrl: 'https://www.skooli.com/',
  },
  {
    name: 'SuperProf',
    hourlyRate: 'Set own rate',
    rateMidpoint: null,
    tefl: 'not_required',
    students: 'all_ages',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Lead generation marketplace; you set the rate.',
    signupUrl: 'https://www.superprof.com/',
  },
  {
    name: 'Twenix',
    hourlyRate: '$13–16/hr',
    rateMidpoint: 14.5,
    tefl: 'not_required',
    students: 'adults',
    minHoursPerWeek: 0,
    minYearsExperience: 0,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: '26-minute conversation classes; must be a registered freelancer.',
    signupUrl: 'https://www.twenix.com/',
  },
  {
    name: 'Verbling',
    hourlyRate: '$15–25/hr',
    rateMidpoint: 20,
    tefl: 'preferred',
    students: 'all_ages',
    minHoursPerWeek: 0,
    minYearsExperience: 1,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Background check required.',
    signupUrl: 'https://www.verbling.com/teach',
  },
  {
    name: 'VIPKid',
    hourlyRate: '$14–22/hr',
    rateMidpoint: 18,
    tefl: 'not_required',
    students: 'young_learners',
    minHoursPerWeek: 0,
    minYearsExperience: 1,
    location: 'usa_canada',
    nativeOnly: true,
    degreeRequired: true,
    notes: 'Degree required. Some US states excluded.',
    signupUrl: 'https://t.vipkid.com/',
  },
  {
    name: 'Voxy',
    hourlyRate: '$15–18/hr',
    rateMidpoint: 16.5,
    tefl: 'required',
    students: 'adults',
    minHoursPerWeek: 10,
    minYearsExperience: 3,
    location: 'worldwide',
    nativeOnly: false,
    degreeRequired: false,
    notes: 'Spanish or Portuguese knowledge preferred.',
    signupUrl: 'https://voxy.com/teach/',
  },
]

// --- Profile + matching ---

export type Country =
  | 'usa'
  | 'uk'
  | 'canada'
  | 'australia'
  | 'new_zealand'
  | 'ireland'
  | 'mexico'
  | 'spain'
  | 'south_korea'
  | 'other'

export const COUNTRY_LABELS: Record<Country, string> = {
  usa: 'United States',
  uk: 'United Kingdom',
  canada: 'Canada',
  australia: 'Australia',
  new_zealand: 'New Zealand',
  ireland: 'Ireland',
  mexico: 'Mexico',
  spain: 'Spain',
  south_korea: 'South Korea',
  other: 'Somewhere else',
}

export type AudienceChoice = 'young_learners' | 'k12' | 'teens_adults' | 'adults' | 'any'

export type ExperienceLevel = 'none' | 'under_1' | '1_to_2' | '3_plus'

export const EXPERIENCE_YEARS: Record<ExperienceLevel, number> = {
  none: 0,
  under_1: 0.5,
  '1_to_2': 1.5,
  '3_plus': 3,
}

export type HoursBucket = 'under_5' | '5_to_10' | '10_to_20' | '20_plus'

export const HOURS_MAX: Record<HoursBucket, number> = {
  under_5: 4,
  '5_to_10': 10,
  '10_to_20': 20,
  '20_plus': 40,
}

export type Profile = {
  nativeSpeaker: boolean
  country: Country
  tefl: boolean
  degree: boolean
  audience: AudienceChoice[]
  experience: ExperienceLevel
  hours: HoursBucket
}

// Raw answers as collected by the questionnaire (before mapping to a Profile).
export type FinderAnswers = Partial<{
  nativeSpeaker: 'yes' | 'no'
  country: Country
  tefl: 'yes' | 'no'
  degree: 'yes' | 'no'
  audience: AudienceChoice[]
  experience: ExperienceLevel
  hours: HoursBucket
}>

// Shared by the client (to render results) and the server (to email them),
// so both derive the exact same profile from a set of answers.
export function profileFromAnswers(answers: FinderAnswers): Profile | null {
  if (
    !answers.nativeSpeaker ||
    !answers.country ||
    !answers.tefl ||
    !answers.degree ||
    !answers.audience ||
    answers.audience.length === 0 ||
    !answers.experience ||
    !answers.hours
  ) {
    return null
  }
  return {
    nativeSpeaker: answers.nativeSpeaker === 'yes',
    country: answers.country,
    tefl: answers.tefl === 'yes',
    degree: answers.degree === 'yes',
    audience: answers.audience,
    experience: answers.experience,
    hours: answers.hours,
  }
}

const COUNTRY_GROUPS: Record<LocationGroup, Country[] | 'all'> = {
  worldwide: 'all',
  native_5: ['usa', 'uk', 'canada', 'australia', 'new_zealand'],
  native_6: ['usa', 'uk', 'canada', 'australia', 'new_zealand', 'ireland'],
  usa_only: ['usa'],
  usa_uk_only: ['usa', 'uk'],
  usa_canada: ['usa', 'canada'],
  outschool_countries: ['usa', 'canada', 'uk', 'australia', 'new_zealand', 'mexico', 'spain', 'south_korea'],
  berlitz_countries: ['usa', 'uk', 'canada', 'australia', 'new_zealand', 'ireland', 'mexico', 'spain', 'south_korea'],
}

export function locationAllows(p: Platform, country: Country): boolean {
  const group = COUNTRY_GROUPS[p.location]
  if (group === 'all') return true
  return group.includes(country)
}

function singleAudienceMatches(platformStudents: StudentAge, audience: AudienceChoice): boolean {
  if (audience === 'any') return true
  if (platformStudents === 'all_ages') return true
  if (audience === 'young_learners') {
    return platformStudents === 'young_learners' || platformStudents === 'k12'
  }
  if (audience === 'k12') {
    return platformStudents === 'k12' || platformStudents === 'young_learners' || platformStudents === 'teens_adults'
  }
  if (audience === 'teens_adults') {
    return platformStudents === 'teens_adults' || platformStudents === 'adults'
  }
  if (audience === 'adults') {
    return platformStudents === 'adults' || platformStudents === 'teens_adults'
  }
  return false
}

function audienceMatches(platformStudents: StudentAge, audiences: AudienceChoice[]): boolean {
  if (audiences.length === 0) return true
  return audiences.some((a) => singleAudienceMatches(platformStudents, a))
}

export type MatchResult = {
  platform: Platform
  matches: boolean
  reasons: string[] // why excluded (empty when matches)
}

export function evaluatePlatform(p: Platform, profile: Profile): MatchResult {
  const reasons: string[] = []

  if (p.nativeOnly && !profile.nativeSpeaker) {
    reasons.push('Native English speakers only')
  }

  if (!locationAllows(p, profile.country)) {
    reasons.push(`Not available in ${COUNTRY_LABELS[profile.country]}`)
  }

  if (p.tefl === 'required' && !profile.tefl) {
    reasons.push('TEFL/CELTA certificate required')
  }

  if (p.degreeRequired && !profile.degree) {
    reasons.push('University degree required')
  }

  if (!audienceMatches(p.students, profile.audience)) {
    reasons.push(`Teaches ${studentAgeLabel(p.students).toLowerCase()} only`)
  }

  const maxHours = HOURS_MAX[profile.hours]
  if (p.minHoursPerWeek > maxHours) {
    reasons.push(`Requires at least ${p.minHoursPerWeek} hrs/week`)
  }

  if (p.minYearsExperience > EXPERIENCE_YEARS[profile.experience]) {
    reasons.push(`Requires ${p.minYearsExperience}+ years of teaching experience`)
  }

  return { platform: p, matches: reasons.length === 0, reasons }
}

export function studentAgeLabel(s: StudentAge): string {
  switch (s) {
    case 'young_learners':
      return 'Young learners'
    case 'k12':
      return 'K-12'
    case 'teens_adults':
      return 'Teens & adults'
    case 'adults':
      return 'Adults'
    case 'all_ages':
      return 'All ages'
  }
}

export function teflLabel(t: TeflRequirement): string {
  switch (t) {
    case 'required':
      return 'Required'
    case 'preferred':
      return 'Preferred'
    case 'not_required':
      return 'Not required'
  }
}

export function matchAll(profile: Profile): MatchResult[] {
  const results = PLATFORMS.map((p) => evaluatePlatform(p, profile))
  // Sort: matched first (by rate desc, "Set own rate" treated as flexible/high), then excluded
  results.sort((a, b) => {
    if (a.matches !== b.matches) return a.matches ? -1 : 1
    // Within matches, sort by rate midpoint; null (set own rate) ranked above to highlight earning potential
    const aRate = a.platform.rateMidpoint
    const bRate = b.platform.rateMidpoint
    if (aRate === null && bRate === null) return a.platform.name.localeCompare(b.platform.name)
    if (aRate === null) return -1
    if (bRate === null) return 1
    return bRate - aRate
  })
  return results
}
