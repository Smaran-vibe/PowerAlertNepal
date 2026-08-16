import api from './api'

export function getPublicStats() {
  return api.get('/api/public/stats').then((response) => response.data)
}
