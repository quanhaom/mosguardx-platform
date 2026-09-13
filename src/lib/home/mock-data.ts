export type RiskLevel =
  | "low"
  | "medium"
  | "high";

export type MosquitoEvent = {
  id: string;
  time: string;
  location: string;
  species: string;
  confidence: number;
};

export const homeSummary = {
  householdName: "Nhà Hà Nội",
  deviceName: "Ban công tầng 3",
  online: true,

  todayCount: 7,
  weekCount: 42,
  previousWeekCount: 51,
  trendPercent: -18,

  dominantSpecies: "Aedes albopictus",
  averageConfidence: 0.92,

  peakTime: "18:00–20:00",

  riskLevel: "medium" as RiskLevel,
};

export const weatherSnapshot = {
  temperature: 29,
  humidity: 81,
  rainfall24h: 12,
  rainfall3d: 28,
  rainfall7d: 43,

  rainProbability: 72,
  windSpeed: 6,

  sunrise: "05:42",
  sunset: "18:01",

  suitability: "high" as RiskLevel,
};

export const deviceStatus = {
  camera: true,
  fan: true,
  connection: "Tốt",
  cartridgePercent: 78,
  lastSeen: "Vừa xong",
};

export const hourlyActivity = [
  1, 0, 0, 0, 0, 1,
  2, 3, 1, 0, 0, 1,
  1, 1, 2, 2, 3, 5,
  7, 6, 4, 2, 1, 1,
];

export const weeklyActivity = [
  {
    day: "T2",
    date: "07/09",
    count: 5,
  },
  {
    day: "T3",
    date: "08/09",
    count: 7,
  },
  {
    day: "T4",
    date: "09/09",
    count: 4,
  },
  {
    day: "T5",
    date: "10/09",
    count: 8,
  },
  {
    day: "T6",
    date: "11/09",
    count: 6,
  },
  {
    day: "T7",
    date: "12/09",
    count: 5,
  },
  {
    day: "CN",
    date: "13/09",
    count: 7,
  },
];

export const speciesBreakdown = [
  {
    species: "Aedes albopictus",
    percentage: 54,
    count: 23,
  },
  {
    species: "Culex",
    percentage: 31,
    count: 13,
  },
  {
    species: "Culiseta",
    percentage: 10,
    count: 4,
  },
  {
    species: "Khác / chưa xác định",
    percentage: 5,
    count: 2,
  },
];

export const recentEvents: MosquitoEvent[] = [
  {
    id: "evt-001",
    time: "22:14",
    location: "Ban công tầng 3",
    species: "Aedes albopictus",
    confidence: 0.94,
  },
  {
    id: "evt-002",
    time: "20:48",
    location: "Ban công tầng 3",
    species: "Culex",
    confidence: 0.88,
  },
  {
    id: "evt-003",
    time: "19:32",
    location: "Ban công tầng 3",
    species: "Aedes albopictus",
    confidence: 0.91,
  },
  {
    id: "evt-004",
    time: "18:17",
    location: "Ban công tầng 3",
    species: "Aedes albopictus",
    confidence: 0.89,
  },
];