from pathlib import Path
from time import perf_counter
from typing import Any

from PIL import Image


class MosquitoDetector:
    def __init__(
        self,
        model_path: Path,
        image_size: int,
        model_version: str,
        classifier_path: Path | None = None,
        classifier_image_size: int = 384,
        classifier_batch_size: int = 8,
        classifier_model_version: str | None = None,
        classifier_review_threshold: float = 0.65,
        classifier_review_species: set[str] | None = None,
    ) -> None:
        from ultralytics import YOLO

        if not model_path.is_file():
            raise FileNotFoundError(f"Model not found: {model_path}")

        self.model = YOLO(str(model_path))
        self.image_size = image_size
        self.model_version = model_version

        self.classifier = None
        self.classifier_image_size = classifier_image_size
        self.classifier_batch_size = max(1, classifier_batch_size)
        self.classifier_model_version = classifier_model_version
        self.classifier_review_threshold = classifier_review_threshold
        self.classifier_review_species = {
            species.strip().lower()
            for species in (classifier_review_species or set())
        }

        if classifier_path is not None:
            if not classifier_path.is_file():
                raise FileNotFoundError(
                    f"Classifier model not found: {classifier_path}"
                )

            self.classifier = YOLO(str(classifier_path))

    @property
    def classifier_loaded(self) -> bool:
        return self.classifier is not None

    @staticmethod
    def _crop_box(
        image: Image.Image,
        coordinates: tuple[float, float, float, float],
    ) -> Image.Image:
        x1, y1, x2, y2 = coordinates
        width, height = image.size

        padding_x = max(2.0, (x2 - x1) * 0.08)
        padding_y = max(2.0, (y2 - y1) * 0.08)

        left = max(0, int(x1 - padding_x))
        top = max(0, int(y1 - padding_y))
        right = min(width, int(x2 + padding_x))
        bottom = min(height, int(y2 + padding_y))

        return image.crop((left, top, right, bottom))

    @staticmethod
    def _class_name(names: Any, class_id: int) -> str:
        if isinstance(names, dict):
            return str(names.get(class_id, f"class_{class_id}"))

        if isinstance(names, (list, tuple)) and class_id < len(names):
            return str(names[class_id])

        return f"class_{class_id}"

    def _classify_crops(
        self,
        crops: list[Image.Image],
    ) -> tuple[list[dict[str, Any] | None], float]:
        if self.classifier is None or not crops:
            return [None for _ in crops], 0.0

        started = perf_counter()
        classifications: list[dict[str, Any] | None] = []

        for start in range(0, len(crops), self.classifier_batch_size):
            batch = crops[start : start + self.classifier_batch_size]
            results = self.classifier.predict(
                source=batch,
                imgsz=self.classifier_image_size,
                verbose=False,
            )

            for result in results:
                if result.probs is None:
                    classifications.append(None)
                    continue

                class_id = int(result.probs.top1)
                confidence = float(result.probs.top1conf.item())
                species = self._class_name(result.names, class_id)
                normalized_species = species.strip().lower()

                classifications.append(
                    {
                        "class_id": class_id,
                        "species": species,
                        "confidence": round(confidence, 4),
                        "review_required": (
                            confidence < self.classifier_review_threshold
                            or normalized_species
                            in self.classifier_review_species
                        ),
                    }
                )

        if len(classifications) < len(crops):
            classifications.extend(
                [None] * (len(crops) - len(classifications))
            )

        inference_ms = (perf_counter() - started) * 1000
        return classifications, inference_ms

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
        detection_inference_ms = (perf_counter() - started) * 1000

        width, height = image.size
        detections: list[dict] = []

        if result.boxes is None:
            return detections, detection_inference_ms

        boxes = list(result.boxes)
        coordinates = [
            tuple(float(value) for value in box.xyxy[0].tolist())
            for box in boxes
        ]
        crops = [
            self._crop_box(image, box_coordinates)
            for box_coordinates in coordinates
        ]
        classifications, classification_inference_ms = (
            self._classify_crops(crops)
        )

        for box, box_coordinates, classification in zip(
            boxes,
            coordinates,
            classifications,
        ):
            detector_class_id = int(box.cls[0].item())
            detector_confidence = float(box.conf[0].item())
            detector_species = self._class_name(
                result.names,
                detector_class_id,
            )

            class_id = (
                int(classification["class_id"])
                if classification is not None
                else detector_class_id
            )
            species = (
                str(classification["species"])
                if classification is not None
                else detector_species
            )
            confidence_value = (
                float(classification["confidence"])
                if classification is not None
                else detector_confidence
            )

            x1, y1, x2, y2 = box_coordinates
            detections.append(
                {
                    "object": "mosquito",
                    "class_id": class_id,
                    "species": species,
                    "confidence": round(confidence_value, 4),
                    "detector_confidence": round(
                        detector_confidence,
                        4,
                    ),
                    "classification_confidence": (
                        round(confidence_value, 4)
                        if classification is not None
                        else None
                    ),
                    "classification_model_version": (
                        self.classifier_model_version
                        if classification is not None
                        else None
                    ),
                    "review_required": bool(
                        classification
                        and classification["review_required"]
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

        return (
            detections,
            detection_inference_ms + classification_inference_ms,
        )
