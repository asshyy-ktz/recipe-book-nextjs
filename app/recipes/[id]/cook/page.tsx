"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRecipeStore } from "@/store/useRecipeStore";
import CookModeView from "@/components/CookModeView";

export default function CookModePage() {
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

  return <CookModeView recipe={recipe} />;
}
