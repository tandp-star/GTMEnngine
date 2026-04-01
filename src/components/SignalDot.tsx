import { SignalScore } from "@/types";

const dotClass: Record<SignalScore, string> = {
  High: "signal-dot signal-high",
  Med: "signal-dot signal-med",
  Low: "signal-dot signal-low",
};

export default function SignalDot({ score }: { score: SignalScore }) {
  return <div className={dotClass[score]} />;
}
