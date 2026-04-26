# ===========================================
# Stage 1: Build Frontend (Node 18)
# ===========================================
FROM node:18-alpine AS frontend

WORKDIR /app/frontend

COPY frontend/ ./

RUN npm install && npm install pinia && npm run build

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

# Copy composer files to root
COPY backend/composer.json ./
COPY backend/composer.lock ./

# Install vendor to root (/var/www/vendor)
RUN composer install --working-dir=/var/www --no-dev --optimize-autoloader

# Copy backend application
COPY backend/ ./backend/

# Copy built frontend
COPY --from=frontend /app/frontend/dist ./backend/public/dist

# Create required directories
RUN mkdir -p backend/storage backend/bootstrap/cache backend/storage/framework/sessions backend/storage/framework/views backend/storage/framework/cache

# Set ownership and permissions
RUN chown -R www-data:www-data /var/www && chmod -R 775 backend/storage backend/bootstrap/cache

# Expose port
EXPOSE 10000

# Start application from backend folder
WORKDIR /var/www/backend

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=${PORT:-10000}"]