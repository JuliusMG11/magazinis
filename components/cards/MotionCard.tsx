'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface MotionCardProps {
  children: ReactNode
  delay?: number
}

export function MotionCard({ children, delay = 0 }: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{
        y: -2,
        boxShadow: 'var(--shadow-card-hover)',
        transition: { duration: 0.15, ease: 'easeOut' },
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}
