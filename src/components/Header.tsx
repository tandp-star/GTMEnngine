"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

interface Props {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  currentView: "inbound" | "outbound";
}

export default function Header({ theme, setTheme, currentView }: Props) {
  const tagline =
    currentView === "inbound" ? "/ Sales Orchestration" : "/ AI Outreach Pipeline";
  return (
    <header>
      <div className="header-inner">
        <div className="logo">
          <span>GTM Engine</span>
          <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 300, marginLeft: 8 }}>
            {tagline}
          </span>
        </div>
        <div className="header-right">
          <div className="view-switch">
            <Link
              href="/inbound"
              className={`view-btn${currentView === "inbound" ? " active" : ""}`}
            >
              Inbound
            </Link>
            <Link
              href="/outbound"
              className={`view-btn${currentView === "outbound" ? " active" : ""}`}
            >
              Outbound
            </Link>
          </div>
          <div className="badge">DEMO · LIVE</div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  );
}
