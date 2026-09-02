from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image

from app.detector import MosquitoDetector
from app.main import app


class FakeDetector:
    model_version = "test-model"

    def predict(self, image, confidence, iou):
        return [], 5.0


class FakeTensorValue:
    def __init__(self, value):
        self.value = value

    def item(self):
        return self.value


class FakeCoordinates:
    def __init__(self, values):
        self.values = values

    def tolist(self):
        return self.values


class FakeBox:
    cls = [FakeTensorValue(0)]
    conf = [FakeTensorValue(0.82)]
    xyxy = [FakeCoordinates([4.0, 3.0, 20.0, 18.0])]


class FakeDetectionResult:
    boxes = [FakeBox()]
    names = {0: "mosquito"}


class FakeDetectionModel:
    def predict(self, **kwargs):
        return [FakeDetectionResult()]


class FakeProbabilities:
    def __init__(self, class_id, confidence):
        self.top1 = class_id
        self.top1conf = FakeTensorValue(confidence)


class FakeClassificationResult:
    names = {
        0: "aegypti",
        1: "anopheles",
        2: "japonicus-koreicus",
        3: "culiseta",
        4: "albopictus",
        5: "culex",
    }

    def __init__(self, class_id, confidence):
        self.probs = FakeProbabilities(class_id, confidence)


class FakeClassificationModel:
    def __init__(self, class_id, confidence):
        self.class_id = class_id
        self.confidence = confidence

    def predict(self, source, **kwargs):
        return [
            FakeClassificationResult(
                self.class_id,
                self.confidence,
            )
            for _ in source
        ]


def make_image() -> bytes:
    buffer = BytesIO()
    Image.new("RGB", (32, 24), "white").save(buffer, format="JPEG")
    return buffer.getvalue()


def test_liveness():
    with TestClient(app) as client:
        response = client.get("/health/live")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


def test_predict():
    with TestClient(app) as client:
        client.app.state.detector = FakeDetector()
        response = client.post(
            "/v1/predict",
            files={"file": ("mosquito.jpg", make_image(), "image/jpeg")},
        )

        assert response.status_code == 200
        body = response.json()
        assert body["mosquito_count"] == 0
        assert body["model_version"] == "test-model"
        assert body["image"]["width"] == 32


def test_rejects_non_image():
    with TestClient(app) as client:
        client.app.state.detector = FakeDetector()
        response = client.post(
            "/v1/predict",
            files={"file": ("payload.txt", b"not an image", "text/plain")},
        )
        assert response.status_code == 415


def make_pipeline(class_id=5, classifier_confidence=0.91):
    detector = MosquitoDetector.__new__(MosquitoDetector)
    detector.model = FakeDetectionModel()
    detector.image_size = 640
    detector.model_version = "detector-v1"
    detector.classifier = FakeClassificationModel(
        class_id,
        classifier_confidence,
    )
    detector.classifier_image_size = 384
    detector.classifier_batch_size = 8
    detector.classifier_model_version = "worker-c-v1"
    detector.classifier_review_threshold = 0.65
    detector.classifier_review_species = {"aegypti"}
    return detector


def test_worker_c_classifies_each_detected_crop():
    detector = make_pipeline()
    detections, _ = detector.predict(
        Image.new("RGB", (32, 24), "white"),
        confidence=0.35,
        iou=0.45,
    )

    assert len(detections) == 1
    assert detections[0]["species"] == "culex"
    assert detections[0]["class_id"] == 5
    assert detections[0]["detector_confidence"] == 0.82
    assert detections[0]["classification_confidence"] == 0.91
    assert detections[0]["classification_model_version"] == "worker-c-v1"
    assert detections[0]["review_required"] is False


def test_aegypti_is_always_sent_to_review():
    detector = make_pipeline(
        class_id=0,
        classifier_confidence=0.99,
    )
    detections, _ = detector.predict(
        Image.new("RGB", (32, 24), "white"),
        confidence=0.35,
        iou=0.45,
    )

    assert detections[0]["species"] == "aegypti"
    assert detections[0]["review_required"] is True
