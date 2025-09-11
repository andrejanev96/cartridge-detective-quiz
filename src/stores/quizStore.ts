import { create } from 'zustand';
import { Question, UserAnswer, QuizState, Tier, MultipleChoiceQuestion, TrueFalseQuestion, TextInputQuestion, SliderQuestion, DragDropQuestion } from '@/types/quiz';
import { subscribeToMailChimp } from '@/utils/mailchimp';
import { trackQuizEvents } from '@/utils/analytics';
import questionsData from '@/data/cartridge-questions.json';

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

type QuestionsFile = {
  settings: {
    questionsPerQuiz: number;
    questionsPerDifficulty: Record<'easy' | 'medium' | 'hard', number>;
  };
  easy: Array<Omit<Question, 'id' | 'difficulty'>>;
  medium: Array<Omit<Question, 'id' | 'difficulty'>>;
  hard: Array<Omit<Question, 'id' | 'difficulty'>>;
};

interface QuizStore extends QuizState {
  // Actions
  startQuiz: () => void;
  loadQuestions: () => Promise<void>;
  generateQuiz: (allQuestions: QuestionsFile) => void;
  selectAnswer: (answer: QuizState['selectedAnswer']) => void;
  nextQuestion: () => void;
  unlockResults: (email: string, subscribeToBulletin: boolean) => void;
  showSection: (section: QuizState['currentSection']) => void;
  retakeQuiz: () => void;
  resetQuestionState: () => void;
  getTier: (score: number) => Tier;
  getAchievements: () => Array<{ icon: string; text: string }>;
  trackEvent: () => void;
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
  resultsUnlocked: false,
  userEmail: undefined,

  // Actions
  startQuiz: async () => {
    trackQuizEvents.quizStarted();
    await get().loadQuestions();
    set({ currentSection: 'quiz', isQuizActive: true, userAnswers: [] });
  },

  loadQuestions: async () => {
    get().generateQuiz(questionsData as unknown as QuestionsFile);
  },

  generateQuiz: (allQuestions) => {
    const settings = allQuestions.settings;
    const quizData: Question[] = [];

    // Add questions from each difficulty level
    (['easy', 'medium', 'hard'] as const).forEach((difficulty) => {
      const questionsNeeded = settings.questionsPerDifficulty[difficulty];
      const diff = difficulty;
      const availableQuestions = [...allQuestions[diff]] as Array<Omit<Question, 'id' | 'difficulty'>>;

      for (let i = 0; i < questionsNeeded && availableQuestions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const selectedQuestion = availableQuestions.splice(randomIndex, 1)[0];
        const completedQuestion = {
          ...(selectedQuestion as Record<string, unknown>),
          id: `${difficulty}-${i}`,
          difficulty: difficulty as 'easy' | 'medium' | 'hard',
        } as unknown as Question;
        quizData.push(completedQuestion);
      }
    });

    // Randomize the final quiz order (shuffle all questions together)
    const shuffledQuizData = quizData.sort(() => Math.random() - 0.5);

    set({ quizData: shuffledQuizData });
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
        {
          const q = question as MultipleChoiceQuestion;
          const idx = state.selectedAnswer as number;
          isCorrect = idx === q.correct;
          userAnswer = typeof idx === 'number' ? q.answers[idx] : null;
        }
        break;
      case 'true-false':
        {
          const q = question as TrueFalseQuestion;
          isCorrect = state.selectedAnswer === q.correct;
        }
        break;
      case 'text-input': {
        const q = question as TextInputQuestion;
        const user = String(state.selectedAnswer ?? '').trim().toLowerCase();
        isCorrect =
          user.length > 0 &&
          q.acceptableAnswers.some(
            (acceptable: string) => acceptable.trim().toLowerCase() === user
          );
        break;
      }
      case 'slider':
        {
          const q = question as SliderQuestion;
          const selected = Number(state.selectedAnswer);
          const correct = Number(q.correct);
          const tolerance = Number(q.tolerance ?? 0);
          if (q.presetOnly) {
            // In preset-only mode, require exact match
            isCorrect = selected === correct;
          } else {
            isCorrect = Math.abs(selected - correct) <= tolerance;
          }
          userAnswer = `${state.selectedAnswer} ${q.unit}`;
          break;
        }
      case 'drag-drop':
        {
          const q = question as DragDropQuestion;
          const ans = (state.selectedAnswer || {}) as Record<string, string>;
          isCorrect = Object.keys(q.correctMatches).every(
            (itemId) => ans[itemId] === q.correctMatches[itemId]
          );
        }
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
      set({ currentSection: 'results', isQuizActive: false });
    }
  },

  unlockResults: async (email: string, subscribeToBulletin: boolean) => {
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
      // Handle MailChimp subscription (only if user opted in)
      if (subscribeToBulletin) {
        await subscribeToMailChimp(email, subscribeToBulletin);
      }
    } catch {
      // Non-blocking
    }

    set({ 
      currentSection: 'results',
      resultsUnlocked: true,
      userEmail: email,
    });
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
      resultsUnlocked: false,
      userEmail: undefined,
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

  trackEvent: () => {
    // Legacy method - now handled by analytics utils
  },
}));
