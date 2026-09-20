import React, { useState } from 'react';
import {
  X,
  PenTool,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  User,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signup',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<'writer' | 'reader'>('writer');
  const [name, setName] = useState('Elena Vance');
  const [email, setEmail] = useState('elena@aether.press');
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userProfile: UserProfile = {
      id: 'user-' + Date.now(),
      name: name || (role === 'writer' ? 'Elena Vance' : 'Alex Rivera'),
      email: email || 'user@aether.press',
      role: role,
      avatar: role === 'writer'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      bio: role === 'writer'
        ? 'Author & technical essayist writing on intelligent systems.'
        : 'Subscriber and technology enthusiast.',
      handle: `@${(name || 'member').toLowerCase().replace(/\s+/g, '_')}`,
      followedCategories: ['AI', 'AWS', 'Full Stack Development', 'Articles'],
      followedAuthorIds: ['author-1', 'author-2'],
      bookmarkedArticleIds: ['art-1', 'art-4'],
      publishedArticlesCount: role === 'writer' ? 8 : 0,
      draftsCount: role === 'writer' ? 2 : 0,
      totalViews: role === 'writer' ? 42190 : 0,
    };

    onSuccess(userProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#fdfdfc] dark:bg-[#1e2228] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#e2e6de] dark:border-[#333a44] animate-in zoom-in-95 duration-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
          
          {/* LEFT PANEL: EDITORIAL BRANDING & SHOWCASE */}
          <div className="lg:col-span-5 relative bg-gradient-to-br from-[#1e2228] via-[#262b32] to-[#333a44] p-8 sm:p-10 flex flex-col justify-between text-white overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#de7c68_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#de7c68] to-[#f2c6b1] flex items-center justify-center font-bold text-base text-[#1e2228]">
                  Æ
                </div>
                <span className="font-bold text-xl tracking-tight">
                  Aether
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-mono tracking-widest font-semibold bg-[#eaf0ec]/20 text-[#f2c6b1] rounded border border-[#f2c6b1]/30">
                  Press
                </span>
              </div>

              <span className="text-xs uppercase tracking-widest font-mono text-[#f2c6b1] font-semibold mb-2 block">
                The Independent Frontier
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold leading-snug mb-4 tracking-tight">
                Where rigorous thinkers publish timeless ideas.
              </h3>
              <p className="text-xs sm:text-sm text-[#f3f5f0]/80 leading-relaxed font-normal">
                Join thousands of engineers, researchers, and technical analysts reading distraction-free, ad-free independent publications.
              </p>
            </div>

            {/* Bottom Testimonial / Credibility Tag */}
            <div className="relative z-10 pt-8 border-t border-white/10 mt-8">
              <p className="text-xs text-[#c4cec9] italic mb-2">
                "Aether has re-established the standard for technical publications. The reading experience is unmatched."
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">Dr. Elena Vance</span>
                <span className="text-[10px] text-[#95a5a8] font-mono">• Research Fellow</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: AUTH FORM & ROLE SELECTOR */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-[#fdfdfc] dark:bg-[#262b32]">
            
            {/* Toggle Login vs Signup */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2228] dark:text-white tracking-tight">
                  {mode === 'signup' ? 'Create your Account' : 'Welcome back'}
                </h2>
                <p className="text-xs text-[#4b585b] dark:text-[#95a5a8] mt-1">
                  {mode === 'signup'
                    ? 'Choose how you want to participate in Aether.'
                    : 'Sign in to access your publishing studio or reader feed.'}
                </p>
              </div>

              <div className="flex p-1 bg-[#f3f5f0] dark:bg-[#1e2228] rounded-xl border border-[#e2e6de] dark:border-[#333a44]">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-[#262b32] text-[#1e2228] dark:text-white shadow-xs'
                      : 'text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-white dark:bg-[#262b32] text-[#1e2228] dark:text-white shadow-xs'
                      : 'text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white'
                  }`}
                >
                  Log In
                </button>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ROLE SELECTION CARDS */}
              <div className="bg-[#f3f5f0]/70 dark:bg-[#1e2228]/70 p-3.5 sm:p-4 rounded-2xl border border-[#e2e6de] dark:border-[#333a44]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-[#1e2228] dark:text-white">
                    Are you here to write blogs or for reading only?
                  </label>
                  <span className="text-[10px] font-mono uppercase text-[#de7c68] font-semibold bg-[#fbeee9] dark:bg-[#de7c68]/20 px-2 py-0.5 rounded-md">
                    Select Mode
                  </span>
                </div>
                <p className="text-[11px] text-[#4b585b] dark:text-[#95a5a8] mb-3">
                  Writers unlock the full blog editor and publishing studio. Readers enjoy distraction-free reading without writing tools.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Option 1: Writer */}
                  <div
                    id="signup-role-writer-option"
                    onClick={() => setRole('writer')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      role === 'writer'
                        ? 'border-[#de7c68] bg-[#fbeee9] dark:bg-[#de7c68]/20 shadow-sm'
                        : 'border-[#e2e6de] dark:border-[#333a44] bg-white dark:bg-[#262b32] hover:border-[#7d998a]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-[#de7c68] text-white flex items-center justify-center">
                        <PenTool className="w-3.5 h-3.5" />
                      </div>
                      {role === 'writer' && (
                        <CheckCircle2 className="w-4 h-4 text-[#de7c68]" />
                      )}
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#1e2228] dark:text-white">
                      ✍️ I Write Blogs
                    </h4>
                    <p className="text-[11px] text-[#4b585b] dark:text-[#95a5a8] mt-1 leading-normal">
                      Full publishing suite, rich WYSIWYG editor, drafts & analytics.
                    </p>
                  </div>

                  {/* Option 2: Reader */}
                  <div
                    id="signup-role-reader-option"
                    onClick={() => setRole('reader')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      role === 'reader'
                        ? 'border-[#7d998a] bg-[#eaf0ec] dark:bg-[#7d998a]/20 shadow-sm'
                        : 'border-[#e2e6de] dark:border-[#333a44] bg-white dark:bg-[#262b32] hover:border-[#7d998a]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-[#637e6f] text-white flex items-center justify-center">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      {role === 'reader' && (
                        <CheckCircle2 className="w-4 h-4 text-[#637e6f] dark:text-[#7d998a]" />
                      )}
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#1e2228] dark:text-white">
                      📖 Reading Only
                    </h4>
                    <p className="text-[11px] text-[#4b585b] dark:text-[#95a5a8] mt-1 leading-normal">
                      Clean reading stream, bookmarks & comments. No editor clutter.
                    </p>
                  </div>

                </div>
              </div>

              {/* Name (on signup) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-[#1e2228] dark:text-[#f3f5f0] mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#4b585b] dark:text-[#95a5a8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'writer' ? 'e.g. Elena Vance' : 'e.g. Alex Rivera'}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f3f5f0] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44] rounded-xl text-xs sm:text-sm text-[#1e2228] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#de7c68]"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#1e2228] dark:text-[#f3f5f0] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#4b585b] dark:text-[#95a5a8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f3f5f0] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44] rounded-xl text-xs sm:text-sm text-[#1e2228] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#de7c68]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#1e2228] dark:text-[#f3f5f0] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#4b585b] dark:text-[#95a5a8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f3f5f0] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44] rounded-xl text-xs sm:text-sm text-[#1e2228] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#de7c68]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="auth-submit-btn"
                className="w-full py-3 bg-[#de7c68] hover:bg-[#cc6752] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{mode === 'signup' ? `Continue as ${role === 'writer' ? 'Author' : 'Reader (Read-Only)'}` : `Sign In as ${role === 'writer' ? 'Author' : 'Reader'}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Pre-fill Links */}
            <div className="mt-6 pt-4 border-t border-[#e2e6de] dark:border-[#333a44] text-center">
              <p className="text-[11px] text-[#4b585b] dark:text-[#95a5a8] mb-2 font-mono">1-Click Fast Switch Demo:</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  id="auth-demo-author-btn"
                  onClick={() => {
                    setName('Elena Vance');
                    setEmail('elena@aether.press');
                    setRole('writer');
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    role === 'writer'
                      ? 'bg-[#fbeee9] dark:bg-[#de7c68]/20 text-[#de7c68] border-[#de7c68]'
                      : 'bg-[#f3f5f0] dark:bg-[#1e2228] text-[#4b585b] dark:text-[#c4cec9] border-[#e2e6de] dark:border-[#333a44]'
                  }`}
                >
                  ⚡ Author Demo
                </button>
                <button
                  type="button"
                  id="auth-demo-reader-btn"
                  onClick={() => {
                    setName('Alex Rivera');
                    setEmail('alex@readers.io');
                    setRole('reader');
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    role === 'reader'
                      ? 'bg-[#eaf0ec] dark:bg-[#7d998a]/20 text-[#637e6f] dark:text-[#7d998a] border-[#7d998a]'
                      : 'bg-[#f3f5f0] dark:bg-[#1e2228] text-[#4b585b] dark:text-[#c4cec9] border-[#e2e6de] dark:border-[#333a44]'
                  }`}
                >
                  ⚡ Reader (Read-Only) Demo
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
