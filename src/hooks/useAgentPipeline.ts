"use client";

import { useState, useRef, useCallback } from "react";
import { Company, AgentState, Stats } from "@/types";
import { sleep } from "@/lib/utils";
import { getResearchLogs } from "@/lib/agents/research";
import { getPioLogs } from "@/lib/agents/pio";
import { getPersonalizationLogs } from "@/lib/agents/personalization";
import { getOutreachLogs } from "@/lib/agents/outreach";

type AgentKey = "research" | "pio" | "personalization" | "outreach";

const initialAgent: AgentState = { status: "idle", logs: [], progress: 0 };

export interface PipelineResult {
  agents: Record<AgentKey, AgentState>;
  running: boolean;
  activeStep: number;
  run: (company: Company, onStats: (fn: (s: Stats) => Stats) => void) => Promise<void>;
  reset: () => void;
}

export function useAgentPipeline(): PipelineResult {
  const [agents, setAgents] = useState<Record<AgentKey, AgentState>>({
    research: { ...initialAgent },
    pio: { ...initialAgent },
    personalization: { ...initialAgent },
    outreach: { ...initialAgent },
  });
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const abortRef = useRef(false);

  const updateAgent = (key: AgentKey, patch: Partial<AgentState>) => {
    setAgents((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const runAgent = async (
    key: AgentKey,
    logs: string[],
    delayMs: number
  ): Promise<boolean> => {
    updateAgent(key, { status: "running", logs: [], progress: 0 });
    for (let i = 0; i < logs.length; i++) {
      if (abortRef.current) return false;
      await sleep(delayMs);
      updateAgent(key, {
        logs: logs.slice(0, i + 1),
        progress: ((i + 1) / logs.length) * 100,
      });
    }
    await sleep(300);
    updateAgent(key, { status: "done" });
    return true;
  };

  const run = useCallback(
    async (company: Company, onStats: (fn: (s: Stats) => Stats) => void) => {
      abortRef.current = false;
      setRunning(true);
      setActiveStep(1);

      // Research
      const resOk = await runAgent("research", getResearchLogs(company), 550);
      if (!resOk) { setRunning(false); return; }
      onStats((s) => ({ ...s, shortlisted: s.shortlisted + 1 }));
      setActiveStep(2);

      // PIO
      await sleep(250);
      const pioOk = await runAgent("pio", getPioLogs(company), 520);
      if (!pioOk) { setRunning(false); return; }
      onStats((s) => ({ ...s, contacts: s.contacts + 1 }));
      setActiveStep(3);

      // Personalization
      await sleep(250);
      const perOk = await runAgent("personalization", getPersonalizationLogs(company), 540);
      if (!perOk) { setRunning(false); return; }
      setActiveStep(4);

      // Outreach
      await sleep(250);
      const outOk = await runAgent("outreach", getOutreachLogs(), 570);
      if (!outOk) { setRunning(false); return; }
      onStats((s) => ({ ...s, outreach: s.outreach + 1 }));
      setActiveStep(5);

      setRunning(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const reset = useCallback(() => {
    abortRef.current = true;
    setRunning(false);
    setActiveStep(0);
    setAgents({
      research: { ...initialAgent },
      pio: { ...initialAgent },
      personalization: { ...initialAgent },
      outreach: { ...initialAgent },
    });
  }, []);

  return { agents, running, activeStep, run, reset };
}
