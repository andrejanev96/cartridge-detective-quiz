import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Landing } from '@/components/sections/Landing';
import { Quiz } from '@/components/sections/Quiz';
import { Results } from '@/components/sections/Results';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { NotFound } from '@/components/ui/NotFound';
import { useQuizStore } from '@/stores/quizStore';
import { trackEvent } from '@/utils/analytics';

function App() {
  const { currentSection, isLoading } = useQuizStore();

  useEffect(() => {
    // Track page view on load
    trackEvent('page_view', {
      content_type: 'quiz',
      content_id: 'cartridge_detective_challenge',
    });
  }, []);

  const renderCurrentSection = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    switch (currentSection) {
      case 'landing':
        return <Landing />;
      case 'quiz':
        return <Quiz />;
      case 'results':
        return <Results />;
      default:
        return <NotFound />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <AnimatePresence mode="wait">
          {renderCurrentSection()}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default App;
