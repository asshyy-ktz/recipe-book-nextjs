export default function StepList({ steps }: { steps: string[] }) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Instructions</h2>
      <ol className="space-y-4">
        {steps.map((step, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
              {idx + 1}
            </span>
            <p className="pt-0.5 text-gray-700">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
