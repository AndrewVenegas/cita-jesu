import { motion } from 'framer-motion'
import Hearts from '../components/Hearts.jsx'

// Escena 2: reglas + presentación de las 3 vidas
export default function Rules({ onStart }) {
  return (
    <motion.div
      className="stage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="card">
        <div style={{ fontSize: '3rem' }}>🥰</div>
        <h1 className="title">¡Sabía que dirías que sí!</h1>
        <p className="subtitle" style={{ margin: '12px 0 18px' }}>
          Ahora demuéstrame cuánto te acuerdas de lo nuestro. <br />
          Son <b>3 preguntas</b>. Cada error te cuesta una vida 💔
        </p>

        <div style={{ margin: '10px 0 6px' }}>
          <Hearts lives={3} />
        </div>
        <p className="hand">tienes 3 vidas… ¿o quizás infinitas? 😏</p>

        <motion.button
          className="btn-primary"
          onClick={onStart}
          whileTap={{ scale: 0.94 }}
          style={{ marginTop: 24 }}
        >
          ¡A jugar! 🎮
        </motion.button>
      </div>
    </motion.div>
  )
}
