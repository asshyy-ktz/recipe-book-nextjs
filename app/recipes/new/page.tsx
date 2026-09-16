import RecipeForm from "@/components/RecipeForm";

export default function NewRecipePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create a New Recipe</h1>
        <p className="text-sm text-gray-500">Fill in the details below to add it to your recipe book.</p>
      </div>
      <RecipeForm mode="create" />
    </div>
  );
}
