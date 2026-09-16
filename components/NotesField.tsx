"use client";

import { useEffect, useState } from "react";

export default function NotesField({
  initialValue,
  onSave,
}: {
  initialValue: string;
  onSave: (notes: string) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
        {!saved && <span className="text-xs text-gray-400">Unsaved</span>}
      </div>
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        onBlur={() => {
          onSave(value);
          setSaved(true);
        }}
        rows={4}
        placeholder="Add personal notes, substitutions, or tips..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}
