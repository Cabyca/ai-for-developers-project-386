import client from '../client.js'

/**
 * Create a new booking
 * @param {Object} bookingData
 * @param {string} bookingData.eventTypeId
 * @param {string} bookingData.startsAt - ISO datetime string
 * @param {string} bookingData.guestName
 * @param {string} bookingData.guestEmail
 * @param {string} [bookingData.comment]
 * @returns {Promise<{id: string, eventTypeId: string, startsAt: string, guestName: string, guestEmail: string, comment?: string}>}
 * @throws {Error} With code 'SLOT_CONFLICT' if 409 returned
 */
export async function createBooking(bookingData) {
  try {
    const response = await client.post('/bookings', bookingData)
    return response.data
  } catch (error) {
    // Пробрасываем ошибку с кодом конфликта для обработки в UI
    if (error.code === 'SLOT_CONFLICT') {
      throw error
    }
    
    // Другие ошибки API
    if (error.code === 'VALIDATION_ERROR') {
      const errorMsg = error.errors 
        ? Object.values(error.errors).flat().join(', ')
        : 'Ошибка валидации данных'
      throw new Error(errorMsg)
    }
    
    // Сетевая ошибка или другая неизвестная ошибка
    throw new Error(error.message || 'Не удалось создать бронирование. Попробуйте снова.')
  }
}

/**
 * Get all bookings (admin only)
 * @returns {Promise<Array>}
 */
export async function getBookings() {
  const response = await client.get('/admin/bookings')
  return response.data
}
