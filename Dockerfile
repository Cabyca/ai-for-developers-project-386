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
    curl \
    && docker-php-ext-install pdo_sqlite

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy backend composer files first (for caching)
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy remaining backend files
COPY backend/ ./

# Copy built frontend assets
COPY --from=frontend-build /app/backend/public/dist ./public/dist

# Создаем директорию для базы данных и устанавливаем права
# (критично для SQLite в Docker)
RUN mkdir -p /app/backend/database && \
    touch /app/backend/database/database.sqlite && \
    chmod 777 /app/backend/database/database.sqlite && \
    chmod -R 777 storage bootstrap/cache /app/backend/database

# Настройка окружения
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV APP_KEY=base64:RENDERPRODUCTIONKEYFOROPENAIAGENTS0000
ENV APP_URL=${RENDER_EXTERNAL_URL:-http://localhost:8000}

# SQLite настройки для файловой базы данных
ENV DB_CONNECTION=sqlite
ENV DB_DATABASE=/app/backend/database/database.sqlite

# Дополнительные настройки для production
ENV LOG_CHANNEL=stderr
ENV LOG_LEVEL=info
ENV SESSION_DRIVER=file
ENV CACHE_DRIVER=file

# Healthcheck для Render.com
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/api/health || exit 1

EXPOSE 8000

# Entrypoint script для инициализации базы при старте
RUN cat > /app/entrypoint.sh << 'EOF'
#!/bin/sh
set -e

# Создаем директорию для базы данных если она не существует
DB_DIR=$(dirname "$DB_DATABASE")
if [ ! -d "$DB_DIR" ]; then
  echo "Creating database directory: $DB_DIR"
  mkdir -p "$DB_DIR"
fi

# Создаем/инициализируем SQLite базу данных
if [ ! -f "$DB_DATABASE" ]; then
  echo "Creating SQLite database at $DB_DATABASE..."
  touch "$DB_DATABASE"
  chmod 666 "$DB_DATABASE"
  echo "✓ Database created"
else
  echo "✓ Database already exists"
fi

# Устанавливаем права на storage и директорию базы (критично для SQLite)
chmod -R 777 storage bootstrap/cache "$DB_DIR"
chmod 666 "$DB_DATABASE"

# Запускаем миграции и сидеры
echo "Running migrations..."
php artisan migrate --force

echo "Running seeders..."
php artisan db:seed --force

# Запускаем PHP сервер
echo "Starting server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
EOF

RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]
