"use client";

import {
  AlertCircle,
  Bug,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  ScanSearch,
  Upload,
  X,
} from "lucide-react";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useState,
} from "react";

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
  normalized_bounding_box: BoundingBox;
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

const speciesLabels: Record<string, string> = {
  albopictus: "Aedes albopictus",
  culex: "Culex",
  culiseta: "Culiseta",
  "japonicus-koreicus": "Aedes japonicus/koreicus",
  aegypti: "Aedes aegypti",
  anopheles: "Anopheles",
  mosquito: "Muỗi",
};

function displaySpecies(species: string) {
  return speciesLabels[species.toLowerCase()] ?? species;
}

export default function DetectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] =
    useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [confidence, setConfidence] = useState(0.35);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function selectFile(selectedFile: File) {
    const acceptedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!acceptedTypes.includes(selectedFile.type)) {
      setError("Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Dung lượng ảnh không được vượt quá 10 MB.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  }

  function handleFileInput(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      selectFile(selectedFile);
    }

    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);

    const selectedFile = event.dataTransfer.files?.[0];

    if (selectedFile) {
      selectFile(selectedFile);
    }
  }

  function clearImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(null);
    setPreviewUrl("");
    setResult(null);
    setError("");
  }

  async function predict() {
    if (!file) {
      setError("Hãy chọn ảnh trước khi nhận diện.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "confidence",
        confidence.toString(),
      );
      formData.append("iou", "0.45");

      const response = await fetch("/api/ai/predict", {
        method: "POST",
        body: formData,
      });

      const body = await response.json();

      if (!response.ok) {
        const detail =
          typeof body.detail === "string"
            ? body.detail
            : body.detail?.message;

        throw new Error(
          detail ?? "Không thể thực hiện nhận diện.",
        );
      }

      setResult(body as PredictionResponse);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Đã xảy ra lỗi khi nhận diện.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700">
          MOSGUARDX AI
        </p>

        <h2 className="mt-1 text-2xl font-bold text-[#16352a]">
          Nhận diện muỗi từ hình ảnh
        </h2>

        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Tải ảnh lên để phát hiện vị trí, số lượng và
          loài muỗi dự đoán bởi mô hình AI.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <section className="rounded-2xl border border-[#dce8e2] bg-white p-5 shadow-sm">
          {!previewUrl ? (
            <div
              onDragEnter={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`flex min-h-[470px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                dragging
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300 bg-slate-50"
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ImagePlus size={31} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                Kéo và thả ảnh vào đây
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                JPEG, PNG hoặc WEBP — tối đa 10 MB
              </p>

              <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                <Upload size={18} />
                Chọn ảnh

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {file?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {file
                      ? `${(
                          file.size /
                          1024 /
                          1024
                        ).toFixed(2)} MB`
                      : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearImage}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <X size={16} />
                  Xóa ảnh
                </button>
              </div>

              <div className="flex min-h-[470px] items-center justify-center overflow-hidden rounded-2xl bg-[#10251f] p-3">
                <div className="relative inline-block max-h-[650px] max-w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Ảnh cần nhận diện"
                    className="block max-h-[620px] max-w-full object-contain"
                  />

                  {result?.detections.map(
                    (detection, index) => {
                      const box =
                        detection.normalized_bounding_box;

                      return (
                        <div
                          key={`${detection.class_id}-${index}`}
                          className="absolute border-2 border-emerald-400"
                          style={{
                            left: `${box.x1 * 100}%`,
                            top: `${box.y1 * 100}%`,
                            width: `${
                              (box.x2 - box.x1) * 100
                            }%`,
                            height: `${
                              (box.y2 - box.y1) * 100
                            }%`,
                          }}
                        >
                          <span className="absolute -top-7 left-[-2px] whitespace-nowrap rounded-t-md bg-emerald-500 px-2 py-1 text-[11px] font-bold text-white">
                            {displaySpecies(
                              detection.species,
                            )}{" "}
                            {Math.round(
                              detection.confidence * 100,
                            )}
                            %
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Ngưỡng confidence:{" "}
                {confidence.toFixed(2)}
              </span>

              <input
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
                className="mt-3 w-full accent-emerald-600 sm:w-72"
              />
            </label>

            <button
              type="button"
              onClick={predict}
              disabled={!file || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b3c32] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <ScanSearch size={18} />
              )}

              {loading
                ? "Đang phân tích..."
                : "Bắt đầu nhận diện"}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle
                size={19}
                className="shrink-0"
              />
              {error}
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#dce8e2] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Bug size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  KẾT QUẢ PHÁT HIỆN
                </p>
                <p className="text-2xl font-bold text-[#16352a]">
                  {result?.mosquito_count ?? "—"}
                </p>
              </div>
            </div>

            {!result ? (
              <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                Kết quả sẽ xuất hiện sau khi ảnh được
                phân tích.
              </p>
            ) : result.detections.length === 0 ? (
              <div className="mt-5 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <CheckCircle2
                  size={20}
                  className="shrink-0"
                />
                Không phát hiện muỗi trong ảnh.
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {result.detections.map(
                  (detection, index) => (
                    <article
                      key={`${detection.class_id}-${index}`}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-slate-500">
                            PHÁT HIỆN #{index + 1}
                          </p>
                          <p className="mt-1 font-bold text-slate-800">
                            {displaySpecies(
                              detection.species,
                            )}
                          </p>
                        </div>

                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          {Math.round(
                            detection.confidence * 100,
                          )}
                          %
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        Class ID: {detection.class_id}
                      </p>

                      {detection.review_required && (
                        <p className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                          <AlertCircle size={14} />
                          Cần chuyên gia xác minh
                        </p>
                      )}
                    </article>
                  ),
                )}
              </div>
            )}
          </section>

          {result && (
            <section className="rounded-2xl border border-[#dce8e2] bg-white p-5 text-sm shadow-sm">
              <h3 className="font-bold text-[#16352a]">
                Thông tin xử lý
              </h3>

              <dl className="mt-4 space-y-3">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    Model
                  </dt>
                  <dd className="text-right font-medium">
                    {result.model_version}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    Thời gian
                  </dt>
                  <dd className="font-medium">
                    {result.inference_ms.toFixed(2)} ms
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    Kích thước ảnh
                  </dt>
                  <dd className="font-medium">
                    {result.image.width} ×{" "}
                    {result.image.height}
                  </dd>
                </div>
              </dl>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
