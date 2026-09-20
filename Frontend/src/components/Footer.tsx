import React from 'react';
import { ArrowUpRight, Shield, Github, Twitter, Linkedin } from 'lucide-react';
import { CategoryType, UserProfile } from '../types';

interface FooterProps {
  categories: CategoryType[];
  onCategoryClick: (cat: string) => void;
  onNavigate: (view: string) => void;
  onGoAdmin: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  onCategoryClick,
  onNavigate,
  onGoAdmin,
  currentUser,
  onOpenAuth,
}) => {
  const isReader = currentUser?.role === 'reader';
  return (
    <footer className="w-full bg-[#fafbf8] dark:bg-[#1e2228] border-t border-[#e2e6de] dark:border-[#333a44] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#e2e6de] dark:border-[#333a44]">
          
          {/* Col 1: Brand & Manifesto */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#de7c68] to-[#f2c6b1] flex items-center justify-center text-[#1e2228] font-bold text-base shadow-sm">
                Æ
              </div>
              <span className="font-bold text-2xl tracking-tight text-[#1e2228] dark:text-white">
                Aether
              </span>
            </div>
            <p className="text-[#4b585b] dark:text-[#c4cec9] text-sm leading-relaxed max-w-sm mb-6">
              A modern editorial publication engine designed for high-signal engineering essays, cognitive systems research, and capital market analyses. Pure signal, no noise.
            </p>
            <div className="flex items-center gap-3 text-[#4b585b] dark:text-[#95a5a8]">
              <a href="#" className="p-2 rounded-lg hover:text-[#de7c68] hover:bg-[#f3f5f0] dark:hover:bg-[#262b32] transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:text-[#de7c68] hover:bg-[#f3f5f0] dark:hover:bg-[#262b32] transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:text-[#de7c68] hover:bg-[#f3f5f0] dark:hover:bg-[#262b32] transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider font-semibold text-[#1e2228] dark:text-white mb-4">
              Explore Topics
            </h4>
            <ul className="space-y-2.5 text-sm text-[#4b585b] dark:text-[#c4cec9]">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onCategoryClick(cat)}
                    className="hover:text-[#de7c68] dark:hover:text-[#f2c6b1] transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: More Categories */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider font-semibold text-[#1e2228] dark:text-white mb-4">
              Specialized Streams
            </h4>
            <ul className="space-y-2.5 text-sm text-[#4b585b] dark:text-[#c4cec9]">
              {categories.slice(5).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onCategoryClick(cat)}
                    className="hover:text-[#de7c68] dark:hover:text-[#f2c6b1] transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-[#de7c68] dark:text-[#f2c6b1] font-medium hover:underline text-left"
                >
                  View All Archives &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Author Links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider font-semibold text-[#1e2228] dark:text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-[#4b585b] dark:text-[#c4cec9]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#de7c68] dark:hover:text-[#f2c6b1] transition-colors text-left cursor-pointer"
                >
                  Featured Stories
                </button>
              </li>

              {isReader ? (
                <li>
                  <button
                    onClick={() => onNavigate('reader-dashboard')}
                    className="hover:text-[#de7c68] dark:hover:text-[#f2c6b1] transition-colors text-left flex items-center gap-1 cursor-pointer"
                  >
                    <span>My Saved Blogs</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => onOpenAuth?.('login')}
                      className="hover:text-[#637e6f] dark:hover:text-[#7d998a] transition-colors text-left cursor-pointer font-medium text-[#637e6f]"
                    >
                      User Log In
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onOpenAuth?.('signup')}
                      className="hover:text-[#de7c68] dark:hover:text-[#f2c6b1] transition-colors text-left cursor-pointer"
                    >
                      User Sign Up
                    </button>
                  </li>
                </>
              )}

              <li className="pt-2 mt-2 border-t border-[#e2e6de] dark:border-[#333a44]">
                <button
                  onClick={onGoAdmin}
                  className="hover:text-[#de7c68] dark:hover:text-[#f2c6b1] transition-colors text-left flex items-center gap-1.5 font-medium text-[#de7c68]"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Portal
                </button>
                <p className="text-[10px] text-[#95a5a8] mt-1 pl-5">Admin & writers only</p>
              </li>
              <li>
                <span className="text-[#7d998a] font-mono text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7d998a]" />
                  <span>All Systems Operational</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4b585b] dark:text-[#95a5a8]">
          <p>© 2026 Aether Press Platform, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#1e2228] dark:hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-[#1e2228] dark:hover:text-white">Terms of Publication</a>
            <a href="#" className="hover:text-[#1e2228] dark:hover:text-white">RSS Feeds</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
