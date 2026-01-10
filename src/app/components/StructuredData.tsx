export default function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fluentify.com'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Fluentify',
    description:
      'Professional English tutoring service offering Business English, Conversational English, and Interview Preparation.',
    url: siteUrl,
    logo: `${siteUrl}/images/HeaderImage.png`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'London',
      addressCountry: 'GB',
    },
    sameAs: [
      // Add your social media profiles here
      // 'https://www.linkedin.com/in/yourprofile',
      // 'https://twitter.com/yourhandle',
    ],
  }

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Millie Cooper',
    jobTitle: 'TEFL Certified English Teacher',
    description:
      'Certified TEFL teacher from London with three years of experience teaching English online.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'London',
      addressCountry: 'GB',
    },
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'TEFL Certification',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: "Master's degree in Public Policy from UCL",
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory:
          "Bachelor's degree in International Politics from King's College London",
      },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'English Language Tutoring',
    provider: {
      '@type': 'Person',
      name: 'Millie Cooper',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide',
    },
    offers: {
      '@type': 'Offer',
      description: 'Online English tutoring services',
    },
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  )
}
