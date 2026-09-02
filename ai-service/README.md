# MosGuardX AI API

FastAPI service that detects, counts and classifies mosquitoes. The production
pipeline uses two checkpoints:

1. A detection model finds every mosquito and produces bounding boxes.
2. Worker C (`YOLO11s-cls`, image size 384) classifies each detected crop into
   one of the six trained species groups.

`aegypti` results are always marked `review_required=true` because that class
had no true-positive prediction in the current test set. Predictions below the
configured classification threshold are also sent to manual review.

## Local setup (PowerShell)

```powershell
cd ai-service
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements-dev.txt
Copy-Item .env.example .env
```

For local development, copy both trained checkpoints to:

```text
ai-service/models/mosguardx_best.pt
ai-service/models/worker_c_best.pt
```

Start the API:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:8000/docs` and execute `POST /v1/predict`.

## Test

```powershell
pytest -q
```

## Docker

The model is deliberately excluded from the Docker build context. For a local
container, mount it read-only:

```powershell
docker build -t mosguardx-ai .
docker run --rm -p 8000:8000 `
  --env-file .env `
  -v "${PWD}/models:/service/models:ro" `
  mosguardx-ai
```

## Endpoints

- `GET /health/live`
- `GET /health/ready`
- `POST /v1/predict`
- `POST /v1/stations`
- `GET /v1/stations`
- `POST /v1/stations/{station_id}/observations`
- `GET /v1/observations`
- `GET /v1/dashboard/summary`
- `GET /v1/alerts`

## Supabase model paths

Upload the checkpoints to the private `mosguardx-models` bucket before
deploying:

```text
mosguardx_best.pt
worker_c/best.pt
```

Then apply `supabase/schema.sql` in the Supabase SQL Editor and configure the
variables from `.env.example` on the FastAPI hosting service. The service-role
key must only exist on FastAPI; never expose it to Next.js or the browser.

Example:

```powershell
curl.exe -X POST `
  "http://127.0.0.1:8000/v1/predict?confidence=0.35" `
  -H "accept: application/json" `
  -H "Content-Type: multipart/form-data" `
  -F "file=@D:\path\to\mosquito.jpg"
```
