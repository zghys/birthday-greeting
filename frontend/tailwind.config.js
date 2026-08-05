/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'birthday-bg': '#0f0a1a',
        'birthday-surface': '#1a1035',
        'birthday-gold': '#f59e0b',
        'birthday-pink': '#ec4899',
        'birthday-purple': '#8b5cf6',
        'birthday-text': '#fdf6e3',
        'birthday-muted': '#a78bfa',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fall': 'fall 5s linear forwards',
        'confetti': 'confetti 3s ease-out forwards',
        'bounce': 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fall: {
          '0%': { transform: 'translateY(-30px) rotate(0deg)', opacity: '0.8' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        confetti: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(1080deg)', opacity: '0' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};