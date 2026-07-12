"use client";

import { FormEvent, useMemo, useState } from "react";
import { Loader2, Plus, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getDefaultPropertyExperience, propertyExperienceStorageKey, type PropertyExperience } from "@/lib/property-experience";
import { properties } from "@/lib/marketplace-data";

const API_URL = "/api/backend";
const adminTokenKey = "micasa-admin-token";

function parseScoreLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, score] = line.split(":");
      return { label: label.trim(), score: Number(score) || 5 };
    });
}

function parseSleepLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, beds, image] = line.split("|");
      return { title: title.trim(), beds: beds?.trim() || "Comfortable bed", image: image?.trim() || undefined };
    });
}

export function AdminListingControls() {
  const firstProperty = properties[0];
  const [selectedPropertyId, setSelectedPropertyId] = useState(firstProperty.id);
  const selectedProperty = properties.find((property) => property.id === selectedPropertyId) ?? firstProperty;
  const defaults = useMemo(() => getDefaultPropertyExperience(selectedProperty), [selectedProperty]);
  const [listingState, setListingState] = useState<"idle" | "saving">("idle");
  const [reviewState, setReviewState] = useState<"idle" | "saving">("idle");
  const [message, setMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [experienceMessage, setExperienceMessage] = useState("");
  const [categoryLines, setCategoryLines] = useState(defaults.reviewCategories.map((item) => `${item.label}:${item.score}`).join("\n"));
  const [tagLine, setTagLine] = useState(defaults.reviewTags.join(", "));
  const [sleepLines, setSleepLines] = useState(defaults.sleepRooms.map((room) => `${room.title}|${room.beds}|${room.image ?? ""}`).join("\n"));

  function token() {
    return window.localStorage.getItem(adminTokenKey) ?? "";
  }

  async function createListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const adminToken = token();
    if (!adminToken) {
      setMessage("Sign in as admin first.");
      return;
    }

    setListingState("saving");
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          title: String(form.get("title") ?? ""),
          slug: String(form.get("slug") ?? ""),
          description: String(form.get("description") ?? ""),
          property_type: String(form.get("property_type") ?? "Apartment"),
          bedrooms: Number(form.get("bedrooms") ?? 1),
          bathrooms: Number(form.get("bathrooms") ?? 1),
          guests: Number(form.get("guests") ?? 1),
          price_per_night: Number(form.get("price_per_night") ?? 1),
          cleaning_fee: Number(form.get("cleaning_fee") ?? 0),
          service_fee: Number(form.get("service_fee") ?? 0),
          location: String(form.get("location") ?? ""),
          featured: form.get("featured") === "on",
          status: String(form.get("status") ?? "published"),
          image_urls: String(form.get("image_urls") ?? "").split("\n").map((url) => url.trim()).filter(Boolean)
        })
      });

      if (!response.ok) {
        throw new Error(`Create listing failed with ${response.status}`);
      }
      event.currentTarget.reset();
      setMessage("Listing created in the backend.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create listing.");
    } finally {
      setListingState("idle");
    }
  }

  async function createReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const adminToken = token();
    if (!adminToken) {
      setReviewMessage("Sign in as admin first.");
      return;
    }

    setReviewState("saving");
    setReviewMessage("");
    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          property_id: Number(form.get("property_id") ?? 0),
          rating: Number(form.get("rating") ?? 5),
          comment: String(form.get("comment") ?? "")
        })
      });
      if (!response.ok) {
        throw new Error(`Create review failed with ${response.status}`);
      }
      event.currentTarget.reset();
      setReviewMessage("Review added to the backend.");
    } catch (error) {
      setReviewMessage(error instanceof Error ? error.message : "Could not create review.");
    } finally {
      setReviewState("idle");
    }
  }

  function saveExperience() {
    const experience: PropertyExperience = {
      reviewCategories: parseScoreLines(categoryLines),
      reviewTags: tagLine.split(",").map((tag) => tag.trim()).filter(Boolean),
      sleepRooms: parseSleepLines(sleepLines)
    };
    window.localStorage.setItem(propertyExperienceStorageKey(selectedProperty.id), JSON.stringify(experience));
    setExperienceMessage("Detail-page ratings, tags, and sleep rooms saved on this browser.");
  }

  function loadDefaultsFor(propertyId: string) {
    const nextProperty = properties.find((property) => property.id === propertyId) ?? firstProperty;
    const nextDefaults = getDefaultPropertyExperience(nextProperty);
    setSelectedPropertyId(propertyId);
    setCategoryLines(nextDefaults.reviewCategories.map((item) => `${item.label}:${item.score}`).join("\n"));
    setTagLine(nextDefaults.reviewTags.join(", "));
    setSleepLines(nextDefaults.sleepRooms.map((room) => `${room.title}|${room.beds}|${room.image ?? ""}`).join("\n"));
    setExperienceMessage("");
  }

  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <Card className="bg-white p-5">
        <h2 className="text-xl font-bold text-brand-ink">Add backend listing</h2>
        <p className="mt-1 text-sm text-brand-muted">Creates a real listing through `/api/properties` using the stored admin token.</p>
        <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={createListing}>
          <Input name="title" placeholder="Title" required />
          <Input name="slug" placeholder="slug-like-this" required />
          <Input name="property_type" placeholder="Property type" defaultValue="Apartment" required />
          <Input name="location" placeholder="Location" required />
          <Input name="bedrooms" type="number" min={0} placeholder="Bedrooms" required />
          <Input name="bathrooms" type="number" min={0} placeholder="Bathrooms" required />
          <Input name="guests" type="number" min={1} placeholder="Guests" required />
          <Input name="price_per_night" type="number" min={1} placeholder="Price per night" required />
          <Input name="cleaning_fee" type="number" min={0} placeholder="Cleaning fee" defaultValue={0} />
          <Input name="service_fee" type="number" min={0} placeholder="Service fee" defaultValue={0} />
          <select name="status" className="h-12 rounded-full border border-brand-line bg-white px-4 text-base font-medium text-brand-ink outline-none sm:text-sm">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <label className="flex items-center gap-3 rounded-full border border-brand-line px-4 text-sm font-semibold text-brand-ink">
            <input name="featured" type="checkbox" className="accent-brand-strong" />
            Featured
          </label>
          <textarea name="description" className="min-h-28 rounded-2xl border border-brand-line p-4 text-base outline-none sm:text-sm md:col-span-2" placeholder="Description" required />
          <textarea name="image_urls" className="min-h-28 rounded-2xl border border-brand-line p-4 text-base outline-none sm:text-sm md:col-span-2" placeholder="One image URL per line" />
          <Button type="submit" disabled={listingState === "saving"} className="md:col-span-2">
            {listingState === "saving" ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <Plus size={18} aria-hidden />}
            Create listing
          </Button>
        </form>
        {message ? <p className="mt-3 text-sm font-semibold text-brand-muted">{message}</p> : null}
      </Card>

      <div className="grid gap-6">
        <Card className="bg-white p-5">
          <h2 className="text-xl font-bold text-brand-ink">Add backend review</h2>
          <form className="mt-5 grid gap-3" onSubmit={createReview}>
            <Input name="property_id" type="number" min={1} placeholder="Backend property ID" required />
            <Input name="rating" type="number" min={1} max={5} placeholder="Rating 1-5" required />
            <textarea name="comment" className="min-h-24 rounded-2xl border border-brand-line p-4 text-base outline-none sm:text-sm" placeholder="Review comment" required />
            <Button type="submit" disabled={reviewState === "saving"}>
              {reviewState === "saving" ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <Star size={18} aria-hidden />}
              Add review
            </Button>
          </form>
          {reviewMessage ? <p className="mt-3 text-sm font-semibold text-brand-muted">{reviewMessage}</p> : null}
        </Card>

        <Card className="bg-white p-5">
          <h2 className="text-xl font-bold text-brand-ink">Detail page controls</h2>
          <p className="mt-1 text-sm text-brand-muted">Controls the guest-favorite breakdown, chips, and sleep carousel for the current frontend listings.</p>
          <select
            className="mt-4 h-12 w-full rounded-full border border-brand-line bg-white px-4 text-base font-medium text-brand-ink outline-none sm:text-sm"
            onChange={(event) => loadDefaultsFor(event.target.value)}
            value={selectedPropertyId}
          >
            {properties.map((property) => (
              <option key={property.id} value={property.id}>{property.title}</option>
            ))}
          </select>
          <textarea className="mt-3 min-h-28 w-full rounded-2xl border border-brand-line p-4 text-base outline-none sm:text-sm" value={categoryLines} onChange={(event) => setCategoryLines(event.target.value)} />
          <textarea className="mt-3 min-h-20 w-full rounded-2xl border border-brand-line p-4 text-base outline-none sm:text-sm" value={tagLine} onChange={(event) => setTagLine(event.target.value)} />
          <textarea className="mt-3 min-h-28 w-full rounded-2xl border border-brand-line p-4 text-base outline-none sm:text-sm" value={sleepLines} onChange={(event) => setSleepLines(event.target.value)} />
          <Button type="button" className="mt-3 w-full" onClick={saveExperience}>
            <Save size={18} aria-hidden />
            Save detail controls
          </Button>
          {experienceMessage ? <p className="mt-3 text-sm font-semibold text-brand-muted">{experienceMessage}</p> : null}
        </Card>
      </div>
    </section>
  );
}
