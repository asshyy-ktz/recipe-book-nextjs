"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRecipeStore } from "@/store/useRecipeStore";
import DifficultyBadge from "@/components/DifficultyBadge";
import FavoriteHeartButton from "@/components/FavoriteHeartButton";
import IngredientList from "@/components/IngredientList";
import StepList from "@/components/StepList";
import NutritionPanel from "@/components/NutritionPanel";
import RatingStars from "@/components/RatingStars";
import NotesField from "@/components/NotesField";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { formatTime } from "@/lib/utils";

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const recipe = useRecipeStore((s) => s.recipes.find((r) => r.id === params.id));
  const deleteRecipe = useRecipeStore((s) => s.deleteRecipe);
  const setRating = useRecipeStore((s) => s.setRating);
  const setNotes = useRecipeStore((s) => s.setNotes);

  const [servings, setServings] = useState(recipe?.servings ?? 1);
  const [deleteOpen, setDeleteOpen] = useState(false);

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

  function handleDelete() {
    if (!recipe) return;
    deleteRecipe(recipe.id);
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100">
            <Image src={recipe.photoUrl} alt={recipe.title} fill className="object-cover" priority />
            <div className="absolute right-3 top-3">
              <FavoriteHeartButton recipeId={recipe.id} isFavorite={recipe.isFavorite} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
              <p className="mt-1 text-sm text-gray-500">{recipe.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <DifficultyBadge difficulty={recipe.difficulty} />
            <span>Prep {formatTime(recipe.prepTimeMinutes)}</span>
            <span>Cook {formatTime(recipe.cookTimeMinutes)}</span>
            <span>{recipe.category}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href={`/recipes/${recipe.id}/cook`}
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Enter Cook Mode ▶
            </Link>
          </div>

          <div className="mt-8">
            <IngredientList
              ingredients={recipe.ingredients}
              originalServings={recipe.servings}
              servings={servings}
              onServingsChange={setServings}
            />
          </div>

          <div className="mt-8">
            <StepList steps={recipe.steps} />
          </div>

          <div className="mt-8 space-y-4 rounded-xl border border-gray-200 bg-white p-4">
            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-900">Your Rating</h2>
              <RatingStars rating={recipe.rating} onChange={(r) => setRating(recipe.id, r)} />
            </div>
            <NotesField initialValue={recipe.notes} onSave={(notes) => setNotes(recipe.id, notes)} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <NutritionPanel
            nutritionPerServing={recipe.nutritionPerServing}
            originalServings={recipe.servings}
            servings={servings}
          />
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteOpen}
        title={recipe.title}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
