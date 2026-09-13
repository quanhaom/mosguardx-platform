export type RiskLevel =
  | "low"
  | "medium"
  | "high";

export type DeviceHealthStatus =
  | "normal"
  | "warning"
  | "offline";

export type MosquitoEvent = {
  id: string;
  time: string;
  location: string;
  species: string;
  confidence: number;
};

export type HomeAlertSeverity =
  | "info"
  | "warning"
  | "critical";

export type HomeAlertCategory =
  | "weather"
  | "mosquito"
  | "device"
  | "cartridge";

export type HomeAlert = {
  id: string;
  category: HomeAlertCategory;
  severity: HomeAlertSeverity;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
};

/* =========================
   HOUSEHOLD SUMMARY
========================= */

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

/* =========================
   WEATHER
========================= */

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

/* =========================
   BASIC DEVICE STATUS
========================= */

export const deviceStatus = {
  camera: true,
  fan: true,
  connection: "Tốt",
  cartridgePercent: 78,
  lastSeen: "Vừa xong",
};

/* =========================
   HOME DEVICES
========================= */

export const homeDevices = [
  {
    id: "MGX-HOME-001",

    name: "Ban công tầng 3",
    model: "MosGuardX Home",
    household: homeSummary.householdName,

    online: true,

    lastSeen: "Vừa xong",
    uptime: "3 ngày 8 giờ",

    camera: {
      status: "normal" as DeviceHealthStatus,
      label: "Bình thường",
      fps: 20,
    },

    motionEngine: {
      status: "normal" as DeviceHealthStatus,
      label: "Đang theo dõi",
      mode: "Frame Difference",
      processingFps: 12,
      roi: "320 × 240",
    },

    aiConnection: {
      status: "normal" as DeviceHealthStatus,
      label: "Đã kết nối",
      latencyMs: 842,
    },

    fan: {
      status: "normal" as DeviceHealthStatus,
      label: "Bình thường",
    },

    wifi: {
      status: "normal" as DeviceHealthStatus,
      label: "Tốt",
      signalDbm: -54,
    },

    eventQueue: {
      pending: 0,
      synced: 184,
    },

    cartridge: {
      percent: 78,
      estimatedDays: 23,
      installedAt: "21/08/2026",
    },

    firmware: "0.1.0-beta",

    ip: "192.168.1.84",
  },

  {
    id: "MGX-HOME-002",

    name: "Sân trước",
    model: "MosGuardX Home",
    household: homeSummary.householdName,

    online: true,

    lastSeen: "2 phút trước",
    uptime: "1 ngày 14 giờ",

    camera: {
      status: "normal" as DeviceHealthStatus,
      label: "Bình thường",
      fps: 18,
    },

    motionEngine: {
      status: "normal" as DeviceHealthStatus,
      label: "Đang theo dõi",
      mode: "Frame Difference",
      processingFps: 11,
      roi: "320 × 240",
    },

    aiConnection: {
      status: "normal" as DeviceHealthStatus,
      label: "Đã kết nối",
      latencyMs: 1034,
    },

    fan: {
      status: "normal" as DeviceHealthStatus,
      label: "Bình thường",
    },

    wifi: {
      status: "warning" as DeviceHealthStatus,
      label: "Trung bình",
      signalDbm: -68,
    },

    eventQueue: {
      pending: 1,
      synced: 96,
    },

    cartridge: {
      percent: 46,
      estimatedDays: 13,
      installedAt: "01/09/2026",
    },

    firmware: "0.1.0-beta",

    ip: "192.168.1.91",
  },
];

/*
  Compatibility:
  Các trang cũ vẫn đang dùng homeDevice
  sẽ tiếp tục hoạt động với thiết bị đầu tiên.
*/
export const homeDevice =
  homeDevices[0];

/* =========================
   HOURLY ACTIVITY
========================= */

export const hourlyActivity = [
  1, 0, 0, 0, 0, 1,
  2, 3, 1, 0, 0, 1,
  1, 1, 2, 2, 3, 5,
  7, 6, 4, 2, 1, 1,
];

/* =========================
   WEEKLY ACTIVITY
========================= */

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

/* =========================
   SPECIES
========================= */

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
    species:
      "Khác / chưa xác định",
    percentage: 5,
    count: 2,
  },
];

/* =========================
   RECENT EVENTS
========================= */

export const recentEvents:
  MosquitoEvent[] = [
    {
      id: "evt-001",
      time: "22:14",
      location:
        "Ban công tầng 3",
      species:
        "Aedes albopictus",
      confidence: 0.94,
    },

    {
      id: "evt-002",
      time: "20:48",
      location:
        "Ban công tầng 3",
      species: "Culex",
      confidence: 0.88,
    },

    {
      id: "evt-003",
      time: "19:32",
      location:
        "Ban công tầng 3",
      species:
        "Aedes albopictus",
      confidence: 0.91,
    },

    {
      id: "evt-004",
      time: "18:17",
      location:
        "Ban công tầng 3",
      species:
        "Aedes albopictus",
      confidence: 0.89,
    },
  ];

/* =========================
   HOME ALERTS
========================= */

export const homeAlerts:
  HomeAlert[] = [
    {
      id: "alert-001",
      category: "weather",
      severity: "warning",

      title:
        "Điều kiện môi trường thuận lợi cho muỗi",

      description:
        "Độ ẩm cao và lượng mưa trong 24 giờ qua đang tạo điều kiện thuận lợi cho hoạt động của muỗi.",

      createdAt:
        "35 phút trước",

      read: false,
    },

    {
      id: "alert-002",
      category: "mosquito",
      severity: "warning",

      title:
        "Hoạt động muỗi tăng vào buổi tối",

      description:
        "MosGuardX ghi nhận hoạt động tập trung nhiều nhất trong khoảng 18:00–20:00.",

      createdAt:
        "2 giờ trước",

      read: false,
    },

    {
      id: "alert-003",
      category: "device",
      severity: "info",

      title:
        "Thiết bị hoạt động ổn định",

      description:
        "Camera, quạt và kết nối cloud đều đang hoạt động bình thường.",

      createdAt:
        "5 giờ trước",

      read: true,
    },

    {
      id: "alert-004",
      category: "cartridge",
      severity: "info",

      title:
        "Cartridge còn 78%",

      description:
        "Ước tính cartridge hiện tại còn khoảng 23 ngày sử dụng.",

      createdAt:
        "Hôm qua",

      read: true,
    },
  ];

/* =========================
   WEATHER FORECAST
========================= */

export const mosquitoWeatherForecast =
  [
    {
      day: "Hôm nay",

      temperature: 29,

      humidity: 81,

      rainProbability: 72,

      suitability:
        "high" as RiskLevel,
    },

    {
      day: "Ngày mai",

      temperature: 30,

      humidity: 78,

      rainProbability: 65,

      suitability:
        "high" as RiskLevel,
    },

    {
      day: "T3",

      temperature: 31,

      humidity: 71,

      rainProbability: 42,

      suitability:
        "medium" as RiskLevel,
    },

    {
      day: "T4",

      temperature: 30,

      humidity: 68,

      rainProbability: 25,

      suitability:
        "medium" as RiskLevel,
    },
  ];