<?php

namespace Database\Seeders;

use App\Models\EventType;
use Illuminate\Database\Seeder;

/**
 * Class DatabaseSeeder
 * 
 * Сидер для начального заполнения базы данных.
 * Создает два типа событий: 15 минут и 30 минут.
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Создаем дефолтные типы только если таблица пуста
        if (EventType::count() === 0) {
            EventType::create([
                'title' => 'Встреча 15 минут',
                'description' => 'Короткий звонок для быстрого обсуждения вопросов.',
                'durationMinutes' => 15,
            ]);

            EventType::create([
                'title' => 'Встреча 30 минут',
                'description' => 'Полноценная консультация с детальным разбором ситуации.',
                'durationMinutes' => 30,
            ]);
        }
    }
}
