# One image for both the API and the ingest worker (different `command`s in docker-compose.yml).
FROM python:3.13-slim

COPY --from=ghcr.io/astral-sh/uv:0.11.21 /uv /uvx /bin/

WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PATH="/app/.venv/bin:$PATH" \
    HF_HOME=/models \
    PYTHONUNBUFFERED=1

# INSTALL_ML=0 skips PyTorch (~700 MB) for an API-only image, e.g. on Render's free plan.
# The API never loads the embedding model; only the ingest worker does.
ARG INSTALL_ML=1

# Dependencies first, so code changes don't re-download PyTorch.
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    if [ "$INSTALL_ML" = "1" ]; then \
        uv sync --frozen --no-dev --extra ml; \
    else \
        uv sync --frozen --no-dev; \
    fi

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
