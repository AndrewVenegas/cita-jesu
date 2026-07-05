# 🎡💕 Jesu, ¿sales conmigo?

Mini-juego tierno y chistosa para invitar a **Jesu** a **La Gran Rueda Chile**
(Parque Araucano · presencial · **miércoles 8 de julio**).

## ¿Qué hace?
1. **Intro** — "Jesu, por un juego, ¿aceptarías salir conmigo?" (el botón **NO** huye 😏).
2. **3 vidas** ❤️❤️❤️ y 3 preguntas de la relación:
   - ¿Qué día nos conocimos? → *30 de mayo*
   - ¿Qué día es nuestro aniversario? → *26 de agosto*
   - ¿Qué día fue nuestra primera cita? → *8 de junio*
   - Si pierde las 3 vidas → *"porque te amo, te regalo 3 vidas más"* (nunca pierde de verdad).
3. **Mini-juego sorpresa** — atrapar 10 corazones con una canasta 🧺.
4. **Ticket ganador** 🎟️ *"VALE POR: 1 cita en La Gran Rueda"* + confeti + el mensaje
   **"¡Mándale un pantallazo a Andriu como comprobante!"**.

## Stack
Vite + React · Framer Motion · canvas-confetti · Web Audio (sonidos). 100% estático, sin backend.

## Correr en local
```bash
npm install
npm run dev      # abre http://localhost:5173
```

## Build de producción
```bash
npm run build    # genera dist/
npm run preview  # revisa el build localmente
```

## Deploy en Vercel
- **Opción A (web):** entra a [vercel.com](https://vercel.com) → *Add New → Project* →
  importa este repo. Vercel detecta **Vite** solo (build `npm run build`, output `dist`).
  Dale *Deploy* y listo ✅.
- **Opción B (CLI):**
  ```bash
  npm i -g vercel
  vercel        # sigue el asistente
  vercel --prod # publica
  ```

Hecho con mucho amor 💌
