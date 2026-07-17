/**
 * Utility to dynamically update SEO tags, meta tags, and structured JSON-LD schema markup.
 * This is crucial for local SEO rankings in Karol Bagh and Google search performance.
 */
export const updateSEO = ({
  title,
  description,
  canonicalUrl = window.location.href,
  ogImage = '/assets/visiting_card.jpg',
  ogType = 'website',
  schemaMarkup = null
}) => {
  const brandName = 'New Balaji Property';
  const fullTitle = title ? `${title} | ${brandName}` : `${brandName} | Real Estate Consultant in Karol Bagh`;
  
  // Update Title
  document.title = fullTitle;

  // Update Meta Description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  metaDescription.content = description || 'Verified Residential & Commercial properties in Karol Bagh, Delhi. Trust our 5+ years of experience for transparent deals, document assistance, and loan guidance.';

  // Update Open Graph Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.content = fullTitle;

  // Update Open Graph Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.content = description || 'Verified Residential & Commercial properties in Karol Bagh, Delhi.';

  // Update Open Graph Image
  let ogImg = document.querySelector('meta[property="og:image"]');
  if (!ogImg) {
    ogImg = document.createElement('meta');
    ogImg.setAttribute('property', 'og:image');
    document.head.appendChild(ogImg);
  }
  ogImg.content = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`;

  // Update Open Graph Type
  let ogT = document.querySelector('meta[property="og:type"]');
  if (!ogT) {
    ogT = document.createElement('meta');
    ogT.setAttribute('property', 'og:type');
    document.head.appendChild(ogT);
  }
  ogT.content = ogType;

  // Update Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Update JSON-LD Schema Markup
  const existingSchema = document.getElementById('seo-schema-markup');
  if (existingSchema) {
    existingSchema.remove();
  }

  if (schemaMarkup) {
    const script = document.createElement('script');
    script.id = 'seo-schema-markup';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaMarkup);
    document.head.appendChild(script);
  } else {
    // Default Local Business Schema Markup
    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "NEW BALAJI PROPERTY",
      "image": ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`,
      "telephone": "+919213521804",
      "url": window.location.origin,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Near Sanjeevya Model School, Block 2A, Sat Nagar, Karol Bagh",
        "addressLocality": "New Delhi",
        "addressRegion": "Delhi",
        "postalCode": "110005",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "28.6508", // Karol Bagh rough coordinates
        "longitude": "77.1912"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:30",
        "closes": "20:00"
      },
      "sameAs": [
        "https://wa.me/919213521804"
      ]
    };

    const script = document.createElement('script');
    script.id = 'seo-schema-markup';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(defaultSchema);
    document.head.appendChild(script);
  }
};
