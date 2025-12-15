
import { Participant } from '../types';

// POINT TO VERCEL (Local Proxy)
// We use a relative path '/api'. Vercel will handle these requests securely (HTTPS).
const BACKEND_API_URL = '/api';

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
    // Calls the Vercel function: api/register.js
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
    // Fallback logic could go here, but for now we throw to show the error
    throw error;
  }
};

export const updateParticipantStatus = async (id: string, status: { quizPassed?: boolean; certificateDownloaded?: boolean }) => {
  try {
    // Calls the Vercel function: api/update.js with ID as a query parameter
    // We send ID as a query param (?id=...) to simplify the Vercel function routing
    const response = await fetch(`${BACKEND_API_URL}/update?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(status)
    });

    if (!response.ok) {
      throw new Error('Failed to update status');
    }
  } catch (error) {
    console.warn("Backend API Error (Update Status):", error);
  }
};
