import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { QuestionRenderer } from '@/components/quiz/QuestionRenderer';
import { useQuizStore } from '@/stores/quizStore';
import { MultipleChoiceQuestion, SliderQuestion } from '@/types/quiz';

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

  const handleNextQuestion = useCallback(async () => {
    if (isNextDisabled) return;
    
    setIsTransitioning(true);
    setShowBullet(true);
    
    // Wait for bullet animation to complete
    setTimeout(() => {
      nextQuestion();
      setShowBullet(false);
      setIsTransitioning(false);
    }, 600);
  }, [isNextDisabled, nextQuestion]);

  useEffect(() => {
    resetQuestionState();
  }, [currentQuestion, resetQuestionState]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys for multiple choice
      if (e.key >= '1' && e.key <= '4' && (currentQ?.type === 'multiple-choice' || currentQ?.type === 'image-multiple-choice')) {
        const answerIndex = parseInt(e.key) - 1;
        const answers = (currentQ as MultipleChoiceQuestion).answers;
        if (answerIndex < answers.length) {
          useQuizStore.getState().selectAnswer(answerIndex);
        }
      }
      
      // Arrow keys for multiple choice navigation
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && (currentQ?.type === 'multiple-choice' || currentQ?.type === 'image-multiple-choice')) {
        const answers = (currentQ as MultipleChoiceQuestion).answers;
        const currentIndex = typeof selectedAnswer === 'number' ? selectedAnswer : -1;
        let newIndex;
        
        if (e.key === 'ArrowDown') {
          newIndex = currentIndex < answers.length - 1 ? currentIndex + 1 : 0;
        } else {
          newIndex = currentIndex > 0 ? currentIndex - 1 : answers.length - 1;
        }
        
        useQuizStore.getState().selectAnswer(newIndex);
      }
      
      // Arrow keys for slider controls
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && currentQ?.type === 'slider') {
        const sliderQuestion = currentQ as SliderQuestion;
        const currentValue: number = typeof selectedAnswer === 'number'
          ? selectedAnswer
          : (sliderQuestion.presetOnly && sliderQuestion.presetValues && sliderQuestion.presetValues.length > 0
              ? sliderQuestion.presetValues[0]
              : (sliderQuestion.min ?? 0));
        
        if (sliderQuestion.presetOnly && sliderQuestion.presetValues) {
          const presets = sliderQuestion.presetValues.sort((a: number, b: number) => a - b);
          const currentIndex = presets.indexOf(currentValue);
          let newIndex;
          
          if (e.key === 'ArrowRight') {
            newIndex = currentIndex < presets.length - 1 ? currentIndex + 1 : currentIndex;
          } else {
            newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
          }
          
          useQuizStore.getState().selectAnswer(presets[newIndex]);
        } else {
          const step = sliderQuestion.step || 10;
          const min = sliderQuestion.min || 0;
          const max = sliderQuestion.max || 100;
          let newValue;
          
          if (e.key === 'ArrowRight') {
            newValue = Math.min(max, currentValue + step);
          } else {
            newValue = Math.max(min, currentValue - step);
          }
          
          useQuizStore.getState().selectAnswer(newValue);
        }
      }
      
      // Spacebar for true/false toggle
      if (e.key === ' ' && currentQ?.type === 'true-false') {
        e.preventDefault();
        const newAnswer = selectedAnswer === null ? true : !selectedAnswer;
        useQuizStore.getState().selectAnswer(newAnswer);
      }
      
      if (e.key === 'Enter' && !isNextDisabled) {
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ, isNextDisabled, selectedAnswer, handleNextQuestion]);

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
            <div className="question-counter">
              <span className="question-counter-full">Question {currentQuestion + 1} of {quizData.length}</span>
              <span className="question-counter-mobile">Question {currentQuestion + 1}</span>
            </div>
            <div className="header-center">
              <AnimatePresence mode="wait">
                {currentQ.title && (
                  <motion.div 
                    className="title-bullet-header"
                    key={`title-${currentQuestion}`}
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 200, opacity: 0 }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeOut",
                      delay: isTransitioning ? 0 : 0.1
                    }}
                  >
                    <h2 className="question-title-header">{currentQ.title}</h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {currentQ.category && (
              <div className="question-category question-category-desktop">
                {currentQ.category}
              </div>
            )}
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
              {isTransitioning ? 'Processing...' : 
               currentQuestion === quizData.length - 1 ? 'Complete Challenge' : 'Next Challenge'}
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
