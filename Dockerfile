# ===========================================
# Stage 1: Build Frontend (Node 20)
# ===========================================
FROM node:20-alpine AS frontend

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install --prefer-offline --no-audit --fund && \
    npm install pinia --prefer-offline && \
    npm cache clean --force

COPY frontend/ .

RUN npm run build -- --outDir dist && \
    rm -rf node_modules/.vite && \
    npm cache clean --force

# ===========================================
# Stage 2: Production Runtime (PHP 8.3-cli)
# ===========================================
FROM php:8.3-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
    libzip-dev \
    zlib1g-dev \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY backend/ .

RUN sed -i "s|require __DIR__.'/../vendor/autoload.php'|require __DIR__.'/vendor/autoload.php'|g" artisan && \
    sed -i "s|require_once __DIR__.'/../bootstrap/app.php'|require_once __DIR__.'/bootstrap/app.php'|g" artisan && \
    composer install --no-dev --no-scripts --no-plugins --prefer-dist --optimize-autoloader --no-interaction && \
    composer clear-cache

RUN mkdir -p storage bootstrap/cache storage/framework/sessions storage/framework/views storage/framework/cache

COPY --from=frontend /app/dist ./public/dist

RUN chown -R www-data:www-data /var/www && \
    chmod -R 777 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]