import React, { useState } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';

interface AdultAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export const AdultAccessModal: React.FC<AdultAccessModalProps> = ({ isOpen, onClose, onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const CORRECT_PASSWORD = 'pulamea';
  const MAX_ATTEMPTS = 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (attempts >= MAX_ATTEMPTS) {
      setError('Too many attempts. Please try again later.');
      return;
    }

    if (password === CORRECT_PASSWORD) {
      // Store in session
      sessionStorage.setItem('adultAccess', 'granted');
      sessionStorage.setItem('adultAccessTime', Date.now().toString());
      onUnlock();
      setPassword('');
      setError('');
    } else {
      setAttempts(prev => prev + 1);
      setError(`Incorrect password. ${MAX_ATTEMPTS - attempts - 1} attempts remaining.`);
      setPassword('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`adult-modal ${error ? 'error-shake' : ''}`}>
        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="bg-red-600 text-white py-3 px-6 rounded-lg font-black text-xl text-center tracking-[4px] shadow-lg shadow-red-600/20">
            🔴 ADULT CONTENT
          </div>
          <div className="flex items-center justify-center gap-2 bg-orange-500/10 border-2 border-orange-500/50 text-orange-500 py-2 px-4 rounded-lg font-bold text-sm">
            <AlertTriangle size={18} />
            18+ RESTRICTED ACCESS
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-white/5 border-l-4 border-red-600 p-4 mb-8">
          <p className="text-zinc-300 text-sm leading-relaxed">
            This section contains explicit adult content. 
            Access is restricted and password protected.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Enter Password:</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border-2 border-red-600/50 rounded-xl py-4 px-4 pr-12 text-white text-lg tracking-[4px] focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/20 transition-all"
                autoFocus
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600" size={20} />
            </div>
          </div>

          {error && (
            <div className="bg-red-600/10 border border-red-600 text-red-500 p-3 rounded-lg text-xs text-center font-bold">
              ⚠️ {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 border-2 border-zinc-700 rounded-xl text-zinc-400 font-bold hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!password || attempts >= MAX_ATTEMPTS}
              className="flex-1 py-4 bg-gradient-to-br from-red-600 to-red-800 rounded-xl text-white font-bold shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              🔓 Unlock
            </button>
          </div>
        </form>

        {/* Age Disclaimer */}
        <div className="mt-8 bg-orange-500/5 border border-orange-500/20 p-4 rounded-lg">
          <p className="text-[10px] text-orange-500/80 text-center leading-relaxed">
            ⚠️ You must be 18+ to access this content. <br />
            By entering, you confirm you meet age requirements.
          </p>
        </div>
      </div>
    </div>
  );
};
