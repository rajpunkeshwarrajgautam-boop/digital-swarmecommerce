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
        description: "Digital products, AI workflow assets, prompt systems, playbooks, and software kits.",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
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
