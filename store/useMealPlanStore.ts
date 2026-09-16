import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DayOfWeek, MealSlot, WeeklyPlan } from "@/lib/types";

function keyFor(day: DayOfWeek, slot: MealSlot): string {
  return `${day}::${slot}`;
}

interface MealPlanStoreState {
  plan: WeeklyPlan;
  addRecipeToSlot: (day: DayOfWeek, slot: MealSlot, recipeId: string) => void;
  removeRecipeFromSlot: (day: DayOfWeek, slot: MealSlot, recipeId: string) => void;
  clearSlot: (day: DayOfWeek, slot: MealSlot) => void;
  getSlot: (day: DayOfWeek, slot: MealSlot) => string[];
  clearWeek: () => void;
}

export const useMealPlanStore = create<MealPlanStoreState>()(
  persist(
    (set, get) => ({
      plan: {},

      addRecipeToSlot: (day, slot, recipeId) => {
        set((state) => {
          const key = keyFor(day, slot);
          const existing = state.plan[key] ?? [];
          if (existing.includes(recipeId)) return state;
          return { plan: { ...state.plan, [key]: [...existing, recipeId] } };
        });
      },

      removeRecipeFromSlot: (day, slot, recipeId) => {
        set((state) => {
          const key = keyFor(day, slot);
          const existing = state.plan[key] ?? [];
          return {
            plan: { ...state.plan, [key]: existing.filter((id) => id !== recipeId) },
          };
        });
      },

      clearSlot: (day, slot) => {
        set((state) => ({ plan: { ...state.plan, [keyFor(day, slot)]: [] } }));
      },

      getSlot: (day, slot) => get().plan[keyFor(day, slot)] ?? [],

      clearWeek: () => set({ plan: {} }),
    }),
    {
      name: "recipe-book-meal-plan",
    }
  )
);
