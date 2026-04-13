<?php

namespace App\Http\Controllers;

use App\Models\EventType;
use App\Actions\CreateEventTypeAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        $eventTypes = EventType::all();
        return response()->json($eventTypes);
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

        $eventType = $action->execute(
            $validated['title'],
            $validated['description'],
            $validated['durationMinutes']
        );

        return response()->json($eventType, 201);
    }
}
