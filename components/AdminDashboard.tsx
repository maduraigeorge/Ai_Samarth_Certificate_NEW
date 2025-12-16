
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
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!participants.length) return;
        
        const headers = ["ID", "Full Name", "School", "City", "Email", "Phone", "Gender", "Quiz Passed", "Cert Downloaded", "Reg Date"];
        
        const csvRows = participants.map(p => {
            const date = new Date(p.registration_date).toLocaleString();
            return [
                p.id,
                `"${p.full_name}"`,
                `"${p.school_name}"`,
                `"${p.city}"`,
                `"${p.email}"`,
                `"${p.phone}"`,
                `"${p.gender}"`,
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
            {/* Toolbar */}
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold">Admin Database View</h2>
                    <span className="bg-slate-700 px-2 py-0.5 rounded text-xs text-slate-300">
                        {participants.length} Records
                    </span>
                </div>
                <div className="flex gap-3">
                     <button 
                        onClick={handleDownload}
                        disabled={loading || participants.length === 0}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-bold transition-colors disabled:opacity-50"
                    >
                        Download CSV
                    </button>
                    <button 
                        onClick={onClose}
                        className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded text-sm font-bold transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-slate-50 p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full text-red-600">
                        {error}
                    </div>
                ) : (
                    <div className="bg-white rounded shadow border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100 text-slate-600 uppercase text-xs font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">Full Name</th>
                                        <th className="px-4 py-3">School</th>
                                        <th className="px-4 py-3">City</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Phone</th>
                                        <th className="px-4 py-3 text-center">Passed?</th>
                                        <th className="px-4 py-3 text-center">Cert?</th>
                                        <th className="px-4 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {participants.map((row) => (
                                        <tr key={row.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-2 font-mono text-slate-500">{row.id}</td>
                                            <td className="px-4 py-2 font-medium text-slate-800">{row.full_name}</td>
                                            <td className="px-4 py-2 text-slate-600">{row.school_name}</td>
                                            <td className="px-4 py-2 text-slate-600">{row.city}</td>
                                            <td className="px-4 py-2 text-slate-600">{row.email}</td>
                                            <td className="px-4 py-2 text-slate-600">{row.phone}</td>
                                            <td className="px-4 py-2 text-center">
                                                {row.quiz_passed ? (
                                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                                ) : (
                                                    <span className="inline-block w-2 h-2 bg-slate-300 rounded-full"></span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                 {row.certificate_downloaded ? (
                                                    <span className="text-green-600 font-bold text-xs">Yes</span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-slate-500 text-xs whitespace-nowrap">
                                                {new Date(row.registration_date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
