"use client";

import { useMemo, useState } from "react";
import type { RecipeCategory } from "@/lib/types";
import { RECIPE_CATEGORIES } from "@/lib/types";
import { useRecipeStore } from "@/store/useRecipeStore";
import { useRecipesQuery } from "@/lib/queries";
import RecipeGrid from "@/components/RecipeGrid";
import CategoryTabs from "@/components/CategoryTabs";
import SearchFilterBar from "@/components/SearchFilterBar";

export default function HomePage() {
  const storeRecipes = useRecipeStore((s) => s.recipes);
  const { data: recipes = [], isLoading } = useRecipesQuery(storeRecipes);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<RecipeCategory | "All">("All");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesCategory = category === "All" || recipe.category === category;
      if (!matchesCategory) return false;
      if (!query) return true;
      const inTitle = recipe.title.toLowerCase().includes(query);
      const inIngredients = recipe.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(query)
      );
      return inTitle || inIngredients;
    });
  }, [recipes, search, category]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Recipes</h1>
        <p className="text-sm text-gray-500">Browse, search, and filter your recipe collection.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchFilterBar value={search} onChange={setSearch} />
        <CategoryTabs categories={RECIPE_CATEGORIES} active={category} onChange={setCategory} />
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-sm text-gray-400">Loading recipes...</p>
      ) : (
        <RecipeGrid recipes={filtered} />
      )}
    </div>
  );
}
