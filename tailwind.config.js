// Tailwind build config. After changing classes in index.html, rebuild styles.css with:
//   npm install && npm run build:css
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        volvic: '#00A887',
        volvicDark: '#007A62',
        bronze: '#D4A373',
        gold: '#D4A359',
        switchClosed: '#E11D48',
        switchOpen: '#059669',
        darkBg: '#121214',
        cardBg: '#1A1A1E',
        borderDark: '#2A2A30'
      },
      boxShadow: {
        'depth-card': '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'depth-inner': 'inset 0 2px 6px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        'depth-button': '0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'depth-button-active': 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
        'badge': '0 4px 10px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)'
      }
    }
  }
};
