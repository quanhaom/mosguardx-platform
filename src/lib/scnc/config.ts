export type SCNCGuidanceMode =
  | "full"
  | "manual"
  | "off";

export type SCNCSettings = {
  guidance: SCNCGuidanceMode;
  importantAlerts: boolean;
};

export type SCNCCorner =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type SCNCText = {
  vi: string;
  en: string;
};

export type SCNCTrigger =
  | "scroll"
  | "visible"
  | "page";

export type SCNCTourStep = {
  id: string;

  routes: string[];

  target?: string;

  trigger: SCNCTrigger;

  corner: SCNCCorner;

  highlight?: boolean;

  message: SCNCText;
};

export const SCNC_STORAGE = {
  settings:
    "mosguardx-scnc-settings",

  completed:
    "mosguardx-scnc-tour-completed",

  route:
    "mosguardx-scnc-tour-route",

  step:
    "mosguardx-scnc-tour-step",
};

export const DEFAULT_SCNC_SETTINGS: SCNCSettings = {
  guidance: "full",
  importantAlerts: true,
};

export const SCNC_COPY = {
  assistantTitle: {
    vi:
      "Trợ lý MosGuardX",

    en:
      "MosGuardX Assistant",
  },

  stopGuide: {
    vi:
      "Không xem hướng dẫn nữa",

    en:
      "Stop guidance",
  },

  continueGuide: {
    vi:
      "Xem tiếp hướng dẫn",

    en:
      "Continue guide",
  },

  hideSCNC: {
    vi:
      "Ẩn SCNC",

    en:
      "Hide SCNC",
  },

  showSCNC: {
    vi:
      "Hiện SCNC",

    en:
      "Show SCNC",
  },

  backWebsite: {
    vi:
      "Website MosGuardX",

    en:
      "MosGuardX website",
  },
} satisfies Record<
  string,
  SCNCText
>;


/* =========================================================
   MAIN WEBSITE
========================================================= */

