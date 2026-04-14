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
        // Создаем тип события на 15 минут
        EventType::firstOrCreate(
            ['durationMinutes' => 15],
            [
                'title' => 'Встреча 15 минут',
                'description' => 'Короткий звонок для быстрого обсуждения вопросов.',
            ]
        );

        // Создаем тип события на 30 минут
        EventType::firstOrCreate(
            ['durationMinutes' => 30],
            [
                'title' => 'Встреча 30 минут',
                'description' => 'Полноценная консультация с детальным разбором ситуации.',
            ]
        );
    }
}
