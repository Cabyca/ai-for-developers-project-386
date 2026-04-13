/**
 * Custom error classes for API handling
 */

export class ApiError extends Error {
  constructor(message, code, status) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Это время только что заняли, выберите другое') {
    super(message, 'SLOT_CONFLICT', 409)
    this.name = 'ConflictError'
  }
}

export class ValidationError extends ApiError {
  constructor(errors = {}) {
    super('Ошибка валидации данных', 'VALIDATION_ERROR', 422)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Ошибка сети. Проверьте подключение к интернету.') {
    super(message, 'NETWORK_ERROR', 0)
    this.name = 'NetworkError'
  }
}

/**
 * Handle API error and return user-friendly message
 * @param {Error} error
 * @returns {{message: string, code: string, isRetryable: boolean}}
 */
export function handleApiError(error) {
  // Already handled errors with codes
  if (error.code === 'SLOT_CONFLICT') {
    return {
      message: error.message,
      code: 'SLOT_CONFLICT',
      isRetryable: true
    }
  }
  
  if (error.code === 'VALIDATION_ERROR') {
    return {
      message: 'Пожалуйста, проверьте введённые данные',
      code: 'VALIDATION_ERROR',
      isRetryable: true
    }
  }
  
  // Network errors
  if (!error.response) {
    return {
      message: 'Ошибка сети. Проверьте подключение и попробуйте снова.',
      code: 'NETWORK_ERROR',
      isRetryable: true
    }
  }
  
  // HTTP status based errors
  const status = error.response?.status
  
  switch (status) {
    case 400:
      return {
        message: 'Некорректный запрос. Пожалуйста, проверьте данные.',
        code: 'BAD_REQUEST',
        isRetryable: false
      }
    case 404:
      return {
        message: 'Запрашиваемые данные не найдены.',
        code: 'NOT_FOUND',
        isRetryable: false
      }
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        message: 'Ошибка сервера. Пожалуйста, попробуйте позже.',
        code: 'SERVER_ERROR',
        isRetryable: true
      }
    default:
      return {
        message: 'Произошла неизвестная ошибка. Пожалуйста, попробуйте снова.',
        code: 'UNKNOWN_ERROR',
        isRetryable: true
      }
  }
}
