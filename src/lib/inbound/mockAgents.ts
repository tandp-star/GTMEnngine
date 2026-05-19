import { EmailDraft, ICPRating, ICPScore, IntelBrief, Lead, TouchResult } from "@/types/inbound";
import { pastTouches } from "@/data/leads";

export function checkTouch(company: string): TouchResult {
  const k = company.toLowerCase();
  for (const key in pastTouches) {
    if (k.includes(key) || key.includes(k)) {
      return { found: true, ...pastTouches[key] };
    }
  }
  return { found: false };
}

const sectorPain: Record<string, { pain: string; angle: string; risk: string; what: string; size: string }> = {
  BFSI: {
    what: "{{company}} is a leading {{sector}} player facing rising cost-to-income pressure and tightening regulatory expectations.",
    size: "Enterprise-scale operations (10,000+) with complex multi-entity finance and treasury functions.",
    pain: "Manual reconciliation, regulatory reporting, and AML alert triage are eating analyst hours that should go to higher-value work.",
    angle: "Our AI automation cuts compliance and reconciliation effort by 60% with full audit trails — built for BFSI.",
    risk: "Compliance and audit will scrutinise data residency and model explainability — have a SOC2 + DPDP brief ready.",
  },
  "IT/ITeS": {
    what: "{{company}} runs a high-velocity tech org where finance has to keep pace with constant new projects, contracts, and billing changes.",
    size: "Mid-to-large operations (3,000–15,000) spanning multiple geographies and currencies.",
    pain: "Project P&L, revenue recognition under ASC 606, and cost allocation are still painfully manual.",
    angle: "We automate 70% of project accounting and rev-rec workflows — finance teams close in days, not weeks.",
    risk: "They likely run NetSuite or Workday Adaptive — position as an intelligence layer, not a replacement.",
  },
  Retail: {
    what: "{{company}} is a marquee {{sector}} group with high SKU velocity, store-level P&L, and seasonal swings.",
    size: "Tens of thousands of associates across stores and DCs, with finance hubs in regional HQs.",
    pain: "Store-level P&L, inventory cost accounting, and demand forecasting still depend on weekly Excel cycles.",
    angle: "Our AI delivers store-level P&L in near real-time and shortens demand-forecast cycles from weeks to hours.",
    risk: "Procurement-heavy buying process — expect a vendor empanelment ask early.",
  },
  Logistics: {
    what: "{{company}} operates critical infrastructure where finance has to consolidate across geographies, currencies, and asset classes.",
    size: "5,000+ employees across multiple operating entities, currencies, and joint ventures.",
    pain: "Freight cost reconciliation, multi-currency FX exposure, and fleet TCO reporting are heavy manual lifts.",
    angle: "Our AI reconciles freight costs and surfaces FX exposure in real-time — built for asset-heavy operations.",
    risk: "Public-sector-adjacent procurement — plan for a 3-month POC ramp.",
  },
  "Real Estate": {
    what: "{{company}} is a flagship developer with project pipelines that create complex capitalisation and lease accounting workloads.",
    size: "Multi-entity finance org spanning development, sales, asset management, and facilities.",
    pain: "IFRS 16 lease accounting, project capitalisation, and cash-flow forecasting consume disproportionate finance bandwidth.",
    angle: "We automate IFRS 16 lease accounting and project-level CF forecasting end-to-end — close cycle drops by ~50%.",
    risk: "Brand-sensitive — they'll want approval rights on anything investor- or board-facing.",
  },
  Energy: {
    what: "{{company}} is a strategic {{sector}} operator with significant commodity exposure and high-stakes capex governance.",
    size: "Multi-thousand workforce with concentrated finance leadership across commercial, treasury, and transformation.",
    pain: "Commodity exposure tracking, capex governance, and multi-entity consolidation are still spreadsheet-driven.",
    angle: "Our AI delivers real-time commodity exposure dashboards and automates capex approval workflows.",
    risk: "Decision-makers expect deep domain credibility — bring a relevant case study to call one.",
  },
};

export function generateIntel(lead: Lead, touch: TouchResult): IntelBrief {
  const sector = sectorPain[lead.sector] ?? sectorPain["IT/ITeS"];
  const stagePriority: Record<string, "High" | "Medium" | "Low"> = {
    "Meeting Set": "High",
    Qualified: "High",
    Contacted: "Medium",
    New: "Medium",
    Cold: "Low",
  };
  const priority = touch.found && lead.stage !== "Cold" ? "High" : stagePriority[lead.stage] ?? "Medium";

  return {
    what: sector.what.replace("{{company}}", lead.company).replace("{{sector}}", lead.sector),
    size: sector.size,
    pain: sector.pain,
    angle: sector.angle,
    risk: touch.found
      ? `${sector.risk} Also: prior conversation context — "${touch.notes}"`
      : sector.risk,
    priority,
  };
}

