
import React from 'react';

const SEO_Schema = () => {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Sahit Sai",
    "jobTitle": "Graphic Designer & Video Editor",
    "url": "https://sahitsai.com",
    "description": "Sahit Sai is a freelance graphic designer and video editor specializing in logo design, brand identity, and motion graphics.",
    "sameAs": [
      "https://www.behance.net/sahitsai",
      "https://dribbble.com/sahitsai",
      "https://www.linkedin.com/in/sahitsai",
      "https://www.instagram.com/sahitsai"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "India"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What graphic design services do you offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "I offer logo design, brand identity, social media creatives, photo editing, and UI/UX design services."
        }
      },
      {
        "@type": "Question",
        "name": "What tools and software do you use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "I am proficient in Adobe Illustrator, Photoshop, Premiere Pro, After Effects, Figma, and DaVinci Resolve."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
};

export default SEO_Schema;
