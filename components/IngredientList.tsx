"use client";

import type { Ingredient } from "@/lib/types";
import { clamp, formatQuantity, scaleIngredients } from "@/lib/utils";

export default function IngredientList({
  ingredients,
  originalServings,
  servings,
  onServingsChange,
}: {
  ingredients: Ingredient[];
  originalServings: number;
  servings: number;
  onServingsChange: (servings: number) => void;
}) {
  const setServings = onServingsChange;
  const scaled = scaleIngredients(ingredients, originalServings, servings);

  const decrement = () => setServings(clamp(servings - 1, 1, 99));
  const increment = () => setServings(clamp(servings + 1, 1, 99));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Ingredients</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Servings</span>
          <div className="flex items-center rounded-lg border border-gray-300">
            <button
              type="button"
              onClick={decrement}
              aria-label="Decrease servings"
              className="px-2.5 py-1 text-gray-600 hover:bg-gray-100"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={99}
              value={servings}
              onChange={(e) => setServings(clamp(Number(e.target.value) || 1, 1, 99))}
              className="w-12 border-x border-gray-300 py-1 text-center text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={increment}
              aria-label="Increase servings"
              className="px-2.5 py-1 text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <ul className="space-y-2">
        {scaled.map((ing) => (
          <li
            key={ing.id}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
          >
            <span className="text-gray-800">{ing.name}</span>
            <span className="font-medium text-gray-900">
              {formatQuantity(ing.quantity)} {ing.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
