import client from '../client.js'

/**
 * Get available slots for an event type on a specific date
 * @param {string} eventTypeId - UUID of the event type
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array<{startsAt: string, endsAt: string, isAvailable: boolean, eventTypeId: string}>>}
 */
export async function getSlots(eventTypeId, date) {
  const response = await client.get('/slots', {
    params: {
      eventTypeId,
      date
    }
  })
  return response.data
}
