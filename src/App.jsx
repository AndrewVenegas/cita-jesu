import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import BgHearts from './components/BgHearts.jsx'
import Intro from './scenes/Intro.jsx'
import Rules from './scenes/Rules.jsx'
import Quiz from './scenes/Quiz.jsx'
import CatchGame from './scenes/CatchGame.jsx'
import Ticket from './scenes/Ticket.jsx'
import './styles/scenes.css'

const WON_KEY = 'jesu-gano-la-cita'

export default function App() {
  // Si ya ganó antes, mostrar el ticket directo (se puede volver a jugar).
  const [scene, setScene] = useState(() =>
    localStorage.getItem(WON_KEY) ? 'ticket' : 'intro',
  )

  useEffect(() => {
    if (scene === 'ticket') localStorage.setItem(WON_KEY, '1')
  }, [scene])

  return (
    <>
      <BgHearts />
      <AnimatePresence mode="wait">
        {scene === 'intro' && <Intro key="intro" onYes={() => setScene('rules')} />}
        {scene === 'rules' && <Rules key="rules" onStart={() => setScene('quiz')} />}
        {scene === 'quiz' && <Quiz key="quiz" onWin={() => setScene('catch')} />}
        {scene === 'catch' && <CatchGame key="catch" onWin={() => setScene('ticket')} />}
        {scene === 'ticket' && (
          <Ticket
            key="ticket"
            onReplay={() => {
              localStorage.removeItem(WON_KEY)
              setScene('intro')
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
