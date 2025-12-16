
import React, { useState } from 'react';

interface AdminLoginProps {
    onLoginSuccess: () => void;
    onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'Admin' && password === 'Reset@123') {
            onLoginSuccess();
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-sm rounded-lg shadow-xl overflow-hidden animate-scale-in">
                <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
                    <h2 className="font-bold tracking-wide">Admin Login</h2>
                    <button onClick={onCancel} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-100 text-center">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Username</label>
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded focus:border-blue-600 outline-none"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded focus:border-blue-600 outline-none"
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded transition-colors"
                        >
                            Access Database
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
