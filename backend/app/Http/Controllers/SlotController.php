<?php

namespace App\Http\Controllers;

use App\Actions\ListAvailableSlotsAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Контроллер слотов
 */
class SlotController extends Controller
{
    /**
     * GET /slots
     * Получить доступные слоты для типа события на указанную дату
     * 
     * Query params:
     * - eventTypeId: UUID типа события
     * - date: Дата в формате Y-m-d
     */
    public function index(Request $request, ListAvailableSlotsAction $action): JsonResponse
    {
        $validated = $request->validate([
            'eventTypeId' => 'required|string|uuid',
            'date' => 'required|date_format:Y-m-d',
        ]);

        $slots = $action->execute(
            $validated['eventTypeId'],
            $validated['date']
        );

        return response()->json($slots);
    }
}
