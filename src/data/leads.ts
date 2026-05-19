import { Lead, PastTouch } from "@/types/inbound";

export const leads: Lead[] = [
  { id: 1, name: "Ahmed Al Fahim", company: "Emirates NBD", role: "Group CHRO", sector: "BFSI", email: "a.alfahim@emiratesnbd.com", stage: "New", source: "Website", date: "19 May", color: "#00c2a8", bg: "rgba(0,194,168,0.15)" },
  { id: 2, name: "Layla Al Qassimi", company: "Dubai Islamic Bank", role: "Chief People Officer", sector: "BFSI", email: "l.alqassimi@dib.ae", stage: "Contacted", source: "LinkedIn", date: "18 May", color: "#7c6af5", bg: "rgba(124,106,245,0.15)" },
  { id: 3, name: "Tariq Hussain", company: "Majid Al Futtaim", role: "CHRO", sector: "Retail", email: "t.hussain@maf.ae", stage: "Qualified", source: "Referral", date: "17 May", color: "#e08a00", bg: "rgba(245,166,35,0.12)" },
  { id: 4, name: "Sara Al Madani", company: "DP World", role: "VP — People & Culture", sector: "Logistics", email: "s.almadani@dpworld.com", stage: "Cold", source: "Website", date: "15 May", color: "#FF6B35", bg: "rgba(255,107,53,0.1)" },
  { id: 5, name: "Khalid Al Mansoori", company: "Abu Dhabi Commercial Bank", role: "Chief HR Officer", sector: "BFSI", email: "k.almansoori@adcb.com", stage: "Meeting Set", source: "Event", date: "14 May", color: "#7c6af5", bg: "rgba(124,106,245,0.15)" },
  { id: 6, name: "Rania Aziz", company: "Careem", role: "VP People", sector: "IT/ITeS", email: "r.aziz@careem.com", stage: "New", source: "LinkedIn", date: "19 May", color: "#00c2a8", bg: "rgba(0,194,168,0.12)" },
  { id: 7, name: "Omar Al Suwaidi", company: "Emaar Properties", role: "CHRO", sector: "Real Estate", email: "o.alsuwaidi@emaar.ae", stage: "Contacted", source: "Website", date: "16 May", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  { id: 8, name: "Fatima Al Hashimi", company: "First Abu Dhabi Bank", role: "Group Head — HR", sector: "BFSI", email: "f.alhashimi@bankfab.com", stage: "New", source: "Referral", date: "19 May", color: "#FF6B35", bg: "rgba(255,107,53,0.1)" },
  { id: 9, name: "Jassim Al Zaabi", company: "Etisalat (e&)", role: "Chief People Officer", sector: "IT/ITeS", email: "j.alzaabi@etisalat.ae", stage: "Cold", source: "Website", date: "10 May", color: "#5a6478", bg: "rgba(90,100,120,0.15)" },
  { id: 10, name: "Noura Al Kaabi", company: "Dubai Airports", role: "SVP — Human Capital", sector: "Logistics", email: "n.alkaabi@dubaiairports.ae", stage: "Qualified", source: "LinkedIn", date: "13 May", color: "#e08a00", bg: "rgba(245,166,35,0.12)" },
  { id: 11, name: "Hamdan Al Rashidi", company: "Alshaya Group", role: "Group HR Director", sector: "Retail", email: "h.alrashidi@alshaya.com", stage: "New", source: "Event", date: "18 May", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  { id: 12, name: "Mariam Al Marzouqi", company: "ENOC", role: "CHRO", sector: "Energy", email: "m.almarzouqi@enoc.com", stage: "Meeting Set", source: "Referral", date: "12 May", color: "#7c6af5", bg: "rgba(124,106,245,0.15)" },
];

export const pastTouches: Record<string, PastTouch> = {
  "emirates nbd": {
    date: "2024-11-10",
    contact: "Ahmed Al Fahim",
    notes: "Discovery call done. Keen on AI-powered outbound for SME banking segment. Proposal pending.",
  },
  "dubai islamic bank": {
    date: "2024-09-18",
    contact: "Layla Al Qassimi",
    notes: "Intro email sent. No reply. Compliance concerns flagged.",
  },
  "dp world": {
    date: "2024-10-05",
    contact: "Sara Al Madani",
    notes: "Two calls done. Strong interest in talent ops automation. Went cold after budget freeze.",
  },
  careem: {
    date: "2024-12-02",
    contact: "Rania Aziz",
    notes: "Demo given. Exploring Clay integration. Follow-up due.",
  },
  "emaar properties": {
    date: "2025-01-14",
    contact: "Omar Al Suwaidi",
    notes: "Intro call completed. Liked the RAF approach. No decision yet.",
  },
};
