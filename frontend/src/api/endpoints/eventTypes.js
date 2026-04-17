import client from '../client.js'

/**
 * Get list of available event types
 * @returns {Promise<Array<{id: string, title: string, description: string, durationMinutes: number}>>}
 */
export async function listEventTypes() {
  const response = await client.get('/event-types')
  return response.data
}

/**
 * Create new event type (admin only)
 * @param {Object} eventTypeData
 * @param {string} eventTypeData.title
 * @param {string} eventTypeData.description
 * @param {number} eventTypeData.durationMinutes - 15 or 30
 * @returns {Promise<{id: string, title: string, description: string, durationMinutes: number}>}
 * @throws {Error} With code 'DUPLICATE_TITLE' if 409 returned
 */
export async function createEventType(eventTypeData) {
  try {
    const response = await client.post('/admin/event-types', eventTypeData)
    return response.data
  } catch (error) {
    // Handle 409 Conflict (duplicate title)
    if (error.response?.status === 409) {
      const conflictError = new Error(error.response.data?.message || 'Тип события с таким названием уже существует')
      conflictError.code = 'DUPLICATE_TITLE'
      conflictError.status = 409
      conflictError.data = error.response.data
      throw conflictError
    }
    
    // Handle 422 Validation Error
    if (error.response?.status === 422) {
      const validationError = new Error('Ошибка валидации данных')
      validationError.code = 'VALIDATION_ERROR'
      validationError.errors = error.response.data?.errors
      throw validationError
    }
    
    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      const serverError = new Error(error.response.data?.message || 'Ошибка сервера')
      serverError.code = 'SERVER_ERROR'
      serverError.status = error.response.status
      throw serverError
    }
    
    // Re-throw other errors
    throw error
  }
}
