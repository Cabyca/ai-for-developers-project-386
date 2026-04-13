<?php

namespace App\Actions;

use App\Models\Booking;
use App\Services\BookingService;

/**
 * Action: Создание бронирования
 */
class CreateBookingAction
{
    public function __construct(
        private BookingService $bookingService
    ) {}

    /**
     * Выполнить создание бронирования
     *
     * @param string $eventTypeId UUID типа события
     * @param string $startsAt Время начала (ISO 8601)
     * @param string $guestName Имя гостя
     * @param string $guestEmail Email гостя
     * @param string|null $comment Комментарий
     * @return array ['booking' => Booking] или ['error' => 'conflict', 'message' => string]
     */
    public function execute(
        string $eventTypeId,
        string $startsAt,
        string $guestName,
        string $guestEmail,
        ?string $comment = null
    ): array {
        // TODO: Реализовать:
        // 1. Получение EventType и проверку существования
        // 2. Расчет endsAt
        // 3. Проверку доступности слота
        // 4. Создание бронирования или возврат ошибки 409
        
        return ['booking' => new Booking()]; // Заглушка
    }
}
