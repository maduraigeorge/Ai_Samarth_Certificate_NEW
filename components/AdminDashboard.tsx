
import React, { useEffect, useState } from 'react';
import { getAllParticipants } from '../services/apiService';

interface DBParticipant {
    id: number;
    full_name: string;
    school_name: string;
    city: string;
    email: string;
    phone: string;
    gender: string;
    grades_handled: string;
    subjects_handled: string;
    quiz_passed: number; // 0 or 1 from MySQL
    certificate_downloaded: number; // 0 or 1
    registration_date: string;
}

interface AdminDashboardProps {
    onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
    const [participants, setParticipants] = useState<DBParticipant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getAllParticipants();
            setParticipants(data);
        } catch (e) {
            setError('Failed to load data. Please check your connection or backend status.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!participants.length) return;
        
        const headers = ["ID", "Full Name", "Gender", "Email", "Phone", "School", "City", "Grades", "Subjects", "Quiz Passed", "Cert Downloaded", "Reg Date"];
        
        const csvRows = participants.map(p => {
            const date = new Date(p.registration_date).toLocaleString();
            return [
                p.id,
                `"${p.full_name}"`,
                `"${p.gender}"`,
                `"${p.email}"`,
                `"${p.phone}"`,
                `"${p.school_name}"`,
                `"${p.city}"`,
                `"${p.grades_handled}"`,
                `"${p.subjects_handled}"`,
                p.quiz_passed ? "Yes" : "No",
                p.certificate_downloaded ? "Yes" : "No",
                `"${date}"`
            ].join(',');
        });
        
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...csvRows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `participants_data_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-fade-in-up">
            {/* Header */}
            <div className="bg-[#1e3a8a] text-white p-4 flex justify-between items-center shadow-md shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-serif font-bold tracking-tight">Admin Console</h2>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        {participants.length} Participants
                    </span>
                </div>
                <div className="flex gap-3">
                     <button 
                        onClick={handleDownload}
                        disabled={loading || participants.length === 0}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export CSV
                    </button>
                    <button 
                        onClick={onClose}
                        className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-sm font-bold transition-all border border-white/20"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto bg-slate-100 p-4 md:p-6 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-full gap-4">
                        <div className="w-10 h-10 border-4 border-slate-300 border-t-[#1e3a8a] rounded-full animate-spin"></div>
                        <p className="text-slate-400 text-sm font-medium animate-pulse">Loading Database...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col justify-center items-center h-full text-center p-6">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-slate-800 font-bold mb-1">Database Sync Error</h3>
                        <p className="text-slate-500 text-sm max-w-xs">{error}</p>
                        <button onClick={loadData} className="mt-4 text-[#1e3a8a] text-sm font-bold underline">Try Again</button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-w-max md:min-w-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4">Participant Name</th>
                                        <th className="px-6 py-4">Gender</th>
                                        <th className="px-6 py-4">Email Address</th>
                                        <th className="px-6 py-4">Phone</th>
                                        <th className="px-6 py-4">School</th>
                                        <th className="px-6 py-4">City</th>
                                        <th className="px-6 py-4">Grades</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4">Reg Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {participants.map((row) => (
                                        <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{row.full_name}</div>
                                                <div className="text-[10px] text-slate-400">ID: #{row.id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 text-sm">{row.gender}</td>
                                            <td className="px-6 py-4 text-slate-600 text-sm">{row.email}</td>
                                            <td className="px-6 py-4 text-slate-600 font-mono text-sm">{row.phone}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-700 text-sm font-medium line-clamp-1 max-w-[150px]" title={row.school_name}>
                                                    {row.school_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 text-sm">{row.city}</td>
                                            <td className="px-6 py-4 text-slate-600 text-[10px] font-bold">{row.grades_handled}</td>
                                            <td className="px-6 py-4 text-center">
                                                {row.quiz_passed ? (
                                                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase">Passed</span>
                                                ) : (
                                                    <span className="text-slate-300 text-[10px] font-bold uppercase italic">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                                                {new Date(row.registration_date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {participants.length === 0 && !loading && (
                                <div className="py-20 text-center">
                                    <p className="text-slate-400 font-medium">No participant records found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <div className="bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center shrink-0">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Secure Admin Access Only</p>
                <p className="text-[10px] text-slate-400">© AI Samarth Database Management System</p>
            </div>
        </div>
    );
};
