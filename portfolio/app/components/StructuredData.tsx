export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KoreLnx",
    "url": "https://korelnx.com",
    "logo": "https://korelnx.com/Logo.png",
    "description": "Enterprise-scale web applications, stunning UI/UX design, and cross-platform mobile solutions.",
    "slogan": "Your Vision.Engineered.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      // Add your social media profiles here
      // "https://twitter.com/KoreLnx",
      // "https://linkedin.com/company/korelynx",
      // "https://github.com/korelynx"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KoreLnx",
    "url": "https://korelnx.com",
    "description": "KoreLnx delivers enterprise-scale web applications, stunning UI/UX design, and cross-platform mobile solutions.",
    "publisher": {
      "@type": "Organization",
      "name": "KoreLnx"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "KoreLnx",
    "image": "https://korelnx.com/Logo.png",
    "url": "https://korelnx.com",
    "description": "Full-service digital solutions including web development, UI/UX design, and mobile app development.",
    "priceRange": "$$",
    "serviceType": [
      "Web Development",
      "UI/UX Design",
      "Mobile App Development",
      "Enterprise Solutions"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Global"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
