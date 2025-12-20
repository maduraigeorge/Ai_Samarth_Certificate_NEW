
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
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<RegistrationData>({
        fullName: '',
        gender: '',
        email: '',
        phone: '',
        schoolName: '',
        city: '',
        gradesHandled: '',
        subjectsHandled: ''
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!activeParticipant && step === 1 && firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, [step, activeParticipant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            const cleaned = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: cleaned }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateSection1 = () => {
        const newErrors: {[key: string]: string} = {};
        
        if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
            newErrors.fullName = "Name must be at least 2 characters long.";
        }
        if (!formData.gender) {
            newErrors.gender = "Please select your gender.";
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!formData.phone || formData.phone.length !== 10) {
            newErrors.phone = "Phone number must be exactly 10 digits.";
        } else if (formData.phone.startsWith('0')) {
            newErrors.phone = "Phone number cannot start with 0.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSection2 = () => {
        const newErrors: {[key: string]: string} = {};
        
        if (!formData.schoolName.trim() || formData.schoolName.trim().length < 3) {
            newErrors.schoolName = "School name must be at least 3 characters.";
        }
        if (!formData.city.trim() || formData.city.trim().length < 3) {
            newErrors.city = "City name must be at least 3 characters.";
        }
        if (!formData.gradesHandled) newErrors.gradesHandled = "Please select grades handled.";
        if (!formData.subjectsHandled) newErrors.subjectsHandled = "Please select subjects handled.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateSection1()) {
            setStep(2);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateSection2()) {
            onRegister(formData);
        }
    };

    if (activeParticipant) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center animate-scale-in p-4 relative">
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

    return (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in-up p-2 relative">
            <div className="w-full max-w-lg bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col h-full md:h-auto md:max-h-[92vh] rounded-xl">
                
                {/* Compact Header */}
                <div className="bg-[#1e3a8a] py-2 md:py-3 px-4 text-white text-center shrink-0">
                    <h1 className="text-lg md:text-xl font-serif font-bold tracking-wide">
                        Participant Registration
                    </h1>
                    <div className="flex flex-col items-center gap-1.5 mt-0.5">
                        <p className="text-[9px] md:text-[10px] text-blue-100 uppercase tracking-[0.15em] font-bold opacity-90">
                            {step === 1 ? 'Section 1: Personal & Contact' : 'Section 2: Academic Info'}
                        </p>
                        <div className="flex justify-center gap-1.5">
                            <div className={`h-0.5 w-6 rounded-full transition-all duration-300 ${step === 1 ? 'bg-white' : 'bg-white/20'}`}></div>
                            <div className={`h-0.5 w-6 rounded-full transition-all duration-300 ${step === 2 ? 'bg-white' : 'bg-white/20'}`}></div>
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-6 lg:p-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                    {step === 1 ? (
                        <form onSubmit={handleNextStep} className="flex flex-col space-y-3 md:space-y-4 animate-slide-up-fade py-1">
                            <div className="space-y-3 md:space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">1. Full Name (as per govt records) <span className="text-red-500">*</span></label>
                                    <input 
                                        ref={firstInputRef}
                                        name="fullName" 
                                        value={formData.fullName} onChange={handleChange}
                                        className={`w-full p-2.5 md:p-3 bg-slate-50 border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-colors text-slate-900 placeholder-slate-400 rounded text-sm`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-[9px] mt-0.5 font-bold">{errors.fullName}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">2. Gender <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Male', 'Female', 'Others'].map((opt) => (
                                            <label key={opt} className={`cursor-pointer flex items-center justify-center gap-1.5 p-2 border transition-all rounded ${formData.gender === opt ? 'bg-blue-50 border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'bg-white border-slate-200 hover:border-slate-400'}`}>
                                                <input 
                                                    type="radio" name="gender" value={opt} 
                                                    checked={formData.gender === opt} 
                                                    onChange={handleChange} className="w-3 h-3 text-[#1e3a8a]" 
                                                />
                                                <span className={`text-[11px] font-bold ${formData.gender === opt ? 'text-[#1e3a8a]' : 'text-slate-600'}`}>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.gender && <p className="text-red-500 text-[9px] mt-0.5 font-bold">{errors.gender}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">3. Email Address <span className="text-red-500">*</span></label>
                                    <input 
                                        type="email" name="email" 
                                        value={formData.email} onChange={handleChange}
                                        className={`w-full p-2.5 md:p-3 bg-slate-50 border ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-colors text-slate-900 placeholder-slate-400 rounded text-sm`}
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && <p className="text-red-500 text-[9px] mt-0.5 font-bold">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">4. Phone Number <span className="text-red-500">*</span></label>
                                    <input 
                                        type="tel" name="phone" 
                                        value={formData.phone} onChange={handleChange}
                                        className={`w-full p-2.5 md:p-3 bg-slate-50 border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-colors text-slate-900 placeholder-slate-400 rounded text-sm`}
                                        placeholder="10-digit mobile number"
                                    />
                                    {errors.phone && <p className="text-red-500 text-[9px] mt-0.5 font-bold">{errors.phone}</p>}
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="mt-2 w-full bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold py-3 uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 rounded shadow-sm"
                            >
                                Next Step &rarr;
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 md:space-y-4 animate-slide-up-fade py-1">
                            <div className="space-y-3 md:space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">1. School Name <span className="text-red-500">*</span></label>
                                    <input 
                                        ref={firstInputRef}
                                        name="schoolName" 
                                        value={formData.schoolName} onChange={handleChange}
                                        className={`w-full p-2.5 md:p-3 bg-slate-50 border ${errors.schoolName ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-colors text-slate-900 placeholder-slate-400 rounded text-sm`}
                                        placeholder="Enter school name"
                                    />
                                    {errors.schoolName && <p className="text-red-500 text-[9px] mt-0.5 font-bold">{errors.schoolName}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">2. City <span className="text-red-500">*</span></label>
                                    <input 
                                        name="city" 
                                        value={formData.city} onChange={handleChange}
                                        className={`w-full p-2.5 md:p-3 bg-slate-50 border ${errors.city ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-colors text-slate-900 placeholder-slate-400 rounded text-sm`}
                                        placeholder="Enter city"
                                    />
                                    {errors.city && <p className="text-red-500 text-[9px] mt-0.5 font-bold">{errors.city}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">3. Grades Handled <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Grades 1–5', 'Grades 6–10'].map((opt) => (
                                            <label key={opt} className={`cursor-pointer flex items-center justify-center gap-2 p-2.5 border transition-all rounded ${formData.gradesHandled === opt ? 'bg-blue-50 border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'bg-white border-slate-200 hover:border-slate-400'}`}>
                                                <input 
                                                    type="radio" name="gradesHandled" value={opt} 
                                                    checked={formData.gradesHandled === opt} 
                                                    onChange={handleChange} className="w-3 h-3 text-[#1e3a8a]" 
                                                />
                                                <span className={`text-[11px] font-bold ${formData.gradesHandled === opt ? 'text-[#1e3a8a]' : 'text-slate-600'}`}>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.gradesHandled && <p className="text-red-500 text-[9px] mt-0.5 font-bold">{errors.gradesHandled}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">4. Subjects Handled <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['ICT', 'Science', 'Mathematics', 'Other'].map((opt) => (
                                            <label key={opt} className={`cursor-pointer flex items-center justify-center gap-2 p-2.5 border transition-all rounded ${formData.subjectsHandled === opt ? 'bg-blue-50 border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'bg-white border-slate-200 hover:border-slate-400'}`}>
                                                <input 
                                                    type="radio" name="subjectsHandled" value={opt} 
                                                    checked={formData.subjectsHandled === opt} 
                                                    onChange={handleChange} className="w-3 h-3 text-[#1e3a8a]" 
                                                />
                                                <span className={`text-[11px] font-bold ${formData.subjectsHandled === opt ? 'text-[#1e3a8a]' : 'text-slate-600'}`}>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.subjectsHandled && <p className="text-red-500 text-[9px] mt-0.5 font-bold">{errors.subjectsHandled}</p>}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button 
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 uppercase tracking-widest text-[10px] transition-all rounded"
                                >
                                    Back
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold py-3 uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 rounded shadow-sm"
                                >
                                    {loading ? '...' : 'Complete & Register'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            
            <div className="text-center mt-2 shrink-0">
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest">Powered by AI Samarth</p>
            </div>
        </div>
    );
};
