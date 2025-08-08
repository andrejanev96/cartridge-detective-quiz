import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { QuestionRenderer } from '@/components/quiz/QuestionRenderer';
import { useQuizStore } from '@/stores/quizStore';

export const Quiz: React.FC = () => {
  const {
    currentQuestion,
    quizData,
    selectedAnswer,
    nextQuestion,
    resetQuestionState,
  } = useQuizStore();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showBullet, setShowBullet] = useState(false);
  
  const currentQ = quizData[currentQuestion];
  const isNextDisabled = selectedAnswer === null || selectedAnswer === '';

  const handleNextQuestion = async () => {
    if (isNextDisabled) return;
    
    setIsTransitioning(true);
    setShowBullet(true);
    
    // Wait for bullet animation to complete
    setTimeout(() => {
      nextQuestion();
      setShowBullet(false);
      setIsTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    resetQuestionState();
  }, [currentQuestion, resetQuestionState]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4' && currentQ?.type === 'multiple-choice') {
        const answerIndex = parseInt(e.key) - 1;
        if (answerIndex < (currentQ as any).answers.length) {
          useQuizStore.getState().selectAnswer(answerIndex);
        }
      }
      
      if (e.key === 'Enter' && !isNextDisabled) {
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ, isNextDisabled, nextQuestion]);

  if (!currentQ) {
    return <div>Loading...</div>;
  }

  return (
    <motion.section 
      className="section active"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div className="container">
        <div className="quiz-header">
          <div className="quiz-header-top">
            <Logo size="small" />
            <div className="progress-section">
              <div className="question-counter">
                Question {currentQuestion + 1} of {quizData.length}
              </div>
              {currentQ.category && (
                <div className="question-category">
                  {currentQ.category}
                </div>
              )}
            </div>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar"
              style={{ '--progress': `${((currentQuestion + 1) / quizData.length) * 100}%` } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Bullet Animation */}
        <AnimatePresence>
          {showBullet && (
            <>
              {/* Muzzle Flash */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-25px',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  background: 'radial-gradient(circle, #ff6b00 0%, #ff4400 50%, transparent 70%)',
                  borderRadius: '50%',
                  zIndex: 999,
                }}
              />
              
              {/* Bullet */}
              <motion.div
                initial={{ x: -50, y: 0, opacity: 1 }}
                animate={{ 
                  x: window.innerWidth + 50,
                  y: 0, // Straight trajectory
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  transform: 'translateY(-50%)',
                  zIndex: 1000,
                }}
              >
                {/* Bullet Shape */}
                <div style={{
                  width: '52px',
                  height: '16px',
                  background: 'linear-gradient(90deg, #bf9400 0%, #99161d 65%, #bf9400 100%)',
                  borderRadius: '2px 10px 10px 2px',
                  boxShadow: '0 0 12px rgba(191, 148, 0, 0.6), inset 0 1px 3px rgba(255,255,255,0.2)',
                  position: 'relative',
                }}>
                  {/* Bullet Tip */}
                  <div style={{
                    position: 'absolute',
                    right: '-8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '12px solid #bf9400',
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    filter: 'drop-shadow(0 0 3px rgba(191, 148, 0, 0.4))',
                  }} />
                  
                  {/* Trail Effect */}
                  <motion.div
                    animate={{ 
                      opacity: [0.7, 0.3, 0.7],
                      scaleX: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 0.15, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      position: 'absolute',
                      left: '-20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '3px',
                      background: 'linear-gradient(90deg, transparent 0%, rgba(191, 148, 0, 0.6) 100%)',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="quiz-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ 
                opacity: 0, 
                x: isTransitioning ? 100 : 0,
                scale: 0.9 
              }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1 
              }}
              exit={{ 
                opacity: 0, 
                x: -100, 
                scale: 0.9 
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
            >
              <QuestionRenderer question={currentQ} />
            </motion.div>
          </AnimatePresence>

          <div className="quiz-navigation">
            <Button
              onClick={handleNextQuestion}
              disabled={isNextDisabled || isTransitioning}
            >
              {isTransitioning ? 'Firing...' : 
               currentQuestion === quizData.length - 1 ? 'Complete Challenge' : 'Next Cartridge'}
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};