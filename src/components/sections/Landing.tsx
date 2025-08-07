import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useQuizStore } from '@/stores/quizStore';

export const Landing: React.FC = () => {
  const { startQuiz, quizData } = useQuizStore();

  return (
    <motion.section 
      className="section active"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <Logo />

        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            The Cartridge Detective Challenge
          </motion.h1>
          
          <motion.p 
            className="subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Can you identify these obscure military and sporting cartridges? 
            Test your expertise with our challenging cartridge identification quiz.
          </motion.p>

          <motion.div 
            className="quiz-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="detail-item">
              <span className="detail-number">{quizData.length || 15}</span>
              <span className="detail-label">Cartridges</span>
            </div>
            <div className="detail-item">
              <span className="detail-number">5-7</span>
              <span className="detail-label">Minutes</span>
            </div>
            <div className="detail-item">
              <span className="detail-number">5</span>
              <span className="detail-label">Skill Levels</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button onClick={startQuiz}>
              Start Detective Challenge
            </Button>
          </motion.div>

          <motion.p 
            className="disclaimer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Get your personalized Cartridge Knowledge Profile and percentile ranking delivered via email.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
};