<?php

namespace App\Actions;

use App\Models\EventType;
use App\Services\SlotService;

/**
 * Action: Создание типа события
 */
class CreateEventTypeAction
{
    public function __construct(
        private SlotService $slotService
    ) {}

    /**
     * Выполнить создание типа события
     *
     * @param string $title Название
     * @param string $description Описание
     * @param int $durationMinutes Длительность (15 или 30)
     * @return EventType
     */
    public function execute(string $title, string $description, int $durationMinutes): EventType
    {
        // TODO: Реализовать:
        // 1. Валидацию durationMinutes (только 15 или 30)
        // 2. Создание записи в БД
        // 3. Возврат созданного EventType
        
        return new EventType(); // Заглушка
    }
}
