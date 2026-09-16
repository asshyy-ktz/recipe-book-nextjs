"use client";

import { useRecipeStore } from "@/store/useRecipeStore";
import { useMealPlanStore } from "@/store/useMealPlanStore";
import RecipeSidebarList from "@/components/RecipeSidebarList";
import WeeklyCalendarGrid from "@/components/WeeklyCalendarGrid";

export default function PlannerPage() {
  const recipes = useRecipeStore((s) => s.recipes);
  const clearWeek = useMealPlanStore((s) => s.clearWeek);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weekly Meal Planner</h1>
          <p className="text-sm text-gray-500">
            Drag recipes from the sidebar onto a day and meal slot to plan your week.
          </p>
        </div>
        <button
          type="button"
          onClick={clearWeek}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear Week
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-3 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">All Recipes</h2>
            <RecipeSidebarList recipes={recipes} />
          </div>
        </div>
        <div className="lg:col-span-3">
          <WeeklyCalendarGrid recipes={recipes} />
        </div>
      </div>
    </div>
  );
}
