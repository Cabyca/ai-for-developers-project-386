.PHONY: install init-db dev build start test clean help render-preview docker-test deploy

install: ## Установка зависимостей (backend → frontend, последовательно)
	@echo "Installing backend dependencies..."
	composer install -d backend --no-interaction --prefer-dist --optimize-autoloader
	@echo "Installing frontend dependencies..."
	cd frontend && npm ci

dev: ## Запуск dev-серверов параллельно (Laravel + Vite)
	@echo "Starting Laravel server on port 8000..."
	@php backend/artisan serve --host=0.0.0.0 --port=8000 > /dev/null 2>&1 &
	@echo "Laravel API: http://localhost:8000"
	@echo "Starting Vite dev server..."
	@cd frontend && npm run dev

build: ## Сборка Docker-образа
	docker build -t calendar-app .

start: ## Сборка и запуск Docker-контейнера локально (финальная проверка)
	@echo "Building Docker image..."
	@docker build -t calendar-app .
	@echo "Starting container on http://localhost:8000"
	@docker run -p 8000:8000 -e PORT=8000 calendar-app

test: ## Запуск всех тестов (backend → frontend)
	@echo "Running Laravel tests..."
	php backend/artisan test
	@echo "Running Playwright tests..."
	cd frontend && npx playwright test

init-db: ## Инициализация SQLite базы данных (composer dump-autoload + создание файла + права + миграции)
	@echo "Refreshing composer autoload..."
	cd backend && composer dump-autoload
	@echo "✓ Autoload refreshed"
	@echo ""
	@echo "Checking database directory and file..."
	@if [ ! -d backend/database ]; then \
		echo "Creating backend/database directory..."; \
		mkdir -p backend/database; \
		chmod 777 backend/database; \
		echo "✓ Directory created with 777 permissions"; \
	else \
		echo "✓ Directory already exists"; \
		chmod 777 backend/database; \
	fi
	@echo "Checking database file..."
	@if [ ! -f backend/database/database.sqlite ]; then \
		echo "Creating database.sqlite..."; \
		touch backend/database/database.sqlite; \
		chmod 777 backend/database/database.sqlite; \
		echo "✓ Database file created with 777 permissions"; \
	else \
		echo "✓ Database file already exists"; \
		chmod 777 backend/database/database.sqlite; \
	fi
	@echo "Setting permissions on storage and database..."
	@chmod -R 777 backend/storage backend/database 2>/dev/null || true
	@echo "✓ Permissions set to 777"
	@echo ""
	@echo "Running migrations..."
	cd backend && php artisan migrate --force
	@echo ""
	@echo "Running seeders..."
	cd backend && php artisan db:seed --force
	@echo ""
	@echo "✅ Database initialized successfully!"

clean: ## Очистка зависимостей и кеша
	rm -rf backend/vendor frontend/node_modules backend/public/dist
	@echo "Cleaned up all dependencies"

render-preview: ## Локальная сборка Docker как на Render
	@echo "Building Docker image for Render preview..."
	@docker build -t calendar-app-render .
	@echo ""
	@echo "Run locally with:"
	@echo "  docker run -p 8000:8000 -e PORT=8000 calendar-app-render"
	@echo ""
	@echo "Test health endpoint:"
	@echo "  curl http://localhost:8000/api/health"

docker-test: ## Тест Docker сборки локально
	@echo "Building Docker image..."
	@docker build -t calendar-app-test .
	@echo ""
	@echo "Starting container for testing..."
	@docker run -d -p 8000:8000 -e PORT=8000 --name calendar-test calendar-app-test
	@echo "Waiting for container to start..."
	@sleep 10
	@echo "Testing health endpoint..."
	@curl -s http://localhost:8000/api/health || echo "FAILED"
	@echo ""
	@echo "Stopping test container..."
	@docker stop calendar-test && docker rm calendar-test
	@echo "Test complete!"

deploy: ## Деплой на Render.com (требует настроенного сервиса)
	@echo "Building Docker image for Render..."
	@docker build -t calendar-app .
	@echo "Image built successfully. Push to Render using:"
	@echo "  render deploy"

help: ## Показать справку по командам
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
