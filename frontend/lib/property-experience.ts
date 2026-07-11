import type { Property } from "@/types/marketplace";

export type ReviewCategory = {
  label: string;
  score: number;
};

export type PropertyExperience = {
  reviewCategories: ReviewCategory[];
  reviewTags: string[];
  sleepRooms: Array<{
    title: string;
    beds: string;
    image?: string;
  }>;
};

export function propertyExperienceStorageKey(propertyId: string) {
  return `micasa-property-experience-${propertyId}`;
}

export function getDefaultPropertyExperience(property: Property): PropertyExperience {
  const score = Number(property.rating) || 5;
  const bedroomLines = property.amenities.filter((amenity) => /^Bedroom\s+\d+:/i.test(amenity));

  return {
    reviewCategories: [
      { label: "Cleanliness", score: Math.min(5, score) },
      { label: "Accuracy", score: Math.min(5, Math.max(4.7, score - 0.05)) },
      { label: "Check-in", score: 5 },
      { label: "Communication", score: 5 },
      { label: "Location", score: Math.min(5, Math.max(4.7, score - 0.12)) },
      { label: "Value", score: Math.min(5, Math.max(4.7, score - 0.08)) }
    ],
    reviewTags: [
      `${property.category} ${Math.max(5, property.reviews)}`,
      `Hospitality ${Math.max(6, property.reviews + 2)}`,
      `Cleanliness ${Math.max(5, property.reviews + 1)}`,
      `View ${Math.max(4, property.bedrooms + 3)}`,
      `Accuracy ${Math.max(5, property.bedrooms + 2)}`,
      `Comfort ${Math.max(5, property.guests)}`
    ],
    sleepRooms: bedroomLines.length
      ? bedroomLines.map((line, index) => {
          const [title, beds] = line.split(":");
          return {
            title: title.trim(),
            beds: beds?.trim() || "Comfortable bed",
            image: property.images[index + 1] ?? property.images[index]
          };
        })
      : Array.from({ length: Math.max(1, property.bedrooms) }, (_, index) => ({
          title: `Bedroom ${index + 1}`,
          beds: index === 0 ? "1 king bed" : "1 comfortable bed",
          image: property.images[index + 1] ?? property.images[index]
        }))
  };
}
