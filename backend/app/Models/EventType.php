<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * Модель типа события (встречи)
 * 
 * @property string $id UUID
 * @property string $title Название
 * @property string $description Описание
 * @property int $durationMinutes Длительность (15 или 30)
 */
class EventType extends Model
{
    use HasUuids;

    protected $table = 'event_types';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'description',
        'durationMinutes',
    ];

    protected $casts = [
        'durationMinutes' => 'integer',
    ];

    /**
     * Бронирования этого типа события
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'eventTypeId');
    }
}
