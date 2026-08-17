import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function LoadingBar() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    let hideTimeout
    let finishTimeout
    const raf = window.requestAnimationFrame(() => {
      setVisible(true)
      setProgress(25)

      hideTimeout = window.setTimeout(() => {
        setProgress(88)
        finishTimeout = window.setTimeout(() => {
          setProgress(100)
          window.setTimeout(() => {
            setVisible(false)
            setProgress(0)
          }, 180)
        }, 220)
      }, 120)
    })

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(hideTimeout)
      window.clearTimeout(finishTimeout)
    }
  }, [location.pathname, location.search, location.hash])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[120] h-[3px] w-full overflow-hidden">
      <div className="h-full w-full bg-[#081425]/20" />
      <div
        className="absolute left-0 top-0 h-full rounded-r-full bg-gradient-to-r from-auth-cyan-charge via-auth-volt-blue to-auth-cyan-charge shadow-[0_0_18px_rgba(56,221,224,0.55)] transition-[width,opacity] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: progress ? 1 : 0 }}
      />
    </div>
  )
}
