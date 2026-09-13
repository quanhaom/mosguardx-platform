export type EnterpriseSite = {
  id: string;
  name: string;
  location: string;
  manager: string;
  devices: number;
  onlineDevices: number;
  activityIndex: number;
  risk: "Low" | "Medium" | "High";
};

export type EnterpriseDevice = {
  id: string;
  name: string;
  siteId: string;
  siteName: string;
  status: "Online" | "Offline" | "Maintenance";
  signal: number;
  lastSync: string;
};

export type EnterpriseAlert = {
  id: string;
  severity: "High" | "Medium" | "Low";
  title: string;
  site: string;
  time: string;
  status: "Open" | "Reviewing" | "Resolved";
};

export type MaintenanceJob = {
  id: string;
  device: string;
  site: string;
  task: string;
  due: string;
  status: "Scheduled" | "Due soon" | "Completed";
};

export const enterpriseSites: EnterpriseSite[] = [
  {
    id: "site-hn-01",
    name: "Office Building A",
    location: "Hà Nội",
    manager: "Nguyễn Minh Anh",
    devices: 4,
    onlineDevices: 4,
    activityIndex: 28,
    risk: "Low",
  },
  {
    id: "site-hn-02",
    name: "Hotel Site B",
    location: "Hà Nội",
    manager: "Trần Đức Long",
    devices: 5,
    onlineDevices: 4,
    activityIndex: 63,
    risk: "Medium",
  },
  {
    id: "site-hn-03",
    name: "Facility C",
    location: "Hà Nội",
    manager: "Lê Ngọc Hà",
    devices: 3,
    onlineDevices: 2,
    activityIndex: 81,
    risk: "High",
  },
];

export const enterpriseDevices: EnterpriseDevice[] = [
  {
    id: "MGX-E-001",
    name: "MGX Station 01",
    siteId: "site-hn-01",
    siteName: "Office Building A",
    status: "Online",
    signal: 92,
    lastSync: "2 phút trước",
  },
  {
    id: "MGX-E-002",
    name: "MGX Station 02",
    siteId: "site-hn-01",
    siteName: "Office Building A",
    status: "Online",
    signal: 88,
    lastSync: "3 phút trước",
  },
  {
    id: "MGX-E-003",
    name: "MGX Station 03",
    siteId: "site-hn-01",
    siteName: "Office Building A",
    status: "Online",
    signal: 86,
    lastSync: "4 phút trước",
  },
  {
    id: "MGX-E-004",
    name: "MGX Station 04",
    siteId: "site-hn-01",
    siteName: "Office Building A",
    status: "Online",
    signal: 81,
    lastSync: "5 phút trước",
  },
  {
    id: "MGX-E-005",
    name: "MGX Station 05",
    siteId: "site-hn-02",
    siteName: "Hotel Site B",
    status: "Online",
    signal: 79,
    lastSync: "2 phút trước",
  },
  {
    id: "MGX-E-006",
    name: "MGX Station 06",
    siteId: "site-hn-02",
    siteName: "Hotel Site B",
    status: "Online",
    signal: 75,
    lastSync: "7 phút trước",
  },
  {
    id: "MGX-E-007",
    name: "MGX Station 07",
    siteId: "site-hn-02",
    siteName: "Hotel Site B",
    status: "Maintenance",
    signal: 54,
    lastSync: "42 phút trước",
  },
  {
    id: "MGX-E-008",
    name: "MGX Station 08",
    siteId: "site-hn-02",
    siteName: "Hotel Site B",
    status: "Online",
    signal: 84,
    lastSync: "5 phút trước",
  },
  {
    id: "MGX-E-009",
    name: "MGX Station 09",
    siteId: "site-hn-02",
    siteName: "Hotel Site B",
    status: "Online",
    signal: 72,
    lastSync: "8 phút trước",
  },
  {
    id: "MGX-E-010",
    name: "MGX Station 10",
    siteId: "site-hn-03",
    siteName: "Facility C",
    status: "Online",
    signal: 77,
    lastSync: "4 phút trước",
  },
  {
    id: "MGX-E-011",
    name: "MGX Station 11",
    siteId: "site-hn-03",
    siteName: "Facility C",
    status: "Online",
    signal: 68,
    lastSync: "6 phút trước",
  },
  {
    id: "MGX-E-012",
    name: "MGX Station 12",
    siteId: "site-hn-03",
    siteName: "Facility C",
    status: "Offline",
    signal: 0,
    lastSync: "1 giờ trước",
  },
];

export const enterpriseAlerts: EnterpriseAlert[] = [
  {
    id: "ALT-001",
    severity: "High",
    title: "Mosquito activity increased",
    site: "Facility C",
    time: "12 phút trước",
    status: "Open",
  },
  {
    id: "ALT-002",
    severity: "Medium",
    title: "Device MGX-E-012 offline",
    site: "Facility C",
    time: "1 giờ trước",
    status: "Reviewing",
  },
  {
    id: "ALT-003",
    severity: "Medium",
    title: "Maintenance threshold reached",
    site: "Hotel Site B",
    time: "2 giờ trước",
    status: "Open",
  },
  {
    id: "ALT-004",
    severity: "Low",
    title: "Activity trend increased",
    site: "Hotel Site B",
    time: "4 giờ trước",
    status: "Resolved",
  },
];

export const enterpriseMaintenance: MaintenanceJob[] = [
  {
    id: "JOB-001",
    device: "MGX-E-007",
    site: "Hotel Site B",
    task: "Inspect airflow & chamber",
    due: "Hôm nay",
    status: "Due soon",
  },
  {
    id: "JOB-002",
    device: "MGX-E-012",
    site: "Facility C",
    task: "Connectivity inspection",
    due: "Hôm nay",
    status: "Scheduled",
  },
  {
    id: "JOB-003",
    device: "MGX-E-003",
    site: "Office Building A",
    task: "Routine inspection",
    due: "17/09",
    status: "Scheduled",
  },
];