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

export function googleLogin({ idToken }) {
    return api
        .post('/api/auth/google', { idToken })
        .then(response => response.data)
}

export function verifyEmail({ email, otp }) {
    return api
        .post('/api/auth/verify-email', { email, otp })
        .then(response => response.data)
}

export function resendVerificationOtp({ email }) {
    return api
        .post('/api/auth/resend-verification-otp', { email })
        .then(response => response.data)
}

export function forgotPassword({ email }) {
    return api
        .post('/api/auth/forgot-password', { email })
        .then(response => response.data)
}

export function verifyResetOtp({ email, otp }) {
    return api
        .post('/api/auth/verify-reset-otp', { email, otp })
        .then(response => response.data)
}

export function resetPassword({ resetToken, newPassword }) {
    return api
        .post('/api/auth/reset-password', { resetToken, newPassword })
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