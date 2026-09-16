"use client";

import { useState } from "react";

export default function RatingStars({
  rating,
  onChange,
  readOnly = false,
}: {
  rating: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? rating;

  return (
    <div className="flex items-center gap-1" role={readOnly ? undefined : "radiogroup"} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(null)}
          onClick={() => onChange?.(star === rating ? 0 : star)}
          className={`text-xl leading-none ${readOnly ? "cursor-default" : "cursor-pointer"} ${
            star <= display ? "text-amber-400" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
