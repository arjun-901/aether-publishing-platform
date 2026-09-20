import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { readerApi, ApiReaderUser, saveReaderSession } from '../api/client';

interface UserAuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: ApiReaderUser) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result =
        mode === 'signup'
          ? await readerApi.register(name, email, password)
          : await readerApi.login(email, password);
      saveReaderSession(result.token, result.user);
      onSuccess(result.user);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#262b32] rounded-3xl max-w-md w-full shadow-2xl border border-[#e2e6de] dark:border-[#333a44] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="relative bg-gradient-to-br from-[#637e6f] to-[#7d998a] px-6 py-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">
            {mode === 'signup' ? 'Create Reader Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-white/80 mt-1">
            Save blogs, build your reading list — free & simple.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold mb-1 block">Your Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#95a5a8]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e6de] dark:border-[#333a44] bg-[#f3f5f0] dark:bg-[#1e2228] text-sm focus:outline-none focus:ring-2 focus:ring-[#7d998a]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold mb-1 block">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#95a5a8]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e6de] dark:border-[#333a44] bg-[#f3f5f0] dark:bg-[#1e2228] text-sm focus:outline-none focus:ring-2 focus:ring-[#7d998a]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#95a5a8]" />
              <input
                type="password"
                required
                minLength={5}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 5 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e6de] dark:border-[#333a44] bg-[#f3f5f0] dark:bg-[#1e2228] text-sm focus:outline-none focus:ring-2 focus:ring-[#7d998a]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#637e6f] hover:bg-[#526b5c] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Log In'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-[#4b585b] dark:text-[#95a5a8]">
            {mode === 'login' ? (
              <>
                New here?{' '}
                <button type="button" onClick={() => setMode('signup')} className="text-[#637e6f] font-semibold hover:underline">
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have account?{' '}
                <button type="button" onClick={() => setMode('login')} className="text-[#637e6f] font-semibold hover:underline">
                  Log in
                </button>
              </>
            )}
          </p>

          <div className="pt-2 border-t border-[#e2e6de] dark:border-[#333a44] text-[11px] text-[#95a5a8] flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3 h-3 text-[#7d998a]" />
            Save blogs & read them anytime from My Saved
          </div>
        </form>
      </div>
    </div>
  );
};
