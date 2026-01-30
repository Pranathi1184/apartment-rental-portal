# Stage 1: Build Frontend
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 2: Build Backend & Runtime
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy built frontend assets to static folder for serving
# The path matches the output from 'npm run build'
COPY --from=frontend-build /app/frontend/dist/frontend/browser ./static

# Expose port
EXPOSE 5000

# Set environment variables (can be overridden at runtime)
ENV FLASK_APP=app.py
ENV PORT=5000

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:create_app()"]
