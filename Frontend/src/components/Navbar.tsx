import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Bookmark,
  LogOut,
  User,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { CategoryType, NotificationItem, UserProfile } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: UserProfile | null;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categories: CategoryType[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  currentUser,
  onUpdateUser,
  onLogout,
  notifications,
  onMarkNotificationsRead,
  onOpenAuth,
  searchQuery,
  onSearchChange,
  categories,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setShowCategoryMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearchInput && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchInput]);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-[#1e2228]/95 border-b border-[#e2e6de] dark:border-[#333a44] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        
        {/* Left: Brand Identity & Primary Nav Links */}
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 min-w-0 shrink-0">
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#de7c68] to-[#f2c6b1] flex items-center justify-center text-[#1e2228] font-bold text-base shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0">
              Æ
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg tracking-tight text-[#1e2228] dark:text-white">
                  Aether
                </span>
                <span className="hidden xs:inline px-1.5 py-0.5 text-[10px] uppercase font-mono tracking-widest font-semibold bg-[#eaf0ec] text-[#637e6f] dark:bg-[#7d998a]/20 dark:text-[#7d998a] rounded border border-[#7d998a]/30">
                  Press
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              id="nav-home-btn"
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'text-[#1e2228] dark:text-white bg-[#f3f5f0] dark:bg-[#262b32] font-semibold'
                  : 'text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white hover:bg-[#f3f5f0]/70 dark:hover:bg-[#262b32]/60'
              }`}
            >
              Explore
            </button>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                id="nav-categories-dropdown-btn"
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white hover:bg-[#f3f5f0]/70 dark:hover:bg-[#262b32]/60 transition-colors"
              >
                <span>Topics</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showCategoryMenu && (
                <div className="absolute top-full left-0 mt-2 w-64 p-2 bg-[#fdfdfc] dark:bg-[#262b32] rounded-xl shadow-xl border border-[#e2e6de] dark:border-[#333a44] animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold text-[#4b585b] dark:text-[#95a5a8] uppercase tracking-wider">
                    Curated Categories
                  </div>
                  <div className="grid grid-cols-1 gap-0.5 mt-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        id={`category-dropdown-item-${cat}`}
                        onClick={() => {
                          setShowCategoryMenu(false);
                          onNavigate('category', cat);
                        }}
                        className="flex items-center justify-between px-3 py-2 text-sm rounded-lg text-[#1e2228] dark:text-[#f3f5f0] hover:bg-[#f3f5f0] dark:hover:bg-[#1e2228] text-left transition-colors"
                      >
                        <span className="font-medium">{cat}</span>
                        <span className="text-xs text-[#7d998a] font-mono">
                          View &rarr;
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {currentUser && (
              <button
                id="nav-saved-blogs-btn"
                onClick={() => onNavigate('reader-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  currentView === 'reader-dashboard'
                    ? 'text-[#1e2228] dark:text-white bg-[#f3f5f0] dark:bg-[#262b32] font-semibold'
                    : 'text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white hover:bg-[#f3f5f0]/70 dark:hover:bg-[#262b32]/60'
                }`}
              >
                <Bookmark className="w-4 h-4 text-[#7d998a]" />
                <span>Saved Blogs</span>
              </button>
            )}
          </nav>
        </div>

        {/* Center/Right: Search Bar, Actions, Toggles, Auth/Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          
          {/* Interactive Search Bar */}
          <div className="relative">
            <div className="hidden lg:flex items-center bg-[#f3f5f0] dark:bg-[#262b32] border border-[#e2e6de] dark:border-[#333a44] rounded-full px-3.5 py-1.5 w-44 xl:w-56 focus-within:w-64 focus-within:border-[#de7c68] dark:focus-within:border-[#de7c68] focus-within:ring-1 focus-within:ring-[#de7c68] transition-all duration-200">
              <Search className="w-3.5 h-3.5 text-[#4b585b] dark:text-[#95a5a8] mr-2 shrink-0" />
              <input
                type="text"
                id="navbar-search-input"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search stories, topics..."
                className="w-full bg-transparent text-xs text-[#1e2228] dark:text-[#f3f5f0] placeholder-[#4b585b]/60 dark:placeholder-[#95a5a8]/60 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-xs text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile/tablet search toggle */}
            <button
              id="mobile-search-toggle"
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-[#4b585b] dark:text-[#95a5a8] hover:bg-[#f3f5f0] dark:hover:bg-[#262b32] transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Saved blogs — logged-in reader */}
          {currentUser && (
            <button
              id="navbar-reading-list-btn"
              onClick={() => onNavigate('reader-dashboard')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#4b585b] dark:text-[#95a5a8] bg-[#f3f5f0] dark:bg-[#262b32] hover:bg-[#e2e6de] dark:hover:bg-[#333a44] transition-colors shrink-0 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#7d998a]" />
              <span>Saved</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
              <button
                id="notifications-bell-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && unreadCount > 0) {
                    onMarkNotificationsRead();
                  }
                }}
                className="relative p-1.5 sm:p-2 rounded-full text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white hover:bg-[#f3f5f0] dark:hover:bg-[#262b32] transition-colors shrink-0"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#de7c68] rounded-full ring-2 ring-white dark:ring-[#1e2228] animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl shadow-2xl border border-[#e2e6de] dark:border-[#333a44] py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 border-b border-[#e2e6de] dark:border-[#333a44] flex items-center justify-between">
                    <div className="font-semibold text-xs sm:text-sm text-[#1e2228] dark:text-white flex items-center gap-2">
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fbeee9] dark:bg-[#382b28] text-[#de7c68] font-mono font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={onMarkNotificationsRead}
                      className="text-[11px] text-[#de7c68] hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#e2e6de]/60 dark:divide-[#333a44]/60">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.articleId) {
                            onNavigate('article', n.articleId);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-3 hover:bg-[#f3f5f0] dark:hover:bg-[#1e2228]/50 cursor-pointer transition-colors flex items-start gap-2.5 ${
                          !n.read ? 'bg-[#fbeee9]/60 dark:bg-[#de7c68]/10' : ''
                        }`}
                      >
                        {n.authorAvatar ? (
                          <img
                            src={n.authorAvatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-[#e2e6de] dark:border-[#333a44]"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#e2e6de] dark:bg-[#333a44] flex items-center justify-center shrink-0 mt-0.5 text-[#4b585b] dark:text-[#95a5a8]">
                            <Bell className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-[#1e2228] dark:text-white truncate">
                              {n.title}
                            </p>
                            <span className="text-[9px] text-[#4b585b] dark:text-[#95a5a8] font-mono shrink-0 ml-1">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4b585b] dark:text-[#95a5a8] line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          {/* Dark / Light Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            className="p-1.5 sm:p-2 rounded-full text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white hover:bg-[#f3f5f0] dark:hover:bg-[#262b32] transition-colors shrink-0"
            aria-label="Toggle color theme"
          >
            {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#f2c6b1]" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-[#4b585b]" />}
          </button>

          {/* AUTH STATUS: When not logged in -> SHOW "Log In" BUTTON */}
          {!currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                id="navbar-login-btn"
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#de7c68] hover:bg-[#cc6752] shadow-sm hover:shadow active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="hidden sm:flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-[#637e6f] border border-[#7d998a]/40 hover:bg-[#eaf0ec] dark:hover:bg-[#7d998a]/10 transition-all"
              >
                Sign Up
              </button>
            </div>
          ) : (
            /* User Profile / Quick Role Switcher Dropdown */
            <div className="relative" ref={userMenuRef}>
              <button
                id="user-profile-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-[#e2e6de] dark:border-[#333a44] hover:border-[#de7c68] dark:hover:border-[#de7c68] transition-colors shrink-0 cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <span className="hidden xl:inline text-xs font-medium text-[#1e2228] dark:text-[#f3f5f0] pr-1 max-w-[80px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3 h-3 text-[#4b585b] dark:text-[#95a5a8] hidden sm:inline" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl shadow-2xl border border-[#e2e6de] dark:border-[#333a44] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-[#e2e6de] dark:border-[#333a44]">
                    <p className="text-sm font-semibold text-[#1e2228] dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-[#4b585b] dark:text-[#95a5a8] truncate">
                      {currentUser.email}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#eaf0ec] text-[#637e6f] dark:bg-[#7d998a]/20 dark:text-[#7d998a] font-semibold border border-[#7d998a]/30">
                        Reader
                      </span>
                      <span className="text-[10px] text-[#95a5a8]">
                        {currentUser.bookmarkedArticleIds.length} saved
                      </span>
                    </div>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('reader-dashboard');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#1e2228] dark:text-[#f3f5f0] hover:bg-[#f3f5f0] dark:hover:bg-[#1e2228] rounded-lg text-left cursor-pointer font-medium"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#7d998a]" />
                      <span>My Saved Blogs</span>
                    </button>

                    <div className="my-1 border-t border-[#e2e6de] dark:border-[#333a44]" />

                    <button
                      id="navbar-logout-btn"
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-left cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Mobile search expanded bar */}
      {showSearchInput && (
        <div className="lg:hidden px-3 sm:px-4 pb-3 pt-1 border-t border-[#e2e6de] dark:border-[#333a44] bg-[#fdfdfc] dark:bg-[#1e2228]">
          <div className="flex items-center bg-[#f3f5f0] dark:bg-[#262b32] border border-[#e2e6de] dark:border-[#333a44] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-[#4b585b] dark:text-[#95a5a8] mr-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search all stories, tags, topics..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#1e2228] dark:text-white placeholder-[#4b585b]/60 dark:placeholder-[#95a5a8]/60 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="text-xs text-[#4b585b] dark:text-[#95a5a8]">
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
