import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useQuizStore } from '@/stores/quizStore';
import { EmailFormData } from '@/types/quiz';

export const EmailCapture: React.FC = () => {
  const { submitEmail } = useQuizStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFiring, setIsFiring] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setFocus,
  } = useForm<EmailFormData>({
    defaultValues: {
      subscribeToBulletin: true, // Default checked as requested
    },
  });

  // Auto-focus email input
  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  // Handle Enter key submission
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isValid) {
        handleSubmit(onSubmit)();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isValid, handleSubmit]);

  const onSubmit = async (data: EmailFormData) => {
    setIsFiring(true);
    setIsSubmitting(true);
    
    try {
      // Show firing animation briefly
      await new Promise(resolve => setTimeout(resolve, 600));
      setIsFiring(false);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      submitEmail(data.email, data.subscribeToBulletin);
    } catch (error) {
      console.error('Email submission error:', error);
      setIsSubmitting(false);
      setIsFiring(false);
    }
  };

  return (
    <motion.section 
      className="section active"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="email-content">
          <Logo />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Challenge Complete!
          </motion.h2>
          
          <motion.p 
            className="email-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Get your detailed Cartridge Knowledge Profile with historical context, 
            percentile ranking, and explanations for each cartridge.
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
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
              style={errors.email ? { borderColor: '#dc3545' } : {}}
            />
            
            <div className="submit-container" style={{ position: 'relative' }}>
              {isFiring && (
                <>
                  <motion.div
                    className="muzzle-flash"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="bullet-trail"
                    initial={{ x: -20, opacity: 1 }}
                    animate={{ x: 200, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </>
              )}
              <Button 
                type="submit" 
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (isFiring ? 'FIRING! 💥' : 'Reloading...') : 'FIRE! 🔫'}
              </Button>
            </div>
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
                <input
                  type="checkbox"
                  {...register('subscribeToBulletin')}
                  defaultChecked
                />
                <span>🎯 Get the Ammo.com BULLETin for weekly ammo discounts and insights</span>
              </label>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};