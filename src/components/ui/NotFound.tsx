import React from 'react';
import { Logo } from './Logo';
import { Button } from './Button';
import { useQuizStore } from '@/stores/quizStore';

export const NotFound: React.FC = () => {
  const { showSection } = useQuizStore();

  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found-content">
          <Logo />
          <h1>404 - Page Not Found</h1>
          <p>Looks like this cartridge got lost in the chamber!</p>
          <Button onClick={() => showSection('landing')}>
            Return to Base
          </Button>
        </div>
      </div>
    </div>
  );
};