"use client";

import type { IngredientCategory, ShoppingListItem } from "@/lib/types";
import { groupByCategory, formatQuantity } from "@/lib/utils";
import { useShoppingListStore } from "@/store/useShoppingListStore";

const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  produce: "Produce",
  dairy: "Dairy",
  meat: "Meat & Seafood",
  pantry: "Pantry",
  spices: "Spices & Condiments",
  other: "Other",
};

export default function ShoppingListView({ items }: { items: ShoppingListItem[] }) {
  const toggleChecked = useShoppingListStore((s) => s.toggleChecked);
  const removeItem = useShoppingListStore((s) => s.removeItem);

  const grouped = groupByCategory(items);
  const categoriesWithItems = (Object.keys(grouped) as IngredientCategory[]).filter(
    (cat) => grouped[cat].length > 0
  );

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
        <p className="font-medium">Your shopping list is empty</p>
        <p className="text-sm">Plan some meals or add an item manually to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categoriesWithItems.map((category) => (
        <div key={category}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            {CATEGORY_LABELS[category]}
          </h3>
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {grouped[category].map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleChecked(item.id)}
                  className="h-4 w-4 shrink-0 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span
                  className={`flex-1 text-sm ${
                    item.checked ? "text-gray-400 line-through" : "text-gray-800"
                  }`}
                >
                  {item.name}
                </span>
                <span className="text-sm text-gray-500">
                  {formatQuantity(item.quantity)} {item.unit}
                </span>
                {item.isManual && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="text-gray-400 hover:text-red-600"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
