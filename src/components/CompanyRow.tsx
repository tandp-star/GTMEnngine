"use client";

import { Company } from "@/types";
import { cn } from "@/lib/utils";
import SectorTag from "./SectorTag";
import SignalDot from "./SignalDot";

interface Props {
  company: Company;
  selected: boolean;
  onClick: () => void;
}

export default function CompanyRow({ company, selected, onClick }: Props) {
  return (
    <div className={cn("company-row", selected && "selected")} onClick={onClick}>
      <div
        className="company-logo"
        style={{ background: company.bg, color: company.color }}
      >
        {company.short}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="company-name">{company.name}</div>
        <div className="company-meta">
          <SectorTag sector={company.sector} />
          <span>{company.employees} emp</span>
        </div>
      </div>
      <SignalDot score={company.signals.score} />
    </div>
  );
}
