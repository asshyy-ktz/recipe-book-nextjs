"use client";

import { Fragment } from "react";
import type { Recipe } from "@/lib/types";
import { DAYS_OF_WEEK, MEAL_SLOTS } from "@/lib/types";
import { useMealPlanStore } from "@/store/useMealPlanStore";
import MealSlotCell from "./MealSlotCell";

const SLOT_LABELS: Record<(typeof MEAL_SLOTS)[number], string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

export default function WeeklyCalendarGrid({ recipes }: { recipes: Recipe[] }) {
  const plan = useMealPlanStore((s) => s.plan);
  const recipeById = new Map(recipes.map((r) => [r.id, r]));

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[640px] grid-cols-8 gap-2 sm:min-w-0">
        <div />
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-700 sm:text-sm">
            {day.slice(0, 3)}
          </div>
        ))}

        {MEAL_SLOTS.map((slot) => (
          <Fragment key={slot}>
            <div className="flex items-center text-xs font-medium text-gray-500 sm:text-sm">
              {SLOT_LABELS[slot]}
            </div>
            {DAYS_OF_WEEK.map((day) => {
              const ids = plan[`${day}::${slot}`] ?? [];
              const plannedRecipes = ids
                .map((id) => recipeById.get(id))
                .filter((r): r is Recipe => Boolean(r));
              return (
                <MealSlotCell key={`${day}-${slot}`} day={day} slot={slot} recipes={plannedRecipes} />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
