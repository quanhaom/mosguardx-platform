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
  useEffect,
  useMemo,
  useState,
} from "react";

type ApiHealth = {
  status: string;
  service: string;
  version: string;
  model_loaded: boolean;
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

const speciesDescriptions: Record<string, string> = {
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

function getSpeciesDescription(species: string) {
  const normalized = normalizeSpecies(species);

  return (
    speciesDescriptions[normalized] ??
    "Kết quả cần được xác minh thêm bằng dữ liệu chuyên môn."
  );
}

function getDetectionColor(index: number) {
  return detectionColors[index % detectionColors.length];
}

function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, value));
}

async function readJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  const rawText = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      rawText.startsWith("<")
        ? "Server trả về HTML thay vì JSON. Hãy kiểm tra API route."
        : rawText || `Server trả về HTTP ${response.status}`,
    );
  }

  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error("Server trả về JSON không hợp lệ.");
  }
}

export default function AiApiPage() {
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

  async function checkHealth() {
    setChecking(true);
    setHealthError("");

    try {
      const response = await fetch("/api/ai/health", {
        cache: "no-store",
      });

      const data = await readJsonResponse(response);

      if (!response.ok) {
        const detail =
          typeof data?.detail === "string"
            ? data.detail
            : "Không thể kết nối backend AI.";

        throw new Error(detail);
      }

      setHealth(data as ApiHealth);
    } catch (error) {
      setHealth(null);

      setHealthError(
        error instanceof Error
          ? error.message
          : "Không thể kết nối backend AI.",
      );
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    void checkHealth();
  }, []);

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
        "Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP.",
      );

      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setPreview("");

      setPredictError(
        "Dung lượng ảnh không được vượt quá 10 MB.",
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
        "Hãy chọn một ảnh trước khi chạy nhận diện.",
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

      const data = await readJsonResponse(response);

      if (!response.ok) {
        const detail =
          typeof data?.detail === "string"
            ? data.detail
            : data?.detail?.message;

        throw new Error(
          detail ??
            `Nhận diện thất bại: HTTP ${response.status}`,
        );
      }

      setResult(data as PredictionResponse);
    } catch (error) {
      setPredictError(
        error instanceof Error
          ? error.message
          : "Không thể gọi API nhận diện.",
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
              Nhận diện và phân loại loài muỗi
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Tải ảnh lên để phát hiện đối tượng, vẽ bounding
              box, phân loại loài và hiển thị độ tin cậy của
              model.
            </p>
          </div>

          <span className="h-fit rounded-full bg-amber-300/10 px-4 py-2 text-xs font-bold text-amber-200">
            KẾT QUẢ AI CẦN ĐƯỢC XÁC MINH
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatusCard
          icon={Server}
          label="Backend API"
          value={
            checking
              ? "Đang kiểm tra"
              : health
                ? "Đang hoạt động"
                : "Mất kết nối"
          }
          tone={
            checking
              ? "pending"
              : health
                ? "success"
                : "error"
          }
        />

        <StatusCard
          icon={BrainCircuit}
          label="Model AI"
          value={
            checking
              ? "Đang kiểm tra"
              : health?.model_loaded
                ? "Đã tải model"
                : "Chưa sẵn sàng"
          }
          tone={
            health?.model_loaded ? "success" : "error"
          }
        />

        <StatusCard
          icon={Activity}
          label="Phiên bản API"
          value={health?.version ?? "Chưa xác định"}
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
            <strong>Không kết nối được backend AI</strong>

            <p className="mt-1">{healthError}</p>

            <p className="mt-2 text-xs">
              Kiểm tra FastAPI đang chạy tại cổng 8000 và
              biến AI_API_URL trong .env.local.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void checkHealth()}
            className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold"
          >
            Thử lại
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
                Ảnh kiểm thử
              </h3>

              <p className="text-xs text-slate-500">
                JPEG, PNG hoặc WEBP · tối đa 10 MB
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
                    alt="Ảnh kiểm thử nhận diện muỗi"
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
                          Không phát hiện đối tượng vượt
                          ngưỡng
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
                  Nhấn để chọn ảnh
                </strong>

                <span className="mt-1 text-xs text-slate-400">
                  Ảnh chỉ được gửi khi bạn chạy nhận diện
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
                Ngưỡng tin cậy
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
              <span>Phát hiện nhiều hơn</span>
              <span>Độ chắc chắn cao hơn</span>
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
                Đang nhận diện...
              </>
            ) : (
              <>
                <BrainCircuit size={18} />
                Chạy nhận diện AI
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
                Kết quả nhận diện
              </h3>
            </div>

            {result && (
              <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                Thành công
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
                Chưa có kết quả
              </h4>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Chọn ảnh và chạy nhận diện để xem bounding
                box, số lượng, loài dự đoán và độ tin cậy.
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <ResultMetric
                  label="Số đối tượng"
                  value={String(result.mosquito_count)}
                />

                <ResultMetric
                  label="Model"
                  value={result.model_version}
                />

                <ResultMetric
                  label="Thời gian"
                  value={`${result.inference_ms} ms`}
                />
              </div>

              {speciesSummary.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-bold tracking-wider text-slate-400">
                    PHÂN BỐ THEO LOÀI
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
                  Các đối tượng phát hiện
                </h4>

                {result.detections.length === 0 ? (
                  <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                    Không phát hiện đối tượng vượt ngưỡng
                    tin cậy.
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
                                  Detection #{index + 1}
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
                                  Class ID:{" "}
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

                            <p className="mt-3 text-xs leading-5 text-slate-500">
                              {getSpeciesDescription(
                                detection.species,
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
                  Xem JSON response
                </summary>

                <pre className="mgx-scrollbar mt-4 max-h-[400px] overflow-auto whitespace-pre-wrap leading-6">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>

              <p className="mt-5 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-700">
                Kết quả phân loại do model AI tạo ra và có
                thể sai. Không sử dụng như kết luận dịch tễ
                hoặc kết luận sinh học chính thức.
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