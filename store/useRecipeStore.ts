import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Recipe } from "@/lib/types";
import { SEED_RECIPES } from "@/lib/seed-data";
import { generateId } from "@/lib/utils";

interface RecipeStoreState {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, "id" | "createdAt" | "isFavorite" | "rating" | "notes">) => string;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setRating: (id: string, rating: number) => void;
  setNotes: (id: string, notes: string) => void;
  getRecipeById: (id: string) => Recipe | undefined;
}

export const useRecipeStore = create<RecipeStoreState>()(
  persist(
    (set, get) => ({
      recipes: SEED_RECIPES,

      addRecipe: (recipe) => {
        const id = generateId("recipe");
        const newRecipe: Recipe = {
          ...recipe,
          id,
          isFavorite: false,
          rating: 0,
          notes: "",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ recipes: [newRecipe, ...state.recipes] }));
        return id;
      },

      updateRecipe: (id, patch) => {
        set((state) => ({
          recipes: state.recipes.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        }));
      },

      deleteRecipe: (id) => {
        set((state) => ({ recipes: state.recipes.filter((r) => r.id !== id) }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
          ),
        }));
      },

      setRating: (id, rating) => {
        set((state) => ({
          recipes: state.recipes.map((r) => (r.id === id ? { ...r, rating } : r)),
        }));
      },

      setNotes: (id, notes) => {
        set((state) => ({
          recipes: state.recipes.map((r) => (r.id === id ? { ...r, notes } : r)),
        }));
      },

      getRecipeById: (id) => get().recipes.find((r) => r.id === id),
    }),
    {
      name: "recipe-book-recipes",
    }
  )
);
