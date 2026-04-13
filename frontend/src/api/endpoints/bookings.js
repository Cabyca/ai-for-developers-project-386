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
  const response = await client.post('/bookings', bookingData)
  return response.data
}
