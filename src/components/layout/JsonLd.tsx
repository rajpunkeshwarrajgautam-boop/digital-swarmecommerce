import React from 'react';

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Digital Swarm",
        url: "https://digitalswarm.in",
        logo: "https://digitalswarm.in/favicon.svg",
        description: "Premium source code, UI kits, and digital templates for developers and creators.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91 88107 77573",
          contactType: "customer service",
          email: "support@digitalswarm.in",
        },
      },
      {
        "@type": "WebSite",
        name: "Digital Swarm",
        url: "https://digitalswarm.in",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://digitalswarm.in/products?query={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
