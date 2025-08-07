import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Landing } from '@/components/sections/Landing';
import { Quiz } from '@/components/sections/Quiz';
import { EmailCapture } from '@/components/sections/EmailCapture';
import { Results } from '@/components/sections/Results';
import { useQuizStore } from '@/stores/quizStore';

function App() {
  const { currentSection, trackEvent } = useQuizStore();

  useEffect(() => {
    // Initialize the quiz on page load
    trackEvent('quiz_page_loaded');
  }, [trackEvent]);

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'landing':
        return <Landing />;
      case 'quiz':
        return <Quiz />;
      case 'emailCapture':
        return <EmailCapture />;
      case 'results':
        return <Results />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {renderCurrentSection()}
      </AnimatePresence>
    </div>
  );
}

export default App;