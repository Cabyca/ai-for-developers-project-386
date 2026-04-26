# ===========================================
# Stage 1: Build Frontend (Node 20)
# ===========================================
FROM node:20-slim AS frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm cache clean --force

RUN npm install --legacy-peer-deps

RUN npm install pinia --legacy-peer-deps

COPY frontend/ ./

RUN npm run build

RUN ls -la ../backend/public/dist || ls -la dist

# ===========================================
# Stage 2: Production Runtime (PHP 8.3)
# ===========================================
FROM php:8.3-cli-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    sqlite \
    sqlite-dev \
    libxml2-dev \
    libxslt-dev \
    unzip \
    git \
    curl

# Install PHP extensions
RUN docker-php-ext-install pdo_sqlite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy backend application
COPY backend/ ./backend/

# Copy built frontend
COPY --from=frontend /app/backend/public/dist ./backend/public/dist

# Set working directory
WORKDIR /app/backend

# Create required directories
RUN mkdir -p storage bootstrap/cache storage/framework/sessions storage/framework/views storage/framework/cache

# Set permissions
RUN chmod -R 777 storage bootstrap/cache database

# Expose port
EXPOSE 8000

# Start application
CMD ["sh", "-c", "\
touch database/database.sqlite && \
chmod -R 777 storage bootstrap/cache database && \
php artisan migrate --force && \
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]