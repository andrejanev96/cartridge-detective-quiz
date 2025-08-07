import React from 'react';

interface LogoProps {
  size?: 'small' | 'large';
}

export const Logo: React.FC<LogoProps> = ({ size = 'large' }) => {
  if (size === 'small') {
    return (
      <div className="logo-small">
        <div className="logo-shield-small">
          <span className="logo-text-small">AMMO</span>
        </div>
      </div>
    );
  }

  return (
    <div className="logo">
      <div className="logo-shield">
        <span className="logo-text">AMMO</span>
      </div>
    </div>
  );
};