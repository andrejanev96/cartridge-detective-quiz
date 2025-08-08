import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  category?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  category 
}) => {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="progress-section">
      <div className="question-counter">
        Question {current + 1} of {total}
      </div>
      
      {category && (
        <div className="question-category">
          {category}
        </div>
      )}
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar"
          style={{ '--progress': `${progress}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
};