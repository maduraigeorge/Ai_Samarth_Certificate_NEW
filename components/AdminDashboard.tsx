
import React, { useEffect, useState, useMemo } from 'react';
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

const ROWS_PER_PAGE = 50;

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
    const [participants, setParticipants] = useState<DBParticipant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

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

    // Filter logic - handles 10k+ rows efficiently in memory
    const filteredParticipants = useMemo(() => {
        if (!searchTerm.trim()) return participants;
        const term = searchTerm.toLowerCase();
        return participants.filter(p => 
            p.full_name?.toLowerCase().includes(term) ||
            p.email?.toLowerCase().includes(term) ||
            p.school_name?.toLowerCase().includes(term) ||
            p.phone?.includes(term) ||
            p.city?.toLowerCase().includes(term)
        );
    }, [participants, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredParticipants.length / ROWS_PER_PAGE);
    const currentData = useMemo(() => {
        const start = (currentPage - 1) * ROWS_PER_PAGE;
        return filteredParticipants.slice(start, start + ROWS_PER_PAGE);
    }, [filteredParticipants, currentPage]);

    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 on search
    }, [searchTerm]);

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
        link.setAttribute("download", `participants_all_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-fade-in-up">
            {/* Header */}
            <div className="bg-[#1e3a8a] text-white p-4 flex flex-col md:flex-row justify-between items-center shadow-md shrink-0 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <h2 className="text-xl font-serif font-bold tracking-tight">Admin Console</h2>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        {participants.length.toLocaleString()} Total Records
                    </span>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:max-w-md">
                    <input 
                        type="text"
                        placeholder="Search by name, email, school, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-2 text-sm focus:outline-none focus:bg-white focus:text-slate-900 transition-all placeholder:text-white/50"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                     <button 
                        onClick={handleDownload}
                        disabled={loading || participants.length === 0}
                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export CSV
                    </button>
                    <button 
                        onClick={onClose}
                        className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-sm font-bold transition-all border border-white/20"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto bg-slate-100 p-2 md:p-6 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-full gap-4">
                        <div className="w-10 h-10 border-4 border-slate-300 border-t-[#1e3a8a] rounded-full animate-spin"></div>
                        <p className="text-slate-400 text-sm font-medium">Fetching Data...</p>
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
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-0">
                        <div className="overflow-x-auto flex-1 custom-scrollbar">
                            <table className="w-full text-left border-collapse table-auto min-w-[1200px]">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 sticky top-0 z-20">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Participant Name</th>
                                        <th className="px-6 py-4">Email Address</th>
                                        <th className="px-6 py-4">Phone</th>
                                        <th className="px-6 py-4">Gender</th>
                                        <th className="px-6 py-4">School & City</th>
                                        <th className="px-6 py-4">Grades & Subjects</th>
                                        <th className="px-6 py-4 text-center">Quiz Status</th>
                                        <th className="px-6 py-4 text-center">Cert Downloaded</th>
                                        <th className="px-6 py-4">Registration Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentData.map((row) => (
                                        <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 text-[10px] text-slate-400 font-mono">#{row.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{row.full_name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 text-sm">{row.email}</td>
                                            <td className="px-6 py-4 text-slate-600 font-mono text-sm">{row.phone}</td>
                                            <td className="px-6 py-4 text-slate-600 text-sm">{row.gender}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-700 text-sm font-medium">{row.school_name}</div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{row.city}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-600 text-[10px] font-bold uppercase">{row.grades_handled}</div>
                                                <div className="text-slate-500 text-[10px] italic">{row.subjects_handled}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {row.quiz_passed ? (
                                                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase ring-1 ring-green-100">Passed</span>
                                                ) : (
                                                    <span className="text-slate-300 text-[10px] font-bold uppercase italic">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {row.certificate_downloaded ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase ring-1 ring-blue-100">Yes</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300 text-[10px] font-bold uppercase italic">No</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                                                {new Date(row.registration_date).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {currentData.length === 0 && !loading && (
                                <div className="py-20 text-center">
                                    <p className="text-slate-400 font-medium">No results matching "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Footer / Pagination */}
            <div className="bg-white border-t border-slate-200 px-6 py-3 flex flex-col md:flex-row justify-between items-center shrink-0 gap-4">
                <div className="flex items-center gap-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    <span>Showing {((currentPage-1)*ROWS_PER_PAGE)+1} to {Math.min(currentPage*ROWS_PER_PAGE, filteredParticipants.length)} of {filteredParticipants.length}</span>
                    <span className="hidden md:inline">|</span>
                    <span className="hidden md:inline">Access Secure Admin Panel</span>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-1 rounded hover:bg-slate-100 disabled:opacity-25"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        <div className="flex items-center gap-1 px-4">
                            <span className="text-xs font-bold text-slate-700">Page {currentPage}</span>
                            <span className="text-xs text-slate-400">of {totalPages}</span>
                        </div>

                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-1 rounded hover:bg-slate-100 disabled:opacity-25"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="hidden md:block text-[10px] text-slate-300">
                    Database v2.0 • {new Date().toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
};
