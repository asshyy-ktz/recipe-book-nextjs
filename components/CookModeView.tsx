"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/lib/types";
import StepTimer from "./StepTimer";

type WakeLockSentinelLike = {
  release: () => Promise<void>;
  addEventListener?: (type: string, listener: () => void) => void;
};

export default function CookModeView({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);
  const [wakeLockActive, setWakeLockActive] = useState(false);

  const totalSteps = recipe.steps.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  useEffect(() => {
    let cancelled = false;

    async function requestWakeLock() {
      try {
        const nav = navigator as Navigator & {
          wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
        };
        if (typeof window !== "undefined" && nav.wakeLock) {
          const sentinel = await nav.wakeLock.request("screen");
          if (cancelled) {
            await sentinel.release();
            return;
          }
          wakeLockRef.current = sentinel;
          setWakeLockActive(true);
          sentinel.addEventListener?.("release", () => setWakeLockActive(false));
        }
      } catch {
        // Wake Lock not supported or permission denied — fail silently,
        // cook mode still works without keeping the screen awake.
        setWakeLockActive(false);
      }
    }

    requestWakeLock();

    return () => {
      cancelled = true;
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => undefined);
        wakeLockRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible" && !wakeLockRef.current) {
        const nav = navigator as Navigator & {
          wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
        };
        nav.wakeLock
          ?.request("screen")
          .then((sentinel) => {
            wakeLockRef.current = sentinel;
            setWakeLockActive(true);
          })
          .catch(() => undefined);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  function exitCookMode() {
    router.push(`/recipes/${recipe.id}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between border-b border-gray-800 px-4 py-3 sm:px-6">
        <div>
          <h1 className="text-base font-semibold sm:text-lg">{recipe.title}</h1>
          <p className="text-xs text-gray-400">
            Step {stepIndex + 1} of {totalSteps}
            {wakeLockActive ? " · Screen will stay awake" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={exitCookMode}
          aria-label="Exit cook mode"
          className="rounded-full bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700"
        >
          Exit ✕
        </button>
      </header>

      <div className="h-1 w-full bg-gray-800">
        <div
          className="h-1 bg-brand-500 transition-all"
          style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-4 py-8 sm:px-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold">
          {stepIndex + 1}
        </div>
        <p className="max-w-2xl text-center text-xl leading-relaxed sm:text-2xl">
          {recipe.steps[stepIndex]}
        </p>
        <StepTimer stepKey={stepIndex} />
      </main>

      <footer className="flex items-center justify-between gap-3 border-t border-gray-800 px-4 py-4 sm:px-6">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          className="flex-1 rounded-lg bg-gray-800 py-3 text-sm font-medium disabled:opacity-40 sm:flex-none sm:px-6"
        >
          ← Previous
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={exitCookMode}
            className="flex-1 rounded-lg bg-green-600 py-3 text-sm font-medium hover:bg-green-700 sm:flex-none sm:px-6"
          >
            Finish 🎉
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.min(totalSteps - 1, i + 1))}
            className="flex-1 rounded-lg bg-brand-600 py-3 text-sm font-medium hover:bg-brand-700 sm:flex-none sm:px-6"
          >
            Next →
          </button>
        )}
      </footer>
    </div>
  );
}
