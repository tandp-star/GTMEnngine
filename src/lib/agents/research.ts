import { Company } from "@/types";

export function getResearchLogs(company: Company): string[] {
  return [
    `Querying LinkedIn Jobs for "${company.name}"…`,
    `Found ${company.signals.hiring} active job postings`,
    `Scanning Crunchbase for funding activity…`,
    `Fetching recent news & press releases…`,
    `Signal detected: "${company.signals.trigger}"`,
    `Score: ${company.signals.score} ✓`,
  ];
}
