"use client";

import { useEffect, useRef, useState } from "react";
import { formatSeconds } from "@/lib/utils";

/** A simple count-up/count-down timer with start/pause/reset controls. */
export default function StepTimer({ stepKey }: { stepKey: string | number }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset the timer whenever the active step changes.
  useEffect(() => {
    setSeconds(0);
    setRunning(false);
  }, [stepKey]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-800 px-4 py-3 text-white">
      <span className="min-w-[4.5rem] font-mono text-2xl tabular-nums">
        {formatSeconds(seconds)}
      </span>
      <button
        type="button"
        onClick={() => setRunning((r) => !r)}
        className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium hover:bg-brand-700"
      >
        {running ? "Pause" : "Start"}
      </button>
      <button
        type="button"
        onClick={() => {
          setRunning(false);
          setSeconds(0);
        }}
        className="rounded-md bg-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-600"
      >
        Reset
      </button>
    </div>
  );
}
