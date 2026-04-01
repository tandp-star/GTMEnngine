import { Stats } from "@/types";

interface Props {
  stats: Stats;
}

export default function StatsRow({ stats }: Props) {
  return (
    <div className="stat-row">
      <div className="stat">
        <div className="stat-num" style={{ color: "var(--accent)" }}>{stats.total}</div>
        <div className="stat-label">Companies Imported</div>
      </div>
      <div className="stat">
        <div className="stat-num" style={{ color: "#FF6B35" }}>{stats.shortlisted}</div>
        <div className="stat-label">Shortlisted</div>
      </div>
      <div className="stat">
        <div className="stat-num" style={{ color: "#FF6B35" }}>{stats.contacts}</div>
        <div className="stat-label">Contacts Found</div>
      </div>
      <div className="stat">
        <div className="stat-num" style={{ color: "#FF6B35" }}>{stats.outreach}</div>
        <div className="stat-label">Ready for Outreach</div>
      </div>
    </div>
  );
}
