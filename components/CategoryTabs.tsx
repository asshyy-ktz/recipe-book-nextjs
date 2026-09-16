"use client";

import type { RecipeCategory } from "@/lib/types";

export default function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: RecipeCategory[];
  active: RecipeCategory | "All";
  onChange: (category: RecipeCategory | "All") => void;
}) {
  const all: (RecipeCategory | "All")[] = ["All", ...categories];

  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
      {all.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
            active === cat
              ? "bg-brand-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
