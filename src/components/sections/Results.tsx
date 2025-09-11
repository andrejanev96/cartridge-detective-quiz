import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useQuizStore } from '@/stores/quizStore';
import { trackQuizEvents } from '@/utils/analytics';
import { useForm } from 'react-hook-form';
import { EmailFormData } from '@/types/quiz';

export const Results: React.FC = () => {
  const {
    score,
    quizData,
    maxStreak,
    getTier,
    getAchievements,
    retakeQuiz,
    resultsUnlocked,
  } = useQuizStore();

  const tier = getTier(score);
  const achievements = getAchievements();
  const accuracy = Math.round((score / quizData.length) * 100);
  const [displayScore, setDisplayScore] = useState(0);

  // Animate score count-up when results unlock
  useEffect(() => {
    if (!resultsUnlocked) return;
    let raf = 0;
    const duration = 800; // ms
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplayScore(Math.round(eased * score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setDisplayScore(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [resultsUnlocked, score]);

  // Email gating
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid }, setFocus } = useForm<EmailFormData>({
    defaultValues: { subscribeToBulletin: true },
  });
  const [showSneakPeek, setShowSneakPeek] = useState(false);

  useEffect(() => { setFocus('email'); }, [setFocus]);

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    try {
      await useQuizStore.getState().unlockResults(data.email, data.subscribeToBulletin);
    } finally {
      setIsSubmitting(false);
    }
  };

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


  if (!resultsUnlocked) {
    return (
      <motion.section 
        className="section active"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div className="email-content">
            <Logo />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Unlock Your Results
            </motion.h2>

            <motion.p 
              className="email-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Enter your email to view your Cartridge Knowledge Profile. You can opt-in for the Ammo.com BULLETin, too.
            </motion.p>

            <motion.form 
              className="email-form"
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
                })}
                style={errors.email ? { borderColor: '#dc3545' } : {}}
              />
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Unlock Results'}
              </Button>
            </motion.form>

            {errors.email && (
              <motion.p 
                style={{ color: '#dc3545', fontSize: '14px', marginTop: '10px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.email.message}
              </motion.p>
            )}

            <motion.div 
              className="bulletin-option-single"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bullet-option">
                <div className="bullet-shell">
                  <div className="bullet-tip"></div>
                </div>
                <label>
                  <input type="checkbox" {...register('subscribeToBulletin')} defaultChecked />
                  <span>🎯 Get the Ammo.com BULLETin for weekly ammo discounts and insights</span>
                </label>
              </div>
            </motion.div>

            {/* Sneak peek option */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              style={{ marginTop: '10px' }}
            >
              <Button variant="secondary" onClick={() => setShowSneakPeek(true)}>
                See a quick summary
              </Button>
            </motion.div>

            {showSneakPeek && (
              <motion.div
                className="results-breakdown"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: '20px' }}
              >
                <h4>Quick Summary</h4>
                <div className="breakdown-item">
                  <span>Cartridges Identified:</span>
                  <span>{score} / {quizData.length}</span>
                </div>
                <div className="breakdown-item">
                  <span>Accuracy Rate:</span>
                  <span>{accuracy}%</span>
                </div>

                {/* Blurred Detective Rank Preview */}
                <div className="breakdown-item" style={{ position: 'relative' }}>
                  <span>Detective Rank:</span>
                  <span style={{ 
                    filter: 'blur(4px)', 
                    userSelect: 'none',
                    color: '#bf9400',
                    fontWeight: 'bold'
                  }}>
                    {tier.name}
                  </span>
                  <div style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '12px',
                    color: '#bf9400'
                  }}>🔒</div>
                </div>

                {/* Hidden Badges Preview */}
                <div style={{ margin: '15px 0', textAlign: 'center' }}>
                  <div style={{ marginBottom: '8px', color: '#bf9400', fontSize: '14px', fontWeight: 'bold' }}>
                    🎯 You earned {achievements.length} badge{achievements.length !== 1 ? 's' : ''}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {achievements.slice(0, 3).map((_, index) => (
                      <div 
                        key={index}
                        style={{
                          background: 'rgba(191, 148, 0, 0.1)',
                          border: '1px solid rgba(191, 148, 0, 0.3)',
                          borderRadius: '20px',
                          padding: '5px 12px',
                          fontSize: '12px',
                          filter: 'blur(3px)',
                          userSelect: 'none'
                        }}
                      >
                        🏆 ██████████
                      </div>
                    ))}
                    {achievements.length > 3 && (
                      <div style={{
                        background: 'rgba(191, 148, 0, 0.1)',
                        border: '1px solid rgba(191, 148, 0, 0.3)',
                        borderRadius: '20px',
                        padding: '5px 12px',
                        fontSize: '12px',
                        color: '#bf9400'
                      }}>
                        +{achievements.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Proof */}
                <div style={{ 
                  textAlign: 'center', 
                  margin: '15px 0',
                  padding: '10px',
                  background: 'rgba(191, 148, 0, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(191, 148, 0, 0.2)'
                }}>
                  <div style={{ fontSize: '12px', color: '#bf9400', marginBottom: '5px' }}>
                    ⭐ Join 1,200+ cartridge detectives who unlocked their full profile
                  </div>
                </div>

                <p style={{ marginTop: '15px', color: '#888a8c', textAlign: 'center', fontSize: '13px' }}>
                  Enter your email above to unlock your detective rank, achievements, and question-by-question breakdown.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>
    );
  }

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
              <span className="score-number">{displayScore}</span>
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

          {/* Shooter's Intelligence Report */}
          <motion.div 
            className="intelligence-report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            style={{ marginTop: '30px' }}
          >
            <h4 style={{ color: '#bf9400', marginBottom: '20px', textAlign: 'center' }}>
              🎯 Your Ballistics Intelligence Report
            </h4>
            
            {/* Performance Insights */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: window.innerWidth > 768 ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr',
              gap: '15px',
              marginBottom: '20px'
            }}>
              {/* Accuracy Assessment */}
              <div style={{
                background: '#1d1d1d',
                border: '2px solid #bf9400',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {accuracy >= 80 ? '🎖️' : accuracy >= 47 ? '🎯' : '📚'}
                </div>
                <h5 style={{ color: '#bf9400', marginBottom: '8px', fontSize: '16px' }}>
                  {accuracy >= 80 ? 'Marksman Status' : accuracy >= 47 ? 'Good Shooting' : 'Training Mode'}
                </h5>
                <p style={{ color: '#fff', fontSize: '14px', margin: '0' }}>
                  {accuracy >= 80 
                    ? "Outstanding accuracy! You've got a keen eye for cartridge identification."
                    : accuracy >= 47 
                    ? "Solid performance! Your detective skills are developing well."
                    : "Every expert was once a beginner. Time to hit the books and try again!"
                  }
                </p>
              </div>

              {/* Comparative Stats */}
              <div style={{
                background: '#1d1d1d',
                border: '2px solid #bf9400',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                <h5 style={{ color: '#bf9400', marginBottom: '8px', fontSize: '16px' }}>
                  Compared to Other Shooters
                </h5>
                <p style={{ color: '#fff', fontSize: '14px', margin: '0' }}>
                  {accuracy >= 90 
                    ? "Top 10% - You're in the elite tier of cartridge detectives!"
                    : accuracy >= 75 
                    ? "Top 25% - Above average marksmanship in identification!"
                    : accuracy >= 50
                    ? "Middle of the pack - Room to improve your ballistics knowledge!"
                    : "Early stage shooter - Perfect time to build your expertise!"
                  }
                </p>
              </div>

              {/* Learning Recommendations */}
              <div style={{
                background: '#1d1d1d',
                border: '2px solid #bf9400',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                ...(window.innerWidth > 768 ? { gridColumn: '1 / -1' } : {})
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎓</div>
                <h5 style={{ color: '#bf9400', marginBottom: '8px', fontSize: '16px' }}>
                  Intel for Your Next Mission
                </h5>
                <p style={{ color: '#fff', fontSize: '14px', margin: '0' }}>
                  {score >= 12 
                    ? "You're dialed in! Try challenging yourself with different cartridge families or historical rounds."
                    : score >= 8 
                    ? "Focus fire on military surplus rounds and common hunting cartridges. That's where the points are!"
                    : score >= 4
                    ? "Start with the fundamentals: rimfire vs. centerfire, and basic caliber recognition. Build that foundation!"
                    : "Time for basic training! Study up on common cartridge types and their key identifying features."
                  }
                  {maxStreak >= 5 ? " Your streak game is strong - maintain that momentum!" : " Work on consistency to build longer identification streaks."}
                </p>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
              Ready for another mission? Your knowledge stays sharp with practice!
            </div>
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

