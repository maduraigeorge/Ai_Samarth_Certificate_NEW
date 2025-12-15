
import { Participant } from '../types';

// Use environment variable for API URL (Production) or localhost (Development)
// In Vercel (Vite), set VITE_API_URL to your backend endpoint (e.g., https://your-server.com/api)
const BACKEND_API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export interface RegistrationData {
  fullName: string;
  schoolName: string;
  city: string;
  email: string;
  phone: string;
  gender: string;
}

export const registerUser = async (data: RegistrationData): Promise<Participant> => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Registration failed');
    }

    const result = await response.json();
    
    return {
      id: result.id,
      ...data,
      quizPassed: false,
      certificateDownloaded: false,
      registrationDate: new Date().toISOString(),
      webinarTopic: "AI Literacy"
    };
  } catch (error) {
    console.warn("Backend API Error:", error);
    console.info("⚠️ Backend unreachable. Switching to DEMO MODE (Mock Data).");
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now().toString(),
          ...data,
          quizPassed: false,
          certificateDownloaded: false,
          registrationDate: new Date().toISOString(),
          webinarTopic: "AI Literacy"
        });
      }, 1000);
    });
  }
};

export const updateParticipantStatus = async (id: string, status: { quizPassed?: boolean; certificateDownloaded?: boolean }) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/update/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(status)
    });

    if (!response.ok) {
      throw new Error('Failed to update status');
    }
  } catch (error) {
    console.warn("Backend API Error (Update Status):", error);
    console.info("⚠️ Backend unreachable. Update skipped (Demo Mode).");
  }
};
