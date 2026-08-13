export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Station {
  id: string;
  name: string;
  district: string;
  latitude: number;
  longitude: number;
  mosquitoCount: number;
  risk: RiskLevel;
  online: boolean;
  battery: number;
  lastSeen: string;
}

export interface Alert {
  id: string;
  title: string;
  station: string;
  location: string;
  level: RiskLevel;
  createdAt: string;
  status: "open" | "acknowledged" | "resolved";
}