const firstNameOf = (name: string) => name.split(" ")[0];

export function generateEmail(lead: Lead, touch: TouchResult): EmailDraft {
  const first = firstNameOf(lead.name);
  const sector = sectorPain[lead.sector] ?? sectorPain["IT/ITeS"];

  if (touch.found) {
    return {
      subject: `${first} — picking up our earlier ${lead.company} conversation`,
      body: `Hi ${first},

Reaching back out — last time we spoke (${touch.date}), the takeaway was: "${touch.notes}"

Since then we've shipped a few things specific to ${lead.sector} finance teams that directly address what you flagged. ${sector.angle}

Worth a 20-min call to re-open the conversation?

— Vik, Inbound GTM Engine`,
    };
  }

  return {
    subject: `${lead.company} — automating the finance grunt work`,
    body: `Hi ${first},

Saw ${lead.company}'s recent moves in ${lead.sector}. ${sector.what.replace("{{company}}", lead.company).replace("{{sector}}", lead.sector)}

Most finance leaders in ${lead.sector} I speak to flag the same blocker: ${sector.pain.toLowerCase()}

${sector.angle}

Open to a 20-min call next week?

— Vik, Inbound GTM Engine`,
  };
}

// ── ICP Scoring ──

const isClearDM = (role: string) =>
  /\bcfo\b|chief financial officer|^(s)?vp finance|svp finance|vp finance/i.test(role);

const isLikelyDM = (role: string) => /director/i.test(role);

const isManager = (role: string) => /manager/i.test(role);

export function scoreICP(lead: Lead): ICPScore {
  // Company fit: all 12 are UAE-based enterprise in target sectors → High
  const companyFit: ICPRating = "High";

  let personFit: ICPRating;
  let recommendation: string;

  if (isClearDM(lead.role)) {
    personFit = "High";
    recommendation = "Proceed with full orchestration — clear decision maker";
  } else if (isLikelyDM(lead.role)) {
    personFit = "Medium";
    recommendation = "Engage with full sequence; flag CFO involvement at proposal stage";
  } else if (isManager(lead.role)) {
    personFit = "Low";
    recommendation = "Treat as champion — recommend warm intro to CFO";
  } else {
    personFit = "Low";
    recommendation = "Out of ICP — consider deprioritising or seek alternate contact";
  }

  const ratingValue = (r: ICPRating) => (r === "High" ? 50 : r === "Medium" ? 32 : 14);
  const overall = ratingValue(companyFit) + ratingValue(personFit);

  return { companyFit, personFit, overall, recommendation };
}

// ── Log builders ──

export function buildICPLogs(lead: Lead): string[] {
  return [
    `Loading ICP criteria…`,
    `Checking company fit · ${lead.company} (${lead.sector})…`,
    `Checking person fit · ${lead.role}…`,
    `Scoring against AI-automation buyer profile…`,
  ];
}

export function buildTouchLogs(lead: Lead, touch: TouchResult): string[] {
  return [
    `Querying meeting notes for "${lead.company}"…`,
    `Scanning mailbox threads…`,
    touch.found ? `Match found: ${touch.date}` : "No prior contact found",
    `Classification: ${touch.found ? "RETURN ↩" : "NEW ★"}`,
  ];
}

export function buildIntelLogs(lead: Lead): string[] {
  return [
    `Profiling ${lead.company}…`,
    `Loading ${lead.sector} finance pain context…`,
    `Generating intel brief…`,
  ];
}

export function buildEmailLogs(touch: TouchResult): string[] {
  return [
    `Loading ${touch.found ? "re-engagement" : "first-touch"} template…`,
    `Injecting contact context…`,
    `Drafting email…`,
  ];
}

export function buildCadenceLogs(): string[] {
  return [
    "Setting up 14-day sequence…",
    "D0: Intro email queued",
    "D3: LinkedIn connect scheduled",
    "D7: Follow-up set",
    "D14: Close loop set",
  ];
}

export function buildCallPrepLogs(lead: Lead, touch: TouchResult): string[] {
  return [
    `Compiling pre-call brief for ${lead.company}…`,
    `Pulling intel signals + ${touch.found ? "prior conversation context" : "first-touch angle"}…`,
    `Brief ready · ${lead.name}`,
  ];
}
