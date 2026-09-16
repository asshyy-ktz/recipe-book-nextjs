"use client";

import Image from "next/image";
import { useState } from "react";
import type { Recipe } from "@/lib/types";

export default function RecipeSidebarList({ recipes }: { recipes: Recipe[] }) {
  const [query, setQuery] = useState("");

  const filtered = recipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, recipeId: string) {
    e.dataTransfer.setData("text/plain", recipeId);
    e.dataTransfer.effectAllowed = "copy";
  }

  return (
    <div className="flex h-full flex-col">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search recipes..."
        className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <p className="mb-2 text-xs text-gray-500">Drag a recipe onto a day/meal slot to plan it.</p>
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {filtered.map((recipe) => (
          <div
            key={recipe.id}
            draggable
            onDragStart={(e) => handleDragStart(e, recipe.id)}
            className="flex cursor-grab items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm active:cursor-grabbing"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
              <Image src={recipe.photoUrl} alt={recipe.title} fill sizes="40px" className="object-cover" />
            </div>
            <span className="line-clamp-2 text-sm text-gray-800">{recipe.title}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">No recipes match.</p>
        )}
      </div>
    </div>
  );
}
