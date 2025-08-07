import React from 'react';
import { MultipleChoiceQuestion } from '@/types/quiz';
import { useQuizStore } from '@/stores/quizStore';
import clsx from 'clsx';

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({ question }) => {
  const { selectedAnswer, selectAnswer } = useQuizStore();

  return (
    <div className="answers-container">
      {question.answers.map((answer, index) => (
        <div
          key={index}
          className={clsx(
            'answer-option',
            selectedAnswer === index && 'selected'
          )}
          onClick={() => selectAnswer(index)}
        >
          {answer}
        </div>
      ))}
    </div>
  );
};