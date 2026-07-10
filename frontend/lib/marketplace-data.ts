import type { Destination, Experience, Property } from "@/types/marketplace";

const localImage = (fileName: string) => `/images/listings/nyali-villa/${fileName}`;

const villaImages = [
  localImage("WhatsApp Image 2026-07-10 at 12.16.37.jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.16.37 (1).jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.21.12 (2).jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.21.12 (3).jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.21.13 (1).jpeg")
];

const threeBedroomImages = [
  localImage("WhatsApp Image 2026-07-10 at 12.25.04.jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.25.05.jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.25.06.jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.25.07.jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.25.19.jpeg")
];

const seaViewImages = [
  localImage("WhatsApp Image 2026-07-10 at 12.25.21.jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.25.20.jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.25.23.jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.27.11 (2).jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.27.12.jpeg")
];

const oneBedroomImages = [
  localImage("WhatsApp Image 2026-07-10 at 12.27.59 (1).jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.28.00.jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.28.39.jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.28.40.jpeg"),
  localImage("WhatsApp Image 2026-07-10 at 12.28.41.jpeg")
];

export const categories = [
  "Beach access",
  "Pool",
  "Family stays",
  "Groups",
  "En-suite rooms",
  "Chef on request",
  "Parking",
  "Fast Wi-Fi"
];

