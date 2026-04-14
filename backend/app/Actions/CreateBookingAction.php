<?php

namespace App\Actions;

use App\Models\Booking;
use App\Models\EventType;
use App\Services\BookingService;

/**
 * Action: Создание бронирования
 * 
 * Бизнес-правила:
 * - Проверка существования EventType
 * - Автоматический расчет endsAt на основе durationMinutes
 * - Глобальная проверка доступности (409 Conflict если занято)
 * - Возврат созданного бронирования или ошибки конфликта
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
        // Делегируем создание бронирования в BookingService
        $result = $this->bookingService->createBooking(
            $eventTypeId,
            $startsAt,
            $guestName,
            $guestEmail,
            $comment
        );

        // Если есть ошибка — возвращаем как есть (контроллер превратит в 409)
        if (isset($result['error'])) {
            return $result;
        }

        // Возвращаем успешно созданное бронирование
        return $result;
    }

    /**
     * Получить детали бронирования для ответа API
     *
     * @param Booking $booking
     * @return array
     */
    public function formatBookingResponse(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'eventTypeId' => $booking->eventTypeId,
            'startsAt' => $booking->startsAt->toIso8601String(),
            'guestName' => $booking->guestName,
            'guestEmail' => $booking->guestEmail,
            'comment' => $booking->comment,
            'eventType' => $booking->eventType ? [
                'id' => $booking->eventType->id,
                'title' => $booking->eventType->title,
                'description' => $booking->eventType->description,
                'durationMinutes' => $booking->eventType->durationMinutes,
            ] : null,
        ];
    }
}
