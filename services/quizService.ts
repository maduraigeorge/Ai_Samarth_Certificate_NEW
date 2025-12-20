
import { QuizQuestion } from '../types';

// Hardcoded pool of questions updated as per user request
const FIXED_QUIZ_POOL: QuizQuestion[] = [
  {
    id: 1,
    question: "How should teachers present the benefits of AI to students?",
    options: [
      "AI will solve all problems in society",
      "AI can help in healthcare, education, and farming but has limitations",
      "AI has no real benefits for society",
      "Only urban-schools can benefit from AI"
    ],
    answer: "AI can help in healthcare, education, and farming but has limitations"
  },
  {
    id: 2,
    question: "What should teachers tell students about using AI for schoolwork?",
    options: [
      "Copy everything AI provides without checking",
      "Never use AI for any learning purpose",
      "Use AI as a helper but verify the information",
      "Only use AI for entertainment"
    ],
    answer: "Use AI as a helper but verify the information"
  },
  {
    id: 3,
    question: "As a teacher, how should you explain AI risks to your students?",
    options: [
      "AI is completely safe and has no risks",
      "AI can make mistakes and may affect some jobs",
      "AI will destroy the world",
      "Students should be afraid of using AI"
    ],
    answer: "AI can make mistakes and may affect some jobs"
  },
  {
    id: 4,
    question: "When teaching students about writing prompts for AI, what should teachers emphasize?",
    options: [
      "Use complex and difficult language",
      "Write very long instructions",
      "Be clear, specific, and include context",
      "Ask many questions at the same time"
    ],
    answer: "Be clear, specific, and include context"
  },
  {
    id: 5,
    question: "How can teachers use AI tools for their own professional development?",
    options: [
      "Replace all their teaching methods with AI",
      "Use AI to help create lesson plans and organize work",
      "Avoid AI completely in professional work",
      "Only use AI for personal entertainment"
    ],
    answer: "Use AI to help create lesson plans and organize work"
  },
  {
    id: 6,
    question: "Which of these is an effective prompt for AI to help with lesson planning?",
    options: [
      "\"Make me a lesson plan\"",
      "\"Create a 45-minute Hindi lesson plan for Class 7 students on '' with activities and examples\"",
      "\"Give me something for teaching\"",
      "\"Help me teach students everything about grammar\""
    ],
    answer: "\"Create a 45-minute Hindi lesson plan for Class 7 students on '' with activities and examples\""
  },
  {
    id: 7,
    question: "How can teachers use AI tools to make their teaching more efficient?",
    options: [
      "Let AI teach all classes instead of the teacher",
      "Use AI to generate lesson plans and create practice questions for students",
      "Replace all textbooks with AI-generated content only",
      "Use AI to give marks to students without checking their work"
    ],
    answer: "Use AI to generate lesson plans and create practice questions for students"
  },
  {
    id: 8,
    question: "Which administrative task can teachers effectively use AI for?",
    options: [
      "Deciding student grades without reviewing their work",
      "Drafting parent communication letters and creating school event notices",
      "Making all school policy decisions",
      "Hiring other teachers"
    ],
    answer: "Drafting parent communication letters and creating school event notices"
  },
  {
    id: 9,
    question: "What is the most important role of a teacher when students use AI in the classroom?",
    options: [
      "Stop students from using any AI tools",
      "Let students use AI without any guidance or rules",
      "Guide students to use AI responsibly and check AI-generated information",
      "Use AI to do all the teaching work"
    ],
    answer: "Guide students to use AI responsibly and check AI-generated information"
  },
  {
    id: 10,
    question: "When writing prompts for AI to help with school work, teachers should:",
    options: [
      "Use very complicated and technical language",
      "Ask for everything in one single long prompt",
      "Be specific, clear, and include context about what they need",
      "Copy prompts from the internet without changing them"
    ],
    answer: "Be specific, clear, and include context about what they need"
  }
];

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  // Return 6 random questions from the fixed pool
  const shuffled = [...FIXED_QUIZ_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 6);
};
