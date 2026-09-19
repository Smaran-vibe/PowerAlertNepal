import api from './api'

export function sendContactMessage({ name, email, message }) {
    return api
        .post('/api/contact', { name, email, message })
        .then(response => response.data)
}