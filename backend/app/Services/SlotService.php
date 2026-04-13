<?php

namespace App\Services;

use Carbon\Carbon;
use Carbon\CarbonPeriod;

/**
 * Сервис для работы со слотами бронирования
 * 
 * БИЗНЕС-ПРАВИЛА:
 * - Сетка строится с шагом 15 минут (00, 15, 30, 45)
 * - Доступность: только будни (Пн-Пт), 09:00–18:00
 * - Окно бронирования: 14 дней от текущей даты
 */
class SlotService
{
    /**
     * Генерация слотов для указанного типа события и даты
     *
     * @param string $eventTypeId UUID типа события
     * @param string $date Дата в формате Y-m-d
     * @param int $durationMinutes Длительность (15 или 30)
     * @return array Массив слотов
     */
    public function generateSlots(string $eventTypeId, string $date, int $durationMinutes): array
    {
        // TODO: Реализовать генерацию слотов с учетом:
        // 1. Проверки что дата в пределах 14 дней
        // 2. Проверки что дата - будний день
        // 3. Генерации слотов с 09:00 до 18:00 с шагом 15 минут
        // 4. Проверки занятости слотов через BookingService
        
        return [
            // Пример структуры ответа
            'date' => $date,
            'event_type_id' => $eventTypeId,
            'slots' => [], // Заполнить реальными слотами
        ];
    }

    /**
     * Проверка, является ли дата рабочим днем
     */
    public function isBusinessDay(string $date): bool
    {
        $carbon = Carbon::parse($date);
        return $carbon->isWeekday();
    }

    /**
     * Проверка, находится ли дата в окне бронирования (14 дней)
     */
    public function isWithinBookingWindow(string $date): bool
    {
        $targetDate = Carbon::parse($date)->startOfDay();
        $maxDate = Carbon::now()->addDays(14)->endOfDay();
        $minDate = Carbon::now()->startOfDay();
        
        return $targetDate->between($minDate, $maxDate);
    }
}
