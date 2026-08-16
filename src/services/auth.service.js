import api from './api'

export function register({ fullName, email, password }) {
    return api
        .post('/api/auth/register', { fullName, email, password })
        .then(response => response.data)
}

export function login({ email, password }) {
    return api
        .post('/api/auth/login', { email, password })
        .then(response => response.data)
}

export function refresh() {
    return api.post('/api/auth/refresh').then(response => response.data)
}

export function getMe() {
    return api.get('/api/auth/me').then(response => response.data)
}

export function logout() {
    return api.post('/api/auth/logout').then(response => response.data)
}