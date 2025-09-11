# Cartridge Detective Quiz

An interactive web quiz for testing ammunition and cartridge identification knowledge.

## About

This is a React-based quiz application that challenges users to identify various ammunition cartridges through multiple question types including multiple choice, image identification, and slider-based numeric input.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Styling**: CSS

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a local `.env` based on `.env.example` (do not commit `.env`).

- `VITE_GA4_MEASUREMENT_ID` — optional; enables Google Analytics 4 if provided.
- MailChimp public IDs (optional; client-safe):
  - `VITE_MAILCHIMP_SERVER_PREFIX` (e.g., `us2`) or `VITE_MAILCHIMP_URL`
  - `VITE_MAILCHIMP_USER_ID`, `VITE_MAILCHIMP_LIST_ID`, `VITE_MAILCHIMP_FORM_ID`, `VITE_MAILCHIMP_TAGS`
  - If not set, sensible defaults are used so the embedded form still works.

### Assets

Quiz images are served from `public/assets/images/cartridges`. Ensure all referenced images from `src/data/cartridge-questions.json` exist there using relative paths like `assets/images/cartridges/question1.jpg` so they work in dev and on GitHub Pages (`vite.config.ts` uses `base: '/cartridge-detective-quiz/'`).

## Features

- 15 questions across 3 difficulty levels
- Multiple question types (multiple choice, sliders, text input)
- Email gate unlocks detailed results on-screen
- Responsive design for all devices
- Google Analytics integration
