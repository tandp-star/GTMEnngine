import { Company } from "@/types";

export function getPersonalizationLogs(company: Company): string[] {
  return [
    `Matching ${company.pio.name}'s recent LinkedIn activity…`,
    `Extracting signal: "${company.personalization.hook}"`,
    `Identifying relevant TalentRecruit use case…`,
    `Channel selected: ${company.personalization.channel.toUpperCase()}`,
    `Drafting personalised message…`,
    `Message ready ✓`,
  ];
}
