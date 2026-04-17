<?php

namespace App\Http\Controllers;

use App\Models\EventType;
use App\Actions\CreateEventTypeAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Контроллер типов событий
 */
class EventTypeController extends Controller
{
    /**
     * GET /event-types
     * Получить список доступных типов встреч
     */
    public function index(): JsonResponse
    {
        try {
            $eventTypes = EventType::all();
            return response()->json($eventTypes);
        } catch (\Exception $e) {
            Log::error('Failed to fetch event types', ['error' => $e->getMessage()]);
            return response()->json([
                'code' => 'FETCH_ERROR',
                'message' => 'Не удалось получить список типов событий',
            ], 500);
        }
    }

    /**
     * POST /admin/event-types
     * Создать новый тип события (только для админов)
     */
    public function store(Request $request, CreateEventTypeAction $action): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:500',
            'durationMinutes' => 'required|integer|in:15,30',
        ]);

        try {
            $eventType = $action->execute(
                $validated['title'],
                $validated['description'],
                $validated['durationMinutes']
            );

            return response()->json($eventType, 201);
        } catch (\Exception $e) {
            Log::error('EventType creation error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'code' => 'CREATE_ERROR',
                'message' => 'Ошибка при создании типа события: ' . $e->getMessage(),
            ], 500);
        }
    }
}
