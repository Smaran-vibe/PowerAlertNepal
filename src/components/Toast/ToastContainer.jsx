import React, { useEffect, useState } from 'react'
import Toast from './Toast.jsx'
import toastApi, { subscribe } from './toast.js'

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    return subscribe(setToasts)
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-[45vh] z-[100] mx-auto flex max-w-[calc(100vw-2rem)] flex-col gap-3 sm:inset-x-auto sm:right-4 sm:bottom-[42vh] sm:max-w-md"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => toastApi.dismiss(toast.id)}
        />
      ))}
    </div>
  )
}
