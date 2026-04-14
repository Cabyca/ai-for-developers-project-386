# Stage 1: Build frontend assets
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: PHP application
FROM php:8.3-cli-alpine
WORKDIR /app

# Установка системных зависимостей и расширений PHP
RUN apk add --no-cache \
    sqlite \
    sqlite-dev \
    && docker-php-ext-install pdo_sqlite

# Copy backend
COPY backend/ ./

# Copy built frontend assets
COPY --from=frontend-build /app/backend/public/dist ./public/dist

# Права для storage и cache (критично для Laravel)
RUN chmod -R 777 storage bootstrap/cache

# Install composer dependencies
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Создаем SQLite базу данных и запускаем миграции/сидеры при сборке
# Для production используем файл базы данных
ENV DB_DATABASE=/app/storage/database.sqlite
ENV DB_CONNECTION=sqlite
RUN touch /app/storage/database.sqlite && \
    chmod 666 /app/storage/database.sqlite && \
    php artisan migrate --force && \
    php artisan db:seed --force

EXPOSE 8000

# CMD с корректной подстановкой $PORT для совместимости с Heroku
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]
