<?php

namespace App\Actions;

use App\Models\EventType;

/**
 * Action: Создание типа события
 */
class CreateEventTypeAction
{
    /**
     * Выполнить создание типа события
     *
     * @param string $title Название
     * @param string $description Описание
     * @param int $durationMinutes Длительность (15 или 30)
     * @return EventType
     * @throws \InvalidArgumentException Если durationMinutes не 15 или 30
     */
    public function execute(string $title, string $description, int $durationMinutes): EventType
    {
        // Валидация durationMinutes (только 15 или 30)
        if (!in_array($durationMinutes, [15, 30], true)) {
            throw new \InvalidArgumentException('Duration must be 15 or 30 minutes');
        }

        // Создание записи в БД
        $eventType = EventType::create([
            'title' => $title,
            'description' => $description,
            'durationMinutes' => $durationMinutes,
        ]);

        return $eventType;
    }
}
