
import React, { useState, useEffect, useCallback } from 'react';
import { Participant, CertificateConfig, AppView, QuizQuestion } from './types';
import { registerUser, updateParticipantStatus, RegistrationData } from './services/apiService';
import { generateQuiz } from './services/quizService';
import { Certificate } from './components/Certificate';
import { Quiz } from './components/Quiz';
import { Header } from './components/Header';
import { PortalView } from './components/PortalView';

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

        </div>
      </main>

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
    </div>
  );
};

export default App;
