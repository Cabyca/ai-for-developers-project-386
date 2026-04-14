<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\EventType;
use Carbon\Carbon;

/**
 * Сервис для работы со слотами бронирования
 * 
 * БИЗНЕС-ПРАВИЛА:
 * - Сетка строится с шагом 15 минут (00, 15, 30, 45)
 * - Доступность: только будни (Пн-Пт), 09:00–18:00
 * - Окно бронирования: 14 дней от текущей даты
 * - Глобальная проверка занятости: starts_at < existing_end AND ends_at > existing_start
 */
class SlotService
{
    private const WORKDAY_START = '09:00';
    private const WORKDAY_END = '18:00';
    private const SLOT_STEP_MINUTES = 15;
    private const BOOKING_WINDOW_DAYS = 14;

    /**
     * Генерация слотов для указанного типа события и даты
     *
     * @param string $eventTypeId UUID типа события
     * @param string $date Дата в формате Y-m-d
     * @param int|null $durationMinutes Длительность (15 или 30), если null — берется из EventType
     * @return array Массив слотов с флагом isAvailable
     */
    public function generateSlots(string $eventTypeId, string $date, ?int $durationMinutes = null): array
    {
        // Получаем EventType для определения длительности
        $eventType = EventType::find($eventTypeId);
        if (!$eventType) {
            return [
                'date' => $date,
                'event_type_id' => $eventTypeId,
                'slots' => [],
                'error' => 'Event type not found',
            ];
        }

        $durationMinutes = $durationMinutes ?? $eventType->durationMinutes;

        // Проверяем бизнес-правила
        if (!$this->isBusinessDay($date)) {
            return [
                'date' => $date,
                'event_type_id' => $eventTypeId,
                'slots' => [],
            ];
        }

        if (!$this->isWithinBookingWindow($date)) {
            return [
                'date' => $date,
                'event_type_id' => $eventTypeId,
                'slots' => [],
            ];
        }

        // Получаем все существующие бронирования для этой даты
        $existingBookings = $this->getBookingsForDate($date);

        // Генерируем слоты с 09:00 до 18:00 с шагом 15 минут
        $slots = [];
        $startTime = Carbon::parse($date . ' ' . self::WORKDAY_START);
        $endTime = Carbon::parse($date . ' ' . self::WORKDAY_END);

        $currentSlot = $startTime->copy();

        while ($currentSlot->lt($endTime)) {
            $slotEnd = $currentSlot->copy()->addMinutes($durationMinutes);

            // Проверяем, что слот не выходит за пределы рабочего дня
            if ($slotEnd->gt($endTime)) {
                break;
            }

            $slotStartsAt = $currentSlot->toIso8601String();
            $slotEndsAt = $slotEnd->toIso8601String();

            // Проверяем доступность слота (нет пересечений с существующими бронированиями)
            $isAvailable = $this->isSlotAvailable($slotStartsAt, $slotEndsAt, $existingBookings);

            $slots[] = [
                'startsAt' => $slotStartsAt,
                'endsAt' => $slotEndsAt,
                'isAvailable' => $isAvailable,
                'eventTypeId' => $eventTypeId,
            ];

            // Переходим к следующему слоту (шаг 15 минут)
            $currentSlot->addMinutes(self::SLOT_STEP_MINUTES);
        }

        return [
            'date' => $date,
            'event_type_id' => $eventTypeId,
            'slots' => $slots,
        ];
    }

    /**
     * Проверка доступности конкретного временного интервала
     * 
     * Глобальная проверка: starts_at < existing_end AND ends_at > existing_start
     *
     * @param string $startsAt Начало слота (ISO 8601)
     * @param string $endsAt Конец слота (ISO 8601)
     * @param array|null $existingBookings Массив существующих бронирований (для оптимизации)
     * @return bool true если слот свободен
     */
    public function isSlotAvailable(string $startsAt, string $endsAt, ?array $existingBookings = null): bool
    {
        $slotStart = Carbon::parse($startsAt);
        $slotEnd = Carbon::parse($endsAt);

        // Если не переданы существующие бронирования — загружаем из БД
        if ($existingBookings === null) {
            $existingBookings = Booking::where(function ($query) use ($slotStart, $slotEnd) {
                $query->where('startsAt', '<', $slotEnd)
                      ->where('endsAt', '>', $slotStart);
            })->get()->toArray();
        }

        // Проверяем пересечение с каждым существующим бронированием
        foreach ($existingBookings as $booking) {
            $bookingStart = Carbon::parse($booking['startsAt']);
            $bookingEnd = Carbon::parse($booking['endsAt']);

            // Проверка пересечения: starts_at < existing_end AND ends_at > existing_start
            if ($slotStart->lt($bookingEnd) && $slotEnd->gt($bookingStart)) {
                return false; // Есть пересечение — слот занят
            }
        }

        return true; // Пересечений нет — слот свободен
    }

    /**
     * Получить все бронирования для конкретной даты
     *
     * @param string $date Дата в формате Y-m-d
     * @return array
     */
    private function getBookingsForDate(string $date): array
    {
        $dayStart = Carbon::parse($date . ' ' . self::WORKDAY_START);
        $dayEnd = Carbon::parse($date . ' ' . self::WORKDAY_END);

        return Booking::where(function ($query) use ($dayStart, $dayEnd) {
            $query->where('startsAt', '<', $dayEnd)
                  ->where('endsAt', '>', $dayStart);
        })->get()->toArray();
    }

    /**
     * Проверка, является ли дата рабочим днем (Пн-Пт)
     */
    public function isBusinessDay(string $date): bool
    {
        $carbon = Carbon::parse($date);
        return $carbon->isWeekday();
    }

    /**
     * Проверка, находится ли дата в окне бронирования (14 дней от текущей даты)
     */
    public function isWithinBookingWindow(string $date): bool
    {
        $targetDate = Carbon::parse($date)->startOfDay();
        $maxDate = Carbon::now()->addDays(self::BOOKING_WINDOW_DAYS)->endOfDay();
        $minDate = Carbon::now()->startOfDay();
        
        return $targetDate->between($minDate, $maxDate);
    }

    /**
     * Рассчитать время окончания на основе времени начала и длительности
     *
     * @param string $startsAt Время начала (ISO 8601)
     * @param int $durationMinutes Длительность в минутах
     * @return string Время окончания (ISO 8601)
     */
    public function calculateEndsAt(string $startsAt, int $durationMinutes): string
    {
        return Carbon::parse($startsAt)->addMinutes($durationMinutes)->toIso8601String();
    }
}
