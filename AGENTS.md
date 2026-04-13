# AGENTS.md — Календарь звонков

Monorepo: Laravel 11 API + Vue 3 SPA + TypeSpec contracts.

## Structure

```
backend/        Laravel 11 API-only (no Blade, no Inertia)
frontend/       Vue 3 + Vite + Tailwind
api/            TypeSpec contracts (DO NOT MODIFY — authoritative source)
```

## Critical Commands

```bash
# Install dependencies (sequential: backend first, then frontend)
make install          # composer install + npm ci

# Development (parallel: Laravel 8000 + Vite 5173)
make dev              # php artisan serve & npm run dev

# Docker build (multi-stage: Node build + PHP serve)
make build            # docker build -t calendar-app .

# Tests
make test             # php artisan test + playwright test
```

## Architecture Constraints

### Business Logic (SlotService)
- **Window**: 14 days from today only
- **Days**: Weekdays only (Mon-Fri)
- **Hours**: 09:00–18:00
- **Slot step**: 15 or 30 minutes (from EventType.durationMinutes)
- **Global conflict check**: `starts_at < existing_end AND ends_at > existing_start`

### Laravel 11 API-Only
- Routes in `routes/api.php` — **NO /api prefix** (Laravel adds automatically)
- Controllers return `JsonResponse`
- Models use `HasUuids` trait (UUID primary keys)
- Services/Actions pattern implemented
- **DB**: SQLite `:memory:` default (see config/database.php, .env.example)

### Frontend (Vue 3)
- Composition API with `<script setup>`
- **Vite proxy**: `/api` → `http://localhost:8000` (see vite.config.js)
- Build output: `backend/public/dist/` (SPA served from Laravel)
- Uses Axios (installed, configure in `src/api/`)

### Docker Production
- Multi-stage: Node 20 → PHP 8.3-cli-alpine
- **Critical**: `chmod -R 777 storage bootstrap/cache` in Dockerfile
- **Critical**: `CMD ["sh", "-c", "...$PORT"]` for Heroku compatibility
- Exposes 8000, respects `$PORT` env var

## Database

SQLite `:memory:` for testing/local. No migrations required for in-memory mode.

To use file-based SQLite: set `DB_DATABASE=/absolute/path/database.sqlite` in `.env`.

## TypeSpec Contracts

Directory `api/` contains authoritative API specification:
- `main.tsp` — TypeSpec contract (OpenAPI 3.1.0)
- `tspconfig.yaml` — emitter config

**DO NOT modify** unless explicitly asked — these are the source of truth.

## Common Mistakes to Avoid

1. **Don't add /api prefix in routes** — Laravel 11 auto-adds it for api.php routes
2. **Don't modify TypeSpec files** in `api/` — they're specification, not implementation
3. **Run `make install` first** — dependencies not installed in environment
4. **Use `make dev` not manual commands** — ensures proxy alignment (8000→5173)
5. **Check SlotService for business rules** — 14 days, weekdays, 9-18h only

## Testing

- **Backend**: PHPUnit via `php artisan test`
- **Frontend**: Playwright E2E via `npx playwright test`
- Tests located in `backend/tests/` and `frontend/tests/`

## Environment Setup

Required locally:
- PHP 8.2+ with sqlite, pdo_sqlite
- Composer
- Node.js 20+

Or use Docker: `make build && docker run -p 8000:8000 calendar-app`
