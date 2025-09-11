import React from 'react';
import { motion } from 'framer-motion';
import { MultipleChoiceQuestion } from '@/types/quiz';
import { useQuizStore } from '@/stores/quizStore';
import clsx from 'clsx';

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({ question }) => {
  const { selectedAnswer, selectAnswer } = useQuizStore();

  return (
    <div className="answers-container" role="group" aria-label="Answer choices">
      {question.answers.map((answer, index) => (
        <motion.button
          type="button"
          key={index}
          className={clsx(
            'answer-option',
            selectedAnswer === index && 'selected'
          )}
          onClick={() => selectAnswer(index)}
          aria-pressed={selectedAnswer === index}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          animate={selectedAnswer === index ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {answer}
        </motion.button>
      ))}
    </div>
  );
};
