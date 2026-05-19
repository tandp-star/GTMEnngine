import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbound GTM Engine · Sales Orchestration",
  description: "AI-powered inbound lead orchestration",
};

export default function InboundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
