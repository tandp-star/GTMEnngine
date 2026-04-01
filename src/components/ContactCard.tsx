import { Company } from "@/types";

export default function ContactCard({ company }: { company: Company }) {
  const { pio } = company;
  const initials = pio.name.split(" ").map((w) => w[0]).join("");

  return (
    <div className="output-box">
      <h4>Contact Identified</h4>
      <div className="contact-row">
        <div
          className="contact-avatar"
          style={{ background: "rgba(245,166,35,0.12)", color: "var(--accent2)" }}
        >
          {initials}
        </div>
        <div>
          <div className="contact-name">{pio.name}</div>
          <div className="contact-role">
            {pio.role} · {company.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
            {pio.email}
          </div>
        </div>
        <div className="contact-links">
          <span className="contact-link">✉ Email</span>
          <span className="contact-link">in LinkedIn</span>
        </div>
        <span className={`confidence ${pio.confidence === "high" ? "conf-high" : "conf-med"}`}>
          {pio.confidence === "high" ? "92%" : "74%"}
        </span>
      </div>
    </div>
  );
}
