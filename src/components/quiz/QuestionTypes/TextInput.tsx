import React, { useState, useEffect } from 'react';
import { TextInputQuestion } from '@/types/quiz';
import { useQuizStore } from '@/stores/quizStore';

interface TextInputProps {
  question: TextInputQuestion;
}

export const TextInput: React.FC<TextInputProps> = () => {
  const { selectAnswer } = useQuizStore();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const trimmed = inputValue.trim();
    selectAnswer(trimmed !== '' ? trimmed : null);
  }, [inputValue, selectAnswer]);

  return (
    <div className="text-input-container">
      <input
        type="text"
        className="text-input"
        placeholder="Enter the cartridge name..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoFocus
      />
    </div>
  );
};
