"use client";

import { useState } from "react";
import type { IngredientCategory } from "@/lib/types";
import { INGREDIENT_CATEGORIES } from "@/lib/types";
import { useShoppingListStore } from "@/store/useShoppingListStore";

export default function ManualAddItemField() {
  const addManualItem = useShoppingListStore((s) => s.addManualItem);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState<IngredientCategory>("other");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addManualItem(name, quantity, unit, category);
    setName("");
    setQuantity(1);
    setUnit("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name"
        className="min-w-[8rem] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <input
        type="number"
        min={0}
        step="any"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-20 rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <input
        type="text"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        placeholder="unit"
        className="w-20 rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as IngredientCategory)}
        className="rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        {INGREDIENT_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Add Item
      </button>
    </form>
  );
}
