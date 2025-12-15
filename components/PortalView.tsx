
import React, { useState, useRef, useEffect } from 'react';
import { Participant } from '../types';
import { RegistrationData } from '../services/apiService';

interface PortalViewProps {
    loading: boolean;
    onRegister: (data: RegistrationData) => void;
    activeParticipant: Participant | null;
    onStartAssessment: () => void;
    onReset: () => void;
}

export const PortalView: React.FC<PortalViewProps> = ({
    loading,
    onRegister,
    activeParticipant,
    onStartAssessment,
    onReset
}) => {
    // Form State
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<RegistrationData>({
        fullName: '',
        schoolName: '',
        city: '',
        email: '',
        phone: '',
        gender: ''
    });

    const firstInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus on step change
    useEffect(() => {
        if (!activeParticipant && firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, [step, activeParticipant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1 && !formData.gender) {
            alert("Please select your gender.");
            return;
        }
        setStep(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister(formData);
    };

    // --- STATE 1: REGISTERED PARTICIPANT CARD ---
    if (activeParticipant) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center animate-scale-in p-4">
                <div className="w-full max-w-md bg-white shadow-xl border-t-4 border-[#1e3a8a] p-6 md:p-10 text-center relative z-20 rounded-lg">
                    
                    <div className="mb-6 flex justify-center">
                        <div className="h-16 w-16 bg-[#eff6ff] rounded-full flex items-center justify-center text-[#1e3a8a]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                        Welcome, {activeParticipant.fullName}
                    </h3>
                    <p className="text-sm text-slate-600 mb-8 font-sans">
                        You are registered as a participant from <br/>
                        <span className="font-semibold text-[#1e3a8a]">{activeParticipant.schoolName}</span>
                    </p>

                    <div className="space-y-3">
                        <button 
                            onClick={onStartAssessment}
                            disabled={loading}
                            className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white font-medium py-3 px-4 uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 rounded"
                        >
                            {loading ? 'Loading...' : (
                                activeParticipant.certificateDownloaded ? 'Retake Assessment' : 'Start Assessment'
                            )}
                            {!loading && <span>&rarr;</span>}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={onReset} 
                            className="text-xs text-slate-400 hover:text-[#1e3a8a] transition-colors py-2 uppercase tracking-widest border-b border-transparent hover:border-[#1e3a8a]"
                        >
                            Register Different User
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- STATE 2: REGISTRATION FORM (Multi-Step) ---
    return (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in-up p-2">
            <div className="w-full max-w-lg bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col h-full md:h-auto md:max-h-[85vh] rounded-xl">
                
                {/* Header */}
                <div className="bg-[#1e3a8a] p-4 md:p-6 text-white text-center shrink-0">
                    <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wide">
                        Participant Registration
                    </h1>
                    <div className="flex justify-center gap-2 mt-3">
                        <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step === 1 ? 'bg-white' : 'bg-white/30'}`}></div>
                        <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step === 2 ? 'bg-white' : 'bg-white/30'}`}></div>
                    </div>
                </div>

                <div className="p-4 md:p-8 flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar">
                    {step === 1 ? (
                        <form onSubmit={handleNextStep} className="flex flex-col h-full justify-center space-y-4 animate-slide-up-fade">
                            <div className="text-center mb-1">
                                <h2 className="text-lg font-semibold text-slate-800">Profile Details</h2>
                                <p className="text-xs text-slate-500">Step 1 of 2</p>
                            </div>

                            <div className="space-y-4">
                                {/* Row 1: Full Name */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name (as per Govt Records)</label>
                                    <input 
                                        ref={firstInputRef}
                                        required name="fullName" 
                                        value={formData.fullName} onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-300 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-colors text-slate-900 placeholder-slate-400 rounded-none text-sm md:text-base"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Row 2: School Name */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">School Name</label>
                                    <input 
                                        required name="schoolName" 
                                        value={formData.schoolName} onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-300 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-colors text-slate-900 placeholder-slate-400 rounded-none text-sm md:text-base"
                                        placeholder="Enter school name"
                                    />
                                </div>

                                {/* Row 3: Gender & City */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</label>
                                        <select
                                            required name="gender"
                                            value={formData.gender} onChange={handleChange}
                                            className="w-full p-3 bg-slate-50 border border-slate-300 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-colors text-slate-900 rounded-none h-[46px] text-sm md:text-base"
                                        >
                                            <option value="">Select...</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">City</label>
                                        <input 
                                            required name="city" 
                                            value={formData.city} onChange={handleChange}
                                            className="w-full p-3 bg-slate-50 border border-slate-300 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-colors text-slate-900 placeholder-slate-400 rounded-none h-[46px] text-sm md:text-base"
                                            placeholder="City"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="mt-6 w-full bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold py-3.5 uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 rounded"
                            >
                                Next Step &rarr;
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-center space-y-4 animate-slide-up-fade">
                             <div className="text-center mb-1">
                                <h2 className="text-lg font-semibold text-slate-800">Contact Information</h2>
                                <p className="text-xs text-slate-500">Step 2 of 2</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                                    <input 
                                        ref={firstInputRef}
                                        required type="email" name="email" 
                                        value={formData.email} onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-300 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-colors text-slate-900 placeholder-slate-400 rounded-none text-sm md:text-base"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                                    <input 
                                        required type="tel" name="phone" 
                                        value={formData.phone} onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-300 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-colors text-slate-900 placeholder-slate-400 rounded-none text-sm md:text-base"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3.5 uppercase tracking-widest text-xs transition-all rounded"
                                >
                                    Back
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold py-3.5 uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 rounded"
                                >
                                    {loading ? '...' : 'Complete Registration'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            
            <div className="text-center mt-2 md:mt-4 shrink-0">
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest">Powered by AI Samarth</p>
            </div>
        </div>
    );
};
