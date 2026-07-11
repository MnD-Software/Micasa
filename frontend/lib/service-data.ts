const localImage = (fileName: string) => `/images/listings/nyali-villa/${fileName}`;

export type ServicePackage = {
  title: string;
  description: string;
  price: number;
  unit: string;
  duration: string;
  image: string;
};

export type MarketplaceService = {
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  provider: string;
  rating: number;
  reviews: number;
  category: "service" | "experience";
  heroImage: string;
  avatar: string;
  startingPrice: number;
  unit: string;
  badge?: string;
  time?: string;
  packages: ServicePackage[];
};

export const marketplaceServices: MarketplaceService[] = [
  {
    slug: "micasa-private-chef-coastal-dinner",
    title: "Private Chef Coastal Dinner",
    subtitle: "A chef-led meal setup for villas, family stays, birthdays, and group holidays in Nyali.",
    location: "Provided on location in Mombasa",
    provider: "Micasa Guest Team",
    rating: 5,
    reviews: 27,
    category: "service",
    heroImage: localImage("WhatsApp Image 2026-07-10 at 12.21.12 (2).jpeg"),
    avatar: localImage("WhatsApp Image 2026-07-10 at 12.16.37.jpeg"),
    startingPrice: 12274,
    unit: "group",
    badge: "Guest favorite",
    packages: [
      {
        title: "Chef consult and menu plan",
        description: "Discuss group size, preferred menu, kitchen setup, and timing before arrival.",
        price: 12274,
        unit: "group",
        duration: "30 mins",
        image: localImage("WhatsApp Image 2026-07-10 at 12.25.04.jpeg")
      },
      {
        title: "In-stay private chef service",
        description: "Chef support for breakfast, dinner, or special occasion meals during your stay.",
        price: 25840,
        unit: "group",
        duration: "3 hours",
        image: localImage("WhatsApp Image 2026-07-10 at 12.25.05.jpeg")
      }
    ]
  },
  {
    slug: "micasa-airport-transfer",
    title: "Airport Transfer to Nyali",
    subtitle: "Reliable arrival and departure coordination for guests flying into Mombasa.",
    location: "Moi International Airport to Nyali",
    provider: "Micasa Transport Desk",
    rating: 5,
    reviews: 18,
    category: "service",
    heroImage: localImage("WhatsApp Image 2026-07-10 at 12.25.21.jpeg"),
    avatar: localImage("WhatsApp Image 2026-07-10 at 12.25.20.jpeg"),
    startingPrice: 6500,
    unit: "trip",
    packages: [
      {
        title: "One-way airport pickup",
        description: "Driver coordination, luggage support, and direct drop-off at your stay.",
        price: 6500,
        unit: "trip",
        duration: "45 mins",
        image: localImage("WhatsApp Image 2026-07-10 at 12.25.23.jpeg")
      },
      {
        title: "Return airport transfer",
        description: "Arrival and departure transfers planned around your flight schedule.",
        price: 12000,
        unit: "group",
        duration: "2 trips",
        image: localImage("WhatsApp Image 2026-07-10 at 12.27.11 (2).jpeg")
      }
    ]
  },
  {
    slug: "micasa-special-occasion-setup",
    title: "Special Occasion Setup",
    subtitle: "Simple decor, planning, and guest support for birthdays, proposals, and family moments.",
    location: "Provided on location",
    provider: "Micasa Guest Team",
    rating: 4.96,
    reviews: 14,
    category: "service",
    heroImage: localImage("WhatsApp Image 2026-07-10 at 12.27.59 (1).jpeg"),
    avatar: localImage("WhatsApp Image 2026-07-10 at 12.28.00.jpeg"),
    startingPrice: 9000,
    unit: "setup",
    packages: [
      {
        title: "Occasion planning call",
        description: "Align on timing, guest count, room setup, and the support needed.",
        price: 9000,
        unit: "setup",
        duration: "30 mins",
        image: localImage("WhatsApp Image 2026-07-10 at 12.28.39.jpeg")
      },
      {
        title: "Room and table setup",
        description: "Light decor and preparation for an in-stay celebration.",
        price: 18500,
        unit: "setup",
        duration: "2 hours",
        image: localImage("WhatsApp Image 2026-07-10 at 12.28.40.jpeg")
      }
    ]
  }
];

export const marketplaceExperiences: MarketplaceService[] = [
  {
    slug: "mombasa-guided-old-town-tour",
    title: "Mombasa Guided City Sightseeing Tour",
    subtitle: "A guided local route through Old Town, coastal landmarks, food stops, and photo moments.",
    location: "Mombasa, Kenya",
    provider: "Micasa Experience Partner",
    rating: 5,
    reviews: 31,
    category: "experience",
    heroImage: localImage("WhatsApp Image 2026-07-10 at 12.27.12.jpeg"),
    avatar: localImage("WhatsApp Image 2026-07-10 at 12.27.12 (1).jpeg"),
    startingPrice: 4134,
    unit: "guest",
    time: "1PM",
    packages: [
      {
        title: "Old Town and Fort Jesus route",
        description: "A compact guided experience for guests who want a city day without planning.",
        price: 4134,
        unit: "guest",
        duration: "3 hours",
        image: localImage("WhatsApp Image 2026-07-10 at 12.27.13.jpeg")
      }
    ]
  },
  {
    slug: "nyali-beach-and-pool-day",
    title: "Nyali Beach and Pool Day",
    subtitle: "A relaxed coastal day plan around beach access, pool time, and casual dining.",
    location: "Nyali, Mombasa",
    provider: "Micasa Experience Partner",
    rating: 4.94,
    reviews: 22,
    category: "experience",
    heroImage: localImage("WhatsApp Image 2026-07-10 at 12.21.13.jpeg"),
    avatar: localImage("WhatsApp Image 2026-07-10 at 12.21.13 (1).jpeg"),
    startingPrice: 4780,
    unit: "guest",
    time: "2PM",
    packages: [
      {
        title: "Beach and pool itinerary",
        description: "A hosted plan for guests who want a simple Mombasa leisure day.",
        price: 4780,
        unit: "guest",
        duration: "Half day",
        image: localImage("WhatsApp Image 2026-07-10 at 12.21.12.jpeg")
      }
    ]
  }
];

export function getServiceBySlug(slug: string) {
  return [...marketplaceServices, ...marketplaceExperiences].find((service) => service.slug === slug);
}
