import { properties as fallbackProperties } from "@/lib/marketplace-data";
import type { Property } from "@/types/marketplace";

export type ApiPropertyImage = {
  id: number;
  image_url: string;
  display_order: number;
};

export type ApiProperty = {
  id: number;
  title: string;
  slug: string;
  description: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  featured: boolean;
  status: string;
  images?: ApiPropertyImage[];
};

const defaultAmenities = ["Fast Wi-Fi", "Secure parking", "Housekeeping support", "WhatsApp booking"];
const defaultHost = {
  name: "Micasa",
  avatar: "/images/listings/nyali-villa/WhatsApp Image 2026-07-10 at 12.25.20 (1).jpeg",
  superhost: true,
  responseTime: "within an hour"
};

export function mapApiProperty(property: ApiProperty): Property {
  const fallback = fallbackProperties.find((item) => item.slug === property.slug) ?? fallbackProperties[0];
  const images = (property.images ?? [])
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((image) => image.image_url)
    .filter(Boolean);

  return {
    id: `api-${property.id}`,
    slug: property.slug,
    title: property.title,
    location: property.location,
    description: property.description,
    type: property.property_type || fallback?.type || "Stay",
    category: property.property_type || fallback?.category || "Micasa stay",
    pricePerNight: Number(property.price_per_night),
    cleaningFee: Number(property.cleaning_fee),
    serviceFee: Number(property.service_fee),
    rating: fallback?.rating ?? 5,
    reviews: fallback?.reviews ?? 0,
    guests: Number(property.guests),
    bedrooms: Number(property.bedrooms),
    bathrooms: Number(property.bathrooms),
    host: fallback?.host ?? defaultHost,
    coordinates: {
      lat: property.latitude ?? fallback?.coordinates.lat ?? -4.0435,
      lng: property.longitude ?? fallback?.coordinates.lng ?? 39.6682
    },
    images: images.length ? images : fallback?.images ?? [],
    videos: fallback?.videos,
    amenities: fallback?.amenities ?? defaultAmenities,
    featured: property.featured
  };
}

export function publicPropertiesFromApi(properties: ApiProperty[]) {
  return properties
    .filter((property) => ["active", "published"].includes(property.status.toLowerCase()))
    .map(mapApiProperty);
}

export function mergedPublicPropertiesFromApi(properties: ApiProperty[]) {
  const liveProperties = publicPropertiesFromApi(properties);
  const liveBySlug = new Map(liveProperties.map((property) => [property.slug, property]));
  const merged = fallbackProperties.map((property) => liveBySlug.get(property.slug) ?? property);
  const fallbackSlugs = new Set(fallbackProperties.map((property) => property.slug));
  const addedLiveProperties = liveProperties.filter((property) => !fallbackSlugs.has(property.slug));
  return [...merged, ...addedLiveProperties];
}
