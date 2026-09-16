import type {
  Ingredient,
  IngredientCategory,
  NutritionFacts,
  ShoppingListItem,
} from "./types";

/** Generates a reasonably unique id without external deps. */
export function generateId(prefix = "id"): string {
  const random = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${random}`;
}

/**
 * Scales a single ingredient's quantity proportionally from an original
 * serving count to a new serving count.
 */
export function scaleQuantity(
  quantity: number,
  originalServings: number,
  newServings: number
): number {
  if (originalServings <= 0) return quantity;
  const scaled = (quantity * newServings) / originalServings;
  // Round to 2 decimal places to avoid floating point noise (e.g. 0.30000000004)
  return Math.round(scaled * 100) / 100;
}

export function scaleIngredients(
  ingredients: Ingredient[],
  originalServings: number,
  newServings: number
): Ingredient[] {
  return ingredients.map((ing) => ({
    ...ing,
    quantity: scaleQuantity(ing.quantity, originalServings, newServings),
  }));
}

export function scaleNutrition(
  nutrition: NutritionFacts,
  originalServings: number,
  newServings: number
): NutritionFacts {
  // nutritionPerServing stays "per serving" by definition, but we expose a
  // helper that scales an aggregate total (used to show total-recipe values)
  // as well as a per-serving passthrough. Here we scale the *per serving*
  // figure by the ratio of new-to-original when the caller wants totals.
  const ratio = originalServings > 0 ? newServings / originalServings : 1;
  const round = (n: number) => Math.round(n * ratio * 10) / 10;
  return {
    calories: round(nutrition.calories),
    proteinG: round(nutrition.proteinG),
    carbsG: round(nutrition.carbsG),
    fatG: round(nutrition.fatG),
    fiberG: round(nutrition.fiberG),
    sugarG: round(nutrition.sugarG),
    sodiumMg: round(nutrition.sodiumMg),
  };
}

/** Normalizes an ingredient name + unit for merge-key comparison. */
function mergeKey(name: string, unit: string): string {
  return `${name.trim().toLowerCase()}::${unit.trim().toLowerCase()}`;
}

/**
 * Aggregates a flat list of ingredients (already scaled to the desired
 * servings by the caller) into merged shopping-list items, summing
 * quantities for entries that share the same name + unit, and grouping
 * by category.
 */
export function mergeIngredients(
  ingredients: Ingredient[]
): Omit<ShoppingListItem, "checked" | "isManual" | "id">[] {
  const byKey = new Map<
    string,
    { name: string; quantity: number; unit: string; category: IngredientCategory }
  >();

  for (const ing of ingredients) {
    const key = mergeKey(ing.name, ing.unit);
    const existing = byKey.get(key);
    if (existing) {
      existing.quantity = Math.round((existing.quantity + ing.quantity) * 100) / 100;
    } else {
      byKey.set(key, {
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        category: ing.category,
      });
    }
  }

  return Array.from(byKey.values());
}

export function groupByCategory<T extends { category: IngredientCategory }>(
  items: T[]
): Record<IngredientCategory, T[]> {
  const result: Record<IngredientCategory, T[]> = {
    produce: [],
    dairy: [],
    meat: [],
    pantry: [],
    spices: [],
    other: [],
  };
  for (const item of items) {
    result[item.category].push(item);
  }
  return result;
}

export function formatQuantity(quantity: number): string {
  if (Number.isInteger(quantity)) return String(quantity);
  return quantity.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hrs} hr` : `${hrs} hr ${mins} min`;
}

export function formatSeconds(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
