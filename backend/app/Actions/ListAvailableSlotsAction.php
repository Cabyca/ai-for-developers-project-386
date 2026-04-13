<?php

namespace App\Actions;

use App\Models\EventType;
use App\Services\SlotService;

/**
 * Action: Получение списка доступных слотов
 */
class ListAvailableSlotsAction
{
    public function __construct(
        private SlotService $slotService
    ) {}

    /**
     * Получить доступные слоты
     *
     * @param string $eventTypeId UUID типа события
     * @param string $date Дата в формате Y-m-d
     * @return array Массив слотов с флагом isAvailable
     */
    public function execute(string $eventTypeId, string $date): array
    {
        // TODO: Реализовать:
        // 1. Получение EventType для определения durationMinutes
        // 2. Генерацию слотов через SlotService
        // 3. Фильтрацию по доступности
        // 4. Возврат структурированного массива
        
        $eventType = new EventType(); // Заглушка
        $durationMinutes = $eventType->durationMinutes ?? 30;
        
        return $this->slotService->generateSlots($eventTypeId, $date, $durationMinutes);
    }
}
