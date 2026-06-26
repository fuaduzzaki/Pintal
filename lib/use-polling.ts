'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * Polls a callback at a given interval (default 10 s).
 * Automatically pauses when the tab is hidden and resumes + fires
 * immediately when the tab becomes visible again.
 */
export function usePolling(callback: () => void, intervalMs = 10_000) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => savedCallback.current()

    const id = setInterval(tick, intervalMs)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        tick() // refresh immediately when user returns
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [intervalMs])
}
