import api from './api'

const MULTIPART_CONFIG = { headers: { 'Content-Type': undefined } }

export function createReport(formData) {
  return api.post('/api/reports', formData, MULTIPART_CONFIG).then(response => response.data)
}

export function getPublicReports(params) {
  return api.get('/api/public/reports', { params }).then((response) => response.data)
}

export function getMyReports(params) {
  return api.get('/api/reports/mine', { params }).then(response => response.data)
}

export function updateReport(id, formData) {
  return api.put(`/api/reports/${id}`, formData, MULTIPART_CONFIG).then(response => response.data)
}

export function deleteReport(id) {
  return api.delete(`/api/reports/${id}`).then(response => response.data)
}
