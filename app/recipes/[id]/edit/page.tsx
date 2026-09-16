"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRecipeStore } from "@/store/useRecipeStore";
import RecipeForm from "@/components/RecipeForm";

export default function EditRecipePage() {
  const params = useParams<{ id: string }>();
  const recipe = useRecipeStore((s) => s.recipes.find((r) => r.id === params.id));

  if (!recipe) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium text-gray-700">Recipe not found</p>
        <Link href="/" className="mt-3 inline-block text-brand-600 hover:underline">
          Back to all recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Recipe</h1>
        <p className="text-sm text-gray-500">Update the details for &ldquo;{recipe.title}&rdquo;.</p>
      </div>
      <RecipeForm
        mode="edit"
        recipeId={recipe.id}
        initialValues={{
          title: recipe.title,
          photoUrl: recipe.photoUrl,
          category: recipe.category,
          description: recipe.description,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          tags: recipe.tags,
          prepTimeMinutes: recipe.prepTimeMinutes,
          cookTimeMinutes: recipe.cookTimeMinutes,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          nutritionPerServing: recipe.nutritionPerServing,
        }}
      />
    </div>
  );
}
