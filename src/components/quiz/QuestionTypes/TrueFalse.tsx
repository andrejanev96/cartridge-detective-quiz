import React from 'react';
import { TrueFalseQuestion } from '@/types/quiz';
import { useQuizStore } from '@/stores/quizStore';
import clsx from 'clsx';

interface TrueFalseProps {
  question: TrueFalseQuestion;
}

export const TrueFalse: React.FC<TrueFalseProps> = ({ question: _ }) => {
  const { selectedAnswer, selectAnswer } = useQuizStore();

  return (
    <div className="answers-container">
      <div
        className={clsx(
          'answer-option',
          selectedAnswer === true && 'selected'
        )}
        onClick={() => selectAnswer(true)}
      >
        True
      </div>
      <div
        className={clsx(
          'answer-option',
          selectedAnswer === false && 'selected'
        )}
        onClick={() => selectAnswer(false)}
      >
        False
      </div>
    </div>
  );
};