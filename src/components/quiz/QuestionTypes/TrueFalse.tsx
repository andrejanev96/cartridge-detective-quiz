import React from 'react';
import { motion } from 'framer-motion';
import { TrueFalseQuestion } from '@/types/quiz';
import { useQuizStore } from '@/stores/quizStore';
import clsx from 'clsx';

interface TrueFalseProps {
  question: TrueFalseQuestion;
}

export const TrueFalse: React.FC<TrueFalseProps> = () => {
  const { selectedAnswer, selectAnswer } = useQuizStore();

  return (
    <div className="answers-container" role="group" aria-label="True or False">
      <motion.button
        type="button"
        className={clsx(
          'answer-option',
          selectedAnswer === true && 'selected'
        )}
        onClick={() => selectAnswer(true)}
        aria-pressed={selectedAnswer === true}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.01 }}
        animate={selectedAnswer === true ? { scale: 1.02 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        True
      </motion.button>
      <motion.button
        type="button"
        className={clsx(
          'answer-option',
          selectedAnswer === false && 'selected'
        )}
        onClick={() => selectAnswer(false)}
        aria-pressed={selectedAnswer === false}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.01 }}
        animate={selectedAnswer === false ? { scale: 1.02 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        False
      </motion.button>
    </div>
  );
};
