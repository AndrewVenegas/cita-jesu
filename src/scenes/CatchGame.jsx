import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hearts from '../components/Hearts.jsx'
import { useSound } from '../hooks/useSound.js'

// Escena 4 (sorpresa): atrapar corazones 🧺💕
// Mueve la canasta con el mouse/dedo. Meta: atrapar GOAL corazones.
// Solo los CORAZONES suman. Cada 💣 resta una vida; al llegar a 0 vidas
// se regalan de nuevo (porque la amo 💝) y se reinicia el mini-juego.
const GOAL = 10
const START_LIVES = 3
const HEART_EMOJIS = ['💖', '💗', '💓', '💕'] // solo corazones (sin flores)

export default function CatchGame({ onWin }) {
  const areaRef = useRef(null)
  const basketX = useRef(0.5) // 0..1
  const items = useRef([]) // {id,x,y,vy,emoji,bad}
  const idRef = useRef(0)
  const rafRef = useRef(0)
  const lastSpawn = useRef(0)
  const livesRef = useRef(START_LIVES) // fuente de verdad para el loop

  const [caught, setCaught] = useState(0)
  const [lives, setLives] = useState(START_LIVES)
  const [render, setRender] = useState([])
  const [basketPct, setBasketPct] = useState(50)
  const [showIntro, setShowIntro] = useState(true) // modal explicativo inicial
  const [started, setStarted] = useState(false)
  const [giftLives, setGiftLives] = useState(false) // modal de recarga de vidas
  const [hurt, setHurt] = useState(false) // temblor al perder una vida

  const { pop, boom } = useSound()

  const move = useCallback((clientX) => {
    const area = areaRef.current?.getBoundingClientRect()
    if (!area) return
    let pct = (clientX - area.left) / area.width
    pct = Math.max(0.06, Math.min(0.94, pct))
    basketX.current = pct
    setBasketPct(pct * 100)
  }, [])

  // Deja el tablero limpio para (re)empezar.
  const resetBoard = useCallback(() => {
    items.current = []
    lastSpawn.current = 0
    setRender([])
    setCaught(0)
  }, [])

  const startGame = useCallback(() => {
    resetBoard()
    livesRef.current = START_LIVES
    setLives(START_LIVES)
    setShowIntro(false)
    setGiftLives(false)
    setStarted(true)
  }, [resetBoard])

  const flashHurt = useCallback(() => {
    setHurt(true)
    setTimeout(() => setHurt(false), 420)
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
            emoji: bad ? '💣' : HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
            bad,
          })
        }
        // move + collide
        const basketPx = basketX.current
        const keep = []
        let gameOver = false
        for (const it of items.current) {
          it.y += it.vy
          const catchZone = it.y > 82 && it.y < 96
          const near = Math.abs(it.x - basketPx) < 0.11
          if (catchZone && near) {
            if (it.bad) {
              // 💣 agarró una bomba → pierde una vida
              boom()
              const nl = livesRef.current - 1
              livesRef.current = nl
              setLives(nl)
              flashHurt()
              if (nl <= 0) {
                gameOver = true
                break
              }
              continue // la bomba se elimina; sigue jugando
            }
            // 💖 corazón → suma punto
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
        if (gameOver) {
          cancelAnimationFrame(rafRef.current)
          items.current = []
          setRender([])
          setStarted(false)
          setGiftLives(true) // modal: te regalo vidas porque te amo
          return
        }
        items.current = keep
        setRender(items.current.map((i) => ({ ...i })))
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [started, onWin, pop, boom, flashHurt])

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

      <Hearts lives={lives} />
      <div className="hand" style={{ fontSize: '1.6rem', marginTop: 2 }}>
        {caught} / {GOAL} 💖
      </div>

      <motion.div
        ref={areaRef}
        className="catch-area"
        onMouseMove={(e) => move(e.clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        animate={hurt ? { x: [-10, 10, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
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
      </motion.div>

      <p className="hand" style={{ opacity: 0.8 }}>tú puedes mi amorcito, eres crack 💪</p>

      {/* Modal explicativo del mini-juego */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="card"
              initial={{ scale: 0.6, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              style={{ maxWidth: 440 }}
            >
              <motion.div
                style={{ fontSize: '3.2rem' }}
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              >
                🧺💕
              </motion.div>
              <h1 className="title" style={{ fontSize: '1.6rem' }}>¿Cómo se juega?</h1>
              <div style={{ textAlign: 'left', margin: '12px 0 4px', lineHeight: 1.7 }}>
                <p className="subtitle" style={{ margin: 0 }}>
                  👉 Mueve la <b>canasta</b> 🧺 con el <b>dedo</b> (o el mouse) por la pantalla.
                </p>
                <p className="subtitle" style={{ margin: '8px 0 0' }}>
                  💖 Atrapa <b>{GOAL} corazones</b> que van cayendo para ganar.
                </p>
                <p className="subtitle" style={{ margin: '8px 0 0' }}>
                  💣 <b>¡Cuidado con las bombas!</b> Cada una te quita una vida ❤️.
                  Si te quedas sin vidas… tranqui, te regalo más 😌
                </p>
              </div>
              <motion.button
                className="btn-primary"
                onClick={startGame}
                whileTap={{ scale: 0.94 }}
                style={{ marginTop: 14 }}
              >
                ¡Estoy lista! 💪
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: te regalo vidas porque te amo (se quedó sin vidas) */}
      <AnimatePresence>
        {giftLives && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="card"
              initial={{ scale: 0.6, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              style={{ maxWidth: 420 }}
            >
              <motion.div
                style={{ fontSize: '3.4rem' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                💝
              </motion.div>
              <h1 className="title" style={{ fontSize: '1.7rem' }}>
                Te explotaron las bombas 💥
              </h1>
              <p className="subtitle" style={{ margin: '12px 0 4px' }}>
                pero como te amo <b>demasiado</b>, te regalo <b>3 vidas más</b> y
                volvemos a empezar 🥹
              </p>
              <div style={{ margin: '14px 0' }}>
                <Hearts lives={START_LIVES} />
              </div>
              <motion.button
                className="btn-primary"
                onClick={startGame}
                whileTap={{ scale: 0.94 }}
              >
                ¡A darle de nuevo! 💕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
