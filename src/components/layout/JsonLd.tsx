import React from 'react';

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Digital Swarm",
    "url": "https://digitalswarm.in",
    "logo": "https://digitalswarm.in/favicon.svg",
    "description": "Premium source code, UI kits, and digital templates for developers and creators.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 88107 77573",
      "contactType": "customer service",
      "email": "support@digitalswarm.in"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
