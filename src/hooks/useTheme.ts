"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

let currentTheme: Theme = "dark";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "dark";
}

function applyTheme(t: Theme) {
  currentTheme = t;
  if (typeof document !== "undefined") {
    document.body.className = t;
  }
  listeners.forEach((l) => l());
}

// Initialize from localStorage on load
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("gtm-theme") as Theme | null;
  if (stored) {
    currentTheme = stored;
    // Apply on next tick after body exists
    queueMicrotask(() => {
      document.body.className = currentTheme;
    });
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem("gtm-theme", t);
    applyTheme(t);
  }, []);

  return { theme, setTheme };
}
