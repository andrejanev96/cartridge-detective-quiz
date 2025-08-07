import React from 'react';
import { Question } from '@/types/quiz';
import { MultipleChoice } from './QuestionTypes/MultipleChoice';
import { TrueFalse } from './QuestionTypes/TrueFalse';
import { TextInput } from './QuestionTypes/TextInput';
import { Slider } from './QuestionTypes/Slider';

interface QuestionRendererProps {
  question: Question;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question }) => {
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
        <h2 className="question-title">{question.question}</h2>
        {question.image && (
          <div className="question-image">
            <img src={question.image} alt="Cartridge identification" />
          </div>
        )}
      </div>
      {renderQuestionType()}
    </>
  );
};