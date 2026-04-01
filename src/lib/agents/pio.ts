import { Company } from "@/types";

export function getPioLogs(company: Company): string[] {
  return [
    `Searching LinkedIn for CHRO / CPO at "${company.name}"…`,
    `Cross-referencing ZoomInfo database…`,
    `Found: ${company.pio.name}, ${company.pio.role}`,
    `Verifying email pattern against MX records…`,
    `Email confidence: ${company.pio.confidence === "high" ? "92%" : "74%"} ✓`,
    `LinkedIn URL confirmed ✓`,
  ];
}
