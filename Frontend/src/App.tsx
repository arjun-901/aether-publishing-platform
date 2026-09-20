import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Article, CategoryType, NotificationItem, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryPills } from './components/CategoryPills';
import { ArticleCard } from './components/ArticleCard';
import { NewsletterSection } from './components/NewsletterSection';
import { CategoryPageRoute } from './pages/CategoryPageRoute';
import { SavedBlogsPage } from './pages/SavedBlogsPage';
import { Footer } from './components/Footer';
import { AdminPage } from './components/AdminPage';
import { BlogPage } from './pages/BlogPage';
import { UserAuthModal } from './components/UserAuthModal';
import {
  api, ApiNotification, ApiReaderUser,
  readerApi, clearReaderSession, readerToProfile,
} from './api/client';
import { categoryToSlug, slugToCategory } from './utils/routes';
import { Sparkles, Compass, Shield, Loader2 } from 'lucide-react';

const CATEGORIES: CategoryType[] = [
  'AI', 'Business', 'News', 'Daily News', 'Articles', 'AWS', 'Full Stack Development', 'Other',
];

function mapNotification(n: ApiNotification): NotificationItem {
  return {
    id: n.id,
    type: n.type as NotificationItem['type'],
    title: n.title,
    message: n.message,
    timestamp: n.timestamp,
    read: n.read,
    articleId: n.articleId,
    authorAvatar: n.authorAvatar,
  };
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('aether_theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    localStorage.setItem('aether_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestBookmarks, setGuestBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('aether_guest_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [readerUser, setReaderUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [prevNotifCount, setPrevNotifCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const fetchArticles = useCallback(async () => {
    try {
      const { articles: data } = await api.getArticles();
      setArticles(data as Article[]);
    } catch {
      showToast('Backend connect nahi ho raha. Pehle Backend start karo (npm start).');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchNotifications = useCallback(async () => {
    try {
      const { notifications: data } = await api.getNotifications();
      const mapped = data.map(mapNotification);
      const unread = mapped.filter((n) => !n.read).length;
      if (prevNotifCount > 0 && unread > prevNotifCount) {
        showToast('🔔 Naya blog publish hua! Notifications dekho.');
      }
      setPrevNotifCount(unread);
      setNotifications(mapped);
    } catch {
      // silent
    }
  }, [prevNotifCount, showToast]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  // Verify reader session from backend
  useEffect(() => {
    const token = localStorage.getItem('aether_reader_token');
    if (!token) return;
    readerApi.me()
      .then(({ user }) => setReaderUser(readerToProfile(user)))
      .catch(() => clearReaderSession());
  }, []);
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    localStorage.setItem('aether_guest_bookmarks', JSON.stringify(guestBookmarks));
  }, [guestBookmarks]);

  const currentView = useMemo(() => {
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname.startsWith('/blog/')) return 'article';
    if (location.pathname.startsWith('/category/')) return 'category';
    if (location.pathname === '/bookmarks') return 'reader-dashboard';
    return 'home';
  }, [location.pathname]);

  const activeCategory = useMemo(() => {
    const match = location.pathname.match(/^\/category\/(.+)/);
    if (match) return slugToCategory(match[1], CATEGORIES) || 'all';
    return selectedCategory;
  }, [location.pathname, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: articles.length };
    CATEGORIES.forEach((c) => { counts[c] = articles.filter((a) => a.category === c).length; });
    return counts;
  }, [articles]);

  const latestHeroArticle = useMemo(
    () => articles.find((a) => a.isFeatured) || articles[0] || null,
    [articles]
  );

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.name.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [articles, activeCategory, searchQuery]);

  const goHome = () => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goBlog = (slug: string) => { navigate(`/blog/${slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goCategory = (cat: string) => {
    navigate(`/category/${categoryToSlug(cat)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goAdmin = () => navigate('/admin');

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'home') goHome();
    else if (view === 'article' && param) {
      const art = articles.find((a) => a.id === param || a.slug === param);
      goBlog(art?.slug || param);
    } else if (view === 'category' && param) goCategory(param);
    else if (view === 'admin') goAdmin();
    else if (view === 'reader-dashboard') navigate('/bookmarks');
  };

  const openAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleReaderAuthSuccess = async (user: ApiReaderUser) => {
    let profile = readerToProfile(user);

    if (guestBookmarks.length > 0) {
      try {
        const { user: synced } = await readerApi.syncBookmarks(guestBookmarks);
        profile = readerToProfile(synced);
        setGuestBookmarks([]);
        localStorage.removeItem('aether_guest_bookmarks');
      } catch { /* keep profile as-is */ }
    }

    setReaderUser(profile);
    showToast(`Welcome, ${profile.name}!`);
  };

  const handleLogout = () => {
    clearReaderSession();
    setReaderUser(null);
    showToast('Logged out');
  };

  const isBookmarked = (id: string) =>
    readerUser ? readerUser.bookmarkedArticleIds.includes(id) : guestBookmarks.includes(id);

  const toggleBookmark = async (id: string) => {
    if (!readerUser) {
      const has = guestBookmarks.includes(id);
      if (!has) {
        setGuestBookmarks([...guestBookmarks, id]);
        showToast('Saved! Log in to sync across devices.');
      } else {
        setGuestBookmarks(guestBookmarks.filter((b) => b !== id));
        showToast('Removed from list');
      }
      return;
    }

    try {
      const { user, bookmarked } = await readerApi.toggleBookmark(id);
      setReaderUser(readerToProfile(user));
      showToast(bookmarked ? 'Blog saved!' : 'Removed from saved');
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Could not save');
    }
  };

  const markNotificationsRead = async () => {
    try { await api.markNotificationsRead(); } catch { /* ok */ }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbf8] dark:bg-[#1e2228] text-[#1e2228] dark:text-[#f3f5f0]">
      {toastMessage && (
        <div className="fixed bottom-16 right-6 z-50 bg-[#1e2228] dark:bg-[#fdfdfc] text-[#f3f5f0] dark:text-[#1e2228] px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-[#333a44]">
          <Sparkles className="w-4 h-4 text-[#de7c68]" />
          {toastMessage}
        </div>
      )}

      {!isAdminRoute && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          currentUser={readerUser}
          onUpdateUser={setReaderUser}
          onLogout={handleLogout}
          notifications={notifications}
          onMarkNotificationsRead={markNotificationsRead}
          onOpenAuth={openAuth}
          searchQuery={searchQuery}
          onSearchChange={(q) => { setSearchQuery(q); if (currentView !== 'home') goHome(); }}
          categories={CATEGORIES}
        />
      )}

      <main className="flex-1 pb-12">
        <Routes>
          <Route path="/" element={
            loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-[#de7c68] animate-spin" />
              </div>
            ) : (
              <div>
                {latestHeroArticle && !searchQuery && (
                  <HeroSection
                    article={latestHeroArticle}
                    onReadArticle={(id) => {
                      const a = articles.find((x) => x.id === id);
                      if (a) goBlog(a.slug);
                    }}
                    onCategoryClick={goCategory}
                    isBookmarked={isBookmarked}
                    onToggleBookmark={toggleBookmark}
                  />
                )}
                <CategoryPills
                  selectedCategory={activeCategory}
                  onSelectCategory={(cat) => { setSelectedCategory(cat); if (cat === 'all') goHome(); else goCategory(cat); }}
                  categoryCounts={categoryCounts}
                />
                <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    {searchQuery ? `Search: "${searchQuery}"` : 'Latest Blog & News'}
                  </h2>
                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-20 bg-[#f3f5f0] dark:bg-[#262b32] rounded-3xl p-8">
                      <Compass className="w-12 h-12 text-[#7d998a] mx-auto mb-3" />
                      <p className="text-sm text-[#4b585b]">Koi article nahi mila</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredArticles.map((article) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          onReadArticle={() => goBlog(article.slug)}
                          onCategoryClick={goCategory}
                          isBookmarked={isBookmarked(article.id)}
                          onToggleBookmark={toggleBookmark}
                        />
                      ))}
                    </div>
                  )}
                </section>
                <NewsletterSection categories={CATEGORIES} />
              </div>
            )
          } />

          <Route path="/blog/:slug" element={
            <BlogPage
              allArticles={articles}
              readerUser={readerUser}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
              onCategoryClick={goCategory}
              onLoginRequired={() => openAuth('login')}
              showToast={showToast}
            />
          } />

          <Route path="/category/:categorySlug" element={
            <CategoryPageRoute
              articles={articles}
              categories={CATEGORIES}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
            />
          } />

          <Route path="/bookmarks" element={
            <SavedBlogsPage
              currentUser={readerUser}
              articles={articles}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
              onOpenAuth={() => openAuth('login')}
              onCategoryClick={goCategory}
            />
          } />

          <Route path="/admin" element={
            <AdminPage
              categories={CATEGORIES}
              onArticlePublished={() => { fetchArticles(); fetchNotifications(); }}
              onPreviewArticle={(slugOrId) => {
                const a = articles.find((x) => x.id === slugOrId || x.slug === slugOrId);
                goBlog(a?.slug || slugOrId);
              }}
              showToast={showToast}
            />
          } />
        </Routes>
      </main>

      {!isAdminRoute && (
        <Footer
          categories={CATEGORIES}
          onCategoryClick={goCategory}
          onNavigate={handleNavigate}
          onGoAdmin={goAdmin}
          currentUser={readerUser}
          onOpenAuth={openAuth}
        />
      )}

      <UserAuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={async (user) => {
          await handleReaderAuthSuccess(user);
          setAuthModalOpen(false);
        }}
      />

      {/* Small bottom-right admin button */}
      {!isAdminRoute && (
        <button
          onClick={goAdmin}
          title="Admin Login"
          className="fixed bottom-4 right-4 z-50 w-11 h-11 rounded-full bg-[#de7c68] hover:bg-[#cc6752] text-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
        >
          <Shield className="w-5 h-5" />
        </button>
      )}

      {isAdminRoute && (
        <button
          onClick={goHome}
          className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full bg-[#1e2228] text-[#f2c6b1] text-xs font-semibold shadow-lg hover:bg-[#262b32] transition-all"
        >
          ← Home
        </button>
      )}
    </div>
  );
}
