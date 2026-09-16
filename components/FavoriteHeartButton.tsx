"use client";

import { useRecipeStore } from "@/store/useRecipeStore";

export default function FavoriteHeartButton({
  recipeId,
  isFavorite,
  size = "md",
}: {
  recipeId: string;
  isFavorite: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const toggleFavorite = useRecipeStore((s) => s.toggleFavorite);

  const sizeClasses = size === "sm" ? "h-8 w-8 text-base" : size === "lg" ? "h-12 w-12 text-2xl" : "h-10 w-10 text-lg";

  return (
    <button
      type="button"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(recipeId);
      }}
      className={`flex ${sizeClasses} items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110 hover:bg-white`}
    >
      <span className={isFavorite ? "text-red-500" : "text-gray-400"}>
        {isFavorite ? "♥" : "♡"}
      </span>
    </button>
  );
}
