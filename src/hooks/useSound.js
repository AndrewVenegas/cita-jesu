import { useCallback, useRef } from 'react'

// Sonidos suaves generados con Web Audio (sin archivos externos).
// Se crea el AudioContext al primer uso para respetar el autoplay policy.
export function useSound() {
  const ctxRef = useRef(null)

  const getCtx = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (AC) ctxRef.current = new AC()
    }
    if (ctxRef.current && ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }

  const tone = useCallback((freq, duration = 0.14, type = 'sine', gain = 0.16) => {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  }, [])

  const pop = useCallback(() => tone(660, 0.12, 'triangle', 0.18), [tone])
  const good = useCallback(() => {
    tone(587, 0.12, 'sine')
    setTimeout(() => tone(880, 0.16, 'sine'), 90)
  }, [tone])
  const bad = useCallback(() => tone(160, 0.22, 'sawtooth', 0.12), [tone])
  const win = useCallback(() => {
    ;[523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => tone(f, 0.18, 'triangle', 0.2), i * 120),
    )
  }, [tone])

  return { pop, good, bad, win }
}
