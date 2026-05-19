import { EmailDraft, IntelBrief, Lead, TouchResult } from "@/types/inbound";
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
    what: "{{company}} is a leading {{sector}} player with deep presence across the GCC and a mandate to modernise talent operations.",
    size: "Enterprise-scale workforce (10,000+) with active hiring across SME banking and digital products.",
    pain: "Hiring quality talent at scale for digital banking transformation while keeping compliance overhead low.",
    angle: "We help BFSI leaders cut time-to-hire by 40% with AI-driven outbound that respects strict compliance rails.",
    risk: "Compliance team likely to question data handling and PII flow — have a SOC2 + DPDP brief ready.",
  },
  "IT/ITeS": {
    what: "{{company}} runs a high-velocity tech org with constant talent churn across product, engineering, and growth.",
    size: "Mid-to-large workforce (3,000–15,000) with aggressive expansion across India and MENA.",
    pain: "Bench velocity and TA team bandwidth — cannot keep up with leadership-grade hires at the speed product needs.",
    angle: "Our AI-powered TA orchestration cuts senior hire cycle from 90 to 35 days for IT/ITeS scaleups.",
    risk: "May already have internal tooling (Lever, Greenhouse) — position as augmentation, not replacement.",
  },
  Retail: {
    what: "{{company}} is a marquee {{sector}} group with rapid store expansion and seasonal hiring waves.",
    size: "Tens of thousands of associates with high turnover in store ops and supply chain leadership.",
    pain: "Cannot fill regional leadership roles fast enough — store openings get bottlenecked on hiring.",
    angle: "We deploy a hiring agent that pre-qualifies retail leadership candidates in 72 hours.",
    risk: "Procurement-heavy buying process — expect a vendor empanelment ask early.",
  },
  Logistics: {
    what: "{{company}} operates critical infrastructure with complex talent needs across ops, tech, and field leadership.",
    size: "Large operational footprint, often 5,000+ employees across multiple geographies.",
    pain: "Specialist hiring (port ops, aviation, cold chain) where the talent pool is small and traditional sourcing fails.",
    angle: "Our agentic sourcing surfaces passive specialists most JDs never reach — proven in port and aviation hires.",
    risk: "Long deal cycles — public-sector-adjacent procurement. Plan for a 3-month POC ramp.",
  },
  "Real Estate": {
    what: "{{company}} is a flagship developer with project pipelines that drive sharp, time-boxed hiring needs.",
    size: "Large workforce across development, sales, and asset management — hiring volume scales with project launches.",
    pain: "Hiring senior sales and development leads ahead of launches without paying retainer-search premiums.",
    angle: "Direct-source senior real estate hires at 1/3 the cost of retained search, in half the time.",
    risk: "Brand-sensitive — they will want approval rights on every outbound message.",
  },
  Energy: {
    what: "{{company}} is a strategic {{sector}} operator with long-cycle hiring and high cost per bad hire.",
    size: "Multi-thousand workforce with concentrated leadership hiring in commercial and tech transformation.",
    pain: "Energy transition hires (renewables, tech) are scarce — internal TA team lacks the network.",
    angle: "We bring deep networks in energy-transition talent that no in-house TA team can replicate alone.",
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
      subject: `${first} — picking up where we left off on ${lead.company}`,
      body: `Hi ${first},

Reaching back out — last time we spoke (${touch.date}), the takeaway was: "${touch.notes}"

Since then, we've shipped a few things specific to ${lead.sector} that I think directly address what you flagged. ${sector.angle}

Worth a 20-min call to re-open the conversation?

— Vik, Inbound GTM Engine`,
    };
  }

  return {
    subject: `${lead.company} — a faster path on ${lead.sector === "BFSI" ? "compliance-grade hiring" : "leadership hiring"}`,
    body: `Hi ${first},

Saw ${lead.company}'s recent moves in ${lead.sector}. ${sector.what.replace("{{company}}", lead.company).replace("{{sector}}", lead.sector)}

Most leaders in ${lead.sector} I speak to flag the same blocker: ${sector.pain.toLowerCase()}

${sector.angle}

Open to a 20-min call next week?

— Vik, Inbound GTM Engine`,
  };
}

export function buildTouchLogs(lead: Lead, touch: TouchResult): string[] {
  return [
    `Querying Granola for "${lead.company}"…`,
    `Scanning Gmail threads…`,
    touch.found ? `Match found: ${touch.date}` : "No prior contact found",
    `Classification: ${touch.found ? "RETURN ↩" : "NEW ★"}`,
  ];
}

export function buildIntelLogs(lead: Lead): string[] {
  return [
    `Profiling ${lead.company}…`,
    `Loading ${lead.sector} sector context…`,
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
