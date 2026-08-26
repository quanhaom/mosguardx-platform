FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /service

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        libgl1 \
        libglib2.0-0 \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN python -m pip install --upgrade pip setuptools wheel \
    && python -m pip install \
        torch==2.8.0 \
        torchvision==0.23.0 \
        --index-url https://download.pytorch.org/whl/cpu \
    && python -m pip install -r requirements.txt

COPY app ./app

RUN useradd \
        --create-home \
        --uid 10001 \
        mosguardx \
    && mkdir -p /service/models \
    && chown -R mosguardx:mosguardx /service

USER mosguardx

EXPOSE 10000

HEALTHCHECK \
    --interval=30s \
    --timeout=10s \
    --start-period=180s \
    --retries=3 \
    CMD python -c "import os, urllib.request; port=os.getenv('PORT', '10000'); urllib.request.urlopen(f'http://127.0.0.1:{port}/health/live', timeout=5)"

CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]