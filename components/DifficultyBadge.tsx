import type { Difficulty } from "@/lib/types";

const STYLES: Record<Difficulty, string> = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-amber-100 text-amber-800",
  Hard: "bg-red-100 text-red-800",
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
