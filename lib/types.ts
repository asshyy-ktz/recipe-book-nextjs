export type Difficulty = "Easy" | "Medium" | "Hard";

export type IngredientCategory =
  | "produce"
  | "dairy"
  | "meat"
  | "pantry"
  | "spices"
  | "other";

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  "produce",
  "dairy",
  "meat",
  "pantry",
  "spices",
  "other",
];

export type RecipeCategory =
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Dessert"
  | "Snack"
  | "Salad"
  | "Soup";

export const RECIPE_CATEGORIES: RecipeCategory[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Salad",
  "Soup",
];

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
}

export interface NutritionFacts {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  sodiumMg: number;
}

export interface Recipe {
  id: string;
  title: string;
  photoUrl: string;
  category: RecipeCategory;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  nutritionPerServing: NutritionFacts;
  isFavorite: boolean;
  rating: number; // 0-5
  notes: string;
  createdAt: string;
}

export type MealSlot = "breakfast" | "lunch" | "dinner";

export const MEAL_SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner"];

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

/** Key format: `${day}::${slot}` */
export type MealPlanKey = string;

export type WeeklyPlan = Record<MealPlanKey, string[]>;

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
  checked: boolean;
  isManual: boolean;
}
