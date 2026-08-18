import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const incomingForm = await request.formData();
    const file = incomingForm.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { detail: "Vui lòng chọn ảnh cần nhận diện." },
        { status: 400 },
      );
    }

    const confidence =
      incomingForm.get("confidence")?.toString() ?? "0.35";

    const iou =
      incomingForm.get("iou")?.toString() ?? "0.45";

    const apiUrl =
      process.env.AI_API_URL ?? "http://127.0.0.1:8000";

    const outgoingForm = new FormData();
    outgoingForm.append("file", file, file.name);

    const response = await fetch(
      `${apiUrl}/v1/predict?confidence=${encodeURIComponent(
        confidence,
      )}&iou=${encodeURIComponent(iou)}`,
      {
        method: "POST",
        body: outgoingForm,
        cache: "no-store",
      },
    );

    const body = await response.json().catch(() => ({
      detail: "AI API trả về dữ liệu không hợp lệ.",
    }));

    return NextResponse.json(body, {
      status: response.status,
    });
  } catch (error) {
    console.error("AI proxy error:", error);

    return NextResponse.json(
      {
        detail:
          "Không thể kết nối AI API. Hãy kiểm tra FastAPI đang chạy ở cổng 8000.",
      },
      { status: 503 },
    );
  }
}