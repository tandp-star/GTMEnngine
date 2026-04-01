"use client";

import { Company } from "@/types";
import CompanyRow from "./CompanyRow";

interface Props {
  companies: Company[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function CompanyPanel({ companies, selectedId, onSelect }: Props) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Company List</div>
        <div className="panel-count">{companies.length} companies</div>
      </div>
      <div className="company-list">
        {companies.map((c) => (
          <CompanyRow
            key={c.id}
            company={c}
            selected={selectedId === c.id}
            onClick={() => onSelect(c.id)}
          />
        ))}
      </div>
    </div>
  );
}
