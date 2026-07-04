// Gran Rueda de la fortuna en SVG, girando, con cabinas y lucecitas 🎡
// Inspirada en La Gran Rueda de Santiago (Parque Araucano).

const CABIN_COLORS = ['#ff5fa2', '#c9b6ff', '#ffd166', '#9fe7d8', '#ff87b8', '#8ec5ff']

export default function FerrisWheel({ size = 260 }) {
  const cx = 100
  const cy = 100
  const r = 78
  const spokes = 12

  const cabins = Array.from({ length: spokes }).map((_, i) => {
    const angle = (i / spokes) * Math.PI * 2
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    return { x, y, color: CABIN_COLORS[i % CABIN_COLORS.length] }
  })

  const lights = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i / 24) * Math.PI * 2
    return { x: cx + (r + 8) * Math.cos(angle), y: cy + (r + 8) * Math.sin(angle), i }
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 210"
      role="img"
      aria-label="La Gran Rueda de Santiago"
      style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="sky" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#fff3fa" />
          <stop offset="100%" stopColor="#ffd6e7" />
        </radialGradient>
      </defs>

      {/* soportes en A */}
      <g stroke="#b06a90" strokeWidth="5" strokeLinecap="round">
        <line x1={cx} y1={cy} x2={cx - 42} y2="195" />
        <line x1={cx} y1={cy} x2={cx + 42} y2="195" />
      </g>
      <rect x={cx - 60} y="193" width="120" height="8" rx="4" fill="#b06a90" />

      {/* rueda giratoria */}
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'wheelSpin 16s linear infinite' }}>
        {/* rayos */}
        {cabins.map((c, i) => (
          <line key={`s${i}`} x1={cx} y1={cy} x2={c.x} y2={c.y} stroke="#ffb6d5" strokeWidth="3" />
        ))}
        {/* aros */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ff5fa2" strokeWidth="4" />
        <circle cx={cx} cy={cy} r={r - 7} fill="none" stroke="#ffb6d5" strokeWidth="2" />

        {/* lucecitas */}
        {lights.map((l) => (
          <circle key={`l${l.i}`} cx={l.x} cy={l.y} r="2.4" fill="#ffd166">
            <animate
              attributeName="opacity"
              values="1;0.25;1"
              dur="1.6s"
              begin={`${l.i * 0.08}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* cabinas (se mantienen "colgando" contra-rotando) */}
        {cabins.map((c, i) => (
          <g
            key={`c${i}`}
            style={{
              transformOrigin: `${c.x}px ${c.y}px`,
              animation: 'wheelSpin 16s linear infinite reverse',
            }}
          >
            <line x1={c.x} y1={c.y} x2={c.x} y2={c.y + 6} stroke="#b06a90" strokeWidth="2" />
            <rect x={c.x - 8} y={c.y + 6} width="16" height="13" rx="5" fill={c.color} />
            <rect x={c.x - 5} y={c.y + 9} width="10" height="5" rx="2" fill="#fff" opacity="0.8" />
          </g>
        ))}
      </g>

      {/* centro */}
      <circle cx={cx} cy={cy} r="8" fill="#ff5fa2" stroke="#fff" strokeWidth="3" />
    </svg>
  )
}
