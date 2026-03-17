/**
 * Error Handler Utility
 * Centralized error handling for the application
 */

import { Message } from 'element-ui'

/**
 * Error types
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  API: 'API_ERROR',
  FILE: 'FILE_ERROR',
  CONFIG: 'CONFIG_ERROR',
  TASK: 'TASK_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

/**
 * User-friendly error messages
 */
const errorMessages = {
  [ErrorTypes.NETWORK]: 'Network connection error. Please check your connection.',
  [ErrorTypes.API]: 'Service unavailable. Please try again later.',
  [ErrorTypes.FILE]: 'File operation failed. Please check file permissions.',
  [ErrorTypes.CONFIG]: 'Configuration error. Please check your settings.',
  [ErrorTypes.TASK]: 'Task operation failed. Please try again.',
  [ErrorTypes.UNKNOWN]: 'An unexpected error occurred.'
}

/**
 * Classify error type based on error message or code
 * @param {Error} error 
 * @returns {string} Error type
 */
export const classifyError = (error) => {
  if (!error) {
    return ErrorTypes.UNKNOWN
  }

  const message = error.message?.toLowerCase() || ''
  const code = error.code?.toLowerCase() || ''

  if (message.includes('network') || message.includes('connection') || code === 'enotfound') {
    return ErrorTypes.NETWORK
  }

  if (message.includes('api') || message.includes('rpc') || code?.startsWith('aria2')) {
    return ErrorTypes.API
  }

  if (message.includes('file') || message.includes('path') || code === 'enoent') {
    return ErrorTypes.FILE
  }

  if (message.includes('config') || message.includes('setting')) {
    return ErrorTypes.CONFIG
  }

  if (message.includes('task') || message.includes('download')) {
    return ErrorTypes.TASK
  }

  return ErrorTypes.UNKNOWN
}

/**
 * Get user-friendly error message
 * @param {Error} error 
 * @param {string} [fallbackMessage] 
 * @returns {string}
 */
export const getErrorMessage = (error, fallbackMessage) => {
  if (!error) {
    return errorMessages[ErrorTypes.UNKNOWN]
  }

  // If error has a custom user message, use it
  if (error.userMessage) {
    return error.userMessage
  }

  // Classify and return appropriate message
  const errorType = classifyError(error)
  return fallbackMessage || errorMessages[errorType]
}

/**
 * Handle error with appropriate action
 * @param {Error} error 
 * @param {Object} options
 * @param {boolean} [options.showToast=true] - Show toast notification
 * @param {boolean} [options.logError=true] - Log error for debugging
 * @param {string} [options.fallbackMessage] - Custom fallback message
 * @param {Function} [options.onError] - Custom error handler
 */
export const handleError = (error, options = {}) => {
  const {
    showToast = true,
    logError = true,
    fallbackMessage,
    onError
  } = options

  // Log error for debugging (in development)
  if (logError && process.env.NODE_ENV === 'development') {
    console.error('[ErrorHandler]', error)
  }

  // Get user-friendly message
  const message = getErrorMessage(error, fallbackMessage)

  // Show toast notification
  if (showToast && Message) {
    Message.error({
      message,
      duration: 5000,
      showClose: true
    })
  }

  // Call custom error handler if provided
  if (onError && typeof onError === 'function') {
    onError(error)
  }

  // Return error for chaining
  return error
}

/**
 * Create a wrapped function with error handling
 * @param {Function} fn - Function to wrap
 * @param {Object} [options] - Error handling options
 * @returns {Function}
 */
export const withErrorHandling = (fn, options = {}) => {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error, options)
      throw error
    }
  }
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} options
 * @param {number} [options.retries=3] - Max retries
 * @param {number} [options.delay=1000] - Initial delay in ms
 * @param {number} [options.factor=2] - Exponential factor
 * @returns {Promise<*>}
 */
export const retry = async (fn, options = {}) => {
  const {
    retries = 3,
    delay = 1000,
    factor = 2
  } = options

  let lastError
  let currentDelay = delay

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (i === retries) {
        break
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, currentDelay))
      currentDelay *= factor
    }
  }

  throw lastError
}

export default {
  ErrorTypes,
  classifyError,
  getErrorMessage,
  handleError,
  withErrorHandling,
  retry
}
