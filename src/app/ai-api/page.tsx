"use client";

import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  ImageIcon,
  LoaderCircle,
  Server,
  ShieldAlert,
  Upload,
  XCircle,
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLanguage } from "@/components/i18n/language-context";

type ApiHealth = {
  status: string;
  service: string;
  version: string;
  model_loaded: boolean;
  backend_connected?: boolean;
  classifier_loaded?: boolean;
  classifier_model_version?: string | null;
  detail?: string;
};

type BoundingBox = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type Detection = {
  object: string;
  class_id: number;
  species: string;
  confidence: number;
  detector_confidence?: number | null;
  classification_confidence?: number | null;
  classification_model_version?: string | null;
  review_required?: boolean;
  bounding_box: BoundingBox;
};

type PredictionResponse = {
  prediction_id: string;
  model_version: string;
  image: {
    filename: string;
    width: number;
    height: number;
  };
  mosquito_count: number;
  detections: Detection[];
  inference_ms: number;
};

const speciesNames: Record<string, string> = {
  aegypti: "Aedes aegypti",
  "aedes-aegypti": "Aedes aegypti",

  albopictus: "Aedes albopictus",
  "aedes-albopictus": "Aedes albopictus",

  culex: "Culex",
  anopheles: "Anopheles",
  culiseta: "Culiseta",

  "japonicus-koreicus": "Aedes japonicus/koreicus",
  japonicus_koreicus: "Aedes japonicus/koreicus",
};

const speciesDescriptionsVi: Record<string, string> = {
  aegypti: "Muỗi vằn có liên quan đến nguy cơ sốt xuất huyết.",
  "aedes-aegypti":
    "Muỗi vằn có liên quan đến nguy cơ sốt xuất huyết.",

  albopictus:
    "Muỗi hổ châu Á, thường hoạt động mạnh vào ban ngày.",
  "aedes-albopictus":
    "Muỗi hổ châu Á, thường hoạt động mạnh vào ban ngày.",

  culex:
    "Nhóm muỗi thường xuất hiện gần khu vực nước tù và cống rãnh.",

  anopheles:
    "Nhóm muỗi có liên quan đến nguy cơ truyền bệnh sốt rét.",

  culiseta:
    "Nhóm muỗi thường xuất hiện tại vùng có khí hậu mát hơn.",

  "japonicus-koreicus":
    "Nhóm Aedes xâm lấn cần tiếp tục theo dõi và xác minh.",

  japonicus_koreicus:
    "Nhóm Aedes xâm lấn cần tiếp tục theo dõi và xác minh.",
};

const speciesDescriptionsEn: Record<string, string> = {
  aegypti:
    "Aedes aegypti is associated with dengue transmission risk.",
  "aedes-aegypti":
    "Aedes aegypti is associated with dengue transmission risk.",

  albopictus:
    "The Asian tiger mosquito is often most active during the day.",
  "aedes-albopictus":
    "The Asian tiger mosquito is often most active during the day.",

  culex:
    "This mosquito group is commonly found near stagnant water and drains.",

  anopheles:
    "This mosquito group is associated with malaria transmission risk.",

  culiseta:
    "This mosquito group is commonly found in cooler climates.",

  "japonicus-koreicus":
    "This invasive Aedes group requires further monitoring and verification.",

  japonicus_koreicus:
    "This invasive Aedes group requires further monitoring and verification.",
};

const detectionColors = [
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

function normalizeSpecies(species: string) {
  return species.toLowerCase().trim().replace(/\s+/g, "-");
}

function getSpeciesName(species: string) {
  const normalized = normalizeSpecies(species);

  return speciesNames[normalized] ?? species;
}

function getSpeciesDescription(
  species: string,
  language: "vi" | "en",
) {
  const normalized = normalizeSpecies(species);

  if (language === "en") {
    return (
      speciesDescriptionsEn[normalized] ??
      "The result requires further verification using expert data."
    );
  }

  return (
    speciesDescriptionsVi[normalized] ??
    "Kết quả cần được xác minh thêm bằng dữ liệu chuyên môn."
  );
}

function getDetectionColor(index: number) {
  return detectionColors[index % detectionColors.length];
}

function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, value));
}

