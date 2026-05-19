"use client";

import { useCallback, useMemo, useState } from "react";
import Header from "@/components/Header";
import { leads } from "@/data/leads";
import { useTheme } from "@/hooks/useTheme";
import {
  AgentKey,
  AgentRunState,
  AgentStatus,
  CadenceStep,
  EmailDraft,
  IntelBrief,
  Lead,
  LeadStage,
  TouchResult,
} from "@/types/inbound";
import {
  buildCadenceLogs,
  buildCallPrepLogs,
  buildEmailLogs,
  buildIntelLogs,
  buildTouchLogs,
  checkTouch,
  generateEmail,
  generateIntel,
} from "@/lib/inbound/mockAgents";
import { sleep } from "@/lib/utils";

const STAGE_FILTERS: ("All" | LeadStage)[] = [
  "All",
  "New",
  "Contacted",
  "Qualified",
  "Meeting Set",
  "Cold",
];

const initialAgent: AgentRunState = { status: "waiting", logs: [], doneLogs: [], progress: 0 };

const initialPipeline: Record<AgentKey, AgentRunState> = {
  touch: initialAgent,
  intel: initialAgent,
  email: initialAgent,
  cadence: initialAgent,
  call: initialAgent,
};

const initialCadence: CadenceStep[] = [
  { day: "D0", label: "Intro", status: "active" },
  { day: "D3", label: "LinkedIn", status: "pending" },
  { day: "D7", label: "Follow-up", status: "pending" },
  { day: "D10", label: "Value", status: "pending" },
  { day: "D14", label: "Close", status: "pending" },
];

