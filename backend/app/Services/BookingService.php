<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\EventType;
use Carbon\Carbon;

/**
 * Сервис для работы с бронированиями
 * 
 * БИЗНЕС-ПРАВИЛА:
 * - Глобальная проверка занятости: один интервал — одна бронь
 * - Проверка конфликтов по времени для всех типов событий
 * - Проверка пересечения: starts_at < existing_end AND ends_at > existing_start
 */
class BookingService
{
    private SlotService $slotService;

    public function __construct(SlotService $slotService)
    {
        $this->slotService = $slotService;
    }

    /**
     * Проверка доступности слота
     *
     * Глобальная проверка: один временной интервал может иметь только одну бронь
     * независимо от типа события.
     *
     * @param string $startsAt Начало слота (ISO 8601)
     * @param string $endsAt Конец слота (ISO 8601)
     * @return bool true если слот свободен
     */
    public function isSlotAvailable(string $startsAt, string $endsAt): bool
    {
        return $this->slotService->isSlotAvailable($startsAt, $endsAt);
    }

    /**
     * Создание бронирования с проверкой конфликтов
     *
     * @param string $eventTypeId UUID типа события
     * @param string $startsAt Время начала (ISO 8601)
     * @param string $guestName Имя гостя
     * @param string $guestEmail Email гостя
     * @param string|null $comment Комментарий
     * @return array ['booking' => Booking] или ['error' => 'conflict', 'message' => string]
     */
    public function createBooking(
        string $eventTypeId,
        string $startsAt,
        string $guestName,
        string $guestEmail,
        ?string $comment = null
    ): array {
        // 1. Получаем EventType и проверяем существование
        $eventType = EventType::find($eventTypeId);
        if (!$eventType) {
            return [
                'error' => 'not_found',
                'message' => 'Тип события не найден',
            ];
        }

        // 2. Рассчитываем время окончания
        $endsAt = $this->slotService->calculateEndsAt($startsAt, $eventType->durationMinutes);

        // 3. Проверяем, что время начала находится в рабочих часах (09:00-18:00)
        $startTime = Carbon::parse($startsAt);
        $hour = (int) $startTime->format('H');
        if ($hour < 9 || $hour >= 18) {
            return [
                'error' => 'invalid_time',
                'message' => 'Время записи должно быть в диапазоне 09:00–18:00',
            ];
        }

        // 4. Проверяем, что дата — будний день
        if (!$startTime->isWeekday()) {
            return [
                'error' => 'invalid_day',
                'message' => 'Запись возможна только на будние дни',
            ];
        }

        // 5. Проверяем доступность слота (глобальная проверка)
        if (!$this->isSlotAvailable($startsAt, $endsAt)) {
            return [
                'error' => 'conflict',
                'message' => 'Это время только что заняли, выберите другое',
            ];
        }

        // 6. Создаем бронирование
        $booking = Booking::create([
            'eventTypeId' => $eventTypeId,
            'startsAt' => $startsAt,
            'endsAt' => $endsAt,
            'guestName' => $guestName,
            'guestEmail' => $guestEmail,
            'comment' => $comment,
        ]);

        // Загружаем связь с eventType для ответа
        $booking->load('eventType');

        return ['booking' => $booking];
    }

    /**
     * Получение всех бронирований с пагинацией (для админки)
     *
     * @param int $perPage Количество записей на странице
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllBookings(int $perPage = 20)
    {
        return Booking::with('eventType')
            ->orderBy('startsAt', 'desc')
            ->paginate($perPage);
    }

    /**
     * Получить бронирование по ID
     *
     * @param string $id UUID бронирования
     * @return Booking|null
     */
    public function getBookingById(string $id): ?Booking
    {
        return Booking::with('eventType')->find($id);
    }
}
