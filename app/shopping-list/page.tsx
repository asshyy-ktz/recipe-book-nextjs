"use client";

import { useEffect } from "react";
import { useRecipeStore } from "@/store/useRecipeStore";
import { useMealPlanStore } from "@/store/useMealPlanStore";
import { useShoppingListStore } from "@/store/useShoppingListStore";
import ShoppingListView from "@/components/ShoppingListView";
import ManualAddItemField from "@/components/ManualAddItemField";

export default function ShoppingListPage() {
  const recipes = useRecipeStore((s) => s.recipes);
  const plan = useMealPlanStore((s) => s.plan);
  const items = useShoppingListStore((s) => s.items);
  const regenerateFromMealPlan = useShoppingListStore((s) => s.regenerateFromMealPlan);
  const clearChecked = useShoppingListStore((s) => s.clearChecked);

  // Keep the auto-derived portion of the list in sync with the meal plan.
  useEffect(() => {
    regenerateFromMealPlan(plan, recipes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, recipes]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping List</h1>
          <p className="text-sm text-gray-500">
            Auto-generated from your weekly meal plan, merged and grouped by category.
          </p>
        </div>
        <button
          type="button"
          onClick={clearChecked}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear Checked
        </button>
      </div>

      <ManualAddItemField />

      <ShoppingListView items={items} />
    </div>
  );
}
