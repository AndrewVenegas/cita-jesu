import { motion } from 'framer-motion'
import DodgingButton from '../components/DodgingButton.jsx'

// Escena 1: la pregunta que no puede rechazar 😏
export default function Intro({ onYes }) {
  return (
    <motion.div
      className="stage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div
        style={{ fontSize: '4.2rem' }}
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      >
        🎡
      </motion.div>

      <div className="card">
        <p className="hand">Hola Jesu 👋</p>
        <h1 className="title">Por un juego…<br />¿aceptarías salir conmigo? 🥺</h1>
        <p className="subtitle" style={{ marginTop: 10 }}>
          (spoiler: hay premio sorpresa al final 🎁)
        </p>

        <div
          style={{
            display: 'flex',
            gap: 14,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 26,
            flexWrap: 'wrap',
          }}
        >
          <motion.button
            className="btn-primary"
            onClick={onYes}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 1.3 }}
            whileTap={{ scale: 0.94 }}
          >
            ¡SÍ! 💖
          </motion.button>
          <DodgingButton />
        </div>
      </div>

      <p className="hand" style={{ opacity: 0.8 }}>tip: el botón “no” tiene vida propia 🙈</p>
    </motion.div>
  )
}
