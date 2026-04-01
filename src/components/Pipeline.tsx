"use client";

import { cn } from "@/lib/utils";

const steps = [
  { label: "Company List", sub: "Clay / Apollo" },
  { label: "Research Agent", sub: "Hiring signals" },
  { label: "PIO Finder", sub: "CHRO coordinates" },
  { label: "Personalization", sub: "Signal extraction" },
  { label: "Outreach Agent", sub: "Email + LinkedIn" },
];

interface Props {
  activeStep: number; // 0-5, 0 = company list done, 5 = all done
}

export default function Pipeline({ activeStep }: Props) {
  return (
    <div className="pipeline">
      {steps.map((step, i) => {
        const isDone = i === 0 ? true : i < activeStep;
        const isActive = i === activeStep;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {i > 0 && <div className="arrow" />}
            <div className={cn("step", isDone && "done", isActive && "active")}>
              <div className="step-num">{isDone ? "✓" : i + 1}</div>
              <div>
                <div className="step-label">{step.label}</div>
                <div className="step-sub">{step.sub}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
