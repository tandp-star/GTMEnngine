"use client";

import ThemeToggle from "./ThemeToggle";

interface Props {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
}

export default function Header({ theme, setTheme }: Props) {
  return (
    <header>
      <div className="header-inner">
        <div className="logo">
          <span>GTM Engine</span>
          <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 300, marginLeft: 8 }}>
            / AI Outreach Pipeline
          </span>
        </div>
        <div className="header-right">
          <div className="badge">DEMO · LIVE</div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  );
}
