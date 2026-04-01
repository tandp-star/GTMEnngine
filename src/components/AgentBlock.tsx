"use client";

import { AgentState } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  state: AgentState;
  children?: React.ReactNode;
}

export default function AgentBlock({ title, subtitle, icon, iconBg, iconColor, state, children }: Props) {
  if (state.status === "idle") return null;

  return (
    <div className={cn("agent-block", state.status === "running" && "running", state.status === "done" && "complete")}>
      <div className="agent-header">
        <div className="agent-icon" style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
        <div>
          <div className="agent-title">{title}</div>
          <div className="agent-sub">{subtitle}</div>
        </div>
        <div className={cn("agent-status", state.status === "running" ? "status-running" : "status-done")}>
          {state.status === "running" ? "RUNNING" : "DONE"}
        </div>
      </div>
      <div className="agent-body">
        <div style={{ marginBottom: 10 }}>
          {state.logs.map((log, i) => (
            <div
              key={i}
              className={cn(
                "log-line",
                state.status === "done" ? "done-line" : i === state.logs.length - 1 ? "active" : "done-line"
              )}
            >
              &gt; {log}
            </div>
          ))}
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: `${state.progress}%` }} />
        </div>
        {children}
      </div>
    </div>
  );
}
