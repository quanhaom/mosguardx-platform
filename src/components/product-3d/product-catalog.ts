export type ProductPartId =
  | "shellBody"
  | "lid"
  | "frame"
  | "fan"
  | "camera"
  | "sensor"
  | "power"
  | "whiteLed"
  | "attractLed"
  | "baitBox"
  | "trapChamber"
  | "grille";

export type ProductPart = {
  id: ProductPartId;
  nodeNames: string[];
  label: string;
  code: string;
  category: string;
  summary: string;
  details: string;
  accent: string;
  /** Offset is expressed as a fraction of the complete model size. */
  explodedOffset: readonly [number, number, number];
  interaction: "fixed" | "lid" | "explode";
};

export const PRODUCT_PARTS: readonly ProductPart[] = [
  {
    id: "shellBody",
    nodeNames: ["MGX_Shell_Body", "MGX_Body"],
    label: "Vỏ thiết bị",
    code: "MGX-SHELL",
    category: "Cơ khí",
    summary: "Bảo vệ linh kiện và định hình luồng khí bên trong trạm.",
    details:
      "Vỏ ngoài được điều khiển độc lập giữa hai chế độ hiển thị: nguyên bản và trong suốt 70% để quan sát cấu trúc bên trong.",
    accent: "#34d399",
    explodedOffset: [0, 0, 0],
    interaction: "fixed",
  },
  {
    id: "lid",
    nodeNames: ["MGX_Shell_Lid", "MGX_Lid", "MGX_Cover"],
    label: "Nắp kỹ thuật",
    code: "MGX-LID",
    category: "Cơ khí",
    summary: "Cho phép tiếp cận khoang linh kiện để kiểm tra và bảo trì.",
    details:
      "Nhấn chuột trái trực tiếp lên nắp để mở hoặc đóng. Chuyển động sử dụng bản lề ảo và giới hạn góc mở 110°.",
    accent: "#6ee7b7",
    explodedOffset: [0, 0, 0],
    interaction: "lid",
  },
  {
    id: "frame",
    nodeNames: ["MGX_Internal_Frame", "MGX_Frame"],
    label: "Khung gá bên trong",
    code: "MGX-FRAME",
    category: "Cơ khí",
    summary: "Cố định bo mạch, cảm biến, quạt và các khoang chức năng.",
    details:
      "Khung giữ khoảng cách giữa các linh kiện, hỗ trợ bảo trì và hạn chế rung trong quá trình quạt hoạt động.",
    accent: "#94a3b8",
    explodedOffset: [0.58, 0.04, 0.02],
    interaction: "explode",
  },
  {
    id: "fan",
    nodeNames: ["MGX_Fan", "Fan"],
    label: "Quạt dẫn dòng",
    code: "MGX-FAN",
    category: "Luồng khí",
    summary: "Tạo dòng hút đưa muỗi từ cửa vào khoang giữ mẫu.",
    details:
      "Quạt không chỉ khuếch tán mùi mồi mà còn tạo chênh áp để kéo cá thể đã tiếp cận cửa hút vào khoang bẫy.",
    accent: "#38bdf8",
    explodedOffset: [0.75, 0.18, 0.08],
    interaction: "explode",
  },
  {
    id: "camera",
    nodeNames: ["MGX_ESP32_CAM", "MGX_Camera", "ESP32_CAM"],
    label: "ESP32-CAM",
    code: "MGX-CAM",
    category: "Thị giác máy tính",
    summary: "Ghi hình mẫu để đếm cá thể và gửi ảnh lên AI cloud.",
    details:
      "Camera chụp ảnh tại vùng quan sát có kiểm soát ánh sáng. Backend phân tích ảnh, nhận diện nhóm loài và lưu kết quả theo trạm.",
    accent: "#a78bfa",
    explodedOffset: [-0.72, 0.2, 0.12],
    interaction: "explode",
  },
  {
    id: "sensor",
    nodeNames: ["MGX_SHT31", "SHT31", "MGX_Temperature_Humidity"],
    label: "Cảm biến SHT31",
    code: "MGX-SHT31",
    category: "Môi trường",
    summary: "Đo nhiệt độ và độ ẩm tại vị trí đặt trạm.",
    details:
      "Dữ liệu vi khí hậu được gắn với từng lượt ghi nhận để phân tích điều kiện thuận lợi cho hoạt động của muỗi.",
    accent: "#fbbf24",
    explodedOffset: [-0.7, -0.04, 0.2],
    interaction: "explode",
  },
  {
    id: "power",
    nodeNames: ["MGX_Power_Module", "MGX_Power", "Power_Module"],
    label: "Module nguồn",
    code: "MGX-POWER",
    category: "Điện tử",
    summary: "Ổn áp và phân phối nguồn cho camera, cảm biến, LED và quạt.",
    details:
      "Khối nguồn được đặt tách khỏi khoang mồi và luồng ẩm, giúp hệ thống vận hành ổn định trong các phiên theo dõi dài.",
    accent: "#fb7185",
    explodedOffset: [-0.62, -0.36, 0.12],
    interaction: "explode",
  },
  {
    id: "whiteLed",
    nodeNames: ["MGX_LED_White", "LED_White"],
    label: "LED trắng",
    code: "MGX-LED-W",
    category: "Chiếu sáng",
    summary: "Cung cấp ánh sáng ổn định cho vùng camera chụp ảnh.",
    details:
      "LED trắng chỉ bật trong thời gian chụp để giảm nhiễu ánh sáng và tạo ảnh có độ tương phản phù hợp cho mô hình AI.",
    accent: "#f8fafc",
    explodedOffset: [0.44, 0.52, 0.14],
    interaction: "explode",
  },
  {
    id: "attractLed",
    nodeNames: ["MGX_LED_Attract", "MGX_LED_UV", "LED_Attract"],
    label: "LED dẫn dụ",
    code: "MGX-LED-A",
    category: "Dẫn dụ",
    summary: "Tạo tín hiệu quang hỗ trợ thu hút muỗi tới vùng cửa hút.",
    details:
      "Dải LED tím hoạt động cùng hộp mồi và luồng khí. Cường độ và lịch bật có thể điều chỉnh theo kịch bản thực nghiệm.",
    accent: "#c084fc",
    explodedOffset: [-0.42, 0.52, 0.16],
    interaction: "explode",
  },
  {
    id: "baitBox",
    nodeNames: ["MGX_Bait_Box", "MGX_Bait", "Bait_Box"],
    label: "Hộp mồi dẫn dụ",
    code: "MGX-BAIT",
    category: "Dẫn dụ",
    summary: "Chứa mồi và hỗ trợ phát tán mùi theo luồng khí kiểm soát.",
    details:
      "Hộp mồi là module tháo rời để thay công thức dẫn dụ giữa các phiên thực nghiệm mà không ảnh hưởng khoang điện tử.",
    accent: "#f59e0b",
    explodedOffset: [0, -0.62, 0.48],
    interaction: "explode",
  },
  {
    id: "trapChamber",
    nodeNames: ["MGX_Trap_Chamber", "Trap_Chamber"],
    label: "Khoang giữ mẫu",
    code: "MGX-TRAP",
    category: "Thu mẫu",
    summary: "Giữ cá thể sau khi được quạt hút vào thiết bị.",
    details:
      "Khoang giữ mẫu tách khỏi camera và bo mạch, giúp quan sát, vệ sinh và thu hồi mẫu thuận tiện hơn.",
    accent: "#22d3ee",
    explodedOffset: [0.68, -0.18, 0.32],
    interaction: "explode",
  },
  {
    id: "grille",
    nodeNames: ["MGX_Grille", "MGX_Inlet", "Grille"],
    label: "Cửa hút và lưới bảo vệ",
    code: "MGX-INLET",
    category: "Luồng khí",
    summary: "Định hướng cá thể vào cửa hút và bảo vệ phần quạt.",
    details:
      "Hình học cửa vào được thiết kế để không che vùng quan sát, đồng thời hạn chế vật thể lớn tiếp xúc trực tiếp với cánh quạt.",
    accent: "#2dd4bf",
    explodedOffset: [0, 0.04, 0.74],
    interaction: "explode",
  },
] as const;

export const PRODUCT_PART_BY_ID = new Map(
  PRODUCT_PARTS.map((part) => [part.id, part]),
);
