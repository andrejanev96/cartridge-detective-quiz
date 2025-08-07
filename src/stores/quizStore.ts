import { create } from 'zustand';
import { Question, UserAnswer, QuizState, Tier } from '@/types/quiz';
import { subscribeToMailChimp, sendQuizResultsEmail } from '@/utils/mailchimp';
import { trackQuizEvents } from '@/utils/analytics';

const tiers: Tier[] = [
  {
    name: "Recruit Detective",
    range: [0, 3],
    icon: "🎯",
    description: "You're new to cartridge identification. Every expert started here - keep learning!",
  },
  {
    name: "Cartridge Spotter",
    range: [4, 6],
    icon: "🏅", 
    description: "You can identify some common cartridges. Your detective skills are developing!",
  },
  {
    name: "Ammunition Expert",
    range: [7, 9],
    icon: "⭐",
    description: "Impressive knowledge! You can identify most cartridges and understand their history.",
  },
  {
    name: "Master Cartridge Detective",
    range: [10, 12],
    icon: "🎖️",
    description: "Exceptional expertise! You have deep cartridge knowledge that rivals collectors.",
  },
  {
    name: "Arsenal Commander",
    range: [13, 15],
    icon: "👑",
    description: "Elite cartridge authority! Your knowledge is comprehensive and you're among the top detectives.",
  },
];

interface QuizStore extends QuizState {
  // Actions
  startQuiz: () => void;
  loadQuestions: () => Promise<void>;
  generateQuiz: (allQuestions: any) => void;
  selectAnswer: (answer: any) => void;
  nextQuestion: () => void;
  submitEmail: (email: string, subscribeToBulletin: boolean) => void;
  showSection: (section: QuizState['currentSection']) => void;
  retakeQuiz: () => void;
  resetQuestionState: () => void;
  getTier: (score: number) => Tier;
  getAchievements: () => Array<{ icon: string; text: string }>;
  trackEvent: (eventName: string, data?: Record<string, any>) => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  // Initial state
  currentQuestion: 0,
  score: 0,
  selectedAnswer: null,
  userAnswers: [],
  streak: 0,
  maxStreak: 0,
  quizData: [],
  isQuizActive: false,
  currentSection: 'landing',

  // Actions
  startQuiz: async () => {
    trackQuizEvents.quizStarted();
    await get().loadQuestions();
    set({ currentSection: 'quiz', isQuizActive: true, userAnswers: [] });
  },

