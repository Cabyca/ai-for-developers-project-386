<?php

namespace App\Actions;

use App\Models\EventType;
use App\Services\SlotService;

/**
 * Action: Получение списка доступных слотов
 * 
 * Бизнес-правила:
 * - Получение EventType для определения durationMinutes
 * - Генерация слотов через SlotService с проверкой доступности
 * - Фильтрация слотов в пределах рабочего дня (09:00-18:00)
 * - Возврат только слотов в окне бронирования (14 дней)
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
        // 1. Получаем EventType для определения durationMinutes
        $eventType = EventType::find($eventTypeId);
        
        if (!$eventType) {
            return [
                'date' => $date,
                'event_type_id' => $eventTypeId,
                'slots' => [],
                'error' => 'Event type not found',
            ];
        }

        // 2. Генерируем слоты через SlotService
        $result = $this->slotService->generateSlots(
            $eventTypeId, 
            $date, 
            $eventType->durationMinutes
        );

        // 3. Форматируем ответ в соответствии с API контрактом
        return $result['slots'] ?? [];
    }

    /**
     * Форматировать слот для ответа API
     *
     * @param array $slot
     * @return array
     */
    public function formatSlot(array $slot): array
    {
        return [
            'startsAt' => $slot['startsAt'],
            'endsAt' => $slot['endsAt'],
            'isAvailable' => $slot['isAvailable'],
            'eventTypeId' => $slot['eventTypeId'],
        ];
    }
}
