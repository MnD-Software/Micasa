import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, "frontend", "lib", "marketplace-data.ts");

function env(name) {
  return process.env[name]?.trim();
}

function requireEnv(name) {
  const value = env(name);
  if (!value) {
    throw new Error(`Missing ${name}. Add it to .env or set it before running npm run import:2chat.`);
  }
  return value;
}

function loadDotEnv() {
  try {
    const file = path.join(ROOT, ".env");
    if (!existsSync(file)) return;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // .env loading is a convenience only; explicit environment variables still work.
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function firstNumber(pattern, text, fallback) {
  const match = text.match(pattern);
  return match ? Number(match[1]) : fallback;
}

function inferLocation(text) {
  const known = ["Nyali", "Mombasa", "Diani", "Shanzu", "Bamburi", "Mtwapa", "Vipingo"];
  const found = known.filter((place) => new RegExp(`\\b${place}\\b`, "i").test(text));
  if (found.length >= 2) return `${found[0]}, ${found[1]}, Kenya`;
  if (found.length === 1) return `${found[0]}, Kenya`;
  return "Mombasa, Kenya";
}

function inferAmenities(description) {
  const checks = [
    ["beach", "Beach access"],
    ["pool", "Swimming pool"],
    ["wifi|wi-fi", "Fast Wi-Fi"],
    ["kitchen", "Kitchen"],
    ["parking", "Parking"],
    ["security", "Security"],
    ["chef", "Chef on request"],
    ["airport|transfer", "Airport transfer on request"],
    ["smart tv|tv", "Smart TV"],
    ["housekeeping", "Housekeeping"],
    ["ocean|sea view", "Ocean views"],
    ["balcon", "Balcony or terrace"]
  ];
  const amenities = checks
    .filter(([pattern]) => new RegExp(pattern, "i").test(description))
    .map(([, label]) => label);
  return amenities.length ? amenities : ["Availability on request", "WhatsApp booking"];
}

function toNumberPrice(price) {
  const parsed = Number(String(price ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function productToProperty(product, index) {
  const name = product.name || `WhatsApp listing ${index + 1}`;
  const description = product.description || "";
  const text = `${name}\n${description}`;
  const bedrooms = firstNumber(/(\d+)\s*(?:bedroom|bedrooms|br)\b/i, text, 1);
  const bathrooms = firstNumber(/(\d+)\s*(?:bathroom|bathrooms|bath)\b/i, text, Math.max(1, bedrooms));
  const guests = firstNumber(/(\d+)\s*(?:guest|guests|pax|people)\b/i, text, Math.max(2, bedrooms * 2));
  const images = Array.isArray(product.images)
    ? product.images.map((image) => image.url).filter(Boolean)
    : [];

  return {
    id: product.id ? `wa-${product.id}` : `wa-${index + 1}`,
    slug: slugify(name) || `whatsapp-listing-${index + 1}`,
    title: name,
    location: inferLocation(text),
    description: description || name,
    type: /villa/i.test(text) ? "Villa" : /apartment/i.test(text) ? "Apartment" : "Property",
    category: /beach/i.test(text) ? "Beach access" : /pool/i.test(text) ? "Pool" : "Coastal stay",
    pricePerNight: toNumberPrice(product.price),
    cleaningFee: 0,
    serviceFee: 0,
    rating: 5,
    reviews: 0,
    guests,
    bedrooms,
    bathrooms,
    host: {
      name: env("IMPORT_HOST_NAME") || "Host",
      avatar: images[0] || "",
      superhost: true,
      responseTime: "via WhatsApp"
    },
    coordinates: { lat: -4.0435, lng: 39.7046 },
    images,
    amenities: inferAmenities(text),
    featured: index === 0
  };
}

function tsString(value) {
  return JSON.stringify(value, null, 2);
}

function renderDataFile(properties) {
  const images = properties.flatMap((property) => property.images);
  const firstImage = images[0] || "";
  const destinations = [
    {
      city: "Mombasa stays",
      country: "Imported from WhatsApp catalog",
      properties: properties.length,
      image: firstImage
    }
  ];
  const experiences = [];

  return `import type { Destination, Experience, Property } from "@/types/marketplace";

export const categories = ${tsString([...new Set(properties.map((property) => property.category))])};

export const properties: Property[] = ${tsString(properties)};

export const destinations: Destination[] = ${tsString(destinations)};

export const experiences: Experience[] = ${tsString(experiences)};

export function getPropertyBySlug(slug: string) {
  return properties.find((property) => property.slug === slug);
}
`;
}

async function main() {
  loadDotEnv();
  const apiKey = requireEnv("2CHAT_API_KEY");
  const fromNumber = requireEnv("2CHAT_FROM_NUMBER");
  const catalogNumber = env("2CHAT_CATALOG_NUMBER");
  const base = "https://api.p.2chat.io/open/whatsapp/catalog/products";
  const url = new URL(catalogNumber ? `${base}/${encodeURIComponent(catalogNumber)}` : base);
  url.searchParams.set("from_number", fromNumber);

  const response = await fetch(url, {
    headers: {
      "X-User-API-Key": apiKey
    }
  });

  if (!response.ok) {
    throw new Error(`2Chat request failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  const products = Array.isArray(payload.products) ? payload.products : [];
  if (!products.length) {
    throw new Error("2Chat returned no catalog products.");
  }

  const properties = products
    .filter((product) => !product.is_hidden && product.approval_status !== "REJECTED")
    .map(productToProperty)
    .filter((property) => property.images.length > 0);

  if (!properties.length) {
    throw new Error("No visible catalog products with images were available to import.");
  }

  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, renderDataFile(properties), "utf8");
  console.log(`Imported ${properties.length} WhatsApp catalog listing(s) into ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
