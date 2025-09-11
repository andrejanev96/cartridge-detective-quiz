import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Landing } from '@/components/sections/Landing';
import { Quiz } from '@/components/sections/Quiz';
import { Results } from '@/components/sections/Results';
import { useQuizStore } from '@/stores/quizStore';
import { trackEvent } from '@/utils/analytics';

function App() {
  const { currentSection } = useQuizStore();

  useEffect(() => {
    // Track page view on load
    trackEvent('page_view', {
      content_type: 'quiz',
      content_id: 'cartridge_detective_challenge',
    });
  }, []);

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'landing':
        return <Landing />;
      case 'quiz':
        return <Quiz />;
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