const websiteTour: SCNCTourStep[] = [
  {
    id: "website-hero",

    routes: ["/"],

    target: "#hero",

    trigger: "scroll",

    corner: "top-left",

    message: {
      vi:
        "Xin chào! Mình là SCNC. Mình sẽ đồng hành cùng bạn để khám phá cách MosGuardX hoạt động.",

      en:
        "Hi! I'm SCNC. I'll guide you through how MosGuardX works.",
    },
  },

  {
    id: "website-problem",

    routes: ["/"],

    target: "#problem",

    trigger: "scroll",

    corner: "top-right",

    message: {
      vi:
        "Dữ liệu muỗi truyền thống thường rời rạc và phụ thuộc nhiều vào khảo sát thủ công. Đây là khoảng trống MosGuardX muốn giải quyết.",

      en:
        "Traditional mosquito surveillance is often fragmented and labor-intensive. This is the gap MosGuardX aims to address.",
    },
  },

  {
    id: "website-product",

    routes: ["/"],

    target: "#product",

    trigger: "scroll",

    corner: "bottom-left",

    message: {
      vi:
        "Đây là thiết bị MosGuardX, nơi dữ liệu thực địa được thu nhận từ camera, cảm biến và hệ thống IoT.",

      en:
        "This is the MosGuardX device, where field data is collected through imaging, sensors, and IoT.",
    },
  },

  /*
   * PRODUCT 3D BUTTON
   */
  {
    id: "website-product-3d",

    routes: ["/"],

    target:
      '#product a[href="/product-3d"]',

    trigger: "visible",

    corner: "top-right",

    highlight: true,

    message: {
      vi:
        "Bạn có thể nhấn vào nút này để xem mô hình 3D của thiết bị và khám phá cấu trúc sản phẩm trực quan hơn.",

      en:
        "Select this button to explore the 3D device model and inspect the product structure in more detail.",
    },
  },

  {
    id: "website-solution",

    routes: ["/"],

    target: "#solution",

    trigger: "scroll",

    corner: "top-left",

    message: {
      vi:
        "Luồng xử lý bắt đầu từ dẫn dụ và thu nhận mẫu, sau đó AI phân tích, dữ liệu được đồng bộ và chuyển thành cảnh báo.",

      en:
        "The workflow starts with attraction and capture, followed by AI analysis, synchronization, and alerts.",
    },
  },

  {
    id: "website-ai",

    routes: ["/"],

    target: "#ai",

    trigger: "scroll",

    corner: "bottom-right",

    message: {
      vi:
        "AI hỗ trợ phát hiện và phân loại muỗi từ hình ảnh. Kết quả được lưu cùng độ tin cậy và thông tin liên quan để có thể kiểm tra lại.",

      en:
        "AI assists with image-based mosquito detection and classification while preserving confidence and related information for verification.",
    },
  },

  {
    id: "website-demo",

    routes: ["/"],

    target: "#demo",

    trigger: "scroll",

    corner: "top-right",

    message: {
      vi:
        "Đây là phần trình diễn hệ thống. Bạn có thể xem cách một sự kiện từ thiết bị được đưa vào nền tảng MosGuardX.",

      en:
        "This section demonstrates how an event from the device flows into the MosGuardX platform.",
    },
  },

  /*
   * VIDEO PLAYER
   */
  {
    id: "website-demo-video",

    routes: ["/"],

    target:
      "#demo video",

    trigger: "visible",

    corner: "bottom-left",

    highlight: true,

    message: {
      vi:
        "Bạn có thể nhấn Play tại đây để xem video demo MVP và theo dõi luồng hoạt động thực tế của hệ thống.",

      en:
        "Press Play here to watch the MVP demo and see the system workflow in action.",
    },
  },

  {
    id: "website-experiment",

    routes: ["/"],

    target: "#experiment",

    trigger: "scroll",

    corner: "top-left",

    message: {
      vi:
        "Ở phần thực nghiệm, nhóm kiểm chứng từng thành phần trước khi tích hợp thành hệ thống hoàn chỉnh.",

      en:
        "This section shows how individual components are validated before full-system integration.",
    },
  },

  {
    id: "website-platforms",

    routes: ["/"],

    target: "#segments",

    trigger: "scroll",

    corner: "bottom-right",

    message: {
      vi:
        "MosGuardX dùng một lõi dữ liệu chung nhưng cung cấp ba trải nghiệm riêng cho hộ gia đình, doanh nghiệp và mạng lưới y tế công cộng.",

      en:
        "MosGuardX uses one shared data core while providing dedicated experiences for households, businesses, and public-health networks.",
    },
  },

  {
    id: "website-open-home",

    routes: ["/"],

    target:
      '#segments a[href="/household"]',

    trigger: "visible",

    corner: "top-left",

    highlight: true,

    message: {
      vi:
        "Nhấn vào đây nếu bạn muốn khám phá MosGuardX Home dành cho hộ gia đình.",

      en:
        "Select here to explore MosGuardX Home for households.",
    },
  },

  {
    id: "website-open-enterprise",

    routes: ["/"],

    target:
      '#segments a[href="/enterprise"]',

    trigger: "visible",

    corner: "top-right",

    highlight: true,

    message: {
      vi:
        "Đây là MosGuardX Enterprise dành cho doanh nghiệp và các đơn vị vận hành nhiều địa điểm.",

      en:
        "This opens MosGuardX Enterprise for businesses and multi-site operators.",
    },
  },

  {
    id: "website-open-command",

    routes: ["/"],

    target:
      '#segments a[href="/dashboard"]',

    trigger: "visible",

    corner: "bottom-left",

    highlight: true,

    message: {
      vi:
        "Bạn có thể mở Command Center tại đây để xem trải nghiệm giám sát mạng lưới ở quy mô lớn.",

      en:
        "Open the Command Center here to explore network-scale monitoring.",
    },
  },

  {
    id: "website-business",

    routes: ["/"],

    target: "#business",

    trigger: "scroll",

    corner: "top-left",

    message: {
      vi:
        "Mô hình triển khai kết hợp thiết bị, nền tảng phần mềm, vận hành và bảo trì theo nhu cầu từng nhóm khách hàng.",

      en:
        "The deployment model combines hardware, software, operations, and maintenance according to customer needs.",
    },
  },

  {
    id: "website-expansion",

    routes: ["/"],

    target: "#expansion",

    trigger: "scroll",

    corner: "bottom-right",

    message: {
      vi:
        "Khi mạng lưới trạm mở rộng, MosGuardX có thể hình thành bức tranh nguy cơ trên phạm vi lớn hơn.",

      en:
        "As the station network expands, MosGuardX can build a broader view of mosquito risk.",
    },
  },

  {
    id: "website-team",

    routes: ["/"],

    target: "#team",

    trigger: "scroll",

    corner: "top-right",

    message: {
      vi:
        "MosGuardX được phát triển theo hướng kết hợp AI, IoT, phần cứng, phần mềm và mô hình kinh doanh trong cùng một hệ sinh thái.",

      en:
        "MosGuardX combines AI, IoT, hardware, software, and business development within one ecosystem.",
    },
  },
];


