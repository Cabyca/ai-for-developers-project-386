.PHONY: install dev build start test clean help

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

clean: ## Очистка зависимостей и кеша
	rm -rf backend/vendor frontend/node_modules backend/public/dist
	@echo "Cleaned up all dependencies"

help: ## Показать справку по командам
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
