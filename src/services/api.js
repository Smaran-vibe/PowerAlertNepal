import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

let currentAccessToken = null

export function setAccessToken(token) {
    currentAccessToken = token
}

let onAuthFailure = null

export function setOnAuthFailure(callback) {
    onAuthFailure = callback
}

api.interceptors.request.use((config) => {
    if (currentAccessToken) {
        config.headers.Authorization = `Bearer ${currentAccessToken}`
    }
    return config
})

const AUTH_ENDPOINTS_EXCLUDED_FROM_REFRESH = [
    '/api/auth/refresh',
    '/api/auth/login',
    '/api/auth/register',
]

function isExcludedFromRefresh(url = '') {
    return AUTH_ENDPOINTS_EXCLUDED_FROM_REFRESH.some((path) => url.includes(path))
}

let isRefreshing = false
let pendingRequests = []

function queueRequest(callback) {
    pendingRequests.push(callback)
}

function resolveQueue(newToken) {
    pendingRequests.forEach((callback) => callback(newToken))
    pendingRequests = []
}

export function resetAuthState() {
    currentAccessToken = null
    isRefreshing = false
    resolveQueue(null)
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const status = error.response?.status

        if (
            status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            isExcludedFromRefresh(originalRequest.url)
        ) {
            return Promise.reject(error)
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                queueRequest((newToken) => {
                    if (!newToken) {
                        reject(error)
                        return
                    }
                    originalRequest._retry = true
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    resolve(api(originalRequest))
                })
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            const refreshResponse = await api.post('/api/auth/refresh')
            const newToken = refreshResponse.data.data.accessToken

            setAccessToken(newToken)
            isRefreshing = false
            resolveQueue(newToken)

            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
        } catch (refreshError) {
            resetAuthState()

            if (onAuthFailure) {
                onAuthFailure()
            }

            return Promise.reject(refreshError)
        }
    }
)

export default api