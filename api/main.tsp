import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

@service({
  title: "Календарь звонков",
  version: "1.0.0"
})
@server("https://api.example.com", "Production API")
namespace BookingCalendar;

/** UUID формат для всех идентификаторов */
scalar UUID extends string;

/** Допустимые значения длительности встречи (в минутах): 15 или 30 */
alias DurationMinutes = 15 | 30;

@doc("Тип события (встречи)")
model EventType {
  @key
  id: UUID;

  @maxLength(100)
  title: string;

  @maxLength(500)
  description: string;

  /** Длительность встречи в минутах (только 15 или 30) */
  durationMinutes: DurationMinutes;
}

@doc("Бронирование встречи")
model Booking {
  @key
  @readOnly
  id: UUID;

  eventTypeId: UUID;
  startsAt: utcDateTime;

  @maxLength(100)
  guestName: string;

  @format("email")
  guestEmail: string;

  @maxLength(500)
  comment?: string;
}

@doc("""
  Временной слот для бронирования.
  
  БИЗНЕС-ПРАВИЛО: Сетка слотов строится с шагом 15 минут (00, 15, 30, 45),
  что соответствует допустимым значениям durationMinutes (15 или 30).
  Например, для durationMinutes=15: 09:00-09:15, 09:15-09:30...
  Для durationMinutes=30: 09:00-09:30, 09:30-10:00...
  
  БИЗНЕС-ИНВАРИАНТЫ:
  1. Доступность слотов: только будни (Пн-Пт), 09:00–18:00 по местному времени
  2. Окно бронирования: максимум 14 дней от текущей даты
  3. Глобальная проверка занятости: один временной интервал может иметь 
     только одну бронь независимо от типа события
""")
model Slot {
  startsAt: utcDateTime;
  endsAt: utcDateTime;
  isAvailable: boolean;
  eventTypeId: UUID;
}

@doc("Ошибка")
@error
model Error {
  code: string;
  message: string;
}

model CreateEventTypeRequest {
  @maxLength(100)
  title: string;

  @maxLength(500)
  description: string;

  /** Длительность встречи в минутах (только 15 или 30) */
  durationMinutes: DurationMinutes;
}

model CreateBookingRequest {
  eventTypeId: UUID;
  startsAt: utcDateTime;

  @maxLength(100)
  guestName: string;

  @format("email")
  guestEmail: string;

  @maxLength(500)
  comment?: string;
}

@route("/api")
namespace Public {
  @doc("Получить список доступных типов встреч")
  @get
  op listEventTypes(): EventType[];

  @doc("""
    Получить доступные слоты для типа события на указанную дату.
    
    Возвращает слоты с шагом 15 минут в соответствии с durationMinutes выбранного типа события.
  """)
  @get
  @route("/slots")
  op getSlots(
    @query eventTypeId: UUID,
    @query date: plainDate
  ): Slot[];

  @doc("""
    Создать новое бронирование.
    
    Возвращает 409 Conflict если выбранный слот уже занят (глобальная проверка).
  """)
  @post
  @route("/bookings")
  op createBooking(@body request: CreateBookingRequest): 
    | {
        @statusCode _: 201;
        @body booking: Booking;
      }
    | {
        @statusCode _: 409;
        @body error: Error;
      };
}

@route("/api/admin")
namespace Admin {
  @doc("Создать новый тип события")
  @post
  @route("/event-types")
  op createEventType(@body request: CreateEventTypeRequest): {
    @statusCode _: 201;
    @body eventType: EventType;
  };

  @doc("Получить список всех бронирований")
  @get
  @route("/bookings")
  op listAllBookings(): Booking[];
}
