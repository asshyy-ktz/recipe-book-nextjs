import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  DayOfWeek,
  IngredientCategory,
  MealSlot,
  Recipe,
  ShoppingListItem,
  WeeklyPlan,
} from "@/lib/types";
import { DAYS_OF_WEEK, MEAL_SLOTS } from "@/lib/types";
import { generateId, mergeIngredients, scaleIngredients } from "@/lib/utils";

interface ShoppingListStoreState {
  items: ShoppingListItem[];
  toggleChecked: (id: string) => void;
  addManualItem: (name: string, quantity: number, unit: string, category: IngredientCategory) => void;
  removeItem: (id: string) => void;
  clearChecked: () => void;
  /**
   * Regenerates the auto-derived (non-manual) portion of the list from the
   * current weekly meal plan, aggregating ingredient quantities across every
   * planned recipe and grouping by category. Manually-added items and the
   * checked state of items that still match after regeneration are preserved.
   */
  regenerateFromMealPlan: (plan: WeeklyPlan, recipes: Recipe[]) => void;
}

function itemMatchKey(name: string, unit: string): string {
  return `${name.trim().toLowerCase()}::${unit.trim().toLowerCase()}`;
}

export const useShoppingListStore = create<ShoppingListStoreState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleChecked: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        }));
      },

      addManualItem: (name, quantity, unit, category) => {
        if (!name.trim()) return;
        const newItem: ShoppingListItem = {
          id: generateId("item"),
          name: name.trim(),
          quantity: quantity > 0 ? quantity : 1,
          unit: unit.trim() || "unit",
          category,
          checked: false,
          isManual: true,
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },

      clearChecked: () => {
        set((state) => ({ items: state.items.filter((item) => !item.checked) }));
      },

      regenerateFromMealPlan: (plan, recipes) => {
        const recipeById = new Map(recipes.map((r) => [r.id, r]));

        // Collect every ingredient (already scaled to the recipe's own
        // servings, i.e. as written) from every planned recipe/day/slot.
        const allIngredients: {
          name: string;
          quantity: number;
          unit: string;
          category: IngredientCategory;
        }[] = [];

        (Object.keys(plan) as string[]).forEach((key) => {
          const recipeIds = plan[key];
          for (const recipeId of recipeIds) {
            const recipe = recipeById.get(recipeId);
            if (!recipe) continue;
            // Ingredients are used at the recipe's default serving size.
            const scaled = scaleIngredients(recipe.ingredients, recipe.servings, recipe.servings);
            allIngredients.push(...scaled);
          }
        });

        const merged = mergeIngredients(allIngredients);

        set((state) => {
          const manualItems = state.items.filter((item) => item.isManual);
          const previousAuto = new Map(
            state.items
              .filter((item) => !item.isManual)
              .map((item) => [itemMatchKey(item.name, item.unit), item])
          );

          const newAutoItems: ShoppingListItem[] = merged.map((m) => {
            const key = itemMatchKey(m.name, m.unit);
            const prev = previousAuto.get(key);
            return {
              id: prev?.id ?? generateId("item"),
              name: m.name,
              quantity: m.quantity,
              unit: m.unit,
              category: m.category,
              checked: prev?.checked ?? false,
              isManual: false,
            };
          });

          return { items: [...newAutoItems, ...manualItems] };
        });
      },
    }),
    {
      name: "recipe-book-shopping-list",
    }
  )
);

// Re-exported for convenience where callers need day/slot iteration.
export { DAYS_OF_WEEK, MEAL_SLOTS };
export type { DayOfWeek, MealSlot };
