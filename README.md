# The Cartridge Detective Challenge

A modern, interactive quiz application for testing ammunition and cartridge identification expertise. Built with React, TypeScript, and modern web technologies while maintaining the Ammo.com brand aesthetic.

## 🎯 Features

- **Interactive Quiz Engine**: Multiple question types (multiple choice, text input, sliders, image identification)
- **Cartridge Identification Focus**: Specialized for ammunition and military cartridge knowledge
- **Tiered Scoring System**: 5 expertise levels from "Recruit Detective" to "Arsenal Commander"
- **Email Lead Capture**: Integrated with MailChimp for newsletter subscriptions
- **Analytics Integration**: Google Analytics 4 event tracking
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern Architecture**: React 18, TypeScript, Zustand state management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd ammo_interactive_quiz

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables
Configure the following in your `.env` file:

```bash
# Google Analytics 4
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# MailChimp API
VITE_MAILCHIMP_API_KEY=your_api_key
VITE_MAILCHIMP_SERVER_PREFIX=us12
VITE_MAILCHIMP_LIST_ID=your_list_id
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── quiz/              # Quiz-specific components
│   └── sections/          # Main app sections
├── stores/                # Zustand state management
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions (analytics, email)
├── styles/               # CSS styles
└── data/                 # Quiz questions data
```

## 🎨 Styling

The application maintains the original Ammo.com visual design:
- **Primary Color**: `#99161d` (Ammo.com red)
- **Accent Color**: `#bf9400` (Gold)
- **Background**: `#111111` (Dark)
- **Typography**: Roboto font family

## 📊 Analytics Events

The application tracks the following events:
- `quiz_started`: User begins the challenge
- `question_answered`: Each question response
- `quiz_completed`: Quiz completion with score data
- `email_submitted`: Lead capture
- `social_share`: Result sharing

## 📧 Email Integration

### MailChimp Features:
- Automatic subscription management
- Quiz score tagging
- Custom merge fields for personalization
- BULLETin newsletter opt-in/out

### Results Email:
- Detailed question explanations
- Historical context for each cartridge
- Personalized score analysis
- Achievement badges

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Adding New Questions
Edit `src/data/cartridge-questions.json`:

```json
{
  "easy": [...],
  "medium": [...], 
  "hard": [...],
  "settings": {
    "questionsPerQuiz": 15,
    "questionsPerDifficulty": {
      "easy": 5,
      "medium": 6,
      "hard": 4
    }
  }
}
```

### Question Types
- `multiple-choice`: Standard multiple choice
- `image-multiple-choice`: Visual cartridge identification
- `true-false`: True/false questions
- `text-input`: Free text entry
- `slider`: Numeric range selection

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

The `dist/` folder contains the production-ready files.

### Deployment Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop `dist/` folder
- **AWS S3**: Upload static files to S3 bucket
- **Traditional Hosting**: Upload `dist/` contents to web server

## 🔮 Future Enhancements

### Planned Features
- [ ] Percentile ranking system (requires backend)
- [ ] A/B testing framework
- [ ] Advanced question types (drag & drop matching)
- [ ] Leaderboard system
- [ ] Social authentication
- [ ] Mobile app version

### A/B Testing Ready
The architecture supports easy A/B testing for:
- Question difficulty progression
- UI design variations
- Email capture copy
- Scoring systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

[Your License Here]

## 🎖️ Campaign Integration

This quiz is designed for the "Cartridge Detective Challenge" marketing campaign:

- **Target**: Military history enthusiasts, collectors, shooting sports participants
- **Lead Generation**: Email capture with MailChimp integration
- **Engagement**: Social sharing with branded results
- **Retention**: Newsletter subscription for ongoing engagement

### Campaign Performance Metrics
- Completion rate
- Email conversion rate
- Social sharing rate
- Newsletter signup rate
- Average session duration