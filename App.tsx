
import React, { useState, useEffect, useCallback } from 'react';
import { Participant, CertificateConfig, AppView, QuizQuestion } from './types';
import { registerUser, updateParticipantStatus, RegistrationData } from './services/apiService';
import { generateQuiz } from './services/quizService';
import { Certificate } from './components/Certificate';
import { Quiz } from './components/Quiz';
import { Header } from './components/Header';
import { PortalView } from './components/PortalView';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [activeParticipant, setActiveParticipant] = useState<Participant | null>(null);
  
  const [view, setView] = useState<AppView>(AppView.PORTAL);
  const [certificateConfig, setCertificateConfig] = useState<CertificateConfig | null>(null);
  
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Security / Anti-Cheat
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && ['I', 'J', 'C'].includes(e.key.toUpperCase())) e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleGenerateCertificateForStudent = useCallback((participant: Participant) => {
    // Modified to use fullName directly
    const fullName = participant.fullName;
    const displayDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const topic = participant.webinarTopic || "AI Literacy";

    const config: CertificateConfig = {
      recipientName: fullName,
      webinarTitle: topic,
      schoolName: participant.schoolName,
      date: displayDate
    };

    setCertificateConfig(config);
    setView(AppView.CERTIFICATE);
  }, []);

  const handleRegistration = async (formData: RegistrationData) => {
      setLoading(true);
      setErrorMsg(null);
      
      try {
          const participant = await registerUser(formData);
          setActiveParticipant(participant);
      } catch (e: any) {
          console.error(e);
          setErrorMsg("Registration failed. Please verify your details.");
      } finally {
          setLoading(false);
      }
  };

  const handleStartAssessment = async () => {
      if (!activeParticipant) return;
      
      setLoading(true);
      try {
        const topic = activeParticipant.webinarTopic || "AI Literacy";
        const questions = await generateQuiz(topic);
        setQuizQuestions(questions);
        setView(AppView.QUIZ);
      } catch (e) {
        console.error("Failed to start quiz", e);
        setErrorMsg("Unable to load assessment questions. Please try again.");
      } finally {
        setLoading(false);
      }
  };

  const handleQuizPassed = async () => {
      if (!activeParticipant) return;
      
      setLoading(true);
      try {
        await updateParticipantStatus(activeParticipant.id, { quizPassed: true });
        setActiveParticipant(prev => prev ? ({ ...prev, quizPassed: true }) : null);
        handleGenerateCertificateForStudent(activeParticipant);
      } catch (e) {
         console.error(e);
         setErrorMsg("Assessment passed, but certificate generation failed.");
      } finally {
        setLoading(false);
      }
  };

  const handleDownloadRecorded = async () => {
    if (!activeParticipant) return;
    await updateParticipantStatus(activeParticipant.id, { certificateDownloaded: true });
    setActiveParticipant(prev => prev ? ({ ...prev, certificateDownloaded: true }) : null);
  };

  return (
    // Use dynamic viewport height (100dvh) to account for mobile address bars
    <div 
        className="w-screen overflow-hidden flex flex-col font-sans select-none bg-slate-50 text-slate-800 relative"
        style={{ height: '100dvh' }}
    >
      
      {/* Abstract Corporate Background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-white via-white to-blue-50"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1e3a8a] opacity-[0.03] skew-x-12 origin-top-right z-0"></div>

      <Header />

      <main className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
        {/* Central Content Area - No Scroll */}
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-0 md:p-4">
          
          {/* Error Toast */}
          {errorMsg && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded shadow-lg animate-fade-in-up z-50 text-sm flex items-center justify-between">
                  <span>{errorMsg}</span>
                  <button onClick={() => setErrorMsg(null)} className="text-red-500 font-bold ml-2">✕</button>
              </div>
          )}
          
          {/* --- VIEW: PORTAL (REGISTRATION) --- */}
          {view === AppView.PORTAL && (
            <PortalView 
                key={activeParticipant ? 'registered' : 'form'}
                loading={loading}
                onRegister={handleRegistration}
                activeParticipant={activeParticipant}
                onStartAssessment={handleStartAssessment}
                onReset={() => {
                  setActiveParticipant(null);
                  setErrorMsg(null);
                }}
            />
          )}
          
          {/* --- VIEW: QUIZ --- */}
          {view === AppView.QUIZ && activeParticipant && (
             <Quiz 
               topic={activeParticipant.webinarTopic || "AI"}
               questions={quizQuestions}
               onPass={handleQuizPassed}
               onCancel={() => setView(AppView.PORTAL)}
             />
          )}

          {/* --- VIEW: ADMIN LOGIN --- */}
          {view === AppView.ADMIN_LOGIN && (
            <AdminLogin 
                onLoginSuccess={() => setView(AppView.ADMIN_DASHBOARD)}
                onCancel={() => setView(AppView.PORTAL)}
            />
          )}

          {/* --- VIEW: ADMIN DASHBOARD --- */}
          {view === AppView.ADMIN_DASHBOARD && (
            <AdminDashboard 
                onClose={() => setView(AppView.PORTAL)}
            />
          )}

        </div>
      </main>

      {/* --- ADMIN ACCESS ICON (Fixed Overlay) --- */}
      {view === AppView.PORTAL && (
          <button 
            onClick={() => setView(AppView.ADMIN_LOGIN)}
            className="fixed bottom-3 right-3 z-[100] p-2 text-slate-400 hover:text-blue-800 transition-colors opacity-70 hover:opacity-100"
            title="Admin Access"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </button>
      )}

      {/* --- VIEW: CERTIFICATE MODAL --- */}
      {view === AppView.CERTIFICATE && certificateConfig && (
        <Certificate 
            config={certificateConfig} 
            onClose={() => {
              setView(AppView.PORTAL);
            }}
            onDownload={handleDownloadRecorded}
        />
      )}
      
      <div className="text-center mt-2 md:mt-4 shrink-0 pb-2 z-20 relative">
             <p className="text-[10px] text-slate-400 uppercase tracking-widest">
               © {new Date().getFullYear()} AI Samarth | Secure Portal v1.2
             </p>
      </div>
    </div>
  );
};

export default App;