function initials(n: string) {
  return n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function stageClass(s: LeadStage) {
  switch (s) {
    case "New":
      return "stage-new";
    case "Contacted":
      return "stage-contacted";
    case "Qualified":
      return "stage-qualified";
    case "Meeting Set":
      return "stage-meeting";
    default:
      return "stage-cold";
  }
}

function sectorTag(s: string) {
  if (s === "BFSI") return "tag-bfsi";
  if (s === "IT/ITeS") return "tag-it";
  if (["Staffing", "Retail", "Logistics", "Energy", "Real Estate"].includes(s)) return "tag-staff";
  return "tag-other";
}

function statusPillClass(status: AgentStatus) {
  if (status === "running") return "agent-status status-running";
  if (status === "done") return "agent-status status-done";
  return "agent-status status-waiting";
}

function statusLabel(status: AgentStatus) {
  if (status === "running") return "RUNNING";
  if (status === "done") return "DONE";
  return "WAITING";
}

function priorityColor(p: IntelBrief["priority"]) {
  if (p === "High") return "var(--green)";
  if (p === "Medium") return "var(--accent2)";
  return "var(--muted)";
}

export default function InboundPage() {
  const { theme, setTheme } = useTheme();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | LeadStage>("All");
  const [agentsRun, setAgentsRun] = useState(0);
  const [meetingsBookedExtra, setMeetingsBookedExtra] = useState(0);
  const [running, setRunning] = useState(false);
  const [pipeline, setPipeline] = useState<Record<AgentKey, AgentRunState>>(initialPipeline);
  const [intel, setIntel] = useState<IntelBrief | null>(null);
  const [email, setEmail] = useState<EmailDraft | null>(null);
  const [emailBody, setEmailBody] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [cadence, setCadence] = useState<CadenceStep[]>(initialCadence);
  const [callNotes, setCallNotes] = useState("");
  const [callMeetingBooked, setCallMeetingBooked] = useState(false);
  const [followUpQueued, setFollowUpQueued] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return leads.filter((l) => {
      const matchFilter = activeFilter === "All" || l.stage === activeFilter;
      const matchQ =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.role.toLowerCase().includes(q);
      return matchFilter && matchQ;
    });
  }, [query, activeFilter]);

  const selected = selectedId ? leads.find((l) => l.id === selectedId) ?? null : null;
  const touch: TouchResult | null = selected ? checkTouch(selected.company) : null;

  const resetForLead = useCallback(() => {
    setPipeline(initialPipeline);
    setIntel(null);
    setEmail(null);
    setEmailBody("");
    setEmailSent(false);
    setEmailSaved(false);
    setCadence(initialCadence);
    setCallNotes("");
    setCallMeetingBooked(false);
    setFollowUpQueued(false);
  }, []);

  const handleSelect = useCallback(
    (id: number) => {
      if (running) return;
      setSelectedId(id);
      resetForLead();
    },
    [running, resetForLead]
  );

  const updateAgent = useCallback((key: AgentKey, patch: Partial<AgentRunState>) => {
    setPipeline((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }, []);

  const runLogs = useCallback(
    async (key: AgentKey, logs: string[], stepMs: (i: number) => number) => {
      updateAgent(key, { status: "running", logs: [], doneLogs: [], progress: 0 });
      const accumulated: string[] = [];
      for (let i = 0; i < logs.length; i++) {
        await sleep(stepMs(i));
        accumulated.push(logs[i]);
        updateAgent(key, {
          logs: [...accumulated],
          progress: ((i + 1) / logs.length) * 100,
        });
      }
      updateAgent(key, { status: "done", logs: [], doneLogs: accumulated, progress: 100 });
    },
    [updateAgent]
  );

  const runAllAgents = useCallback(async () => {
    if (!selected || !touch || running) return;
    setRunning(true);
    resetForLead();

    const touchLogs = buildTouchLogs(selected, touch);
    const intelLogs = buildIntelLogs(selected);
    const emailLogs = buildEmailLogs(touch);
    const cadenceLogs = buildCadenceLogs();

    await Promise.all([
      runLogs("touch", touchLogs, (i) => 350 + i * 120),
      (async () => {
        await runLogs("intel", intelLogs, (i) => 280 + i * 200);
        setIntel(generateIntel(selected, touch));
      })(),
      (async () => {
        await runLogs("email", emailLogs, (i) => 300 + i * 180);
        const drafted = generateEmail(selected, touch);
        setEmail(drafted);
        setEmailBody(drafted.body);
      })(),
      runLogs("cadence", cadenceLogs, (i) => 260 + i * 150),
    ]);

    // Call prep depends on intel — runs after the parallel batch
    await runLogs("call", buildCallPrepLogs(selected, touch), (i) => 320 + i * 180);

    setAgentsRun((n) => n + 1);
    setRunning(false);
  }, [selected, touch, running, runLogs, resetForLead]);

  const markCadenceSent = (idx: number) => {
    setCadence((prev) => prev.map((step, i) => (i === idx ? { ...step, status: "sent" } : step)));
  };

  const bookMeeting = () => {
    if (!selected) return;
    if (!callMeetingBooked) {
      setCallMeetingBooked(true);
      setMeetingsBookedExtra((n) => n + 1);
    }
    const title = encodeURIComponent(`Intro call — ${selected.company}`);
    const details = encodeURIComponent(
      `Call with ${selected.name} (${selected.role}) at ${selected.company}.${
        intel ? `\n\nAngle: ${intel.angle}\nWatch: ${intel.risk}` : ""
      }${callNotes ? `\n\nNotes:\n${callNotes}` : ""}`
    );
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&add=${encodeURIComponent(
      selected.email
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const sendViaGmail = () => {
    if (!selected || !email) return;
    setEmailSent(true);
    const subject = encodeURIComponent(email.subject);
    const body = encodeURIComponent(emailBody);
    window.open(`mailto:${selected.email}?subject=${subject}&body=${body}`, "_blank");
  };

  const totalInbound = leads.length;
  const newLeads = useMemo(() => leads.filter((l) => l.stage === "New").length, []);
  const returnLeads = useMemo(
    () => leads.filter((l) => checkTouch(l.company).found).length,
    []
  );
  const baselineMeetingsBooked = useMemo(
    () => leads.filter((l) => l.stage === "Meeting Set").length,
    []
  );
  const meetingsBooked = baselineMeetingsBooked + meetingsBookedExtra;
  const hasRun = pipeline.touch.status !== "waiting";

  return (
    <>
      <Header theme={theme} setTheme={setTheme} currentView="inbound" />
      <div className="container inbound-container">
        <div className="page-body">
          <div className="stat-row">
            <Stat num={totalInbound} label="Total Inbound" />
            <Stat num={newLeads} label="New Leads" />
            <Stat num={returnLeads} label="Return Leads" />
            <Stat num={meetingsBooked} label="Meetings Booked" />
            <Stat num={agentsRun} label="Agents Run" />
          </div>

          <div className="inbound-main">
            <div className="crm-panel">
              <div className="crm-topbar">
                <div className="crm-title">
                  <span className="hs-logo">HUBSPOT</span> Contacts · Inbound
                </div>
                <div className="crm-actions">
                  <button className="crm-btn">Filter</button>
                  <button className="crm-btn">Export</button>
                  <button className="crm-btn primary">+ Add Lead</button>
                </div>
              </div>

              <div className="crm-search">
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none" style={{ color: "var(--muted)", flexShrink: 0 }}>
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M15 15l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  placeholder="Search contacts…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="filter-chips">
                {STAGE_FILTERS.map((f) => (
                  <span
                    key={f}
                    className={`chip${activeFilter === f ? " active" : ""}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="crm-table-head">
                <div className="crm-th"></div>
                <div className="crm-th">Contact</div>
                <div className="crm-th">Stage</div>
                <div className="crm-th">Source</div>
                <div className="crm-th">Date</div>
              </div>

              <div className="crm-rows">
                {filtered.length === 0 ? (
                  <div style={{ padding: 24, textAlign: "center", color: "var(--muted)", fontSize: 12 }}>
                    No contacts match
                  </div>
                ) : (
                  filtered.map((l) => (
                    <div
                      key={l.id}
                      className={`crm-row${selectedId === l.id ? " selected" : ""}`}
                      onClick={() => handleSelect(l.id)}
                    >
                      <div className="crm-check"></div>
                      <div className="contact-info">
                        <div className="contact-av" style={{ background: l.bg, color: l.color }}>
                          {initials(l.name)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div className="contact-nm">{l.name}</div>
                          <div className="contact-co">
                            {l.company} · {l.role}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className={`stage-pill ${stageClass(l.stage)}`}>{l.stage}</span>
                      </div>
                      <div className="source-tag">{l.source}</div>
                      <div className="crm-date">{l.date}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="right">
              {!selected || !touch ? (
                <div className="empty-state">
                  <div style={{ fontSize: 28, marginBottom: 10 }}>←</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Select a contact from the CRM</div>
                  <div style={{ fontSize: 11, marginTop: 5 }}>
                    Five agents will fire — Touch History, Company Intel, Email Draft, Cadence, then Call Prep
                  </div>
                </div>
              ) : (
                <>
                  <LeadHeader
                    lead={selected}
                    touch={touch}
                    onRun={runAllAgents}
                    running={running}
                    hasRun={hasRun}
                  />

                  {hasRun && (
                    <div className="agents-grid">
                      <AgentBlock
                        id="touch"
                        title="Touch History"
                        sub="Granola + Gmail scan"
                        icon="🔎"
                        iconBg="rgba(124,106,245,0.15)"
                        iconColor="var(--accent3)"
                        state={pipeline.touch}
                      >
                        {pipeline.touch.status === "done" &&
                          (touch.found ? (
                            <div className="output-box">
                              <h4>Prior Touch</h4>
                              <div className="info-row">
                                <span className="info-key">Last</span>
                                <span className="info-val">{touch.date}</span>
                              </div>
                              <div className="info-row">
                                <span className="info-key">Contact</span>
                                <span className="info-val">{touch.contact}</span>
                              </div>
                              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>
                                {touch.notes}
                              </div>
                            </div>
                          ) : (
                            <div className="output-box">
                              <div style={{ color: "var(--accent2)", fontWeight: 600, fontSize: 12 }}>
                                ★ New lead — no prior touch
                              </div>
                            </div>
                          ))}
                      </AgentBlock>

                      <AgentBlock
                        id="intel"
                        title="Company Intel"
                        sub="Templated QA brief"
                        icon="🧠"
                        iconBg="rgba(0,194,168,0.1)"
                        iconColor="var(--accent2)"
                        state={pipeline.intel}
                      >
                        {pipeline.intel.status === "running" && (
                          <div className="output-box">
                            <div className="ai-badge">✦ Generating</div>
                            <div className="ai-loading">
                              <div className="ai-dot"></div>
                              <div className="ai-dot"></div>
                              <div className="ai-dot"></div>
                              <span style={{ marginLeft: 5 }}>Generating brief…</span>
                            </div>
                          </div>
                        )}
                        {pipeline.intel.status === "done" && intel && (
                          <div className="output-box">
                            <div className="ai-badge">★ AI BRIEF</div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  padding: "2px 8px",
                                  borderRadius: 8,
                                  background: `${priorityColor(intel.priority)}22`,
                                  color: priorityColor(intel.priority),
                                  border: `1px solid ${priorityColor(intel.priority)}44`,
                                }}
                              >
                                Priority: {intel.priority}
                              </span>
                            </div>
                            <QaItem q="What" a={intel.what} />
                            <QaItem q="Scale" a={intel.size} />
                            <QaItem q="Pain" a={intel.pain} />
                            <QaItem q="Angle" a={intel.angle} aStyle={{ color: "var(--accent)", fontWeight: 600 }} />
                            <QaItem q="Risk" a={intel.risk} aStyle={{ color: "var(--red)" }} />
                          </div>
                        )}
                      </AgentBlock>

                      <AgentBlock
                        id="email"
                        title="Email Draft"
                        sub="Templatized outreach"
                        icon="✉"
                        iconBg="rgba(255,107,53,0.1)"
                        iconColor="var(--accent)"
                        state={pipeline.email}
                      >
                        {pipeline.email.status === "running" && (
                          <div className="output-box">
                            <div className="ai-badge">✦ Drafting</div>
                            <div className="ai-loading">
                              <div className="ai-dot"></div>
                              <div className="ai-dot"></div>
                              <div className="ai-dot"></div>
                              <span style={{ marginLeft: 5 }}>Drafting email…</span>
                            </div>
                          </div>
                        )}
                        {pipeline.email.status === "done" && email && (
                          <div className="output-box">
                            <div className="ai-badge">★ AI BRIEF</div>
                            <div className="email-preview">
                              <div className="email-header-bar">
                                <div className="email-field">
                                  <span className="email-label">To:</span>
                                  <span>{selected.email}</span>
                                </div>
                                <div className="email-field">
                                  <span className="email-label">Sub:</span>
                                  <span style={{ color: "var(--accent)", fontWeight: 600 }}>{email.subject}</span>
                                </div>
                              </div>
                              <textarea
                                className="editable-body"
                                rows={8}
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                              />
                            </div>
                            <div className="action-row">
                              <button
                                className="act-btn green"
                                disabled={emailSent}
                                onClick={sendViaGmail}
                              >
                                {emailSent ? "✓ Sent" : "Send via Gmail"}
                              </button>
                              <button
                                className="act-btn teal"
                                disabled={emailSaved}
                                onClick={() => setEmailSaved(true)}
                              >
                                {emailSaved ? "✓ Saved" : "Save to Drive"}
                              </button>
                            </div>
                          </div>
                        )}
                      </AgentBlock>

                      <AgentBlock
                        id="cadence"
                        title="14-Day Cadence"
                        sub="Follow-up sequence"
                        icon="📅"
                        iconBg="rgba(34,197,94,0.1)"
                        iconColor="var(--green)"
                        state={pipeline.cadence}
                      >
                        {pipeline.cadence.status === "done" && (
                          <div className="output-box">
                            <h4>Sequence</h4>
                            <div className="cadence-row">
                              {cadence.map((step) => (
                                <div
                                  key={step.day}
                                  className={`cadence-step ${
                                    step.status === "active"
                                      ? "active-day"
                                      : step.status === "sent"
                                        ? "sent"
                                        : "pending"
                                  }`}
                                >
                                  <div className="cadence-day">{step.day}</div>
                                  <div className="cadence-lbl">{step.label}</div>
                                </div>
                              ))}
                            </div>
                            <div className="action-row" style={{ marginTop: 8 }}>
                              <button
                                className="act-btn teal"
                                disabled={cadence[1].status === "sent"}
                                onClick={() => markCadenceSent(1)}
                              >
                                {cadence[1].status === "sent" ? "✓" : "Mark D3 Sent"}
                              </button>
                              <button
                                className="act-btn teal"
                                disabled={cadence[2].status === "sent"}
                                onClick={() => markCadenceSent(2)}
                              >
                                {cadence[2].status === "sent" ? "✓" : "Mark D7 Sent"}
                              </button>
                            </div>
                          </div>
                        )}
                      </AgentBlock>

                      <AgentBlock
                        id="call"
                        title="Call Prep & Log"
                        sub="Pre-call brief + post-call notes"
                        icon="📞"
                        iconBg="rgba(124,106,245,0.15)"
                        iconColor="var(--accent3)"
                        state={pipeline.call}
                        fullWidth
                      >
                        {pipeline.call.status === "waiting" && (
                          <div style={{ color: "var(--muted)", fontSize: 11 }}>
                            Waiting for intel to complete…
                          </div>
                        )}
                        {pipeline.call.status !== "waiting" && (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div className="output-box">
                              <h4>Pre-Call Brief</h4>
                              {intel ? (
                                <>
                                  <div className="info-row">
                                    <span className="info-key">Company</span>
                                    <span className="info-val">{selected.company}</span>
                                  </div>
                                  <div className="info-row">
                                    <span className="info-key">Contact</span>
                                    <span className="info-val">
                                      {selected.name}, {selected.role}
                                    </span>
                                  </div>
                                  <div className="info-row">
                                    <span className="info-key">Priority</span>
                                    <span className="info-val" style={{ color: priorityColor(intel.priority) }}>
                                      {intel.priority}
                                    </span>
                                  </div>
                                  <div style={{ marginTop: 8, fontSize: 11, lineHeight: 1.5 }}>
                                    <strong style={{ color: "var(--text)" }}>Angle:</strong>{" "}
                                    <span style={{ color: "var(--accent)" }}>{intel.angle}</span>
                                  </div>
                                  <div style={{ marginTop: 5, fontSize: 11, lineHeight: 1.5 }}>
                                    <strong style={{ color: "var(--text)" }}>Watch:</strong>{" "}
                                    <span style={{ color: "var(--red)" }}>{intel.risk}</span>
                                  </div>
                                </>
                              ) : (
                                <div style={{ color: "var(--muted)", fontSize: 11 }}>Intel pending.</div>
                              )}
                              {touch.found && (
                                <div
                                  style={{
                                    marginTop: 8,
                                    padding: "6px 8px",
                                    background: "rgba(255,107,53,0.08)",
                                    borderRadius: 6,
                                    fontSize: 11,
                                    color: "var(--accent)",
                                  }}
                                >
                                  ↩ Return lead — prior notes available
                                </div>
                              )}
                            </div>
                            <div className="output-box">
                              <h4>Post-Call Notes</h4>
                              <textarea
                                className="editable-body"
                                rows={5}
                                placeholder="Type call notes here…"
                                value={callNotes}
                                onChange={(e) => setCallNotes(e.target.value)}
                                style={{ border: "1px solid var(--border)", borderRadius: 6, padding: 8 }}
                              />
                              <div className="action-row">
                                <button
                                  className="act-btn green"
                                  disabled={callMeetingBooked}
                                  onClick={bookMeeting}
                                >
                                  {callMeetingBooked ? "✅ Booked" : "📅 Book Meeting"}
                                </button>
                                <button
                                  className="act-btn orange"
                                  disabled={followUpQueued}
                                  onClick={() => setFollowUpQueued(true)}
                                >
                                  {followUpQueued ? "✅ Queued" : "↩ Follow-up"}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </AgentBlock>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ num, label }: { num: number; label: string }) {
  return (
    <div className="stat">
      <div className="stat-num" style={{ color: "#FF6B35" }}>
        {num}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function LeadHeader({
  lead,
  touch,
  onRun,
  running,
  hasRun,
}: {
  lead: Lead;
  touch: TouchResult;
  onRun: () => void;
  running: boolean;
  hasRun: boolean;
}) {
  return (
    <div className="lead-detail-header">
      <div className="lead-av-lg" style={{ background: lead.bg, color: lead.color }}>
        {initials(lead.name)}
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="lead-name-lg">{lead.name}</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 3, flexWrap: "wrap" }}>
          <span className={`tag ${sectorTag(lead.sector)}`}>{lead.sector}</span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>
            {lead.company} · {lead.role}
          </span>
          <span className={`touch-badge ${touch.found ? "touch-return" : "touch-new"}`}>
            {touch.found ? "↩ RETURN" : "★ NEW"}
          </span>
        </div>
      </div>
      <button className="run-all-btn" disabled={running} onClick={onRun}>
        ⚡ {running ? "Running…" : hasRun ? "Re-run Agents" : "Run All Agents"}
      </button>
    </div>
  );
}

function AgentBlock({
  title,
  sub,
  icon,
  iconBg,
  iconColor,
  state,
  fullWidth,
  children,
}: {
  id: AgentKey;
  title: string;
  sub: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  state: AgentRunState;
  fullWidth?: boolean;
  children?: React.ReactNode;
}) {
  const blockClass =
    state.status === "running"
      ? "agent-block running"
      : state.status === "done"
        ? "agent-block complete"
        : "agent-block";
  return (
    <div className={`${blockClass}${fullWidth ? " full-width" : ""}`}>
      <div className="agent-header">
        <div className="agent-icon" style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
        <div>
          <div className="agent-title">{title}</div>
          <div className="agent-sub">{sub}</div>
        </div>
        <div className={statusPillClass(state.status)}>{statusLabel(state.status)}</div>
      </div>
      <div className="agent-body">
        {state.doneLogs.map((log, i) => (
          <div key={`d-${i}`} className="log-line done-line">
            &gt; {log}
          </div>
        ))}
        {state.logs.map((log, i) => (
          <div key={`a-${i}`} className="log-line active">
            &gt; {log}
          </div>
        ))}
        {(state.status === "running" || state.status === "done") && (
          <div className="progress-bar-wrap">
            <div className="progress-bar" style={{ width: `${state.progress}%` }}></div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function QaItem({
  q,
  a,
  aStyle,
}: {
  q: string;
  a: string;
  aStyle?: React.CSSProperties;
}) {
  return (
    <div className="qa-item">
      <div className="qa-q">{q}</div>
      <div className="qa-a" style={aStyle}>
        {a}
      </div>
    </div>
  );
}