export const properties: Property[] = [
  {
    id: "p-001",
    slug: "nyali-4br-villa-near-beach",
    title: "Luxury 4 Bedroom Villa, Nyali",
    location: "Nyali, Mombasa, Kenya",
    description:
      "A spacious 4-bedroom villa in Nyali, Mombasa, set 2 minutes from the beach and 5 minutes from major shopping malls. Built for family holidays, group getaways, and relaxed coastal staycations, the villa includes 4 en-suite bedrooms, ocean views, a large swimming pool, fully equipped kitchen, fast Wi-Fi, Smart TV, ceiling fans, water dispensers, ample parking, housekeeping every 2 nights, and 24/7 manned security. Private chef services and airport transfers can be arranged at an additional cost.",
    type: "Entire villa",
    category: "Beach access",
    pricePerNight: 45000,
    cleaningFee: 3500,
    serviceFee: 4500,
    rating: 5.0,
    reviews: 5,
    guests: 8,
    bedrooms: 4,
    bathrooms: 4,
    host: {
      name: "Linda",
      avatar: villaImages[0],
      superhost: true,
      responseTime: "within 1 hour"
    },
    coordinates: { lat: -4.0435, lng: 39.7046 },
    images: villaImages,
    amenities: [
      "2-minute walk to the beach",
      "5-minute walk to Nyali Mall and Nyali Centre",
      "Ocean views",
      "8 guests maximum",
      "4 en-suite bedrooms",
      "5 beds",
      "4 bathrooms",
      "Bedroom 1: 1 king bed",
      "Bedroom 2: 2 double beds",
      "Bedroom 3: 1 king bed",
      "Bedroom 4: 1 king bed",
      "Large shared outdoor saltwater pool",
      "Fully equipped kitchen",
      "Fast Wi-Fi",
      "Smart TV",
      "Ceiling fans in every room",
      "Large balconies, terraces and verandas",
      "Water dispensers",
      "Ample parking on premises",
      "Housekeeping every 2 nights",
      "24/7 manned security",
      "Private chef on request at extra cost",
      "Airport transfers on request at extra cost",
      "Check-in after 14:00",
      "Checkout before 10:00"
    ],
    featured: true
  },
  {
    id: "p-002",
    slug: "nyali-3br-apartment-lift-pool",
    title: "3 Bedroom Apartment, Nyali",
    location: "Nyali, Mombasa, Kenya",
    description:
      "A bright 4th-floor 3-bedroom apartment with lift access, ideal for family holidays, group getaways, business trips, and staycations. The apartment sleeps up to 6 guests and is 5 minutes from major shopping malls and 10 minutes from the beach. Guests get hot showers, a swimming pool, fast Wi-Fi, parking for 2 vehicles, and a fully equipped kitchen. Private chef service is available on request at an additional charge.",
    type: "Apartment",
    category: "Family stays",
    pricePerNight: 12000,
    cleaningFee: 1800,
    serviceFee: 2200,
    rating: 4.92,
    reviews: 18,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    host: {
      name: "Micasa",
      avatar: threeBedroomImages[0],
      superhost: true,
      responseTime: "within 1 hour"
    },
    coordinates: { lat: -4.0435, lng: 39.7046 },
    images: threeBedroomImages,
    amenities: [
      "5-minute walk to major shopping malls",
      "10-minute walk to the beach",
      "Sleeps up to 6 guests",
      "4th floor apartment with lift access",
      "Hot showers",
      "Swimming pool",
      "Fast Wi-Fi",
      "Parking for 2 vehicles",
      "Fully equipped kitchen",
      "Private chef on request at extra cost",
      "Ideal for family holidays and business trips"
    ],
    featured: true
  },
  {
    id: "p-003",
    slug: "nyali-4br-sea-view-apartment",
    title: "Luxury 4 Bedroom Sea View Apartment",
    location: "Nyali, Mombasa, Kenya",
    description:
      "A spacious sea-view apartment in prime Nyali with sweeping ocean outlooks and room for families or groups. The apartment sleeps up to 10 guests including kids and includes 4 en-suite bedrooms, swimming pool access, fast Wi-Fi, a fully equipped kitchen, and secure parking. Beaches, malls, restaurants, and entertainment are all close by.",
    type: "Sea view apartment",
    category: "Ocean views",
    pricePerNight: 15000,
    cleaningFee: 2200,
    serviceFee: 2600,
    rating: 4.96,
    reviews: 24,
    guests: 10,
    bedrooms: 4,
    bathrooms: 4,
    host: {
      name: "Micasa",
      avatar: seaViewImages[0],
      superhost: true,
      responseTime: "within 1 hour"
    },
    coordinates: { lat: -4.0435, lng: 39.7046 },
    images: seaViewImages,
    amenities: [
      "Stunning ocean views",
      "Prime Nyali location",
      "4 en-suite bedrooms",
      "Sleeps up to 10 guests including kids",
      "Swimming pool",
      "Fast Wi-Fi",
      "Fully equipped kitchen",
      "Secure parking",
      "Close to beaches, malls, restaurants and entertainment"
    ],
    featured: true
  },
  {
    id: "p-004",
    slug: "nyali-spacious-one-bedroom-apartment",
    title: "Spacious One Bedroom Apartment, Nyali",
    location: "Nyali, Mombasa, Kenya",
    description:
      "A big, well-designed one-bedroom apartment in the heart of Nyali for couples, solo travelers, business stays, or longer coastal breaks. The stay includes a swimming pool, fast Wi-Fi, Smart TV with YouTube and Netflix, fully equipped kitchen with fridge and microwave, dining area, ample parking, 24/7 manned security, and housekeeping every two nights. The beach is 2 minutes away and major shopping malls are 5 minutes away.",
    type: "One bedroom apartment",
    category: "Couples",
    pricePerNight: 6000,
    cleaningFee: 1200,
    serviceFee: 1200,
    rating: 4.88,
    reviews: 31,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    host: {
      name: "Micasa",
      avatar: oneBedroomImages[0],
      superhost: true,
      responseTime: "within 1 hour"
    },
    coordinates: { lat: -4.0435, lng: 39.7046 },
    images: oneBedroomImages,
    amenities: [
      "2-minute walk to the beach",
      "5-minute walk to major shopping malls",
      "Ideal for couples, solo travelers and business stays",
      "Swimming pool",
      "Fast Wi-Fi",
      "Smart TV with YouTube and Netflix",
      "Fully equipped kitchen with fridge and microwave",
      "Dining area",
      "Ample parking",
      "24/7 manned security",
      "Housekeeping every two nights"
    ]
  }
];

export const destinations: Destination[] = [
  {
    city: "Nyali",
    country: "Mombasa, Kenya",
    properties: properties.length,
    image: seaViewImages[0]
  },
  {
    city: "Beach access",
    country: "2 to 10 minutes from selected stays",
    properties: properties.length,
    image: villaImages[2]
  },
  {
    city: "Villa compound",
    country: "Pool and parking available",
    properties: properties.length,
    image: threeBedroomImages[3]
  }
];

export const experiences: Experience[] = [
  {
    title: "Private chef service",
    location: "Available on request",
    image: villaImages[0],
    price: 0
  },
  {
    title: "Airport transfer",
    location: "Additional cost",
    image: seaViewImages[1],
    price: 0
  },
  {
    title: "Family pool day",
    location: "Shared outdoor saltwater pool",
    image: villaImages[3],
    price: 0
  }
];

export function getPropertyBySlug(slug: string) {
  return properties.find((property) => property.slug === slug);
}
