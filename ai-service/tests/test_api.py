from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image

from app.main import app


class FakeDetector:
    model_version = "test-model"

    def predict(self, image, confidence, iou):
        return [], 5.0


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
