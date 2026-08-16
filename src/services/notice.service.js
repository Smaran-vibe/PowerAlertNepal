import api from './api'

export function getPublicNotices(params) {
  return api.get('/api/public/notices', { params }).then((response) => response.data)
}
