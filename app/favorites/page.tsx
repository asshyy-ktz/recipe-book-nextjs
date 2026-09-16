"use client";

import { useRecipeStore } from "@/store/useRecipeStore";
import RecipeGrid from "@/components/RecipeGrid";

export default function FavoritesPage() {
  const recipes = useRecipeStore((s) => s.recipes.filter((r) => r.isFavorite));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
        <p className="text-sm text-gray-500">Recipes you&apos;ve marked with a heart.</p>
      </div>
      <RecipeGrid recipes={recipes} />
    </div>
  );
}
