'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface DrawerState {
  embedUrl: string
  title: string
}

interface EmbedDrawerContextValue {
  openDrawer: (embedUrl: string, title: string) => void
}

const EmbedDrawerContext = createContext<EmbedDrawerContextValue | null>(null)

export function useEmbedDrawer() {
  const ctx = useContext(EmbedDrawerContext)
  if (!ctx) throw new Error('useEmbedDrawer must be used inside EmbedDrawerProvider')
  return ctx
}

export function EmbedDrawerProvider({ children }: { children: React.ReactNode }) {
  const [drawer, setDrawer] = useState<DrawerState | null>(null)

  const openDrawer = useCallback((embedUrl: string, title: string) => {
    setDrawer({ embedUrl, title })
  }, [])

  const closeDrawer = useCallback(() => setDrawer(null), [])

  useEffect(() => {
    if (!drawer) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [drawer, closeDrawer])

  return (
    <EmbedDrawerContext.Provider value={{ openDrawer }}>
      {children}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
            />
            <motion.div
              key="drawer"
              className="fixed top-0 right-0 h-full w-full max-w-lg z-50 bg-canvas shadow-2xl flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-stroke shrink-0">
                <p className="text-sm font-medium text-ink line-clamp-1 pr-4">{drawer.title}</p>
                <button
                  onClick={closeDrawer}
                  className="p-1.5 rounded-md hover:bg-surface transition-colors text-ink-muted hover:text-ink"
                  aria-label="Close embed"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={drawer.embedUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={drawer.title}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </EmbedDrawerContext.Provider>
  )
}
