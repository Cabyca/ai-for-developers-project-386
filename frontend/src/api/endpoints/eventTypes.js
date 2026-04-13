import client from '../client.js'

/**
 * Get list of available event types
 * @returns {Promise<Array<{id: string, title: string, description: string, durationMinutes: number}>>}
 */
export async function listEventTypes() {
  const response = await client.get('/event-types')
  return response.data
}