/* =========================================================
   HOUSEHOLD
========================================================= */

const householdTour: SCNCTourStep[] = [
  {
    id: "household-intro",

    routes: [
      "/household",
    ],

    trigger: "page",

    corner: "top-left",

    message: {
      vi:
        "Bạn đang ở MosGuardX Home — trải nghiệm dành cho hộ gia đình.",

      en:
        "You're now in MosGuardX Home, the experience designed for households.",
    },
  },

  {
    id: "household-open-app",

    routes: [
      "/household",
    ],

    target:
      'a[href="/home"]',

    trigger: "visible",

    corner: "bottom-right",

    highlight: true,

    message: {
      vi:
        "Nhấn vào đây để mở ứng dụng Home và xem dữ liệu hoạt động muỗi, thiết bị và cảnh báo.",

      en:
        "Select here to open the Home app and view mosquito activity, devices, and alerts.",
    },
  },
];


/* =========================================================
   HOME APP
========================================================= */

const homeTour: SCNCTourStep[] = [
  {
    id: "home-main",

    routes: [
      "/home",
      "/activity",
      "/my-device",
      "/home-alerts",
      "/home-settings",
    ],

    trigger: "page",

    corner: "bottom-right",

    message: {
      vi:
        "Đây là ứng dụng MosGuardX Home. Bạn có thể theo dõi hoạt động muỗi, thiết bị và cảnh báo của gia đình tại đây.",

      en:
        "This is the MosGuardX Home app for household mosquito activity, devices, and alerts.",
    },
  },

  {
    id: "home-activity",

    routes: [
      "/home",
    ],

    target:
      'a[href="/activity"]',

    trigger: "visible",

    corner: "top-left",

    highlight: true,

    message: {
      vi:
        "Mở Hoạt động để xem diễn biến số lượng và xu hướng muỗi theo thời gian.",

      en:
        "Open Activity to view mosquito counts and trends over time.",
    },
  },

  {
    id: "home-device",

    routes: [
      "/home",
    ],

    target:
      'a[href="/my-device"]',

    trigger: "visible",

    corner: "bottom-left",

    highlight: true,

    message: {
      vi:
        "Mục Thiết bị giúp bạn kiểm tra trạng thái thiết bị MosGuardX trong gia đình.",

      en:
        "Devices lets you check the status of household MosGuardX stations.",
    },
  },

  {
    id: "home-alerts",

    routes: [
      "/home",
    ],

    target:
      'a[href="/home-alerts"]',

    trigger: "visible",

    corner: "top-right",

    highlight: true,

    message: {
      vi:
        "Mở Cảnh báo để xem những thay đổi đáng chú ý mà hệ thống phát hiện.",

      en:
        "Open Alerts to review noteworthy changes detected by the system.",
    },
  },
];


/* =========================================================
   ENTERPRISE
========================================================= */

