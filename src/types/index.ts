export type Sector = "bfsi" | "staffing" | "pharma";
export type SignalScore = "High" | "Med" | "Low";
export type Confidence = "high" | "med";
export type Channel = "email" | "linkedin";

export interface CompanySignals {
  hiring: string;
  trigger: string;
  score: SignalScore;
  openRoles: string[];
  newsSnippet: string;
}

export interface PIO {
  name: string;
  role: string;
  email: string;
  confidence: Confidence;
}

export interface Personalization {
  hook: string;
  channel: Channel;
}

export interface Company {
  id: number;
  name: string;
  short: string;
  color: string;
  bg: string;
  sector: Sector;
  employees: string;
  hq: string;
  signals: CompanySignals;
  pio: PIO;
  personalization: Personalization;
}

export type AgentStatus = "idle" | "running" | "done";

export interface AgentState {
  status: AgentStatus;
  logs: string[];
  progress: number;
}

export interface PipelineState {
  research: AgentState;
  pio: AgentState;
  personalization: AgentState;
  outreach: AgentState;
}

export interface Stats {
  total: number;
  shortlisted: number;
  contacts: number;
  outreach: number;
}
