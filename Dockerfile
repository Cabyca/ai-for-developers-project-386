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

# ===========================================
# Stage 2: Production Runtime (PHP 8.3)
# ===========================================
FROM php:8.3-cli-alpine

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

# Set working directory
WORKDIR /var/www

# Copy dependency files first
COPY backend/composer.json backend/composer.lock ./

# Install dependencies without scripts
RUN composer install --no-dev --no-scripts --no-autoloader

# Copy all backend files
COPY backend/ .

# Generate optimized autoloader
RUN composer dump-autoloader --optimize

# Copy built frontend
COPY --from=frontend /app/frontend/backend/public/dist ./public/dist

# Create required directories
RUN mkdir -p storage bootstrap/cache storage/framework/sessions storage/framework/views storage/framework/cache

# Set ownership and permissions
RUN chown -R www-data:www-data /var/www

RUN chmod -R 775 storage bootstrap/cache

# Expose port
EXPOSE 10000

# Start application
CMD ["sh", "-c", "\
touch database/database.sqlite && \
chown -R www-data:www-data /var/www && \
php artisan migrate --force && \
php artisan serve --host=0.0.0.0 --port=10000"]