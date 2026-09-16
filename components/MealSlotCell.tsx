"use client";

import { useState } from "react";
import Link from "next/link";
import type { DayOfWeek, MealSlot, Recipe } from "@/lib/types";
import { useMealPlanStore } from "@/store/useMealPlanStore";

export default function MealSlotCell({
  day,
  slot,
  recipes,
}: {
  day: DayOfWeek;
  slot: MealSlot;
  recipes: Recipe[];
}) {
  const [isOver, setIsOver] = useState(false);
  const addRecipeToSlot = useMealPlanStore((s) => s.addRecipeToSlot);
  const removeRecipeFromSlot = useMealPlanStore((s) => s.removeRecipeFromSlot);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsOver(false);
    const recipeId = e.dataTransfer.getData("text/plain");
    if (recipeId) addRecipeToSlot(day, slot, recipeId);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      className={`min-h-[84px] rounded-lg border p-1.5 transition ${
        isOver ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex flex-col gap-1">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="flex items-center justify-between gap-1 rounded-md bg-white px-2 py-1 text-xs shadow-sm"
          >
            <Link href={`/recipes/${recipe.id}`} className="line-clamp-2 text-gray-800 hover:text-brand-600">
              {recipe.title}
            </Link>
            <button
              type="button"
              onClick={() => removeRecipeFromSlot(day, slot, recipe.id)}
              aria-label={`Remove ${recipe.title} from ${day} ${slot}`}
              className="shrink-0 text-gray-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
        {recipes.length === 0 && (
          <span className="block py-2 text-center text-[11px] text-gray-400">Drop here</span>
        )}
      </div>
    </div>
  );
}
