import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSound } from '../hooks/useSound.js'

// Escena 4 (sorpresa): atrapar corazones 🧺💕
// Mueve la canasta con el mouse/dedo. Meta: atrapar GOAL corazones.
const GOAL = 10
const FALL_EMOJIS = ['💖', '💗', '💓', '💕', '🩷', '🌸']

export default function CatchGame({ onWin }) {
  const areaRef = useRef(null)
  const basketX = useRef(0.5) // 0..1
  const items = useRef([]) // {id,x,y,vy,emoji,bad}
  const idRef = useRef(0)
  const rafRef = useRef(0)
  const lastSpawn = useRef(0)

  const [caught, setCaught] = useState(0)
  const [render, setRender] = useState([])
  const [basketPct, setBasketPct] = useState(50)
  const [started, setStarted] = useState(false)
  const { pop } = useSound()

  const caughtRef = useRef(0)
  caughtRef.current = caught

  const move = useCallback((clientX) => {
    const area = areaRef.current?.getBoundingClientRect()
    if (!area) return
    let pct = (clientX - area.left) / area.width
    pct = Math.max(0.06, Math.min(0.94, pct))
    basketX.current = pct
    setBasketPct(pct * 100)
  }, [])

  useEffect(() => {
    if (!started) return
    const loop = (t) => {
      const area = areaRef.current?.getBoundingClientRect()
      if (area) {
        // spawn
        if (t - lastSpawn.current > 620) {
          lastSpawn.current = t
          const bad = Math.random() < 0.16
          items.current.push({
            id: idRef.current++,
            x: 0.06 + Math.random() * 0.88,
            y: -6,
            vy: 0.28 + Math.random() * 0.22,
            emoji: bad ? '💣' : FALL_EMOJIS[Math.floor(Math.random() * FALL_EMOJIS.length)],
            bad,
          })
        }
        // move + collide
        const basketPx = basketX.current
        const keep = []
        for (const it of items.current) {
          it.y += it.vy
          const catchZone = it.y > 82 && it.y < 96
          const near = Math.abs(it.x - basketPx) < 0.11
          if (catchZone && near && !it.bad) {
            pop()
            setCaught((c) => {
              const n = c + 1
              if (n >= GOAL) {
                cancelAnimationFrame(rafRef.current)
                setTimeout(onWin, 350)
              }
              return n
            })
            continue // atrapado, se elimina
          }
          if (it.y < 104) keep.push(it)
        }
        items.current = keep
        setRender(items.current.map((i) => ({ ...i })))
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [started, onWin, pop])

  return (
    <motion.div
      className="stage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ userSelect: 'none' }}
    >
      <h1 className="title" style={{ fontSize: '1.5rem' }}>Mini-juego sorpresa 🎁</h1>
      <p className="subtitle">
        ¡Atrapa <b>{GOAL} corazones</b> con la canasta! (esquiva las 💣)
      </p>
      <div className="hand" style={{ fontSize: '1.6rem' }}>
        {caught} / {GOAL} 💖
      </div>

      <div
        ref={areaRef}
        className="catch-area"
        onMouseMove={(e) => move(e.clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        onTouchStart={(e) => { setStarted(true); move(e.touches[0].clientX) }}
        onMouseDown={(e) => { setStarted(true); move(e.clientX) }}
      >
        {!started && (
          <div className="catch-hint">
            <p className="hand" style={{ fontSize: '1.7rem' }}>👆 toca/mueve aquí para empezar</p>
          </div>
        )}

        {render.map((it) => (
          <span
            key={it.id}
            className="fall-item"
            style={{ left: `${it.x * 100}%`, top: `${it.y}%` }}
          >
            {it.emoji}
          </span>
        ))}

        <span className="basket" style={{ left: `${basketPct}%` }}>🧺</span>
      </div>

      <p className="hand" style={{ opacity: 0.8 }}>tú puedes mi amor, eres crack 💪</p>
    </motion.div>
  )
}
