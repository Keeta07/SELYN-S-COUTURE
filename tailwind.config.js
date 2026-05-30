export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171313',
        silk: '#fff9f2',
        blush: '#e7b7a8',
        jade: '#0f5b52',
        berry: '#762840',
        champagne: '#f5dfbd',
        clay: '#b85f42'
      },
      boxShadow: {
        soft: '0 20px 80px rgba(23, 19, 19, 0.12)'
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
