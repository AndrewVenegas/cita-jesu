import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

// Botón "NO" IMPOSIBLE de clickear. Es un botón FIJO en la pantalla que, cuando
// el cursor se acerca, DESAPARECE y REAPARECE en otro punto del viewport
// GARANTIZADO lejos del mouse (usando la posición real del cursor al reaparecer).
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

const RADIUS = 140 // px: distancia a la que se activa la huida
const MIN_FAR = 340 // px: distancia mínima garantizada al reaparecer
const COOLDOWN = 170 // ms: mínimo entre saltos
const BLINK = 70 // ms: duración del parpadeo (corto → el mouse no alcanza a llegar)
const PAD = 14 // px: margen contra los bordes del viewport

export default function DodgingButton() {
  const [pos, setPos] = useState(null) // { x, y } en coords de viewport
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)
  const btnRef = useRef(null)
  const anchorRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 }) // última posición real del cursor
  const lastFlee = useRef(0)
  const hideTimer = useRef(0)

  // Elige un punto del viewport lejos del cursor (usa mouse.current, en vivo).
  const pickSpot = useCallback(() => {
    const btn = btnRef.current?.getBoundingClientRect()
    const bw = btn?.width || 130
    const bh = btn?.height || 50
    const maxX = Math.max(PAD, window.innerWidth - bw - PAD)
    const maxY = Math.max(PAD, window.innerHeight - bh - PAD)
    const { x: mx, y: my } = mouse.current

    const far = []
    let best = null
    let bestDist = -1
    for (let k = 0; k < 60; k++) {
      const x = PAD + Math.random() * (maxX - PAD)
      const y = PAD + Math.random() * (maxY - PAD)
      const cx = x + bw / 2
      const cy = y + bh / 2
      const d = Math.hypot(cx - mx, cy - my)
      if (d > bestDist) {
        bestDist = d
        best = { x, y }
      }
      if (d > MIN_FAR) far.push({ x, y })
    }
    // Preferimos un punto aleatorio entre los suficientemente lejanos;
    // si ninguno cumple (pantalla muy chica), usamos el más lejano posible.
    return far.length ? far[Math.floor(Math.random() * far.length)] : best
  }, [])

  const flee = useCallback(() => {
    const now = performance.now()
    if (now - lastFlee.current < COOLDOWN) return
    lastFlee.current = now

    // Se teletransporta LEJOS al instante (usando la posición viva del mouse),
    // así jamás queda un momento debajo del cursor. El fade es solo cosmético.
    setPos(pickSpot())
    setStep((s) => (s + 1) % TEXTS.length)
    setVisible(false)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setVisible(true), BLINK)
  }, [pickSpot])

  // Posición inicial: donde está el ancla dentro del layout.
  useEffect(() => {
    const a = anchorRef.current?.getBoundingClientRect()
    const btn = btnRef.current?.getBoundingClientRect()
    if (a) {
      setPos({
        x: a.left + a.width / 2 - (btn?.width || 130) / 2,
        y: a.top + a.height / 2 - (btn?.height || 50) / 2,
      })
    }
    return () => clearTimeout(hideTimer.current)
  }, [])

  // Listener global: registra el mouse y huye si se acerca.
  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (!visible) return
      const btn = btnRef.current?.getBoundingClientRect()
      if (!btn) return
      const cx = btn.left + btn.width / 2
      const cy = btn.top + btn.height / 2
      if (Math.hypot(e.clientX - cx, e.clientY - cy) < RADIUS) flee()
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [flee, visible])

  return (
    <>
      {/* Ancla invisible que reserva el espacio en el layout */}
      <span ref={anchorRef} className="dodge-anchor" aria-hidden="true" />

      <motion.button
        ref={btnRef}
        type="button"
        className="btn-ghost"
        // Movimiento instantáneo (x/y) + fade → parece que desaparece y reaparece.
        animate={{
          x: pos?.x ?? 0,
          y: pos?.y ?? 0,
          opacity: pos && visible ? 1 : 0,
          scale: visible ? 1 : 0.6,
        }}
        transition={{
          x: { duration: 0 },
          y: { duration: 0 },
          opacity: { duration: 0.09 },
          scale: { duration: 0.09 },
        }}
        onMouseEnter={flee}
        onPointerDown={(e) => {
          e.preventDefault()
          flee()
        }}
        onClick={(e) => e.preventDefault()}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 30,
          whiteSpace: 'nowrap',
          touchAction: 'none',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        {TEXTS[step]}
      </motion.button>
    </>
  )
}
