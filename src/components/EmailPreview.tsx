import { Company } from "@/types";

const sectorLabel: Record<string, string> = {
  bfsi: "BFSI",
  staffing: "staffing",
  pharma: "pharma",
};

export default function EmailPreview({ company }: { company: Company }) {
  const firstName = company.pio.name.split(" ")[0];

  return (
    <div className="email-preview">
      <div className="email-header-bar">
        <div className="email-field">
          <span className="email-label">From:</span>
          <span>vikyath.nanjappa@gmail.com</span>
        </div>
        <div className="email-field">
          <span className="email-label">To:</span>
          <span>{company.pio.email}</span>
        </div>
        <div className="email-field">
          <span className="email-label">Sub:</span>
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>
            Re: {company.signals.trigger} — how {company.name} can move faster on talent
          </span>
        </div>
      </div>
      <div className="email-body-text">
        Hi <span className="highlight-name">{firstName}</span>,
        <br /><br />
        I noticed that{" "}
        <span className="highlight-signal">{company.personalization.hook}</span> — that&apos;s a
        significant moment for your talent team.
        <br /><br />
        I work with {sectorLabel[company.sector]} organisations on GTM and recruitment automation —
        helping teams reduce time-to-fill by 40% through intelligent pipeline systems.
        <br /><br />
        Would you be open to a 20-minute conversation this week?
        <br /><br />
        Best,
        <br />
        <span style={{ color: "var(--muted)" }}>Vik</span>
      </div>
    </div>
  );
}
