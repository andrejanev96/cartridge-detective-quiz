import React, { useState, useEffect } from 'react';
import { SliderQuestion } from '@/types/quiz';
import { useQuizStore } from '@/stores/quizStore';

interface SliderProps {
  question: SliderQuestion;
}

export const Slider: React.FC<SliderProps> = ({ question }) => {
  const { selectAnswer } = useQuizStore();
  
  // For preset-only sliders, start with the first preset value
  const initialValue = question.presetOnly && question.presetValues 
    ? question.presetValues[0] 
    : Math.round(((question.min || 0) + (question.max || 100)) / 2);
  
  const [sliderValue, setSliderValue] = useState(initialValue);

  useEffect(() => {
    selectAnswer(sliderValue);
  }, [sliderValue, selectAnswer]);

  const generatePresets = () => {
    // If preset-only mode, use the specified values
    if (question.presetOnly && question.presetValues) {
      return question.presetValues.sort((a, b) => a - b);
    }

    // Otherwise, use the original logic
    const range = (question.max || 100) - (question.min || 0);
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

    const min = question.min || 0;
    const max = question.max || 100;
    const presets = [min];
    for (let val = min + interval; val < max; val += interval) {
      const roundedVal = Math.round(val / interval) * interval;
      if (roundedVal > min && roundedVal < max && !presets.includes(roundedVal)) {
        presets.push(roundedVal);
      }
    }
    presets.push(max);

    return presets.sort((a, b) => a - b);
  };

  const presets = generatePresets();
  const step = question.step || 10;

  const handleDecrease = () => {
    if (question.presetOnly && question.presetValues) {
      const currentIndex = presets.indexOf(sliderValue);
      if (currentIndex > 0) {
        setSliderValue(presets[currentIndex - 1]);
      }
    } else {
      const newValue = Math.max(question.min || 0, sliderValue - step);
      setSliderValue(newValue);
    }
  };

  const handleIncrease = () => {
    if (question.presetOnly && question.presetValues) {
      const currentIndex = presets.indexOf(sliderValue);
      if (currentIndex < presets.length - 1) {
        setSliderValue(presets[currentIndex + 1]);
      }
    } else {
      const newValue = Math.min(question.max || 100, sliderValue + step);
      setSliderValue(newValue);
    }
  };

  const isPresetOnly = question.presetOnly && question.presetValues;
  const minValue = isPresetOnly ? presets[0] : (question.min || 0);
  const maxValue = isPresetOnly ? presets[presets.length - 1] : (question.max || 100);

  return (
    <div className="slider-container">
      {isPresetOnly ? (
        <div className="slider-label">
          Select the correct value:
        </div>
      ) : (
        <div className="slider-label">
          Range: {question.min} - {question.max} {question.unit}
        </div>
      )}
      
      {/* Only show slider for non-preset-only questions */}
      {!isPresetOnly && (
        <input
          type="range"
          className="slider"
          min={question.min}
          max={question.max}
          step={step}
          value={sliderValue}
          onChange={(e) => setSliderValue(parseInt(e.target.value))}
        />
      )}
      
      <div className="slider-controls">
        <button 
          type="button"
          className="slider-control-btn"
          onClick={handleDecrease}
          disabled={sliderValue <= minValue}
        >
          −
        </button>
        <div className="slider-value">
          {sliderValue} {question.unit}
        </div>
        <button 
          type="button"
          className="slider-control-btn"
          onClick={handleIncrease}
          disabled={sliderValue >= maxValue}
        >
          +
        </button>
      </div>
      
      <div className="slider-presets">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`slider-preset-btn ${sliderValue === preset ? 'active' : ''}`}
            onClick={() => setSliderValue(preset)}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
};