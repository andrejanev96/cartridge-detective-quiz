import React, { useState, useEffect } from 'react';
import { SliderQuestion } from '@/types/quiz';
import { useQuizStore } from '@/stores/quizStore';

interface SliderProps {
  question: SliderQuestion;
}

export const Slider: React.FC<SliderProps> = ({ question }) => {
  const { selectAnswer } = useQuizStore();
  const initialValue = Math.round((question.min + question.max) / 2);
  const [sliderValue, setSliderValue] = useState(initialValue);

  useEffect(() => {
    selectAnswer(sliderValue);
  }, [sliderValue, selectAnswer]);

  const generatePresets = () => {
    const range = question.max - question.min;
    let interval;

    if (question.unit === 'fps') {
      interval = 200;
    } else if (question.unit === 'grains') {
      interval = 20;
    } else if (range > 1000) {
      interval = 200;
    } else if (range > 100) {
      interval = 25;
    } else {
      interval = 10;
    }

    const presets = [question.min];
    for (let val = question.min + interval; val < question.max; val += interval) {
      const roundedVal = Math.round(val / interval) * interval;
      if (roundedVal > question.min && roundedVal < question.max && !presets.includes(roundedVal)) {
        presets.push(roundedVal);
      }
    }
    presets.push(question.max);

    return presets.sort((a, b) => a - b);
  };

  const presets = generatePresets();

  return (
    <div className="slider-container">
      <div className="slider-label">
        Range: {question.min} - {question.max} {question.unit}
      </div>
      
      <input
        type="range"
        className="slider"
        min={question.min}
        max={question.max}
        step={question.step || 10}
        value={sliderValue}
        onChange={(e) => setSliderValue(parseInt(e.target.value))}
      />
      
      <div className="slider-value">
        {sliderValue} {question.unit}
      </div>
      
      <div className="slider-presets">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className="slider-preset-btn"
            onClick={() => setSliderValue(preset)}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
};