# ===========================================
# Stage 1: Build Frontend (Node 20)
# ===========================================
FROM node:20-alpine AS frontend

WORKDIR /app

COPY frontend/ ./

RUN npm install && npm install pinia && npm run build -- --outDir dist

# ===========================================
# Stage 2: Production Runtime (PHP 8.3-cli)
# ===========================================
FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    git \
    libonig-dev \
    && docker-php-ext-install gd zip \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy backend to root
COPY backend/ .

# Fix artisan paths
RUN sed -i "s|require __DIR__.'/../vendor/autoload.php'|require __DIR__.'/vendor/autoload.php'|g" artisan
RUN sed -i "s|require_once __DIR__.'/../bootstrap/app.php'|require_once __DIR__.'/bootstrap/app.php'|g" artisan

# Install dependencies (RAM-optimized)
RUN composer install --no-dev --no-scripts --no-plugins --prefer-dist --no-interaction && composer dump-autoload

# Fix Status 255
RUN ln -s /var/www/vendor /var/vendor

# Copy built frontend
COPY --from=frontend /app/dist ./public/dist

# Create required directories
RUN mkdir -p storage bootstrap/cache storage/framework/sessions storage/framework/views storage/framework/cache

# Set ownership and permissions
RUN chown -R www-data:www-data /var/www && chmod -R 777 storage bootstrap/cache

# Expose port
EXPOSE 8000

# Start application
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}