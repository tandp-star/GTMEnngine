"use client";

import { Company, Stats } from "@/types";
import SectorTag from "./SectorTag";
import AgentBlock from "./AgentBlock";
import ContactCard from "./ContactCard";
import OutreachPreview from "./OutreachPreview";
import { PipelineResult } from "@/hooks/useAgentPipeline";

interface Props {
  company: Company | null;
  pipeline: PipelineResult;
  onStats: (fn: (s: Stats) => Stats) => void;
}

export default function DetailView({ company, pipeline, onStats }: Props) {
  if (!company) {
    return (
      <div className="panel" style={{ padding: "64px 20px", textAlign: "center", color: "var(--muted)" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>←</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Select a company to run the agent pipeline</div>
      </div>
    );
  }

  const scoreColor =
    company.signals.score === "High"
      ? "var(--green)"
      : company.signals.score === "Med"
        ? "var(--accent2)"
        : "var(--muted)";

  const handleRun = () => {
    pipeline.run(company, onStats);
  };

  return (
    <div className="right">
      {/* Detail Card */}
      <div className="detail-card">
        <div className="detail-header">
          <div
            className="detail-logo"
            style={{ background: company.bg, color: company.color }}
          >
            {company.short}
          </div>
          <div style={{ flex: 1 }}>
            <div className="detail-name">{company.name}</div>
            <div className="detail-tags">
              <SectorTag sector={company.sector} />
              <span style={{ fontSize: 12, color: "var(--muted)", paddingLeft: 6 }}>
                {company.hq} · {company.employees} employees
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "var(--muted)",
                marginBottom: 4,
              }}
            >
              Signal Score
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: scoreColor }}>
              {company.signals.score}
            </div>
          </div>
        </div>
        <div className="detail-body">
          <div className="signals-grid">
            <div className="signal-card">
              <div className="signal-title">Open Roles</div>
              <div className="signal-value">{company.signals.hiring}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>Active JDs found</div>
            </div>
            <div className="signal-card">
              <div className="signal-title">Key Trigger</div>
              <div className="signal-value" style={{ fontSize: 13 }}>{company.signals.trigger}</div>
            </div>
            <div className="signal-card" style={{ gridColumn: "span 2" }}>
              <div className="signal-title">Research Summary</div>
              <div style={{ fontSize: 13, lineHeight: 1.7, marginTop: 4 }}>
                {company.signals.newsSnippet}
              </div>
            </div>
          </div>
          <button
            className="run-btn"
            onClick={handleRun}
            disabled={pipeline.running}
          >
            {pipeline.running ? "Running pipeline…" : `▶ Run Agent Pipeline on ${company.name}`}
          </button>
        </div>
      </div>

      {/* Agent Blocks */}
      <AgentBlock
        title="Research Agent"
        subtitle="Finding hiring signals & triggers"
        icon="🔍"
        iconBg="rgba(124,106,245,0.15)"
        iconColor="var(--accent3)"
        state={pipeline.agents.research}
      >
        {pipeline.agents.research.status === "done" && (
          <div className="output-box">
            <h4>Top Open Roles Detected</h4>
            {company.signals.openRoles.map((r, i) => (
              <div key={i} style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                · {r}
              </div>
            ))}
          </div>
        )}
      </AgentBlock>

      <AgentBlock
        title="PIO Finder"
        subtitle="Identifying CHRO & coordinates"
        icon="👤"
        iconBg="rgba(245,166,35,0.12)"
        iconColor="var(--accent2)"
        state={pipeline.agents.pio}
      >
        {pipeline.agents.pio.status === "done" && <ContactCard company={company} />}
      </AgentBlock>

      <AgentBlock
        title="Personalization Agent"
        subtitle="Extracting context for outreach"
        icon="✨"
        iconBg="rgba(0,194,168,0.1)"
        iconColor="var(--accent)"
        state={pipeline.agents.personalization}
      />

      <AgentBlock
        title="Outreach Agent"
        subtitle={`Composing ${company.personalization.channel === "email" ? "Email" : "LinkedIn"} outreach`}
        icon="📤"
        iconBg="rgba(34,197,94,0.1)"
        iconColor="var(--green)"
        state={pipeline.agents.outreach}
      >
        {pipeline.agents.outreach.status === "done" && <OutreachPreview company={company} />}
      </AgentBlock>
    </div>
  );
}
