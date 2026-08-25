import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const apiUrl = (
    process.env.AI_API_URL ?? "http://127.0.0.1:8000"
  ).replace(/\/$/, "");

  try {
    const response = await fetch(`${apiUrl}/health/live`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const contentType =
      response.headers.get("content-type") ?? "";

    const responseText = await response.text();

    if (!contentType.includes("application/json")) {
      console.error(
        "FastAPI returned non-JSON response:",
        responseText,
      );

      return NextResponse.json(
        {
          status: "error",
          service: "MosGuardX AI API",
          version: "unknown",
          model_loaded: false,
          detail:
            "FastAPI không trả về JSON tại /health/live.",
        },
        { status: 502 },
      );
    }

    let body: unknown;

    try {
      body = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          status: "error",
          service: "MosGuardX AI API",
          version: "unknown",
          model_loaded: false,
          detail: "FastAPI trả về JSON không hợp lệ.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(body, {
      status: response.status,
    });
  } catch (error) {
    console.error("AI health proxy error:", error);

    return NextResponse.json(
      {
        status: "offline",
        service: "MosGuardX AI API",
        version: "unknown",
        model_loaded: false,
        detail:
          "Next.js không thể kết nối đến FastAPI.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown connection error",
      },
      { status: 503 },
    );
  }
}