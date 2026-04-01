"use client";

import { cn } from "@/lib/utils";

interface Props {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
}

export default function ThemeToggle({ theme, setTheme }: Props) {
  return (
    <div className="theme-toggle">
      <button
        className={cn("theme-btn", theme === "dark" && "active")}
        onClick={() => setTheme("dark")}
      >
        🌙 Dark
      </button>
      <button
        className={cn("theme-btn", theme === "light" && "active")}
        onClick={() => setTheme("light")}
      >
        ☀️ Light
      </button>
    </div>
  );
}
