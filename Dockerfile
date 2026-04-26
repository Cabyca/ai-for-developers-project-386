# ===========================================
# Stage 1: Build Frontend (Node 18)
# ===========================================
FROM node:18-alpine AS frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install && npm install pinia

COPY frontend/ .

RUN npm run build

# ===========================================
# Stage 2: Production Runtime (PHP 8.2)
# ===========================================
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    git \
    oniguruma-dev

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy backend to root
COPY backend/ .

# Install dependencies and create symlink
RUN composer install --no-dev --optimize-autoloader && ln -s /var/www/vendor /var/vendor

# Copy built frontend
COPY --from=frontend /app/frontend/dist ./public/dist

# Create required directories
RUN mkdir -p storage bootstrap/cache storage/framework/sessions storage/framework/views storage/framework/cache

# Set ownership and permissions
RUN chown -R www-data:www-data /var/www && chmod -R 775 storage bootstrap/cache

# Expose port
EXPOSE 10000

# Start application
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-10000}