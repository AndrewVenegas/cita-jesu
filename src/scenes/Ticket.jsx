import { useEffect } from 'react'
import { motion } from 'framer-motion'
import FerrisWheel from '../components/FerrisWheel.jsx'
import { useConfetti } from '../hooks/useConfetti.js'
import { useSound } from '../hooks/useSound.js'

// Escena 5: el premio 🎟️ — invitación a La Gran Rueda
export default function Ticket({ onReplay }) {
  const { celebrate, burst } = useConfetti()
  const { win } = useSound()

  useEffect(() => {
    burst()
    celebrate(3000)
    win()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      className="stage"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h1
        className="title"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        style={{ fontSize: '2rem' }}
      >
        ¡GANASTE, mi amorcito! 🏆💕
      </motion.h1>

      <FerrisWheel size={230} />

      {/* Ticket estilo entrada con borde dentado */}
      <motion.div
        className="ticket"
        initial={{ rotate: -3, y: 30, opacity: 0 }}
        animate={{ rotate: -1.5, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
        whileHover={{ rotate: 0, scale: 1.02 }}
      >
        <div className="ticket-top">
          <span>🎡 GRAN RUEDA · SANTIAGO</span>
          <span>ADMIT ♥ ONE</span>
        </div>

        <div className="ticket-body">
          <p className="ticket-label">🎟️ VALE POR</p>
          <p className="ticket-prize">1 cita en La Gran Rueda</p>

          <div className="ticket-details">
            <p>📍 <b>Parque Araucano</b>, Santiago</p>
            <p>📅 <b>Miércoles 8 de julio</b></p>
            <p>🎪 Evento presencial · La Gran Rueda Chile</p>
          </div>

          <a
            href="https://www.puntoticket.com/la-gran-rueda-chile"
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-link"
          >
            ver info del evento 🔗
          </a>

          <p className="ticket-sign">con amor, <b>Andriu</b> 💌</p>
        </div>

        <div className="ticket-stub">Nº 08·07 · ∞ vidas · 100% amor</div>
      </motion.div>

      {/* Mensaje del comprobante */}
      <motion.div
        className="proof"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        📸 ¡Mándale un pantallazo a Andriu como comprobante!
      </motion.div>

      <button className="btn-ghost" onClick={onReplay} style={{ marginTop: 6 }}>
        volver a jugar 🔁
      </button>
    </motion.div>
  )
}
