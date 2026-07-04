import { motion, AnimatePresence } from 'framer-motion'

// Muestra las vidas restantes como corazones ❤️. Máximo 3 llenos.
export default function Hearts({ lives, max = 3 }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: max }).map((_, i) => {
        const alive = i < lives
        return (
          <AnimatePresence mode="popLayout" key={i}>
            <motion.span
              key={alive ? 'full' : 'empty'}
              initial={{ scale: 0.4 }}
              animate={{ scale: alive ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.4 }}
              style={{ fontSize: '1.8rem', filter: alive ? 'none' : 'grayscale(1)', opacity: alive ? 1 : 0.45 }}
            >
              {alive ? '❤️' : '🤍'}
            </motion.span>
          </AnimatePresence>
        )
      })}
    </div>
  )
}
