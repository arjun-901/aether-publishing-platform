import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookOpen, LogIn } from 'lucide-react';
import { Article, UserProfile } from '../types';
import { ArticleCard } from '../components/ArticleCard';

interface SavedBlogsPageProps {
  currentUser: UserProfile | null;
  articles: Article[];
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
  onOpenAuth: () => void;
  onCategoryClick: (cat: string) => void;
}

export const SavedBlogsPage: React.FC<SavedBlogsPageProps> = ({
  currentUser,
  articles,
  isBookmarked,
  onToggleBookmark,
  onOpenAuth,
  onCategoryClick,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      document.title = 'My Saved Blogs | Aether Press';
    }
    return () => {
      document.title = 'Aether Press — Blog & News Platform';
    };
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-lg mx-auto my-20 p-10 text-center bg-white dark:bg-[#262b32] rounded-3xl border border-[#e2e6de] dark:border-[#333a44] shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#eaf0ec] dark:bg-[#7d998a]/20 flex items-center justify-center">
          <Bookmark className="w-8 h-8 text-[#637e6f]" />
        </div>
        <h2 className="text-xl font-bold mb-2">Login to see saved blogs</h2>
        <p className="text-sm text-[#4b585b] dark:text-[#95a5a8] mb-6">
          Sign up free and save any blog to read later.
        </p>
        <button
          onClick={onOpenAuth}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#637e6f] text-white text-sm font-semibold"
        >
          <LogIn className="w-4 h-4" />
          Log In / Sign Up
        </button>
      </div>
    );
  }

  const saved = articles.filter((a) => currentUser.bookmarkedArticleIds.includes(a.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#eaf0ec] dark:bg-[#7d998a]/20 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-[#637e6f]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Saved Blogs</h1>
          <p className="text-sm text-[#4b585b] dark:text-[#95a5a8]">
            Hi {currentUser.name} — {saved.length} blog{saved.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-20 bg-[#f3f5f0] dark:bg-[#262b32] rounded-3xl border border-[#e2e6de] dark:border-[#333a44]">
          <Bookmark className="w-12 h-12 text-[#7d998a] mx-auto mb-3 opacity-50" />
          <p className="text-[#4b585b] dark:text-[#95a5a8] mb-4">Abhi koi blog save nahi kiya</p>
          <button onClick={() => navigate('/')} className="text-[#de7c68] text-sm font-semibold hover:underline">
            Explore blogs →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onReadArticle={() => navigate(`/blog/${article.slug}`)}
              onCategoryClick={onCategoryClick}
              isBookmarked={isBookmarked(article.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};
