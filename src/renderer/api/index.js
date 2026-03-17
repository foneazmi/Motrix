import Api from './Api'

let apiInstance = null

/**
 * Get or create API singleton instance
 * @returns {Api} API instance
 */
export const getApi = () => {
  if (!apiInstance) {
    apiInstance = new Api()
  }
  return apiInstance
}

// Create instance for direct export
const api = getApi()

export default api
