export type LeadStage = "New" | "Contacted" | "Qualified" | "Meeting Set" | "Cold";
export type LeadSource = "Website" | "LinkedIn" | "Referral" | "Event";
export type LeadSector =
  | "BFSI"
  | "IT/ITeS"
  | "Retail"
  | "Logistics"
  | "Real Estate"
  | "Energy";

export interface Lead {
  id: number;
  name: string;
  company: string;
  role: string;
  sector: LeadSector;
  email: string;
  stage: LeadStage;
  source: LeadSource;
  date: string;
  color: string;
  bg: string;
}

export interface PastTouch {
  date: string;
  contact: string;
  notes: string;
}

export interface TouchResult {
  found: boolean;
  date?: string;
  contact?: string;
  notes?: string;
}

export type AgentKey = "touch" | "intel" | "email" | "cadence" | "call";
export type AgentStatus = "waiting" | "running" | "done";

export interface AgentRunState {
  status: AgentStatus;
  logs: string[];
  doneLogs: string[];
  progress: number;
}

export interface IntelBrief {
  what: string;
  size: string;
  pain: string;
  angle: string;
  risk: string;
  priority: "High" | "Medium" | "Low";
}

export interface EmailDraft {
  subject: string;
  body: string;
}

export type CadenceStepStatus = "active" | "pending" | "sent";

export interface CadenceStep {
  day: string;
  label: string;
  status: CadenceStepStatus;
}