  loadQuestions: async () => {
    try {
      const basePath = import.meta.env.DEV ? '' : '/cartridge-detective-quiz';
      const response = await fetch(`${basePath}/cartridge-questions.json`);
      const allQuestions = await response.json();
      get().generateQuiz(allQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback to embedded questions if needed
      get().generateQuiz({
        easy: [],
        medium: [],
        hard: [],
        settings: { questionsPerDifficulty: { easy: 5, medium: 6, hard: 4 } }
      });
    }
  },

  generateQuiz: (allQuestions) => {
    const settings = allQuestions.settings;
    const quizData: Question[] = [];

    // Add questions from each difficulty level
    ['easy', 'medium', 'hard'].forEach((difficulty) => {
      const questionsNeeded = settings.questionsPerDifficulty[difficulty];
      const availableQuestions = [...allQuestions[difficulty]];

      for (let i = 0; i < questionsNeeded && availableQuestions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const selectedQuestion = availableQuestions.splice(randomIndex, 1)[0];
        quizData.push({
          ...selectedQuestion,
          id: `${difficulty}-${i}`,
          difficulty: difficulty as 'easy' | 'medium' | 'hard'
        });
      }
    });

    set({ quizData });
  },

  selectAnswer: (answer) => {
    set({ selectedAnswer: answer });
  },

  nextQuestion: () => {
    const state = get();
    const question = state.quizData[state.currentQuestion];
    let isCorrect = false;
    let userAnswer = state.selectedAnswer;

    // Check answer based on question type
    switch (question.type) {
      case 'multiple-choice':
      case 'image-multiple-choice':
        isCorrect = state.selectedAnswer === (question as any).correct;
        userAnswer = (question as any).answers[state.selectedAnswer];
        break;
      case 'true-false':
        isCorrect = state.selectedAnswer === (question as any).correct;
        break;
      case 'text-input':
        isCorrect = (question as any).acceptableAnswers.some(
          (acceptable: string) => 
            acceptable.toLowerCase() === String(state.selectedAnswer).toLowerCase()
        );
        break;
      case 'slider':
        isCorrect = Math.abs(state.selectedAnswer - (question as any).correct) <= (question as any).tolerance;
        userAnswer = `${state.selectedAnswer} ${(question as any).unit}`;
        break;
      case 'drag-drop':
        isCorrect = Object.keys((question as any).correctMatches).every(
          (itemId) => state.selectedAnswer[itemId] === (question as any).correctMatches[itemId]
        );
        break;
    }

    // Store the answer
    const newAnswer: UserAnswer = {
      question,
      userAnswer,
      isCorrect,
      questionIndex: state.currentQuestion,
    };

    const newUserAnswers = [...state.userAnswers, newAnswer];
    const newScore = isCorrect ? state.score + 1 : state.score;
    const newStreak = isCorrect ? state.streak + 1 : 0;
    const newMaxStreak = Math.max(state.maxStreak, newStreak);

    set({
      userAnswers: newUserAnswers,
      score: newScore,
      streak: newStreak,
      maxStreak: newMaxStreak,
    });

    // Track the question answer
    trackQuizEvents.questionAnswered(state.currentQuestion, isCorrect, question.category);

    // Move to next question or finish quiz
    if (state.currentQuestion + 1 < state.quizData.length) {
      set({ currentQuestion: state.currentQuestion + 1 });
      get().resetQuestionState();
    } else {
      set({ currentSection: 'emailCapture', isQuizActive: false });
    }
  },

  submitEmail: async (email: string, subscribeToBulletin: boolean) => {
    const state = get();
    const tier = get().getTier(state.score);
    const accuracy = Math.round((state.score / state.quizData.length) * 100);

    // Track analytics events
    trackQuizEvents.emailSubmitted(subscribeToBulletin);
    trackQuizEvents.quizCompleted({
      score: state.score,
      totalQuestions: state.quizData.length,
      accuracy,
      tier: tier.name,
      subscribeToBulletin,
    });

    try {
      // Subscribe to MailChimp
      await subscribeToMailChimp(email, subscribeToBulletin, {
        score: state.score,
        tier: tier.name,
        accuracy,
      });

      // Send detailed quiz results email
      await sendQuizResultsEmail(email, {
        score: state.score,
        totalQuestions: state.quizData.length,
        tier,
        userAnswers: state.userAnswers,
        accuracy,
      });

    } catch (error) {
      console.error('Email/subscription error:', error);
      // Continue to results even if email fails
    }
    
    set({ currentSection: 'results' });
  },

  showSection: (section) => {
    set({ currentSection: section });
  },

  retakeQuiz: () => {
    trackQuizEvents.retakeQuiz();
    set({
      currentQuestion: 0,
      score: 0,
      selectedAnswer: null,
      streak: 0,
      maxStreak: 0,
      userAnswers: [],
      currentSection: 'landing',
      isQuizActive: false,
    });
    get().resetQuestionState();
  },

  resetQuestionState: () => {
    set({ selectedAnswer: null });
  },

  getTier: (score: number) => {
    for (const tier of tiers) {
      if (score >= tier.range[0] && score <= tier.range[1]) {
        return tier;
      }
    }
    return tiers[0];
  },

  getAchievements: () => {
    const state = get();
    const achievements = [];

    if (state.score === state.quizData.length) {
      achievements.push({ icon: "🎯", text: "Perfect Detective!" });
    }
    if (state.maxStreak >= 5) {
      achievements.push({ icon: "🔥", text: "Hot Streak!" });
    }
    if (state.score >= Math.ceil(state.quizData.length * 0.8)) {
      achievements.push({ icon: "🏆", text: "Expert Level" });
    }
    if (state.maxStreak >= 3) {
      achievements.push({ icon: "💪", text: "Consistent Detective" });
    }

    return achievements;
  },

  trackEvent: (eventName: string, data?: Record<string, any>) => {
    // This is now handled by the analytics utils
    console.log('Legacy Analytics Event:', eventName, data);
  },
}));