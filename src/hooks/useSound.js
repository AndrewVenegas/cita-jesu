import { useCallback, useRef } from 'react'
import * as Tone from 'tone'

// Sonidos sintetizados con Tone.js (sin archivos externos → 100% deployable).
// El AudioContext se arranca en el primer gesto del usuario (autoplay policy).
export function useSound() {
  const refs = useRef({})
  const started = useRef(false)
  const timeRef = useRef(0)

  const ensure = () => {
    if (!started.current) {
      Tone.start()
      started.current = true
    }
    const r = refs.current
    if (!r.synth) {
      r.synth = new Tone.PolySynth(Tone.Synth).toDestination()
      r.synth.volume.value = -8
      r.membrane = new Tone.MembraneSynth().toDestination()
      r.membrane.volume.value = -4
      r.noise = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.005, decay: 0.35, sustain: 0 },
      }).toDestination()
      r.noise.volume.value = -10
    }
    return r
  }

  // Devuelve un tiempo estrictamente creciente para evitar colisiones de scheduling.
  const at = (offset = 0) => {
    const t = Math.max(Tone.now() + offset, timeRef.current + 0.02)
    timeRef.current = t
    return t
  }

  const pop = useCallback(() => {
    const { synth } = ensure()
    synth.triggerAttackRelease('E6', '16n', at())
  }, [])

  const good = useCallback(() => {
    const { synth } = ensure()
    synth.triggerAttackRelease('D5', '8n', at())
    synth.triggerAttackRelease('A5', '8n', at(0.1))
  }, [])

  const bad = useCallback(() => {
    const { synth } = ensure()
    synth.triggerAttackRelease('E3', '8n', at())
  }, [])

  const win = useCallback(() => {
    const { synth } = ensure()
    ;['C5', 'E5', 'G5', 'C6'].forEach((n, i) =>
      synth.triggerAttackRelease(n, '8n', at(i * 0.12)),
    )
  }, [])

  // Explosión para cuando agarra una bomba 💥
  const boom = useCallback(() => {
    const { membrane, noise } = ensure()
    const t = at()
    membrane.triggerAttackRelease('C2', '8n', t)
    noise.triggerAttackRelease('4n', t)
  }, [])

  return { pop, good, bad, win, boom }
}
