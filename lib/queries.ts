import { useQuery } from "@tanstack/react-query";
import type { Recipe } from "./types";

/**
 * Simulates an async data-fetch (e.g. from an API) by resolving with the
 * recipes currently held in the Zustand store after a short delay. This
 * demonstrates the TanStack Query client-fetch pattern even though the
 * underlying data is local/seeded rather than remote.
 */
function simulateFetchRecipes(recipes: Recipe[]): Promise<Recipe[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(recipes), 300);
  });
}

export function useRecipesQuery(recipes: Recipe[]) {
  return useQuery({
    queryKey: ["recipes", recipes.length, recipes.map((r) => r.id).join(",")],
    queryFn: () => simulateFetchRecipes(recipes),
    initialData: recipes,
  });
}
