import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      <div className="container">
        <div className="loading-content">
          <Logo />
          <motion.div
            className="spinner"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            🎯
          </motion.div>
          <p>Loading your challenge...</p>
        </div>
      </div>
    </div>
  );
};