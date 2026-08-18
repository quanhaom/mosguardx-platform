from pathlib import Path
from time import perf_counter

from PIL import Image


class MosquitoDetector:
    def __init__(self, model_path: Path, image_size: int, model_version: str) -> None:
        from ultralytics import YOLO

        if not model_path.is_file():
            raise FileNotFoundError(f"Model not found: {model_path}")

        self.model = YOLO(str(model_path))
        self.image_size = image_size
        self.model_version = model_version

    def predict(self, image: Image.Image, confidence: float, iou: float) -> tuple[list[dict], float]:
        started = perf_counter()
        result = self.model.predict(
            source=image,
            imgsz=self.image_size,
            conf=confidence,
            iou=iou,
            agnostic_nms=True,
            verbose=False,
        )[0]
        inference_ms = (perf_counter() - started) * 1000

        width, height = image.size
        detections: list[dict] = []

        if result.boxes is None:
            return detections, inference_ms

        for box in result.boxes:
            class_id = int(box.cls[0].item())
            species = str(
                result.names.get(
                    class_id,
                    f"class_{class_id}"
                )
            )
            
            x1, y1, x2, y2 = (float(value) for value in box.xyxy[0].tolist())
            detections.append(
                {
                    "object": "mosquito",
                    "class_id": class_id,
                    "species": species,
                    "confidence": round(
                        float(box.conf[0].item()),
                        4
                    ),
                    "bounding_box": {
                        "x1": round(x1, 2),
                        "y1": round(y1, 2),
                        "x2": round(x2, 2),
                        "y2": round(y2, 2),
                    },
                    "normalized_bounding_box": {
                        "x1": round(x1 / width, 6),
                        "y1": round(y1 / height, 6),
                        "x2": round(x2 / width, 6),
                        "y2": round(y2 / height, 6),
                    },
                }
            )

        return detections, inference_ms
