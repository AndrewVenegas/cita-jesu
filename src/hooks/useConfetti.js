import confetti from 'canvas-confetti'
import { useCallback } from 'react'

// Pequeños helpers de confeti reutilizables 🎉
export function useConfetti() {
  const burst = useCallback((opts = {}) => {
    confetti({
      particleCount: 90,
      spread: 75,
      startVelocity: 42,
      origin: { y: 0.6 },
      colors: ['#ff5fa2', '#ffb6d5', '#c9b6ff', '#ffd166', '#9fe7d8'],
      ...opts,
    })
  }, [])

  // Lluvia de corazones/confeti que dura unos segundos (para el ticket)
  const celebrate = useCallback((duration = 2600) => {
    const end = Date.now() + duration
    const heart = confetti.shapeFromText
      ? confetti.shapeFromText({ text: '💖', scalar: 2 })
      : undefined
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#ff5fa2', '#ffb6d5', '#c9b6ff'],
        shapes: heart ? [heart] : undefined,
        scalar: heart ? 1.6 : 1,
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#ffd166', '#9fe7d8', '#ff5fa2'],
        shapes: heart ? [heart] : undefined,
        scalar: heart ? 1.6 : 1,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  return { burst, celebrate }
}
