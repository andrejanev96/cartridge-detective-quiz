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
    <div className="progress-container">
      <div 
        className="progress-bar"
        style={{ '--progress': `${progress}%` } as React.CSSProperties}
      />
      <span className="progress-text">
        Question {current + 1} of {total}
        {category && ` • ${category}`}
      </span>
    </div>
  );
};