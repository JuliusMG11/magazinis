'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setTheme(stored ?? preferred)
  }, [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(next)
  }

  if (!mounted) {
    return <div className="w-8 h-8" />
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="flex items-center justify-center w-8 h-8 rounded-md text-ink-muted hover:text-ink hover:bg-card transition-colors"
    >
      {theme === 'light' ? (
        <Moon size={16} strokeWidth={1.5} />
      ) : (
        <Sun size={16} strokeWidth={1.5} />
      )}
    </button>
  )
}