async function readJsonResponse(
  response: Response,
  language: "vi" | "en",
) {
  const contentType = response.headers.get("content-type") ?? "";
  const rawText = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      rawText.startsWith("<")
        ? language === "vi"
          ? "Server trả về HTML thay vì JSON. Hãy kiểm tra API route."
          : "The server returned HTML instead of JSON. Check the API route."
        : rawText ||
          (language === "vi"
            ? `Server trả về HTTP ${response.status}`
            : `The server returned HTTP ${response.status}`),
    );
  }

  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error(
      language === "vi"
        ? "Server trả về JSON không hợp lệ."
        : "The server returned invalid JSON.",
    );
  }
}

export default function AiApiPage() {
  const { language, tr } = useLanguage();
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [healthError, setHealthError] = useState("");
  const [checking, setChecking] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [confidence, setConfidence] = useState(0.35);

  const [result, setResult] =
    useState<PredictionResponse | null>(null);

  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState("");

  const speciesSummary = useMemo(() => {
    if (!result) {
      return [];
    }

    const summary = result.detections.reduce<
      Record<string, number>
    >((currentSummary, detection) => {
      const speciesName = getSpeciesName(detection.species);

      currentSummary[speciesName] =
        (currentSummary[speciesName] ?? 0) + 1;

      return currentSummary;
    }, {});

    return Object.entries(summary);
  }, [result]);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    setHealthError("");

    try {
      const response = await fetch("/api/ai/health", {
        cache: "no-store",
      });

      const data = await readJsonResponse(response, language);

      if (!response.ok) {
        const detail =
          typeof data?.detail === "string"
            ? data.detail
            : tr(
                "Không thể kết nối backend AI.",
                "Unable to connect to the AI backend.",
              );

        throw new Error(detail);
      }

      setHealth(data as ApiHealth);
    } catch (error) {
      setHealth(null);

      setHealthError(
        error instanceof Error
          ? error.message
          : tr(
              "Không thể kết nối backend AI.",
              "Unable to connect to the AI backend.",
            ),
      );
    } finally {
      setChecking(false);
    }
  }, [language, tr]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void checkHealth();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [checkHealth]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    setResult(null);
    setPredictError("");

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    if (!selectedFile) {
      setFile(null);
      setPreview("");
      return;
    }

    const acceptedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!acceptedTypes.includes(selectedFile.type)) {
      setFile(null);
      setPreview("");

      setPredictError(
        tr(
          "Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP.",
          "Only JPEG, PNG, or WEBP images are accepted.",
        ),
      );

      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setPreview("");

      setPredictError(
        tr(
          "Dung lượng ảnh không được vượt quá 10 MB.",
          "The image size must not exceed 10 MB.",
        ),
      );

      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  async function submitPrediction(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!file) {
      setPredictError(
        tr(
          "Hãy chọn một ảnh trước khi chạy nhận diện.",
          "Select an image before running detection.",
        ),
      );

      return;
    }

    setPredicting(true);
    setPredictError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("confidence", String(confidence));
      formData.append("iou", "0.45");

      const response = await fetch("/api/ai/predict", {
        method: "POST",
        body: formData,
        cache: "no-store",
      });

      const data = await readJsonResponse(response, language);

      if (!response.ok) {
        const detail =
          typeof data?.detail === "string"
            ? data.detail
            : data?.detail?.message;

        throw new Error(
          detail ??
            tr(
              `Nhận diện thất bại: HTTP ${response.status}`,
              `Detection failed: HTTP ${response.status}`,
            ),
        );
      }

      setResult(data as PredictionResponse);
    } catch (error) {
      setPredictError(
        error instanceof Error
          ? error.message
          : tr(
              "Không thể gọi API nhận diện.",
              "Unable to call the detection API.",
            ),
      );
    } finally {
      setPredicting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-[#10251f] p-7 text-white md:p-9">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-emerald-300">
              MOSGUARDX AI SERVICE
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {tr(
                "Nhận diện và phân loại loài muỗi",
                "Mosquito detection and species classification",
              )}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              {tr(
                "Tải ảnh lên để phát hiện đối tượng, vẽ bounding box, phân loại loài và hiển thị độ tin cậy của model.",
                "Upload an image to detect objects, draw bounding boxes, classify species, and display model confidence.",
              )}
            </p>
          </div>

          <span className="h-fit rounded-full bg-amber-300/10 px-4 py-2 text-xs font-bold text-amber-200">
            {tr(
              "KẾT QUẢ AI CẦN ĐƯỢC XÁC MINH",
              "AI RESULTS REQUIRE VERIFICATION",
            )}
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          icon={Server}
          label="FastAPI + Supabase"
          value={
            checking
              ? tr("Đang kiểm tra", "Checking")
              : health?.backend_connected
                ? tr("Đã kết nối", "Connected")
                : tr("Mất kết nối", "Disconnected")
          }
          tone={
            checking
              ? "pending"
              : health?.backend_connected
                ? "success"
                : "error"
          }
        />

        <StatusCard
          icon={BrainCircuit}
          label={tr("Model phát hiện", "Detection model")}
          value={
            checking
              ? tr("Đang kiểm tra", "Checking")
              : health?.model_loaded
                ? tr("Đã tải model", "Model loaded")
                : tr("Chưa sẵn sàng", "Not ready")
          }
          tone={
            health?.model_loaded ? "success" : "error"
          }
        />

        <StatusCard
          icon={ShieldAlert}
          label="Worker C"
          value={
            checking
              ? tr("Đang kiểm tra", "Checking")
              : health?.classifier_loaded
                ? tr("Đã tải classifier", "Classifier loaded")
                : tr("Chưa sẵn sàng", "Not ready")
          }
          tone={
            health?.classifier_loaded ? "success" : "error"
          }
        />

        <StatusCard
          icon={Activity}
          label={tr("Phiên bản API", "API version")}
          value={health?.version ?? tr("Chưa xác định", "Unknown")}
          tone={health ? "success" : "pending"}
        />
      </section>

      {healthError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <XCircle
            className="mt-0.5 shrink-0"
            size={18}
          />

          <div className="flex-1">
            <strong>
              {tr(
                "Không kết nối được backend AI",
                "Unable to connect to the AI backend",
              )}
            </strong>

            <p className="mt-1">{healthError}</p>

            <p className="mt-2 text-xs">
              {tr(
                "Kiểm tra FastAPI đang chạy tại cổng 8000 và biến AI_API_URL trong .env.local.",
                "Check that FastAPI is running on port 8000 and verify AI_API_URL in .env.local.",
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void checkHealth()}
            className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold"
          >
            {tr("Thử lại", "Retry")}
          </button>
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <form
          onSubmit={submitPrediction}
          className="rounded-3xl border border-slate-200 bg-white p-6"
        >
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Upload size={21} />
            </span>

            <div>
              <h3 className="font-bold text-[#16352a]">
                {tr("Ảnh kiểm thử", "Test image")}
              </h3>

              <p className="text-xs text-slate-500">
                {tr(
                  "JPEG, PNG hoặc WEBP · tối đa 10 MB",
                  "JPEG, PNG, or WEBP · up to 10 MB",
                )}
              </p>
            </div>
          </div>

          <label className="mt-6 flex min-h-[340px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center transition hover:border-emerald-400">
            {preview ? (
              <div className="flex w-full items-center justify-center p-3">
                <div className="relative w-fit max-w-full overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt={tr(
                      "Ảnh kiểm thử nhận diện muỗi",
                      "Mosquito detection test image",
                    )}
                    className="block h-auto max-h-[460px] max-w-full object-contain"
                  />

                  {result?.detections.map(
                    (detection, index) => {
                      const imageWidth =
                        result.image.width || 1;

                      const imageHeight =
                        result.image.height || 1;

                      const x1 = clampPercentage(
                        (detection.bounding_box.x1 /
                          imageWidth) *
                          100,
                      );

                      const y1 = clampPercentage(
                        (detection.bounding_box.y1 /
                          imageHeight) *
                          100,
                      );

                      const x2 = clampPercentage(
                        (detection.bounding_box.x2 /
                          imageWidth) *
                          100,
                      );

                      const y2 = clampPercentage(
                        (detection.bounding_box.y2 /
                          imageHeight) *
                          100,
                      );

                      const width = Math.max(0, x2 - x1);
                      const height = Math.max(0, y2 - y1);
                      const color =
                        getDetectionColor(index);

                      return (
                        <div
                          key={`${detection.species}-${index}`}
                          className="pointer-events-none absolute border-2"
                          style={{
                            left: `${x1}%`,
                            top: `${y1}%`,
                            width: `${width}%`,
                            height: `${height}%`,
                            borderColor: color,
                            boxShadow: `0 0 0 1px ${color}40`,
                          }}
                        >
                          <span
                            className="absolute left-[-2px] top-0 max-w-[220px] -translate-y-full truncate rounded-t-md px-2 py-1 text-[10px] font-bold text-white shadow"
                            style={{
                              backgroundColor: color,
                            }}
                          >
                            {getSpeciesName(
                              detection.species,
                            )}
                            {" · "}
                            {(
                              detection.confidence * 100
                            ).toFixed(1)}
                            %
                          </span>

                          <span
                            className="absolute bottom-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                            style={{
                              backgroundColor: color,
                            }}
                          >
                            {index + 1}
                          </span>
                        </div>
                      );
                    },
                  )}

                  {result &&
                    result.detections.length === 0 && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35">
                        <span className="rounded-xl bg-white/90 px-4 py-2 text-xs font-bold text-slate-700 shadow">
                          {tr(
                            "Không phát hiện đối tượng vượt ngưỡng",
                            "No objects detected above the threshold",
                          )}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <>
                <ImageIcon
                  size={42}
                  className="text-slate-300"
                />

                <strong className="mt-4 text-sm text-[#16352a]">
                  {tr("Nhấn để chọn ảnh", "Click to select an image")}
                </strong>

                <span className="mt-1 text-xs text-slate-400">
                  {tr(
                    "Ảnh chỉ được gửi khi bạn chạy nhận diện",
                    "The image is sent only when you run detection",
                  )}
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={selectImage}
              className="hidden"
            />
          </label>

          {file && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              <strong className="truncate">
                {file.name}
              </strong>

              <span className="ml-3 shrink-0">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <label
                htmlFor="confidence"
                className="text-sm font-bold text-[#16352a]"
              >
                {tr("Ngưỡng tin cậy", "Confidence threshold")}
              </label>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                {Math.round(confidence * 100)}%
              </span>
            </div>

            <input
              id="confidence"
              type="range"
              min="0.05"
              max="0.95"
              step="0.05"
              value={confidence}
              onChange={(event) =>
                setConfidence(
                  Number(event.target.value),
                )
              }
              className="mt-4 w-full accent-emerald-600"
            />

            <div className="mt-2 flex justify-between text-[10px] text-slate-400">
              <span>{tr("Phát hiện nhiều hơn", "More detections")}</span>
              <span>
                {tr("Độ chắc chắn cao hơn", "Higher confidence")}
              </span>
            </div>
          </div>

          {predictError && (
            <div className="mt-5 flex gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <ShieldAlert
                size={18}
                className="shrink-0"
              />

              <p>{predictError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={
              !file ||
              predicting ||
              !health?.model_loaded
            }
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {predicting ? (
              <>
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
                {tr("Đang nhận diện...", "Detecting...")}
              </>
            ) : (
              <>
                <BrainCircuit size={18} />
                {tr("Chạy nhận diện AI", "Run AI detection")}
              </>
            )}
          </button>
        </form>

        <article className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-wider text-emerald-700">
                PREDICTION RESPONSE
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#16352a]">
                {tr("Kết quả nhận diện", "Detection results")}
              </h3>
            </div>

            {result && (
              <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                {tr("Thành công", "Success")}
              </span>
            )}
          </div>

          {!result ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
              <BrainCircuit
                size={50}
                className="text-slate-200"
              />

              <h4 className="mt-5 font-bold text-slate-500">
                {tr("Chưa có kết quả", "No results yet")}
              </h4>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                {tr(
                  "Chọn ảnh và chạy nhận diện để xem bounding box, số lượng, loài dự đoán và độ tin cậy.",
                  "Select an image and run detection to view bounding boxes, counts, predicted species, and confidence scores.",
                )}
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <ResultMetric
                  label={tr("Số đối tượng", "Object count")}
                  value={String(result.mosquito_count)}
                />

                <ResultMetric
                  label={tr("Mô hình", "Model")}
                  value={result.model_version}
                />

                <ResultMetric
                  label={tr("Thời gian", "Inference time")}
                  value={`${result.inference_ms} ms`}
                />
              </div>

              {speciesSummary.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-bold tracking-wider text-slate-400">
                    {tr("PHÂN BỐ THEO LOÀI", "SPECIES DISTRIBUTION")}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {speciesSummary.map(
                      ([species, count], index) => (
                        <span
                          key={species}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#16352a]"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                getDetectionColor(index),
                            }}
                          />

                          {species}

                          <strong className="text-emerald-700">
                            × {count}
                          </strong>
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="mt-7">
                <h4 className="font-bold text-[#16352a]">
                  {tr("Các đối tượng phát hiện", "Detected objects")}
                </h4>

                {result.detections.length === 0 ? (
                  <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                    {tr(
                      "Không phát hiện đối tượng vượt ngưỡng tin cậy.",
                      "No objects were detected above the confidence threshold.",
                    )}
                  </p>
                ) : (
                  <div className="mgx-scrollbar mt-4 max-h-[500px] space-y-3 overflow-y-auto pr-1">
                    {result.detections.map(
                      (detection, index) => {
                        const color =
                          getDetectionColor(index);

                        return (
                          <div
                            key={`${detection.species}-${index}`}
                            className="rounded-2xl border border-slate-200 p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-xs text-slate-400">
                                  {tr("Phát hiện", "Detection")} #{index + 1}
                                </p>

                                <div className="mt-1 flex items-center gap-2">
                                  <span
                                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                                    style={{
                                      backgroundColor:
                                        color,
                                    }}
                                  />

                                  <h5 className="font-bold text-[#16352a]">
                                    {getSpeciesName(
                                      detection.species,
                                    )}
                                  </h5>
                                </div>

                                <p className="mt-1 text-xs text-slate-400">
                                  {tr("Mã lớp", "Class ID")}:{" "}
                                  {detection.class_id}
                                </p>
                              </div>

                              <strong
                                className="text-lg"
                                style={{ color }}
                              >
                                {(
                                  detection.confidence *
                                  100
                                ).toFixed(1)}
                                %
                              </strong>
                            </div>

                            {detection.review_required && (
                              <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                                <ShieldAlert size={15} />
                                {tr(
                                  "Cần chuyên gia xác minh",
                                  "Expert review required",
                                )}
                              </div>
                            )}

                            <p className="mt-3 text-xs leading-5 text-slate-500">
                              {getSpeciesDescription(
                                detection.species,
                                language,
                              )}
                            </p>

                            <div className="mt-3 h-2 rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${clampPercentage(
                                    detection.confidence *
                                      100,
                                  )}%`,
                                  backgroundColor: color,
                                }}
                              />
                            </div>

                            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px]">
                              <BoxMetric
                                label="X1"
                                value={detection.bounding_box.x1}
                              />

                              <BoxMetric
                                label="Y1"
                                value={detection.bounding_box.y1}
                              />

                              <BoxMetric
                                label="X2"
                                value={detection.bounding_box.x2}
                              />

                              <BoxMetric
                                label="Y2"
                                value={detection.bounding_box.y2}
                              />
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>

              <details className="mt-6 rounded-2xl bg-[#10251f] p-4 text-xs text-emerald-100">
                <summary className="cursor-pointer font-bold">
                  {tr("Xem JSON response", "View JSON response")}
                </summary>

                <pre className="mgx-scrollbar mt-4 max-h-[400px] overflow-auto whitespace-pre-wrap leading-6">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>

              <p className="mt-5 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-700">
                {tr(
                  "Kết quả phân loại do model AI tạo ra và có thể sai. Không sử dụng như kết luận dịch tễ hoặc kết luận sinh học chính thức.",
                  "Classification results are generated by an AI model and may be incorrect. Do not use them as official epidemiological or biological conclusions.",
                )}
              </p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Server;
  label: string;
  value: string;
  tone: "success" | "error" | "pending";
}) {
  const colors = {
    success: "bg-emerald-50 text-emerald-700",
    error: "bg-red-50 text-red-700",
    pending: "bg-amber-50 text-amber-700",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className={`rounded-xl p-3 ${colors[tone]}`}>
          {tone === "pending" ? (
            <Clock3 size={20} />
          ) : tone === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <XCircle size={20} />
          )}
        </span>

        <Icon
          size={20}
          className="text-slate-300"
        />
      </div>

      <p className="mt-5 text-xs text-slate-500">
        {label}
      </p>

      <strong className="mt-1 block text-lg text-[#16352a]">
        {value}
      </strong>
    </article>
  );
}

function ResultMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-[10px] font-bold tracking-wider text-slate-400">
        {label.toUpperCase()}
      </p>

      <strong className="mt-2 block break-all text-[#16352a]">
        {value}
      </strong>
    </div>
  );
}

function BoxMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-2">
      <span className="block text-slate-400">
        {label}
      </span>

      <strong className="text-[#16352a]">
        {value.toFixed(0)}
      </strong>
    </div>
  );
}
