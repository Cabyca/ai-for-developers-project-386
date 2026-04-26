# Развёртывание Календаря звонков

## Описание
Приложение для бронирования встреч с Fluid Pastel дизайном и glassmorphism эффектами.

## Технологии
- **Backend**: Laravel 11 + SQLite
- **Frontend**: Vue 3 + Vite + Tailwind CSS
- **Container**: Docker + Docker Compose
- **Hosting**: Render.com

## Локальный запуск

### Без Docker
```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan serve

# Frontend
cd frontend
npm install
npm run dev
```

### С Docker
```bash
# Сборка и запуск
docker build -t calendar-app .
docker run -p 8000:8000 -e PORT=8000 calendar-app
```

## Деплой на Render.com

### 1. Подготовка
- Создайте репозиторий на GitHub
- Запушьте код: `git push origin main`

### 2. Настройка на Render
1. Перейдите на [dashboard.render.com](https://dashboard.render.com)
2. Нажмите "New +" → "Web Service"
3. Выберите ваш GitHub репозиторий
4. Настройки:
   - **Name**: calendar-app
   - **Runtime**: Docker
   - **Plan**: Free
   - **Health Check Path**: `/api/health`
5. Добавьте Persistent Disk:
   - **Name**: database
   - **Mount Path**: `/app/backend/database`
   - **Size**: 1 GB
6. Нажмите "Create Web Service"

### 3. Проверка деплоя
- Дождитесь окончания сборки (3-5 минут)
- Проверьте health check: `https://your-app.onrender.com/api/health`
- Откройте приложение: `https://your-app.onrender.com`

## API Endpoints

### Health Check
```
GET /api/health
Response: {"status": "ok"}
```

### Event Types
```
GET /api/event-types
POST /api/event-types
```

### Bookings
```
GET /api/admin/bookings
POST /api/bookings
```

## Переменные окружения

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8000 |
| `APP_ENV` | Environment | production |
| `APP_DEBUG` | Debug mode | false |

## Публичный URL

**После деплоя вставьте ссылку сюда:**

🌐 **Live URL**: `https://your-app-name.onrender.com`

---

## Поддержка

Если у вас возникли проблемы с деплоем:
1. Проверьте логи сборки на Render Dashboard
2. Убедитесь, что файл `database/database.sqlite` доступен для записи
3. Проверьте health check endpoint: `/api/health`
