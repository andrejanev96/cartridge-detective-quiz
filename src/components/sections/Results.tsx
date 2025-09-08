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

  const shareX = () => {
    trackQuizEvents.socialShare('x', score, tier.name);
    const text = `I just scored ${score}/${quizData.length} on the Cartridge Detective Challenge and earned the rank of ${tier.name}! Can you beat my score?`;
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
      '_blank'
    );
  };

  const shareFacebook = () => {
    trackQuizEvents.socialShare('facebook', score, tier.name);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareReddit = () => {
    trackQuizEvents.socialShare('reddit', score, tier.name);
    const title = `I scored ${score}/${quizData.length} on the Cartridge Detective Challenge and earned ${tier.name}!`;
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.reddit.com/submit?url=${url}&title=${encodeURIComponent(title)}`,
      '_blank'
    );
  };

  const shareInstagram = () => {
    trackQuizEvents.socialShare('instagram', score, tier.name);
    // Instagram doesn't support direct URL sharing, so we'll copy the text to clipboard
    const text = `I just scored ${score}/${quizData.length} on the Cartridge Detective Challenge! 🎯 Check it out: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Results copied to clipboard! You can paste this on Instagram.');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Results copied to clipboard! You can paste this on Instagram.');
    });
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
              <Button variant="social" onClick={shareX}>
                <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Button>
              <Button variant="social" onClick={shareFacebook}>
                <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Button>
              <Button variant="social" onClick={shareReddit}>
                <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </Button>
              <Button variant="social" onClick={shareInstagram}>
                <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
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