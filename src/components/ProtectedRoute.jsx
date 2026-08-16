import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, isRestoring, user } = useAuth()
    const location = useLocation()

    if (isRestoring) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-sm text-gray-500">Loading...</p>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />
    }

    return children
}
