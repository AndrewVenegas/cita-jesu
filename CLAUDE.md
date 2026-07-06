# CLAUDE.md — Cita Jesu 🎡💕

Contexto para retomar este proyecto en el futuro.

## Qué es
Mini-juego web tierno y chistoso para invitar a **Jesu** (polola de Andriu) a
**La Gran Rueda Chile** (Parque Araucano, presencial, **miércoles 8 de julio**).
Es una sorpresa: la mención a la Gran Rueda debe mantenerse oculta hasta el ticket final.

## Stack
- **Vite + React** (100% estático, sin backend).
- **Framer Motion** (animaciones), **canvas-confetti** (confeti), **Tone.js** (sonidos
  sintetizados, sin archivos de audio externos).
- Deployable en **Vercel** (build `npm run build`, output `dist`; config en `vercel.json`).

## Comandos
```bash
npm install
npm run dev      # dev server (usa 5173, o 5174 si está ocupado)
npm run build    # genera dist/
npm run preview  # revisa el build local
```

## Flujo del juego (escenas en src/scenes/)
1. **Intro.jsx** — "Jesu, por un juego, ¿aceptarías salir conmigo?". El botón **NO**
   (`src/components/DodgingButton.jsx`) es `position: fixed`, se teletransporta al instante
   lejos del cursor (usando la posición viva del mouse, distancia mínima garantizada) con un
   parpadeo corto → imposible de hoverear/clickear. Un ancla `.dodge-anchor` reserva el
   espacio en el layout. Solo se puede decir SÍ.
2. **Rules.jsx** — explica las 3 vidas y las 3 preguntas.
3. **Quiz.jsx** — 3 vidas ❤️ y 3 preguntas (datos en `src/data/questions.js`). Las
   **alternativas se barajan** (Fisher-Yates) al montar. Al fallar solo se marca en rojo la
   elegida; **nunca se revela la correcta**. Si pierde las 3 vidas, se le regalan 3 más
   "porque te amo" → nunca pierde de verdad.
4. **CatchGame.jsx** — mini-juego sorpresa: atrapar **10 corazones** con la canasta 🧺.
   - Modal inicial explicativo ("¿Cómo se juega?").
   - Tiene **3 vidas** (componente Hearts). Cada **💣 bomba** atrapada resta una vida (sonido
     `boom` + temblor). Al llegar a **0 vidas** → modal "te regalo vidas porque te amo",
     recarga las 3 vidas y reinicia desde 0 corazones.
   - **Solo los corazones suman** (`HEART_EMOJIS`, sin flores).
5. **Ticket.jsx** — ticket ganador 🎟️ "VALE POR: 1 cita en La Gran Rueda" + confeti +
   mensaje "¡Mándale un pantallazo a Andriu como comprobante!".

## Datos clave (src/data/questions.js)
Respuestas correctas del quiz:
- ¿Qué día nos conocimos? → **30 de mayo**
- ¿Qué día es nuestro aniversario? → **26 de agosto**
- ¿Qué día fue nuestra primera cita? → **8 de junio**

⚠️ **Evitar spoilers:** ninguna alternativa del quiz ni texto previo al ticket debe mencionar
"La Gran Rueda". (Ya se cambió la opción original `'la de la Gran Rueda 🎡'` por una neutra.)

⚠️ **Emoji 🩷 prohibido:** se ve como cuadrito en el Windows de Jesu. No usarlo (ya se quitó
de `CatchGame.jsx` y `BgHearts.jsx`).

## Estructura
- `src/scenes/` — pantallas del flujo (Intro, Rules, Quiz, CatchGame, Ticket).
- `src/components/` — BgHearts, DodgingButton, FerrisWheel (rueda gráfica), Hearts (vidas).
- `src/hooks/` — useConfetti, useSound.
- `src/data/questions.js` — preguntas y mensajes chistosos de error.
- `src/styles/` — global.css, scenes.css.
- `src/App.jsx` — orquesta las escenas.

## Repo y deploy
- GitHub: **https://github.com/AndrewVenegas/cita-jesu**.
- La rama local se llama **`cita-gran-rueda`**; se publica en el remoto con
  `git push origin cita-gran-rueda:main`. Vercel despliega la rama **`main`** y hace
  auto-deploy en cada push. Ya está **live**.

## Origen
Generado con `/ultraplan` (Claude Code en la nube) y ajustado localmente.
