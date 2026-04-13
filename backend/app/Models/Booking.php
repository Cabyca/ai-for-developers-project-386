<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * Модель бронирования
 * 
 * @property string $id UUID
 * @property string $eventTypeId UUID типа события
 * @property string $startsAt Время начала (ISO 8601)
 * @property string $endsAt Время окончания (ISO 8601)
 * @property string $guestName Имя гостя
 * @property string $guestEmail Email гостя
 * @property string|null $comment Комментарий
 */
class Booking extends Model
{
    use HasUuids;

    protected $table = 'bookings';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'eventTypeId',
        'startsAt',
        'endsAt',
        'guestName',
        'guestEmail',
        'comment',
    ];

    protected $casts = [
        'startsAt' => 'datetime',
        'endsAt' => 'datetime',
    ];

    /**
     * Тип события этого бронирования
     */
    public function eventType()
    {
        return $this->belongsTo(EventType::class, 'eventTypeId');
    }
}
