"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Difficulty,
  Ingredient,
  IngredientCategory,
  Recipe,
  RecipeCategory,
} from "@/lib/types";
import { INGREDIENT_CATEGORIES, RECIPE_CATEGORIES } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { useRecipeStore } from "@/store/useRecipeStore";

type FormIngredient = Ingredient;

export interface RecipeFormValues {
  title: string;
  photoUrl: string;
  category: RecipeCategory;
  description: string;
  ingredients: FormIngredient[];
  steps: string[];
  tags: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  nutritionPerServing: Recipe["nutritionPerServing"];
}

const emptyIngredient = (): FormIngredient => ({
  id: generateId("ing"),
  name: "",
  quantity: 1,
  unit: "",
  category: "other",
});

function defaultValues(): RecipeFormValues {
  return {
    title: "",
    photoUrl: "https://picsum.photos/seed/new-recipe/800/600",
    category: "Dinner",
    description: "",
    ingredients: [emptyIngredient()],
    steps: [""],
    tags: [],
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 4,
    difficulty: "Easy",
    nutritionPerServing: {
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
      fiberG: 0,
      sugarG: 0,
      sodiumMg: 0,
    },
  };
}

export default function RecipeForm({
  mode,
  recipeId,
  initialValues,
}: {
  mode: "create" | "edit";
  recipeId?: string;
  initialValues?: RecipeFormValues;
}) {
  const router = useRouter();
  const addRecipe = useRecipeStore((s) => s.addRecipe);
  const updateRecipe = useRecipeStore((s) => s.updateRecipe);

  const [values, setValues] = useState<RecipeFormValues>(initialValues ?? defaultValues());
  const [tagInput, setTagInput] = useState("");

  function update<K extends keyof RecipeFormValues>(key: K, val: RecipeFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function updateIngredient(id: string, patch: Partial<FormIngredient>) {
    setValues((v) => ({
      ...v,
      ingredients: v.ingredients.map((ing) => (ing.id === id ? { ...ing, ...patch } : ing)),
    }));
  }

  function addIngredientRow() {
    setValues((v) => ({ ...v, ingredients: [...v.ingredients, emptyIngredient()] }));
  }

  function removeIngredientRow(id: string) {
    setValues((v) => ({ ...v, ingredients: v.ingredients.filter((ing) => ing.id !== id) }));
  }

  function updateStep(index: number, text: string) {
    setValues((v) => ({
      ...v,
      steps: v.steps.map((s, i) => (i === index ? text : s)),
    }));
  }

  function addStep() {
    setValues((v) => ({ ...v, steps: [...v.steps, ""] }));
  }

  function removeStep(index: number) {
    setValues((v) => ({ ...v, steps: v.steps.filter((_, i) => i !== index) }));
  }

  function moveStep(index: number, direction: -1 | 1) {
    setValues((v) => {
      const target = index + direction;
      if (target < 0 || target >= v.steps.length) return v;
      const steps = [...v.steps];
      [steps[index], steps[target]] = [steps[target], steps[index]];
      return { ...v, steps };
    });
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !values.tags.includes(tag)) {
      update("tags", [...values.tags, tag]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    update(
      "tags",
      values.tags.filter((t) => t !== tag)
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanedIngredients = values.ingredients.filter((ing) => ing.name.trim() !== "");
    const cleanedSteps = values.steps.filter((s) => s.trim() !== "");

    const payload = {
      ...values,
      ingredients: cleanedIngredients,
      steps: cleanedSteps,
    };

    if (mode === "create") {
      const id = addRecipe(payload);
      router.push(`/recipes/${id}`);
    } else if (recipeId) {
      updateRecipe(recipeId, payload);
      router.push(`/recipes/${recipeId}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
          <input
            required
            type="text"
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Photo URL</label>
          <input
            required
            type="url"
            value={values.photoUrl}
            onChange={(e) => update("photoUrl", e.target.value)}
            placeholder="https://picsum.photos/seed/my-recipe/800/600"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select
            value={values.category}
            onChange={(e) => update("category", e.target.value as RecipeCategory)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {RECIPE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            value={values.difficulty}
            onChange={(e) => update("difficulty", e.target.value as Difficulty)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Prep time (min)</label>
          <input
            type="number"
            min={0}
            value={values.prepTimeMinutes}
            onChange={(e) => update("prepTimeMinutes", Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Cook time (min)</label>
          <input
            type="number"
            min={0}
            value={values.cookTimeMinutes}
            onChange={(e) => update("cookTimeMinutes", Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Servings</label>
          <input
            type="number"
            min={1}
            value={values.servings}
            onChange={(e) => update("servings", Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-medium text-gray-700">Tags</h2>
        <div className="mb-2 flex flex-wrap gap-2">
          {values.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-gray-700">
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag and press Enter"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Add
          </button>
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700">Ingredients</h2>
          <button
            type="button"
            onClick={addIngredientRow}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            + Add ingredient
          </button>
        </div>
        <div className="space-y-2">
          {values.ingredients.map((ing) => (
            <div key={ing.id} className="grid grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Name"
                value={ing.name}
                onChange={(e) => updateIngredient(ing.id, { name: e.target.value })}
                className="col-span-5 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <input
                type="number"
                step="any"
                placeholder="Qty"
                value={ing.quantity}
                onChange={(e) => updateIngredient(ing.id, { quantity: Number(e.target.value) })}
                className="col-span-2 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <input
                type="text"
                placeholder="Unit"
                value={ing.unit}
                onChange={(e) => updateIngredient(ing.id, { unit: e.target.value })}
                className="col-span-2 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <select
                value={ing.category}
                onChange={(e) =>
                  updateIngredient(ing.id, { category: e.target.value as IngredientCategory })
                }
                className="col-span-2 rounded-lg border border-gray-300 px-1 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {INGREDIENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeIngredientRow(ing.id)}
                className="col-span-1 rounded-lg text-gray-400 hover:text-red-600"
                aria-label="Remove ingredient"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700">Steps</h2>
          <button
            type="button"
            onClick={addStep}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            + Add step
          </button>
        </div>
        <div className="space-y-2">
          {values.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold">
                {idx + 1}
              </span>
              <textarea
                value={step}
                onChange={(e) => updateStep(idx, e.target.value)}
                rows={2}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveStep(idx, -1)}
                  disabled={idx === 0}
                  className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  aria-label="Move step up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveStep(idx, 1)}
                  disabled={idx === values.steps.length - 1}
                  className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  aria-label="Move step down"
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeStep(idx)}
                className="mt-1 text-gray-400 hover:text-red-600"
                aria-label="Remove step"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-gray-700">Nutrition (per serving)</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["calories", "Calories"],
              ["proteinG", "Protein (g)"],
              ["carbsG", "Carbs (g)"],
              ["fatG", "Fat (g)"],
              ["fiberG", "Fiber (g)"],
              ["sugarG", "Sugar (g)"],
              ["sodiumMg", "Sodium (mg)"],
            ] as [keyof Recipe["nutritionPerServing"], string][]
          ).map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-xs text-gray-500">{label}</label>
              <input
                type="number"
                min={0}
                value={values.nutritionPerServing[key]}
                onChange={(e) =>
                  update("nutritionPerServing", {
                    ...values.nutritionPerServing,
                    [key]: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          {mode === "create" ? "Create Recipe" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
