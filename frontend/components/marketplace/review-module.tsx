"use client";

import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Review = {
  rating: number;
  text: string;
  author: string;
};

function Stars({
  value,
  onChange
}: {
  value: number;
  onChange?: (value: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((rating) => {
        const active = rating <= value;
        const Icon = (
          <Star
            size={22}
            aria-hidden
            className={active ? "fill-brand-ink text-brand-ink" : "text-brand-muted"}
          />
        );

        return onChange ? (
          <button
            key={rating}
            aria-label={`Rate ${rating} star${rating === 1 ? "" : "s"}`}
            className="focus-ring rounded-full p-1"
            onClick={() => onChange(rating)}
            type="button"
          >
            {Icon}
          </button>
        ) : (
          <span key={rating}>{Icon}</span>
        );
      })}
    </div>
  );
}

export function ReviewModule({
  propertyId,
  propertyTitle,
  baseRating,
  baseReviewCount
}: {
  propertyId: string;
  propertyTitle: string;
  baseRating: number;
  baseReviewCount: number;
}) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const storageKey = `micasa-reviews-${propertyId}`;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        setReviews(JSON.parse(stored) as Review[]);
      }
    } catch {
      setReviews([]);
    }
  }, [storageKey]);

  const average = useMemo(() => {
    if (!reviews.length) {
      return baseRating;
    }
    const total = reviews.reduce((sum, review) => sum + review.rating, baseRating * baseReviewCount);
    return total / (reviews.length + baseReviewCount);
  }, [baseRating, baseReviewCount, reviews]);

  function submitReview() {
    const text = reviewText.trim();
    if (!text) {
      return;
    }
    const nextReviews = [{ rating, text, author: "Your review" }, ...reviews];
    setReviews(nextReviews);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextReviews));
    } catch {
      // Local persistence is optional; the submitted review still appears in-session.
    }
    setRating(5);
    setReviewText("");
  }

  return (
    <section className="content-visibility-auto py-6 [contain-intrinsic-size:720px] sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand-ink sm:text-2xl">Reviews</h2>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-brand-ink">
            <Star size={16} className="fill-brand-ink" aria-hidden />
            {average.toFixed(1)} - {baseReviewCount + reviews.length} review{baseReviewCount + reviews.length === 1 ? "" : "s"}
          </p>
        </div>
        <p className="text-sm text-brand-muted">Rate your stay at {propertyTitle}</p>
      </div>

      <div className="mt-5 rounded-[22px] border border-brand-line bg-white p-4 shadow-pearl">
        <div className="flex items-center justify-between gap-3">
          <p className="font-bold text-brand-ink">Your rating</p>
          <Stars value={rating} onChange={setRating} />
        </div>
        <textarea
          className="focus-ring mt-4 min-h-24 w-full resize-none rounded-2xl border border-brand-line bg-brand-ivory p-3 text-sm text-brand-ink outline-none placeholder:text-brand-muted"
          onChange={(event) => setReviewText(event.target.value)}
          placeholder="Share what stood out about this stay"
          value={reviewText}
        />
        <div className="mt-3 flex justify-end">
          <Button type="button" onClick={submitReview} disabled={!reviewText.trim()}>
            Submit review
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-5">
        {reviews.length ? reviews.map((review, index) => (
          <article key={`${review.author}-${index}`} className="rounded-[20px] border border-brand-line bg-white/72 p-4 shadow-pearl sm:rounded-[24px] sm:p-5">
            <Stars value={review.rating} />
            <p className="mt-3 text-sm leading-6 text-brand-ink">{review.text}</p>
            <p className="mt-4 text-sm font-semibold text-brand-muted">{review.author}</p>
          </article>
        )) : (
          <div className="rounded-[20px] border border-dashed border-brand-line bg-white/60 p-4 text-sm leading-6 text-brand-muted sm:rounded-[24px] sm:p-5">
            No written guest reviews have been added on this device yet.
          </div>
        )}
      </div>
    </section>
  );
}
