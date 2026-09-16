# Recipe Book (Next.js 14)

A full-featured recipe manager built with Next.js 14 (App Router), TypeScript, Tailwind CSS,
Zustand, and TanStack Query. Browse recipes, scale ingredients, enter a full-screen cook mode
with a wake lock and step timer, plan a week of meals by dragging recipes onto a calendar, and
auto-generate a categorized shopping list from that plan.

## Architecture overview

### App Router structure (`app/`)

- `app/layout.tsx` — root server-renderable layout shell: imports `globals.css`, wraps the tree
  in `Providers` (TanStack Query client) and renders the global `NavBar`.
- `app/page.tsx` — home page: recipe grid with search + category tabs.
- `app/recipes/[id]/page.tsx` — recipe detail: scalable ingredients, steps, nutrition, rating/notes.
- `app/recipes/new/page.tsx` — create form (uses the shared `RecipeForm`).
- `app/recipes/[id]/edit/page.tsx` — edit form (same shared `RecipeForm`, pre-filled).
- `app/recipes/[id]/cook/page.tsx` — renders `CookModeView`, a fixed full-screen overlay.
- `app/planner/page.tsx` — weekly meal planner (sidebar + 7x3 drag-and-drop grid).
- `app/shopping-list/page.tsx` — auto-derived + manually-added shopping list.
- `app/favorites/page.tsx` — recipes filtered to `isFavorite`.

Pages are marked `"use client"` wherever they read Zustand state or use hooks/drag-and-drop;
`app/layout.tsx` and a couple of leaf presentational pieces stay server components.

### Components (`components/`)

Each piece of UI is a single-purpose component: `RecipeCard` / `RecipeGrid` / `CategoryTabs` /
`SearchFilterBar` for browsing; `IngredientList` (with the serving-size stepper),
`StepList`, `NutritionPanel`, `RatingStars`, `NotesField`, `FavoriteHeartButton` for the detail
page; `CookModeView` + `StepTimer` for cook mode; `RecipeForm` + `DeleteConfirmDialog` for
CRUD; and `WeeklyCalendarGrid` + `MealSlotCell` + `RecipeSidebarList` + `ShoppingListView` +
`ManualAddItemField` for planning/shopping. `Providers` wraps the app in a
`QueryClientProvider`.

### State (`store/`)

Three Zustand stores, each persisted to `localStorage` via the `persist` middleware:

- `useRecipeStore` — the recipe list itself (seeded from `lib/seed-data.ts`), plus CRUD,
  favorite-toggling, star ratings, and free-text notes, all keyed by recipe id.
- `useMealPlanStore` — the weekly plan, stored as a flat map of `"<day>::<slot>" -> recipeId[]`.
- `useShoppingListStore` — the shopping list items (auto-derived + manually added), each with a
  persisted `checked` boolean, plus the `regenerateFromMealPlan` action described below.

### Shared logic (`lib/`)

- `lib/types.ts` — every shared type (`Recipe`, `Ingredient`, `NutritionFacts`, `WeeklyPlan`,
  `ShoppingListItem`, category enums, etc.), used consistently by the stores and components.
- `lib/seed-data.ts` — 12 realistic mock recipes (photos from picsum.photos) with full
  ingredient/step/nutrition data.
- `lib/utils.ts` — serving-scale math, the ingredient-merge/aggregation algorithm, id
  generation, and small formatting helpers.
- `lib/queries.ts` — a TanStack Query hook (`useRecipesQuery`) that wraps the recipes currently
  in the Zustand store in a simulated async fetch, demonstrating the query-hook data-fetch
  pattern even though the data is local.

## Shopping-list ingredient-merge algorithm

The shopping list is derived from whatever recipes are currently planned in `useMealPlanStore`,
and regenerated automatically (see `app/shopping-list/page.tsx`) whenever the plan or recipe
list changes:

1. **Collect.** For every `day + mealSlot` cell in the weekly plan, look up each planned
   recipe's ingredient list (`lib/utils.ts#scaleIngredients`, called with `originalServings ===
   servings` so the recipe's ingredients are used exactly as written for its own default batch
   size). Every ingredient from every planned recipe is flattened into one array.
2. **Merge.** `lib/utils.ts#mergeIngredients` groups that flat array by a case-insensitive
   `name + unit` key (e.g. `"garlic::clove"`). When two planned recipes both call for "Garlic"
   in "cloves", their quantities are summed into a single merged entry; ingredients that share a
   name but use different units (e.g. "cup" vs. "tbsp") are intentionally kept as separate line
   items, since converting between arbitrary units isn't reliable without a unit-conversion
   table.
3. **Reconcile with existing state.** `useShoppingListStore.regenerateFromMealPlan` replaces the
   auto-derived items with the freshly merged set, but looks up each new item's
   `name + unit` key against the *previous* auto-derived items first. If a match is found, the
   new item reuses that item's `id` and — critically — its `checked` state, so items a user has
   already ticked off don't reset just because the plan was tweaked. Manually-added items
   (`isManual: true`, added from `ManualAddItemField`) are left untouched by regeneration and
   are simply concatenated back onto the list.
4. **Group for display.** `lib/utils.ts#groupByCategory` buckets the final item list by
   `IngredientCategory` (`produce`, `dairy`, `meat`, `pantry`, `spices`, `other`) so
   `ShoppingListView` can render one section per aisle.

## Serving-size scaling

`IngredientList` keeps a local `servings` value (seeded from the recipe's default `servings`).
Every render, `lib/utils.ts#scaleIngredients` multiplies each ingredient's quantity by
`newServings / originalServings` (rounded to 2 decimal places to avoid floating-point noise).
`NutritionPanel` receives the same `servings` value and uses `scaleNutrition` to show both the
constant per-serving figures and a scaled total for the currently selected serving count.

## Cook Mode & Wake Lock

`CookModeView` renders as a `fixed inset-0` overlay so it behaves as a true full-screen
experience on both mobile and desktop. On mount it feature-detects `navigator.wakeLock` and, if
present, requests a `"screen"` wake lock inside a `try/catch` (Wake Lock is entirely optional —
the UI works identically without it). The lock is released on unmount, and a
`visibilitychange` listener re-acquires it if the tab regains visibility after being backgrounded
(the browser auto-releases wake locks when a tab is hidden). Each step also has its own
`StepTimer` with start/pause/reset controls that resets automatically when the active step
changes.

## How to run locally

This project was generated with source files only — no dependencies have been installed and no
build has been run. To run it yourself:

```bash
cd "recipe-book-nextjs"
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Other available scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # run Next.js/ESLint checks
```

All app data (recipes, meal plan, shopping list) is persisted to the browser's `localStorage`,
so changes survive page reloads but are local to that browser.
