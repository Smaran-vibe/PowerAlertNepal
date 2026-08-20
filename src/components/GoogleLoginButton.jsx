import { GoogleLogin } from '@react-oauth/google'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/errorHandler'
import toast from './Toast/toast'

export default function GoogleLoginButton({ onError }) {
    const { loginWithGoogle } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    async function handleSuccess(credentialResponse) {
        try {
            const authenticatedUser = await loginWithGoogle(credentialResponse.credential)
            toast.success('Welcome back!')
            const destination = location.state?.from || (authenticatedUser?.role === 'admin' ? '/admin' : '/')
            navigate(destination, { replace: true, state: location.state })
        } catch (err) {
            onError?.(getErrorMessage(err))
        }
    }

    return (
        <div className="flex justify-center">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => onError?.('Google sign-in failed. Please try again.')}
                theme="filled_black"
                shape="pill"
                width="100%"
            />
        </div>
    )
}