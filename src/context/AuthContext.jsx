import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import * as authService from '../services/auth.service'
import { setAccessToken as setApiAccessToken, setOnAuthFailure, resetAuthState } from '../services/api'

const AuthContext = createContext(null)
const AUTH_SYNC_KEY = 'poweralert-auth-sync'

function readAuthSync() {
  try {
    const raw = localStorage.getItem(AUTH_SYNC_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeAuthSync(payload) {
  try {
    localStorage.setItem(AUTH_SYNC_KEY, JSON.stringify(payload))
  } catch {
    // Ignore storage failures and keep the in-memory session working.
  }
}

function clearAuthSync() {
  try {
    localStorage.removeItem(AUTH_SYNC_KEY)
  } catch {
    // Ignore storage failures.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [isRestoring, setIsRestoring] = useState(true)

  function applyAuthState(nextUser, nextToken) {
    setUser(nextUser)
    setAccessToken(nextToken)
    setApiAccessToken(nextToken)
    setIsRestoring(false)
  }

  useEffect(() => {
    setOnAuthFailure(() => {
      resetAuthState()
      setAccessToken(null)
      setUser(null)
      clearAuthSync()
      toast.error('Your session has expired. Please log in again.')
    })

    return () => {
      setOnAuthFailure(null)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      try {
        const refreshResult = await authService.refresh()
        const token = refreshResult.data.accessToken

        const meResult = await authService.getMe()

        if (!cancelled) {
          const restoredUser = meResult.data.user
          applyAuthState(restoredUser, token)
          writeAuthSync({ user: restoredUser, accessToken: token })
        }
      } catch {
        if (!cancelled) {
          setAccessToken(null)
          setUser(null)
          setApiAccessToken(null)
          clearAuthSync()
        }
      } finally {
        if (!cancelled) {
          setIsRestoring(false)
        }
      }
    }

    restoreSession()

    function handleStorage(event) {
      if (event.key !== AUTH_SYNC_KEY) return

      const synced = event.newValue ? readAuthSync() : null

      if (!synced) {
        resetAuthState()
        setAccessToken(null)
        setUser(null)
        setIsRestoring(false)
        return
      }

      setAccessToken(synced.accessToken || null)
      setUser(synced.user || null)
      setApiAccessToken(synced.accessToken || null)
      setIsRestoring(false)
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      cancelled = true
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  async function signup({ fullName, email, password }) {
    const result = await authService.register({ fullName, email, password })
    return result
  }

  async function login({ email, password }) {
    const result = await authService.login({ email, password })
    const authenticatedUser = result.data.user

    applyAuthState(authenticatedUser, result.data.accessToken)
    writeAuthSync({ user: authenticatedUser, accessToken: result.data.accessToken })

    return authenticatedUser
  }

  async function logout() {
    try {
      await authService.logout()
      toast.success('Logged out successfully')
    } finally {
      setAccessToken(null)
      setUser(null)
      resetAuthState()
      clearAuthSync()
    }
  }

  const value = useMemo(() => ({
    user,
    accessToken,
    isAuthenticated: Boolean(user),
    isRestoring,
    signup,
    login,
    logout,
  }), [user, accessToken, isRestoring])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
