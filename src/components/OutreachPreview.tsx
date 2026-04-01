"use client";

import { useState } from "react";
import { Company } from "@/types";
import { cn } from "@/lib/utils";
import EmailPreview from "./EmailPreview";
import LinkedInPreview from "./LinkedInPreview";

interface Props {
  company: Company;
}

export default function OutreachPreview({ company }: Props) {
  const isEmail = company.personalization.channel === "email";
  const [activeTab, setActiveTab] = useState<"primary" | "alt">("primary");

  return (
    <div>
      <div className="tab-row">
        <button
          className={cn("tab", activeTab === "primary" && "active")}
          onClick={() => setActiveTab("primary")}
        >
          {isEmail ? "Email" : "LinkedIn"}
        </button>
        <button
          className={cn("tab", activeTab === "alt" && "active")}
          onClick={() => setActiveTab("alt")}
        >
          {isEmail ? "LinkedIn (alt)" : "Email (alt)"}
        </button>
      </div>

      {activeTab === "primary" ? (
        isEmail ? <EmailPreview company={company} /> : <LinkedInPreview company={company} />
      ) : (
        isEmail ? <LinkedInPreview company={company} /> : <EmailPreview company={company} />
      )}

      <button
        className="run-btn"
        style={{ marginTop: 14, background: "var(--green)" }}
        onClick={() => alert("✅ Queued for outreach sequence!")}
      >
        ✓ Approve & Queue for Send
      </button>
    </div>
  );
}
