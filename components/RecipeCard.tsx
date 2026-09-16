"use client";

import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/lib/types";
import DifficultyBadge from "./DifficultyBadge";
import FavoriteHeartButton from "./FavoriteHeartButton";
import { formatTime } from "@/lib/utils";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Image
          src={recipe.photoUrl}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2">
          <FavoriteHeartButton recipeId={recipe.id} isFavorite={recipe.isFavorite} size="sm" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3 className="line-clamp-2 font-semibold text-gray-900">{recipe.title}</h3>
        <p className="line-clamp-2 text-sm text-gray-500">{recipe.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500">
            {formatTime(recipe.prepTimeMinutes + recipe.cookTimeMinutes)}
          </span>
          <DifficultyBadge difficulty={recipe.difficulty} />
        </div>
      </div>
    </Link>
  );
}
