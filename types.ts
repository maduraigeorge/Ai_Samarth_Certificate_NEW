
export interface Participant {
  id: string;
  fullName: string;
  schoolName: string;
  city: string;
  email: string;
  phone: string;
  gender: string;
  gradesHandled: string;
  subjectsHandled: string;
  
  // App State
  quizPassed: boolean;
  certificateDownloaded: boolean;
  registrationDate: string;
  webinarTopic?: string;
}

export interface CertificateConfig {
  recipientName: string;
  webinarTitle: string;
  schoolName: string;
  date: string;
  customMessage?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export enum AppView {
  PORTAL = 'PORTAL',
  QUIZ = 'QUIZ',
  CERTIFICATE = 'CERTIFICATE',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}
