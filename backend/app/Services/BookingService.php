<?php

namespace App\Services;

use App\Models\Booking;

/**
 * Сервис для работы с бронированиями
 * 
 * БИЗНЕС-ПРАВИЛА:
 * - Глобальная проверка занятости: один интервал — одна бронь
 * - Проверка конфликтов по времени для всех типов событий
 */
class BookingService
{
    /**
     * Проверка доступности слота
     *
     * @param string $startsAt Начало слота (ISO 8601)
     * @param string $endsAt Конец слота (ISO 8601)
     * @return bool true если слот свободен
     */
    public function isSlotAvailable(string $startsAt, string $endsAt): bool
    {
        // TODO: Реализовать проверку:
        // 1. Поиск бронирований, пересекающихся с указанным интервалом
        // 2. Вернуть true если пересечений нет
        
        return true; // Заглушка
    }

    /**
     * Создание бронирования с проверкой конфликтов
     *
     * @param array $data Данные бронирования
     * @return Booking|array Booking при успехе, ['error' => 'conflict'] при конфликте
     */
    public function createBooking(array $data): Booking|array
    {
        // TODO: Реализовать:
        // 1. Расчет endsAt на основе startsAt и durationMinutes из EventType
        // 2. Проверку доступности через isSlotAvailable
        // 3. Создание бронирования или возврат ошибки конфликта
        
        return new Booking(); // Заглушка
    }

    /**
     * Получение всех бронирований (для админки)
     */
    public function getAllBookings(): array
    {
        // TODO: Реализовать получение списка с пагинацией
        return [];
    }
}
