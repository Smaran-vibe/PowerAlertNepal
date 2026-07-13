import React, { createContext, useContext, useMemo, useState } from 'react'

const USERS_KEY = 'pa_users'
const SESSION_KEY = 'pa_session'

const AuthContext = createContext(null)

function readUsers() {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function readSession() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readUsers())
  const [session, setSession] = useState(() => readSession())

  function persistUsers(nextUsers) {
    setUsers(nextUsers)
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers))
  }

  function persistSession(nextSession) {
    setSession(nextSession)
    if (nextSession) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  }

  function signup({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const existing = readUsers().find(user => user.email === normalizedEmail)
    if (existing) {
      return { ok: false, message: 'An account with this email already exists.' }
    }

    const nextUser = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password,
    }

    const nextUsers = [...readUsers(), nextUser]
    persistUsers(nextUsers)
    return { ok: true }
  }

  function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const found = readUsers().find(user => user.email === normalizedEmail && user.password === password)
    if (!found) {
      return { ok: false, message: 'Invalid email or password.' }
    }

    persistSession({ id: found.id, name: found.name, email: found.email })
    return { ok: true }
  }

  function logout() {
    persistSession(null)
  }

  const value = useMemo(() => ({
    users,
    session,
    isAuthenticated: Boolean(session),
    signup,
    login,
    logout,
  }), [users, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
