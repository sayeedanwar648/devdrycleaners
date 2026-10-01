import { SHOP } from "@/lib/catalog";
import { copy } from "@/lib/i18n";

export const SEO_TITLE =
  "देव ड्राई क्लीनर्स समस्तीपुर | ड्राई क्लीन, लॉन्ड्री और कपड़े धुलाई";

export const SEO_DESCRIPTION =
  "समस्तीपुर, बंगाली टोला में देव ड्राई क्लीनर्स — ड्राई क्लीनिंग, कपड़े धुलाई, लॉन्ड्री और स्टीम प्रेस। करीब 10 किमी तक होम पिकअप। कॉल 8298874800।";

const KEYWORDS = [
  "देव ड्राई क्लीनर्स",
  "ड्राई क्लीन समस्तीपुर",
  "ड्राई क्लीनिंग समस्तीपुर",
  "लॉन्ड्री समस्तीपुर",
  "कपड़े धुलाई समस्तीपुर",
  "कपड़ा धुलवाना समस्तीपुर",
  "स्टीम प्रेस समस्तीपुर",
  "होम पिकअप ड्राई क्लीन",
  "dry cleaners in Samastipur",
  "laundry service Samastipur",
  "Bengali Tola dry cleaners",
  "Dev Dry Cleaners",
].join(", ");

export function seoHead(origin: string) {
  const base = origin.replace(/\/$/, "");
  const pageUrl = base ? `${base}/` : undefined;
  const image = base ? `${base}/og.jpg` : "/og.jpg";
  const graph = localBusinessGraph(base);

  return {
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESCRIPTION },
      { name: "keywords", content: KEYWORDS },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "राम कुमार बैठा" },
      { name: "geo.region", content: "IN-BR" },
      { name: "geo.placename", content: "Samastipur, Bihar" },
      { name: "geo.position", content: `${SHOP.lat};${SHOP.lng}` },
      { name: "ICBM", content: `${SHOP.lat}, ${SHOP.lng}` },
      { property: "og:type", content: "business.business" },
      { property: "og:site_name", content: "देव ड्राई क्लीनर्स" },
      { property: "og:locale", content: "hi_IN" },
      { property: "og:locale:alternate", content: "en_IN" },
      { property: "og:title", content: SEO_TITLE },
      { property: "og:description", content: SEO_DESCRIPTION },
      { property: "og:image", content: image },
      ...(pageUrl ? [{ property: "og:url", content: pageUrl }] : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SEO_TITLE },
      { name: "twitter:description", content: SEO_DESCRIPTION },
      { name: "twitter:image", content: image },
    ],
    links: pageUrl ? [{ rel: "canonical", href: pageUrl }] : [],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(graph),
      },
    ],
  };
}

function localBusinessGraph(origin: string) {
  const pageUrl = origin ? `${origin}/` : undefined;
  const places = copy.hi.areaPlaces.map((name) => ({
    "@type": "Place" as const,
    name: `${name}, समस्तीपुर`,
    address: {
      "@type": "PostalAddress" as const,
      addressLocality: "Samastipur",
      addressRegion: "Bihar",
      addressCountry: "IN",
    },
  }));

  const business: Record<string, unknown> = {
    "@type": ["DryCleaningOrLaundry", "LocalBusiness"],
    "@id": pageUrl ? `${pageUrl}#shop` : "#shop",
    name: "देव ड्राई क्लीनर्स",
    alternateName: ["Dev Dry Cleaners", "Dev Drycleaners"],
    description: SEO_DESCRIPTION,
    telephone: `+91${SHOP.phoneRaw}`,
    image: origin ? `${origin}/og.jpg` : "/og.jpg",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bengali Tola",
      addressLocality: "Samastipur",
      addressRegion: "Bihar",
      postalCode: "848101",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SHOP.lat,
      longitude: SHOP.lng,
    },
    hasMap: SHOP.mapsUrl,
    areaServed: [
      {
        "@type": "GeoCircle",
        name: "About 10 km around Bengali Tola, Samastipur",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: SHOP.lat,
          longitude: SHOP.lng,
        },
        geoRadius: 10000,
      },
      {
        "@type": "City",
        name: "Samastipur",
      },
      ...places,
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "20:00",
      },
    ],
    founder: {
      "@type": "Person",
      name: "राम कुमार बैठा",
    },
    knowsLanguage: ["hi", "en"],
    makesOffer: [
      "ड्राई क्लीनिंग",
      "कपड़े धुलाई",
      "लॉन्ड्री सर्विस",
      "स्टीम प्रेस",
      "होम पिकअप और डिलीवरी",
      "साड़ी और शादी के कपड़े",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name,
        areaServed: "Samastipur",
      },
    })),
    potentialAction: {
      "@type": "ReserveAction",
      name: "WhatsApp पर बुकिंग",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://wa.me/${SHOP.whatsappE164}`,
      },
    },
  };

  if (pageUrl) business.url = pageUrl;

  return {
    "@context": "https://schema.org",
    "@graph": [
      business,
      {
        "@type": "FAQPage",
        ...(pageUrl ? { url: pageUrl } : {}),
        mainEntity: copy.hi.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };
}
