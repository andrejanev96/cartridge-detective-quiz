import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useQuizStore } from '@/stores/quizStore';
import { trackQuizEvents } from '@/utils/analytics';

export const Results: React.FC = () => {
  const {
    score,
    quizData,
    maxStreak,
    getTier,
    getAchievements,
    retakeQuiz,
  } = useQuizStore();

  const tier = getTier(score);
  const achievements = getAchievements();
  const accuracy = Math.round((score / quizData.length) * 100);

  const shareTwitter = () => {
    trackQuizEvents.socialShare('twitter', score, tier.name);
    const text = `I just scored ${score}/${quizData.length} on the Cartridge Detective Challenge and earned the rank of ${tier.name}! Can you beat my score?`;
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
      '_blank'
    );
  };

  const shareFacebook = () => {
    trackQuizEvents.socialShare('facebook', score, tier.name);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  return (
    <motion.section 
      className="section active"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="results-content">
          <Logo />

          <div className="results-header">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your Detective Results
            </motion.h2>
            
            <motion.div 
              className="score-display"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <span className="score-number">{score}</span>
              <span className="score-separator"> / </span>
              <span className="score-total">{quizData.length}</span>
            </motion.div>
          </div>

          <motion.div 
            className="tier-badge"
            style={{
              borderColor: score >= 10 ? '#bf9400' : score >= 7 ? '#99161d' : '#464648'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="tier-icon">{tier.icon}</div>
            <h3 className="tier-title">{tier.name}</h3>
            <p className="tier-description">{tier.description}</p>
          </motion.div>

          <motion.div 
            className="results-breakdown"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h4>Performance Summary</h4>
            <div className="breakdown-item">
              <span>Cartridges Identified:</span>
              <span>{score}</span>
            </div>
            <div className="breakdown-item">
              <span>Accuracy Rate:</span>
              <span>{accuracy}%</span>
            </div>
            <div className="breakdown-item">
              <span>Best Streak:</span>
              <span>{maxStreak}</span>
            </div>
          </motion.div>

          {achievements.length > 0 && (
            <motion.div 
              className="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {achievements.map((achievement, index) => (
                <div key={index} className="achievement-badge">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <span className="achievement-text">{achievement.text}</span>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div 
            className="email-sent-notice"
            style={{
              background: '#1d1d1d',
              border: '2px solid #28a745',
              borderRadius: '8px',
              padding: '20px',
              margin: '30px 0',
              textAlign: 'center'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h4 style={{ color: '#28a745', marginBottom: '10px' }}>📧 Results Sent!</h4>
            <p style={{ color: '#cccccc' }}>
              Check your email for detailed explanations, historical context, 
              and your complete Cartridge Knowledge Profile.
            </p>
          </motion.div>

          <motion.div 
            style={{ margin: '30px 0' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <h4 style={{ color: '#bf9400', marginBottom: '15px' }}>Share Your Results</h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Button variant="social" onClick={shareTwitter}>
                Share on Twitter
              </Button>
              <Button variant="social" onClick={shareFacebook}>
                Share on Facebook
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <Button variant="secondary" onClick={retakeQuiz}>
              Take Challenge Again
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};