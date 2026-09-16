import type { NutritionFacts } from "@/lib/types";
import { scaleNutrition } from "@/lib/utils";

export default function NutritionPanel({
  nutritionPerServing,
  originalServings,
  servings,
}: {
  nutritionPerServing: NutritionFacts;
  originalServings: number;
  servings: number;
}) {
  // Per-serving values stay constant regardless of batch size; scaling
  // applies when we show the recipe *total* across all servings.
  const total = scaleNutrition(nutritionPerServing, 1, originalServings);
  const totalScaled = scaleNutrition(total, originalServings, servings);

  const rows: { label: string; perServing: number; unit: string }[] = [
    { label: "Calories", perServing: nutritionPerServing.calories, unit: "kcal" },
    { label: "Protein", perServing: nutritionPerServing.proteinG, unit: "g" },
    { label: "Carbs", perServing: nutritionPerServing.carbsG, unit: "g" },
    { label: "Fat", perServing: nutritionPerServing.fatG, unit: "g" },
    { label: "Fiber", perServing: nutritionPerServing.fiberG, unit: "g" },
    { label: "Sugar", perServing: nutritionPerServing.sugarG, unit: "g" },
    { label: "Sodium", perServing: nutritionPerServing.sodiumMg, unit: "mg" },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-lg font-semibold text-gray-900">Nutrition Facts</h2>
      <p className="mb-4 text-xs text-gray-500">
        Per serving (unchanged) &middot; total for {servings} serving{servings !== 1 ? "s" : ""}
      </p>
      <div className="divide-y divide-gray-100 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-1.5">
            <span className="text-gray-600">{row.label}</span>
            <span className="font-medium text-gray-900">
              {row.perServing} {row.unit}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-800">
        Total for {servings} servings: {totalScaled.calories} kcal, {totalScaled.proteinG}g protein
      </div>
    </div>
  );
}
