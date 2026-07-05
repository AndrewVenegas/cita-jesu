# CLAUDE.md — Cita Jesu 🎡💕

Contexto para retomar este proyecto en el futuro.

## Qué es
Mini-juego web tierno y chistoso para invitar a **Jesu** (polola de Andriu) a
**La Gran Rueda Chile** (Parque Araucano, presencial, **miércoles 8 de julio**).
Es una sorpresa: la mención a la Gran Rueda debe mantenerse oculta hasta el ticket final.

## Stack
- **Vite + React** (100% estático, sin backend).
- **Framer Motion** (animaciones), **canvas-confetti** (confeti), **Web Audio API** (sonidos).
- Deployable en **Vercel** (build `npm run build`, output `dist`; config en `vercel.json`).

## Comandos
```bash
npm install
npm run dev      # dev server (usa 5173, o 5174 si está ocupado)
npm run build    # genera dist/
npm run preview  # revisa el build local
```

## Flujo del juego (escenas en src/scenes/)
1. **Intro.jsx** — "Jesu, por un juego, ¿aceptarías salir conmigo?". El botón **NO** huye
   a posiciones aleatorias (componente `src/components/DodgingButton.jsx`); solo se puede decir SÍ.
2. **Rules.jsx** — explica las 3 vidas y las 3 preguntas.
3. **Quiz.jsx** — 3 vidas ❤️ y 3 preguntas (datos en `src/data/questions.js`). Si pierde las 3
   vidas, se le regalan 3 más "porque te amo" → nunca pierde de verdad.
4. **CatchGame.jsx** — mini-juego sorpresa: atrapar 10 corazones con una canasta 🧺.
5. **Ticket.jsx** — ticket ganador 🎟️ "VALE POR: 1 cita en La Gran Rueda" + confeti +
   mensaje "¡Mándale un pantallazo a Andriu como comprobante!".

## Datos clave (src/data/questions.js)
Respuestas correctas del quiz:
- ¿Qué día nos conocimos? → **30 de mayo**
- ¿Qué día es nuestro aniversario? → **26 de agosto**
- ¿Qué día fue nuestra primera cita? → **8 de junio**

⚠️ **Evitar spoilers:** ninguna alternativa del quiz ni texto previo al ticket debe mencionar
"La Gran Rueda". (Ya se cambió la opción original `'la de la Gran Rueda 🎡'` por una neutra.)

## Estructura
- `src/scenes/` — pantallas del flujo (Intro, Rules, Quiz, CatchGame, Ticket).
- `src/components/` — BgHearts, DodgingButton, FerrisWheel (rueda gráfica), Hearts (vidas).
- `src/hooks/` — useConfetti, useSound.
- `src/data/questions.js` — preguntas y mensajes chistosos de error.
- `src/styles/` — global.css, scenes.css.
- `src/App.jsx` — orquesta las escenas.

## Repo y deploy
- GitHub: **https://github.com/AndrewVenegas/cita-jesu** (rama `main`).
- Deploy: importar el repo en [vercel.com](https://vercel.com) → Vercel detecta Vite solo → Deploy.

## Origen
Generado con `/ultraplan` (Claude Code en la nube) y ajustado localmente.
