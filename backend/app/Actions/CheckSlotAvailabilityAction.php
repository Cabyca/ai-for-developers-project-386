<?php

namespace App\Actions;

use App\Services\BookingService;
use Carbon\Carbon;

/**
 * Action: Проверка доступности слота
 */
class CheckSlotAvailabilityAction
{
    public function __construct(
        private BookingService $bookingService
    ) {}

    /**
     * Проверить доступность слота
     *
     * @param string $startsAt Начало (ISO 8601)
     * @param int $durationMinutes Длительность в минутах
     * @return array ['available' => bool, 'conflict' => Booking|null]
     */
    public function execute(string $startsAt, int $durationMinutes): array
    {
        $endsAt = Carbon::parse($startsAt)->addMinutes($durationMinutes)->toIso8601String();
        
        $isAvailable = $this->bookingService->isSlotAvailable($startsAt, $endsAt);
        
        return [
            'available' => $isAvailable,
            'conflict' => $isAvailable ? null : new \stdClass(), // TODO: Вернуть реальный конфликт
        ];
    }
}
