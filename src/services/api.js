import axios from 'axios'

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'https://15larasupalagi.vercel.app'

const api = axios.create({
  baseURL: apiBaseUrl.replace(/\/$/, ''),
  headers: {
    Accept: 'application/json',
  },
  timeout: 15000,
})

export { apiBaseUrl }
export default api