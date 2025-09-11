import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Question } from '@/types/quiz';
import { MultipleChoice } from './QuestionTypes/MultipleChoice';
import { TrueFalse } from './QuestionTypes/TrueFalse';
import { TextInput } from './QuestionTypes/TextInput';
import { Slider } from './QuestionTypes/Slider';
import { useQuizStore } from '@/stores/quizStore';

interface QuestionRendererProps {
  question: Question;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question }) => {
  const { currentQuestion, quizData } = useQuizStore();
  const [isCompactMode, setIsCompactMode] = useState(false);

  // Preload next question image for better UX
  useEffect(() => {
    const nextQuestion = quizData[currentQuestion + 1];
    if (nextQuestion?.image) {
      const img = new Image();
      img.src = nextQuestion.image;
    }
  }, [currentQuestion, quizData]);

  // Check if content fits in mobile viewport
  useEffect(() => {
    if (window.innerWidth <= 428) { // Mobile only
      const checkContentFit = () => {
        const viewportHeight = window.innerHeight;
        const availableHeight = viewportHeight - 140; // Account for header + button space
        
        // Estimate content height based on question characteristics
        let estimatedHeight = 0;
        
        // Header space
        estimatedHeight += 80;
        
        // Question text (if present)
        if (question.question && question.question.length > 0) {
          estimatedHeight += 60; // Text height
        }
        
        // Image height
        if (question.image) {
          estimatedHeight += 220; // Base image + margins
        }
        
        // Answer options height
        if (question.type === 'multiple-choice') {
          estimatedHeight += 200; // 4 options + gaps
        } else if (question.type === 'slider') {
          estimatedHeight += 160; // Slider + controls
        } else {
          estimatedHeight += 100; // Other types
        }
        
        // Navigation button
        estimatedHeight += 60;
        
        setIsCompactMode(estimatedHeight > availableHeight);
      };

      checkContentFit();
      window.addEventListener('resize', checkContentFit);
      return () => window.removeEventListener('resize', checkContentFit);
    }
  }, [question]);
  const renderQuestionType = () => {
    switch (question.type) {
      case 'multiple-choice':
      case 'image-multiple-choice':
        return <MultipleChoice question={question} />;
      case 'true-false':
        return <TrueFalse question={question} />;
      case 'text-input':
        return <TextInput question={question} />;
      case 'slider':
        return <Slider question={question} />;
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className={`quiz-content-wrapper ${isCompactMode ? 'compact-mode' : ''}`}>
      <div className="question-content-area">
        <div className="question-header-area">
          {question.question && <h2 className="question-text">{question.question}</h2>}
        </div>
        
        <div className="question-image-area">
          {question.image && (
            <div className="question-image">
              <motion.img 
                src={question.image} 
                alt="Cartridge identification"
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          )}
        </div>
        
        <div className="question-answers-area">
          {renderQuestionType()}
        </div>
      </div>
    </div>
  );
};
