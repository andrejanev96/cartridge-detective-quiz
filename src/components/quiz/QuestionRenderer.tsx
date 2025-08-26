import React, { useEffect } from 'react';
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

  // Preload next question image for better UX
  useEffect(() => {
    const nextQuestion = quizData[currentQuestion + 1];
    if (nextQuestion?.image) {
      const img = new Image();
      img.src = nextQuestion.image;
    }
  }, [currentQuestion, quizData]);
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
    <>
      <div className="question-container">
        {question.question && <h2 className="question-text">{question.question}</h2>}
        {question.image && (
          <div className="question-image">
            <img 
              src={question.image} 
              alt="Cartridge identification"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
      </div>
      {renderQuestionType()}
    </>
  );
};