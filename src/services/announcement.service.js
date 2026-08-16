import api from './api'

export function getPublicAnnouncements(params) {
  return api.get('/api/public/announcements', { params }).then((response) => response.data)
}
