// Las 3 preguntas del quiz de la relación de Andriu y Jesu 💕
// La opción correcta se marca con `correct: true`.
// Cada pregunta trae un mensajito tierno al acertar.

export const questions = [
  {
    id: 'conocimos',
    emoji: '🥹',
    question: '¿Qué día nos conocimos?',
    hint: 'El día que empezó todo…',
    right: '¡Ese día se me alegró la vida para siempre! 🥰',
    options: [
      { label: '30 de mayo', correct: true },
      { label: '31 de mayo', correct: false },
      { label: '30 de junio', correct: false },
      { label: 'ni idea 🙈', correct: false },
    ],
  },
  {
    id: 'aniversario',
    emoji: '💞',
    question: '¿Qué día es nuestro aniversario?',
    hint: 'El día que te hiciste oficialmente mía (y yo tuyo)…',
    right: '¡Mi día favorito del año, plena! 💖',
    options: [
      { label: '26 de agosto', correct: true },
      { label: '25 de agosto', correct: false },
      { label: '26 de septiembre', correct: false },
      { label: 'todos los días contigo ☺️', correct: false },
    ],
  },
  {
    id: 'primera-cita',
    emoji: '🍦',
    question: '¿Qué día fue nuestra primera cita?',
    hint: 'Los nervios más lindos de mi vida…',
    right: '¡Estaba muerto de nervios y tú preciosa! 🫶',
    options: [
      { label: '8 de junio', correct: true },
      { label: '18 de junio', correct: false },
      { label: '8 de julio', correct: false },
      { label: 'jamás lo olvidaría 🥰', correct: false },
    ],
  },
]

// Mensajes chistosos que salen cuando Jesu se equivoca (pierde una vida).
export const wrongMessages = [
  '¡Ayyy no po Jesu! 😭 esa no era…',
  'Mmm… ¿segura segura? 🤨 te falló la memoria',
  '¡Casiii! pero no 😅',
  'Nooo mi amorcito, concéntrate 🥺',
  'Esa dolió 💔 pero te sigo amando',
]
