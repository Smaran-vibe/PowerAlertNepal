import api from './api'

const ADMIN_BASE = '/api/admin'
const PUBLIC_BASE = '/api/public'

export function getAdminReports(params) {
  return api.get(`${ADMIN_BASE}/reports`, { params }).then((response) => response.data)
}

export function getAdminUsers(params) {
  return api.get(`${ADMIN_BASE}/users`, { params }).then((response) => response.data)
}

export function getAdminStats() {
  return api.get(`${ADMIN_BASE}/stats`).then((response) => response.data)
}

export function verifyReport(id) {
  return api.patch(`${ADMIN_BASE}/reports/${id}/verify`).then((response) => response.data)
}

export function resolveReport(id, estimatedRestoreTime) {
  return api
    .patch(`${ADMIN_BASE}/reports/${id}/resolve`, { estimatedRestoreTime })
    .then((response) => response.data)
}

export function rejectReport(id, rejectionReason) {
  return api
    .patch(`${ADMIN_BASE}/reports/${id}/reject`, { rejectionReason })
    .then((response) => response.data)
}

export function deleteReport(id) {
  return api.delete(`${ADMIN_BASE}/reports/${id}`).then((response) => response.data)
}

export function deactivateUser(id) {
  return api.patch(`${ADMIN_BASE}/users/${id}/deactivate`).then((response) => response.data)
}

export function getPublicNotices(params) {
  return api.get(`${PUBLIC_BASE}/notices`, { params }).then((response) => response.data)
}

export function createNotice(payload) {
  return api.post(`${ADMIN_BASE}/notices`, payload).then((response) => response.data)
}

export function updateNotice(id, payload) {
  return api.put(`${ADMIN_BASE}/notices/${id}`, payload).then((response) => response.data)
}

export function deleteNotice(id) {
  return api.delete(`${ADMIN_BASE}/notices/${id}`).then((response) => response.data)
}

export function getAdminAnnouncements(params) {
  return api.get(`${ADMIN_BASE}/announcements`, { params }).then((response) => response.data)
}

export function createAnnouncement(payload) {
  return api.post(`${ADMIN_BASE}/announcements`, payload).then((response) => response.data)
}

export function updateAnnouncement(id, payload) {
  return api.put(`${ADMIN_BASE}/announcements/${id}`, payload).then((response) => response.data)
}

export function deleteAnnouncement(id) {
  return api.delete(`${ADMIN_BASE}/announcements/${id}`).then((response) => response.data)
}
