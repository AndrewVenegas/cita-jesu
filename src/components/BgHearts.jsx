import { useMemo } from 'react'

// Corazones decorativos que suben lento por el fondo 💕
const EMOJIS = ['💕', '💖', '💗', '🌸', '💘', '🎡', '🩷']

export default function BgHearts({ count = 14 }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 0.9 + Math.random() * 1.6,
        duration: 9 + Math.random() * 10,
        delay: Math.random() * 12,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      })),
    [count],
  )

  return (
    <div className="bg-hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="bg-heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}rem`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  )
}
