import { Company } from "@/types";

const sectorLabel: Record<string, string> = {
  bfsi: "BFSI",
  staffing: "staffing",
  pharma: "pharma",
};

export default function LinkedInPreview({ company }: { company: Company }) {
  const firstName = company.pio.name.split(" ")[0];
  const initials = company.pio.name.split(" ").map((w) => w[0]).join("");
  const hookPart = company.personalization.hook.split("→")[0].trim();

  return (
    <div className="linkedin-preview">
      <div className="linkedin-name-header">
        <div className="li-avatar">{initials}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{company.pio.name}</div>
          <div style={{ fontSize: 11, color: "#0073b1" }}>
            {company.pio.role} at {company.name}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.7 }}>
        Hi <span style={{ color: "#0073b1", fontWeight: 600 }}>{firstName}</span>, came across{" "}
        <span style={{ color: "var(--accent2)", fontStyle: "italic" }}>{hookPart}</span> — impressive
        momentum.
        <br /><br />
        I help HR leaders at {sectorLabel[company.sector]} orgs build smarter recruitment pipelines
        without adding headcount. Open to a quick chat?
        <br /><br />
        — Vik
      </div>
    </div>
  );
}
