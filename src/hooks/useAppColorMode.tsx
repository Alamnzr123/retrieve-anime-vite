import { useCallback, useEffect, useState } from 'react'

type Mode = 'light' | 'dark'
const KEY = 'app:color-mode'
const EVENT = 'app:color-mode-changed'

function readMode(): Mode {
  try {
    const attr = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-color-mode') : null
    if (attr === 'light' || attr === 'dark') return attr
    const stored = localStorage.getItem(KEY)
    if (stored === 'light' || stored === 'dark') return stored
    } catch {
      /* ignore read errors */
    }
  return 'light'
}

export function useAppColorMode() {
  const [mode, setMode] = useState<Mode>(() => readMode())

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === KEY) {
        setMode(readMode())
      }
    }

    function onCustom() {
      setMode(readMode())
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener(EVENT, onCustom)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(EVENT, onCustom)
    }
  }, [])

  const toggle = useCallback(() => {
    const next: Mode = mode === 'light' ? 'dark' : 'light'
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* ignore storage set errors */
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-color-mode', next)
    }
    // dispatch custom event to notify same-tab listeners
    try {
      window.dispatchEvent(new Event(EVENT))
    } catch {
      /* ignore custom event dispatch errors */
    }
    setMode(next)
  }, [mode])

  return { mode, toggle }
}
