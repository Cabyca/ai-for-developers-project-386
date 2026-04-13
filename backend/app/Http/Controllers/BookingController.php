<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Actions\CreateBookingAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Контроллер бронирований
 */
class BookingController extends Controller
{
    /**
     * POST /bookings
     * Создать новое бронирование
     * 
     * Возвращает 409 Conflict если слот занят
     */
    public function store(Request $request, CreateBookingAction $action): JsonResponse
    {
        $validated = $request->validate([
            'eventTypeId' => 'required|string|uuid',
            'startsAt' => 'required|date',
            'guestName' => 'required|string|max:100',
            'guestEmail' => 'required|email',
            'comment' => 'nullable|string|max:500',
        ]);

        $result = $action->execute(
            $validated['eventTypeId'],
            $validated['startsAt'],
            $validated['guestName'],
            $validated['guestEmail'],
            $validated['comment'] ?? null
        );

        // Если есть ошибка конфликта - вернуть 409
        if (isset($result['error']) && $result['error'] === 'conflict') {
            return response()->json([
                'code' => 'SLOT_OCCUPIED',
                'message' => $result['message'] ?? 'Выбранный слот уже занят',
            ], 409);
        }

        return response()->json($result['booking'], 201);
    }

    /**
     * GET /admin/bookings
     * Получить список всех бронирований (только для админов)
     */
    public function adminIndex(): JsonResponse
    {
        $bookings = Booking::with('eventType')->get();
        return response()->json($bookings);
    }
}