const enterpriseTour: SCNCTourStep[] = [
  {
    id: "enterprise-main",

    routes: [
      "/enterprise",
    ],

    trigger: "page",

    corner: "top-right",

    message: {
      vi:
        "MosGuardX Enterprise dành cho tổ chức cần quản lý nhiều site, thiết bị và hoạt động vận hành.",

      en:
        "MosGuardX Enterprise is designed for organizations managing multiple sites, devices, and operations.",
    },
  },

  {
    id: "enterprise-open-app",

    routes: [
      "/enterprise",
    ],

    target:
      'a[href="/enterprise/app"]',

    trigger: "visible",

    corner: "bottom-left",

    highlight: true,

    message: {
      vi:
        "Nhấn vào đây để mở workspace Enterprise và xem cách quản lý nhiều site trong cùng một hệ thống.",

      en:
        "Select here to open the Enterprise workspace and explore multi-site management.",
    },
  },
];

const enterpriseAppTour: SCNCTourStep[] = [
  {
    id: "enterprise-app-main",

    routes: [
      "/enterprise/app",
      "/enterprise/app/*",
    ],

    trigger: "page",

    corner: "bottom-right",

    message: {
      vi:
        "Đây là workspace Enterprise. Site, thiết bị, cảnh báo, bảo trì và báo cáo được quản lý tập trung tại đây.",

      en:
        "This is the Enterprise workspace for centralized sites, devices, alerts, maintenance, and reports.",
    },
  },
];


/* =========================================================
   COMMAND CENTER
========================================================= */

const commandCenterTour: SCNCTourStep[] = [
  {
    id: "command-main",

    routes: [
      "/dashboard",
    ],

    trigger: "page",

    corner: "top-left",

    message: {
      vi:
        "Đây là MosGuardX Command Center — trung tâm giám sát mạng lưới trạm và nguy cơ ở quy mô lớn.",

      en:
        "This is the MosGuardX Command Center for network-scale monitoring.",
    },
  },

  {
    id: "command-map",

    routes: [
      "/dashboard",
    ],

    target:
      'a[href="/map"]',

    trigger: "visible",

    corner: "top-right",

    highlight: true,

    message: {
      vi:
        "Nhấn Bản đồ giám sát để xem vị trí các trạm và thông tin theo khu vực.",

      en:
        "Open the Monitoring Map to view station locations and regional information.",
    },
  },

  {
    id: "command-alerts",

    routes: [
      "/dashboard",
    ],

    target:
      'a[href="/alerts"]',

    trigger: "visible",

    corner: "bottom-left",

    highlight: true,

    message: {
      vi:
        "Mục Cảnh báo giúp bạn ưu tiên những sự kiện hoặc khu vực cần được chú ý.",

      en:
        "Alerts helps prioritize events or areas requiring attention.",
    },
  },

  {
    id: "command-devices",

    routes: [
      "/dashboard",
    ],

    target:
      'a[href="/devices"]',

    trigger: "visible",

    corner: "top-left",

    highlight: true,

    message: {
      vi:
        "Mạng lưới trạm cho phép kiểm tra tình trạng các thiết bị đang triển khai.",

      en:
        "The station network lets you inspect deployed device status.",
    },
  },

  {
    id: "command-ai",

    routes: [
      "/dashboard",
    ],

    target:
      'a[href="/ai-api"]',

    trigger: "visible",

    corner: "bottom-right",

    highlight: true,

    message: {
      vi:
        "AI / API là khu vực kết nối lớp nhận diện với dữ liệu và các hệ thống tích hợp.",

      en:
        "AI / API connects recognition services with data and integration systems.",
    },
  },
];


/* =========================================================
   ALL STEPS
========================================================= */

export const scncTourSteps: SCNCTourStep[] = [
  ...websiteTour,
  ...householdTour,
  ...homeTour,
  ...enterpriseTour,
  ...enterpriseAppTour,
  ...commandCenterTour,
];


/* =========================================================
   ROUTES
========================================================= */

export function matchesSCNCRoute(
  pathname: string,
  route: string,
) {
  if (
    route.endsWith("/*")
  ) {
    const base =
      route.slice(
        0,
        -2,
      );

    return (
      pathname === base ||
      pathname.startsWith(
        `${base}/`,
      )
    );
  }

  return pathname === route;
}


export function getSCNCStepsForRoute(
  pathname: string,
) {
  return scncTourSteps.filter(
    (step) =>
      step.routes.some(
        (route) =>
          matchesSCNCRoute(
            pathname,
            route,
          ),
      ),
  );
}