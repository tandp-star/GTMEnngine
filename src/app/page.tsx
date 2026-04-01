"use client";

import { useState, useCallback } from "react";
import { Stats } from "@/types";
import { companies } from "@/data/companies";
import { useTheme } from "@/hooks/useTheme";
import { useAgentPipeline } from "@/hooks/useAgentPipeline";
import Header from "@/components/Header";
import Pipeline from "@/components/Pipeline";
import StatsRow from "@/components/StatsRow";
import CompanyPanel from "@/components/CompanyPanel";
import DetailView from "@/components/DetailView";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats>({ total: 247, shortlisted: 0, contacts: 0, outreach: 0 });
  const pipeline = useAgentPipeline();

  const selectedCompany = selectedId ? companies.find((c) => c.id === selectedId) ?? null : null;

  const handleSelect = useCallback(
    (id: number) => {
      if (pipeline.running) return;
      pipeline.reset();
      setSelectedId(id);
    },
    [pipeline]
  );

  return (
    <>
      <Header theme={theme} setTheme={setTheme} />
      <div className="container">
        <div className="page-body">
          <Pipeline activeStep={pipeline.activeStep} />
          <StatsRow stats={stats} />
          <div className="main">
            <CompanyPanel
              companies={companies}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
            <DetailView
              company={selectedCompany}
              pipeline={pipeline}
              onStats={setStats}
            />
          </div>
        </div>
      </div>
    </>
  );
}
