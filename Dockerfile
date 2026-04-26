# Multi-stage Dockerfile for Laravel + Vue.js SPA
# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ .

# Build for production
RUN npm run build

# Stage 2: PHP application
FROM php:8.3-cli-alpine

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    sqlite \
    sqlite-dev \
    libxml2-dev \
    libzip-dev \
    unzip \
    curl \
    && docker-php-ext-install \
    pdo_sqlite \
    xml \
    dom \
    zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app/backend

# Copy composer files
COPY backend/composer*.json ./

# Install PHP dependencies (no dev dependencies for production)
RUN composer install --no-dev --optimize-autoloader

# Copy backend source
COPY backend/ .

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/frontend/dist/ ./public/dist/

# Set proper permissions for SQLite and storage
RUN chmod -R 777 storage \
    && chmod -R 777 bootstrap/cache \
    && mkdir -p database \
    && chmod -R 777 database

# Create SQLite database file if it doesn't exist
RUN touch database/database.sqlite && chmod 777 database/database.sqlite

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Start the application
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]
