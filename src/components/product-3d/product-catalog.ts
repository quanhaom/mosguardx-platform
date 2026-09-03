export type ProductPartId =
  | "shellBody"
  | "lid"
  | "frame"
  | "fan"
  | "camera"
  | "sensor_humidity"
  | "power"
  | "main"
  | "whiteLed"
  | "attractLed"
  | "baitBox"
  | "sensor_temperature"
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
    nodeNames: [
      "MGX_Shell_Body",
      "MGX_Body",
      "MGX_ENCLOSURE_BODY",
      "body",
      "Cut",
    ],
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
    nodeNames: [
      "MGX_Shell_Lid",
      "MGX_Lid",
      "MGX_Cover",
      "MGX_LID",
    ],
    label: "Nắp kỹ thuật",
    code: "MGX-LID",
    category: "Cơ khí",
    summary: "Cho phép tiếp cận khoang linh kiện để kiểm tra và bảo trì.",
    details:
      "Nhấn chuột trái trực tiếp lên nắp để tháo nắp ra khỏi thân hoặc gắn trở lại vị trí đóng.",
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
    nodeNames: ["MGX_Fan", "Fan", "MGX_fan"],
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
    nodeNames: [
      "MGX_CAMERA"],
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
    id: "sensor_humidity",
    nodeNames: [
      "MGX_SENSOR_HUMIDITY",
    ],
    label: "Cảm biến độ ẩm",
    code: "MGX-Sensor-humidity",
    category: "Môi trường",
    summary: "Đo độ ẩm tại vị trí đặt trạm.",
    details:
      "Dữ liệu vi khí hậu được gắn với từng lượt ghi nhận để phân tích điều kiện thuận lợi cho hoạt động của muỗi.",
    accent: "#fbbf24",
    explodedOffset: [-0.7, -0.04, 0.2],
    interaction: "explode",
  },
  {
    id: "main",
    nodeNames: [
      "XIAO-ESP32S3-Sense v001",
      "MGX_MAIN",
      "XIAO-ESP32S3-Sense v24",
    ],
    label: "Vi xử lý ESP32-S3",
    code: "MGX-ESP32",
    category: "Điện tử",
    summary:
      "Bộ điều khiển trung tâm của trạm, chịu trách nhiệm chụp ảnh, đọc cảm biến, điều khiển quạt và LED, sau đó gửi dữ liệu lên hệ thống AI.",
    details:
      "ESP32-S3 điều phối hoạt động của các linh kiện theo chương trình đã cấu hình, đồng thời tổng hợp và truyền dữ liệu lên hệ thống trung tâm.",
    accent: "#fb7195",
    explodedOffset: [0.82, 0.12, -0.08],
    interaction: "explode",
  },
  {
    id: "power",
    nodeNames: ["MGX-USB-C"],
    label: "Module nguồn",
    code: "MGX-USB-C",
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
    nodeNames: ["MGX_LED_White"],
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
    nodeNames: [ "MGX_LED"],
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
    nodeNames: [ "MGX_BOX"],
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
    id: "sensor_temperature",
    nodeNames: ["MGX_SENSOR_TEMPERATURE"],
    label: "Cảm biến",
    code: "MGX-sensor-temperature",
    category: "Môi trường",
    summary: "Ghi nhận thông tin môi trường tại trạm để cảm báo điều kiện thuận lợi cho muỗi phát triển.",
    details:
      "Cảm biến nhiệt độ đặt riêng để ghi nhận nhiệt độ theo thời gian thực từ môi trường, hỗ trợ dự đoán, cảnh bảo nguy cơ bùng phát dịch bệnh về muỗi.",
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
