// Google Analytics 4 integration

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const initializeGA4 = (measurementId: string) => {
  // Create the script tag for Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId);
};

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, parameters);
  } else {
    // Fallback for development
    console.log('Analytics Event:', eventName, parameters);
  }
};

// Quiz-specific tracking events
export const trackQuizEvents = {
  quizStarted: () => trackEvent('quiz_started', {
    content_type: 'quiz',
    content_id: 'cartridge_detective_challenge'
  }),

  questionAnswered: (questionIndex: number, isCorrect: boolean, category: string) => 
    trackEvent('question_answered', {
      question_index: questionIndex,
      is_correct: isCorrect,
      question_category: category
    }),

  quizCompleted: (data: {
    score: number;
    totalQuestions: number;
    accuracy: number;
    tier: string;
    subscribeToBulletin: boolean;
  }) => trackEvent('quiz_completed', {
    score: data.score,
    total_questions: data.totalQuestions,
    accuracy: data.accuracy,
    tier: data.tier,
    newsletter_signup: data.subscribeToBulletin,
    conversion: true
  }),

  emailSubmitted: (subscribeToBulletin: boolean) => trackEvent('email_submitted', {
    newsletter_signup: subscribeToBulletin,
    lead_generated: true
  }),

  socialShare: (platform: string, score: number, tier: string) => 
    trackEvent('social_share', {
      platform,
      score,
      tier
    }),

  retakeQuiz: () => trackEvent('quiz_retake'),
};

// Initialize analytics if measurement ID is provided
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
if (GA4_MEASUREMENT_ID) {
  initializeGA4(GA4_MEASUREMENT_ID);
}