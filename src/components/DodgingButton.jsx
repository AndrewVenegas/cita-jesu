import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

// Botón "NO" imposible de clickear: huye a una posición aleatoria cuando
// el mouse se acerca o cuando se intenta tocar en el celular.
const TEXTS = [
  'No 😬',
  '¿segura? 🥺',
  'no seas mala 😭',
  'porfa noo 💔',
  'el botón está roto 😵',
  'inténtalo igual 😏',
  'jamás 🙅',
  'ni lo sueñes 😂',
]

export default function DodgingButton() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [step, setStep] = useState(0)
  const areaRef = useRef(null)

  const flee = () => {
    const area = areaRef.current?.getBoundingClientRect()
    // Rango de movimiento (px) relativo a su posición original.
    const rangeX = area ? Math.min(area.width * 0.35, 140) : 120
    const x = (Math.random() * 2 - 1) * rangeX
    const y = (Math.random() * 2 - 1) * 90 - 10
    setPos({ x, y })
    setStep((s) => (s + 1) % TEXTS.length)
  }

  return (
    <span
      ref={areaRef}
      style={{ position: 'relative', display: 'inline-block', minWidth: 120, minHeight: 52 }}
    >
      <motion.button
        type="button"
        className="btn-ghost"
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        onMouseEnter={flee}
        onPointerDown={(e) => {
          // En móvil huye ANTES de que se registre el tap.
          e.preventDefault()
          flee()
        }}
        onClick={(e) => {
          e.preventDefault()
          flee()
        }}
        style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap', touchAction: 'none' }}
      >
        {TEXTS[step]}
      </motion.button>
    </span>
  )
}
