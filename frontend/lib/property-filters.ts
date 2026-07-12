import type { Property } from "@/types/marketplace";

export const stayFilterOptions = [
  ["", "All stays"],
  ["Fast Wi-Fi", "Wifi"],
  ["Parking", "Free parking"],
  ["Self check-in", "Self check-in"],
  ["bathrooms", "1+ bathrooms"],
  ["Air conditioning", "Air conditioning"],
  ["Smart TV", "TV"],
  ["Swimming pool", "Pool"],
  ["Beach", "Beach access"]
] as const;

export function filterProperties(properties: Property[], values: { location?: string; guests?: number; filter?: string }) {
  const query = values.location?.trim().toLowerCase() ?? "";
  const filter = values.filter?.trim().toLowerCase() ?? "";
  const guests = values.guests ?? 1;

  return properties.filter((property) => {
    const locationNeedle = query.split(",")[0]?.trim() ?? "";
    const searchable = [
      property.title,
      property.location,
      property.description,
      property.category,
      property.type,
      ...property.amenities
    ].join(" ").toLowerCase();

    const matchesLocation = !locationNeedle || searchable.includes(locationNeedle);
    const matchesGuests = property.guests >= guests;
    const matchesFilter =
      !filter ||
      searchable.includes(filter) ||
      (filter === "bathrooms" && property.bathrooms >= 1) ||
      (filter === "parking" && searchable.includes("parking")) ||
      (filter === "beach" && searchable.includes("beach")) ||
      (filter === "swimming pool" && searchable.includes("pool")) ||
      (filter === "smart tv" && searchable.includes("tv"));

    return matchesLocation && matchesGuests && matchesFilter;
  });
}
