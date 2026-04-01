import { Sector } from "@/types";

const config: Record<Sector, { label: string; className: string }> = {
  bfsi: { label: "BFSI", className: "tag tag-bfsi" },
  staffing: { label: "Staffing", className: "tag tag-staffing" },
  pharma: { label: "Pharma", className: "tag tag-pharma" },
};

export default function SectorTag({ sector }: { sector: Sector }) {
  const { label, className } = config[sector];
  return <span className={className}>{label}</span>;
}
