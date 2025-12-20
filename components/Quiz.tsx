
import React, { useState, useMemo } from 'react';
import { QuizQuestion } from '../types';

interface QuizProps {
  topic: string;
  questions: QuizQuestion[];
  onPass: () => void;
  onCancel: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ topic, questions, onPass, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // Safe check for questions
  const currentQuestion = questions[currentIndex];
  
  const totalQuestions = questions.length;
  const passingScore = Math.ceil(totalQuestions / 2); 
  const isPassed = score >= passingScore;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  // Shuffle options
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const options = [...currentQuestion.options];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }, [currentQuestion]);

  const handleOptionSelect = (option: string) => {
      if (isAnswered) return;
      setSelectedOption(option);
  };

  const handleConfirmAnswer = () => {
    setIsAnswered(true);
    const isCorrect = selectedOption === currentQuestion.answer;
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    }, 1200); 
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResult(false);
  };

  // --- RESULT VIEW ---
  if (showResult) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center animate-scale-in p-2">
        <div className="w-full max-w-lg bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col rounded-xl">
             
             {/* Header */}
             <div className="bg-[#1e3a8a] p-4 md:p-6 text-white text-center shrink-0">
                <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wide">
                    Assessment Completed
                </h1>
                <div className="flex justify-center mt-2">
                    <div className="h-1 w-12 bg-white/30 rounded"></div>
                </div>
            </div>

            <div className="p-6 md:p-10 text-center flex-1 flex flex-col items-center justify-center">
                 <div className="mb-4 md:mb-6 flex justify-center">
                     <div className={`h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-sm ${isPassed ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-[#1e3a8a]'}`}>
                        {isPassed ? '✓' : 'ⓘ'}
                     </div>
                 </div>

                 <div className="mb-6">
                    <h2 className="text-lg md:text-2xl font-serif font-bold text-slate-800">
                        {isPassed ? 'Great Job!' : 'Thank you for participating'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-2">
                        You scored <span className="font-bold text-[#1e3a8a]">{score} out of {totalQuestions}</span>
                    </p>
                 </div>
                 
                 <div className="space-y-3 w-full">
                    <button 
                        onClick={onPass}
                        title="Click to view and download your certificate"
                        className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold py-3 md:py-3.5 uppercase tracking-widest text-xs transition-all rounded-lg flex items-center justify-center gap-2"
                    >
                        <span>View Certificate</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>

                    {!isPassed && (
                        <button 
                            onClick={handleRetry}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 uppercase tracking-widest text-[10px] transition-all rounded-lg"
                        >
                            Retry for a higher score
                        </button>
                    )}

                    <button 
                        onClick={onCancel}
                        className="w-full text-slate-400 hover:text-slate-600 text-[10px] uppercase tracking-widest py-2"
                    >
                        Back to Home
                    </button>
                 </div>
            </div>
        </div>
      </div>
    );
  }

  // Error State Handling
  if (!currentQuestion) {
      return (
          <div className="w-full h-full flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <p className="text-red-600 mb-4">Error loading question.</p>
                  <button onClick={onCancel} className="text-slate-600 underline">Return to Home</button>
              </div>
          </div>
      );
  }

  // --- ASSESSMENT VIEW ---
  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in-up p-1 md:p-2">
        <div className="w-full max-w-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col h-full md:h-auto md:max-h-[85vh] rounded-xl">
            
            {/* Header */}
            <div className="bg-[#1e3a8a] p-4 md:p-5 text-white shrink-0 flex items-center justify-between">
                <div>
                    <h1 className="text-lg md:text-xl font-serif font-bold tracking-wide">
                        Knowledge Assessment
                    </h1>
                    <p className="text-[10px] md:text-xs text-blue-200 mt-0.5 uppercase tracking-wider font-semibold">
                        Question {currentIndex + 1} of {totalQuestions}
                    </p>
                </div>
                {/* Info Tooltip Icon */}
                <div className="relative group cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200 opacity-70 hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Complete the quiz to receive your certificate.
                    </div>
                </div>
            </div>

            {/* Progress Line */}
            <div className="h-1.5 w-full bg-slate-100 shrink-0">
                <div 
                    className="h-full bg-blue-400 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>

            {/* Question & Options Area - Scrollable */}
            <div className="p-4 md:p-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                <div key={currentIndex} className="animate-slide-up-fade flex flex-col h-full">
                    <h3 className="text-lg md:text-xl font-serif font-bold text-slate-900 mb-4 md:mb-6 leading-snug">
                        {currentQuestion.question}
                    </h3>

                    <div className="space-y-2 md:space-y-3 pb-2">
                        {shuffledOptions.map((option, idx) => {
                            const isSelected = selectedOption === option;
                            let baseStyle = "w-full p-3 md:p-4 border text-left text-sm md:text-base transition-all duration-200 flex items-center justify-between group rounded-lg md:rounded-none relative overflow-hidden";
                            
                            if (isAnswered) {
                                if (option === currentQuestion.answer) {
                                    baseStyle += " border-green-500 bg-green-50 text-green-900 font-medium";
                                } else if (isSelected) {
                                    baseStyle += " border-red-300 bg-red-50 text-red-900 opacity-75";
                                } else {
                                    baseStyle += " border-slate-100 text-slate-300 opacity-40";
                                }
                            } else if (isSelected) {
                                baseStyle += " border-[#1e3a8a] bg-blue-50 text-[#1e3a8a] font-medium shadow-sm border-l-4";
                            } else {
                                baseStyle += " border-slate-200 hover:border-[#1e3a8a] hover:bg-slate-50 text-slate-600 active:scale-[0.99]";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(option)}
                                    disabled={isAnswered}
                                    className={baseStyle}
                                >
                                    <span className="pr-4">{option}</span>
                                    {/* Selection Indicator */}
                                    <span className={`h-4 w-4 rounded-full border border-current flex items-center justify-center shrink-0 ${isSelected ? 'bg-current' : 'bg-transparent'}`}>
                                        {isSelected && <span className="h-1.5 w-1.5 bg-white rounded-full"></span>}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-3 md:p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0 z-10">
                {!isAnswered ? (
                    <button
                        onClick={handleConfirmAnswer}
                        disabled={!selectedOption}
                        title={!selectedOption ? "Please select an answer first" : "Submit your answer"}
                        className={`px-6 md:px-8 py-3 uppercase tracking-widest text-xs font-bold transition-all rounded-lg
                            ${selectedOption 
                                ? 'bg-[#1e3a8a] hover:bg-[#172554] text-white shadow-md active:transform active:translate-y-0.5' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }
                        `}
                    >
                        Submit Answer
                    </button>
                ) : (
                    <div className="px-6 md:px-8 py-3 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <div className="w-3 h-3 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                        <span>Processing...</span>
                    </div>
                )}
            </div>
        </div>
        
        <div className="text-center mt-2 md:mt-4 shrink-0">
             <p className="text-[10px] text-slate-400 uppercase tracking-widest">Powered by AI Samarth</p>
        </div>
    </div>
  );
};
