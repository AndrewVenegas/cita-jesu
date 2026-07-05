import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hearts from '../components/Hearts.jsx'
import { questions, wrongMessages } from '../data/questions.js'
import { useSound } from '../hooks/useSound.js'
import { useConfetti } from '../hooks/useConfetti.js'

// Baraja un array (Fisher-Yates) sin mutar el original.
const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Escena 3: las 3 preguntas de la relación.
// Nunca puede perder de verdad: al llegar a 0 vidas, se regalan 3 más 💝
export default function Quiz({ onWin }) {
  // Barajamos las opciones de cada pregunta una sola vez al montar,
  // así la correcta no queda siempre primera y el orden se mantiene estable.
  const [deck] = useState(() =>
    questions.map((q) => ({ ...q, options: shuffle(q.options) })),
  )
  const [index, setIndex] = useState(0)
  const [lives, setLives] = useState(3)
  const [locked, setLocked] = useState(null) // índice de opción elegida
  const [feedback, setFeedback] = useState(null) // { ok, text }
  const [giftLives, setGiftLives] = useState(false)
  const [shake, setShake] = useState(false)

  const { good, bad } = useSound()
  const { burst } = useConfetti()
  const q = deck[index]

  const pick = (opt, i) => {
    if (locked !== null || giftLives) return
    setLocked(i)

    if (opt.correct) {
      good()
      burst({ particleCount: 50, spread: 60 })
      setFeedback({ ok: true, text: q.right })
      setTimeout(() => {
        if (index + 1 >= questions.length) {
          onWin()
        } else {
          setIndex((n) => n + 1)
          setLocked(null)
          setFeedback(null)
        }
      }, 1300)
    } else {
      bad()
      setShake(true)
      setTimeout(() => setShake(false), 450)
      const msg = wrongMessages[Math.floor(Math.random() * wrongMessages.length)]
      setFeedback({ ok: false, text: msg })
      const next = lives - 1
      setLives(next)

      setTimeout(() => {
        if (next <= 0) {
          setGiftLives(true) // muestra overlay de "te doy 3 vidas más"
        } else {
          setLocked(null)
          setFeedback(null)
        }
      }, 1100)
    }
  }

  const acceptGift = () => {
    setLives(3)
    setGiftLives(false)
    setLocked(null)
    setFeedback(null)
  }

  return (
    <motion.div
      className="stage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Hearts lives={lives} />
      <p className="hand" style={{ marginTop: -4 }}>
        Pregunta {index + 1} de {questions.length}
      </p>

      <motion.div
        className="card"
        animate={shake ? { x: [-10, 10, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ fontSize: '2.6rem' }}>{q.emoji}</div>
        <h1 className="title" style={{ fontSize: '1.6rem' }}>{q.question}</h1>
        <p className="subtitle" style={{ margin: '6px 0 18px' }}>{q.hint}</p>

        <div style={{ display: 'grid', gap: 12 }}>
          {q.options.map((opt, i) => {
            const chosen = locked === i
            let bg = '#fff'
            let color = 'var(--pink-deep)'
            let border = '2px solid var(--pink-soft)'
            // Solo coloreamos la opción ELEGIDA: verde si acertó, rojo si falló.
            // Nunca revelamos cuál era la correcta cuando se equivoca.
            if (chosen) {
              if (opt.correct) {
                bg = 'var(--mint)'
                color = '#0c6b56'
                border = '2px solid var(--mint)'
              } else {
                bg = '#ffd9d9'
                color = '#b02a2a'
                border = '2px solid #ffb0b0'
              }
            }
            return (
              <motion.button
                key={i}
                onClick={() => pick(opt, i)}
                whileTap={{ scale: 0.97 }}
                disabled={locked !== null || giftLives}
                style={{
                  background: bg,
                  color,
                  border,
                  borderRadius: 16,
                  padding: '14px 16px',
                  fontSize: '1.05rem',
                  transition: 'all 0.2s',
                }}
              >
                {opt.label}
                {chosen && opt.correct ? ' ✅' : ''}
                {chosen && !opt.correct ? ' ❌' : ''}
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="hand"
              style={{
                marginTop: 16,
                fontSize: '1.5rem',
                color: feedback.ok ? '#0c6b56' : '#b02a2a',
              }}
            >
              {feedback.text}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Overlay: te regalo 3 vidas más porque te amo */}
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
                Te quedaste sin vidas…
              </h1>
              <p className="subtitle" style={{ margin: '12px 0 4px' }}>
                pero como te amo <b>demasiado</b>, te regalo <b>3 vidas más</b> 🥹
              </p>
              <p className="hand">(y las que necesites, mi amorcito)</p>
              <div style={{ margin: '14px 0' }}>
                <Hearts lives={3} />
              </div>
              <motion.button className="btn-primary" onClick={acceptGift} whileTap={{ scale: 0.94 }}>
                ¡Gracias mi vida! 💕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
