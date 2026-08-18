# MosGuardX AI API

FastAPI service that detects and counts mosquitoes. Species labels from legacy
multi-class checkpoints are intentionally collapsed to the single public label
`mosquito`.

## Local setup (PowerShell)

```powershell
cd ai-service
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements-dev.txt
Copy-Item .env.example .env
```

Copy the trained checkpoint to:

```text
ai-service/models/mosguardx_best.pt
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

Example:

```powershell
curl.exe -X POST `
  "http://127.0.0.1:8000/v1/predict?confidence=0.35" `
  -H "accept: application/json" `
  -H "Content-Type: multipart/form-data" `
  -F "file=@D:\path\to\mosquito.jpg"
```
