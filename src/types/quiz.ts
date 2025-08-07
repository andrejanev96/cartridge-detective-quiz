export interface BaseQuestion {
  id: string;
  type: QuestionType;
  category: string;
  question: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice' | 'image-multiple-choice';
  answers: string[];
  correct: number;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correct: boolean;
}

export interface TextInputQuestion extends BaseQuestion {
  type: 'text-input';
  correct: string;
  acceptableAnswers: string[];
}

export interface SliderQuestion extends BaseQuestion {
  type: 'slider';
  min: number;
  max: number;
  unit: string;
  correct: number;
  tolerance: number;
  step?: number;
}

export interface DragDropQuestion extends BaseQuestion {
  type: 'drag-drop';
  items: Array<{ id: string; text: string }>;
  targets: Array<{ id: string; text: string }>;
  correctMatches: Record<string, string>;
}

export type Question = 
  | MultipleChoiceQuestion 
  | TrueFalseQuestion 
  | TextInputQuestion 
  | SliderQuestion 
  | DragDropQuestion;

export type QuestionType = Question['type'];

export interface UserAnswer {
  question: Question;
  userAnswer: any;
  isCorrect: boolean;
  questionIndex: number;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  selectedAnswer: any;
  userAnswers: UserAnswer[];
  streak: number;
  maxStreak: number;
  quizData: Question[];
  isQuizActive: boolean;
  currentSection: 'landing' | 'quiz' | 'emailCapture' | 'results';
}

export interface Tier {
  name: string;
  range: [number, number];
  icon: string;
  description: string;
}

export interface Achievement {
  icon: string;
  text: string;
}

export interface EmailFormData {
  email: string;
  subscribeToBulletin: boolean;
}

export interface AnalyticsEvent {
  eventName: string;
  data?: Record<string, any>;
}