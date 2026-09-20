import React, { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Bell,
  Sparkles,
  UserCheck,
  Tag,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Settings
} from 'lucide-react';
import { Article, Author, CategoryType, NotificationItem, UserProfile } from '../types';
import { ArticleCard } from './ArticleCard';

interface ReaderDashboardProps {
  articles: Article[];
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onReadArticle: (id: string) => void;
  onCategoryClick: (category: string) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
  notifications: NotificationItem[];
  allAuthors: Author[];
  categories: CategoryType[];
}

export const ReaderDashboard: React.FC<ReaderDashboardProps> = ({
  articles,
  currentUser,
  onUpdateUser,
  onReadArticle,
  onCategoryClick,
  isBookmarked,
  onToggleBookmark,
  notifications,
  allAuthors,
  categories,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'bookmarks' | 'following' | 'notifications'>('feed');

  // Personalized feed based on followed categories & authors
  const personalizedArticles = articles.filter((a) => {
    const matchesCategory = currentUser.followedCategories.includes(a.category);
    const matchesAuthor = currentUser.followedAuthorIds.includes(a.author.id);
    return matchesCategory || matchesAuthor;
  });

  const bookmarkedArticles = articles.filter((a) =>
    currentUser.bookmarkedArticleIds.includes(a.id)
  );

  const toggleCategoryFollow = (cat: CategoryType) => {
    const isFollowed = currentUser.followedCategories.includes(cat);
    const newFollowed = isFollowed
      ? currentUser.followedCategories.filter((c) => c !== cat)
      : [...currentUser.followedCategories, cat];

    onUpdateUser({
      ...currentUser,
      followedCategories: newFollowed,
    });
  };

  const toggleAuthorFollow = (authorId: string) => {
    const isFollowed = currentUser.followedAuthorIds.includes(authorId);
    const newAuthors = isFollowed
      ? currentUser.followedAuthorIds.filter((id) => id !== authorId)
      : [...currentUser.followedAuthorIds, authorId];

    onUpdateUser({
      ...currentUser,
      followedAuthorIds: newAuthors,
    });
  };

  return (
    <div className="min-h-screen bg-[#fafbf8] dark:bg-[#1e2228] text-[#1e2228] dark:text-[#f3f5f0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 bg-[#fdfdfc] dark:bg-[#262b32] rounded-3xl border border-[#e2e6de] dark:border-[#333a44] shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#7d998a]/30 border border-[#e2e6de] dark:border-[#333a44]"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-[#1e2228] dark:text-white">
                  Welcome back, {currentUser.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#fbeee9] text-[#de7c68] dark:bg-[#de7c68]/20 dark:text-[#f2c6b1] font-mono font-medium border border-[#de7c68]/20">
                  Reader Member
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#4b585b] dark:text-[#c4cec9]">
                Tracking {currentUser.followedCategories.length} focus topics and {currentUser.followedAuthorIds.length} authors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('following')}
              className="px-4 py-2 bg-[#f3f5f0] dark:bg-[#1e2228] hover:bg-[#e2e6de] dark:hover:bg-[#333a44] text-xs font-semibold rounded-xl text-[#1e2228] dark:text-[#f3f5f0] transition-colors border border-[#e2e6de] dark:border-[#333a44]"
            >
              Manage Topics ({currentUser.followedCategories.length})
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className="px-4 py-2 bg-[#f3f5f0] dark:bg-[#1e2228] hover:bg-[#e2e6de] dark:hover:bg-[#333a44] text-xs font-semibold rounded-xl text-[#1e2228] dark:text-[#f3f5f0] transition-colors border border-[#e2e6de] dark:border-[#333a44]"
            >
              Saved ({currentUser.bookmarkedArticleIds.length})
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#e2e6de] dark:border-[#333a44] pb-3 mb-8">
          <button
            id="reader-tab-feed"
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'feed'
                ? 'bg-[#1e2228] text-white dark:bg-[#f3f5f0] dark:text-[#1e2228] shadow-xs'
                : 'text-[#4b585b] dark:text-[#c4cec9] hover:bg-[#f3f5f0] dark:hover:bg-[#333a44]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#de7c68]" />
            <span>Curated For You</span>
          </button>

          <button
            id="reader-tab-bookmarks"
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'bookmarks'
                ? 'bg-[#1e2228] text-white dark:bg-[#f3f5f0] dark:text-[#1e2228] shadow-xs'
                : 'text-[#4b585b] dark:text-[#c4cec9] hover:bg-[#f3f5f0] dark:hover:bg-[#333a44]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Reading List ({bookmarkedArticles.length})</span>
          </button>

          <button
            id="reader-tab-following"
            onClick={() => setActiveTab('following')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'following'
                ? 'bg-[#1e2228] text-white dark:bg-[#f3f5f0] dark:text-[#1e2228] shadow-xs'
                : 'text-[#4b585b] dark:text-[#c4cec9] hover:bg-[#f3f5f0] dark:hover:bg-[#333a44]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Topics & Authors</span>
          </button>

          <button
            id="reader-tab-notifications"
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'notifications'
                ? 'bg-[#1e2228] text-white dark:bg-[#f3f5f0] dark:text-[#1e2228] shadow-xs'
                : 'text-[#4b585b] dark:text-[#c4cec9] hover:bg-[#f3f5f0] dark:hover:bg-[#333a44]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
        </div>

        {/* TAB 1: CURATED FEED */}
        {activeTab === 'feed' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1e2228] dark:text-white">
                  Your Personalized Stream
                </h2>
                <p className="text-xs text-[#4b585b] dark:text-[#c4cec9]">
                  Filtered by your active subscriptions in {currentUser.followedCategories.join(', ')}
                </p>
              </div>
            </div>

            {personalizedArticles.length === 0 ? (
              <div className="text-center py-16 bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl border border-[#e2e6de] dark:border-[#333a44] p-8">
                <BookOpen className="w-10 h-10 text-[#4b585b] mx-auto mb-3" />
                <h3 className="font-semibold text-[#1e2228] dark:text-white mb-1">
                  No stories found for your active filters.
                </h3>
                <p className="text-xs text-[#4b585b] dark:text-[#c4cec9] mb-4">
                  Follow more topics to enrich your morning feed.
                </p>
                <button
                  onClick={() => setActiveTab('following')}
                  className="px-4 py-2 bg-[#de7c68] text-white text-xs font-semibold rounded-xl"
                >
                  Configure Topics
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalizedArticles.map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    onReadArticle={onReadArticle}
                    onCategoryClick={onCategoryClick}
                    isBookmarked={isBookmarked(art.id)}
                    onToggleBookmark={onToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BOOKMARKS */}
        {activeTab === 'bookmarks' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1e2228] dark:text-white">
                  Saved for Later
                </h2>
                <p className="text-xs text-[#4b585b] dark:text-[#c4cec9]">
                  Articles bookmarked for uninterrupted deep reading.
                </p>
              </div>
            </div>

            {bookmarkedArticles.length === 0 ? (
              <div className="text-center py-16 bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl border border-[#e2e6de] dark:border-[#333a44] p-8">
                <Bookmark className="w-10 h-10 text-[#4b585b] mx-auto mb-3" />
                <h3 className="font-semibold text-[#1e2228] dark:text-white mb-1">
                  Your reading list is empty.
                </h3>
                <p className="text-xs text-[#4b585b] dark:text-[#c4cec9]">
                  Click the bookmark icon on any article across the platform to save it here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedArticles.map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    onReadArticle={onReadArticle}
                    onCategoryClick={onCategoryClick}
                    isBookmarked={true}
                    onToggleBookmark={onToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TOPICS & AUTHORS */}
        {activeTab === 'following' && (
          <div className="space-y-10">
            {/* Category Preferences */}
            <div>
              <h2 className="text-xl font-bold text-[#1e2228] dark:text-white mb-1">
                Followed Categories
              </h2>
              <p className="text-xs text-[#4b585b] dark:text-[#c4cec9] mb-5">
                Toggle categories to adjust what appears on your home feed and notifications.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const isFollowed = currentUser.followedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategoryFollow(cat)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isFollowed
                          ? 'bg-[#fbeee9]/60 dark:bg-[#de7c68]/20 border-[#de7c68]/40'
                          : 'bg-[#fdfdfc] dark:bg-[#262b32] border-[#e2e6de] dark:border-[#333a44] hover:border-[#7d998a]'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-xs text-[#1e2228] dark:text-white block">
                          {cat}
                        </span>
                        <span className="text-[10px] text-[#4b585b] dark:text-[#95a5a8] font-mono">
                          {isFollowed ? 'Subscribed' : 'Click to follow'}
                        </span>
                      </div>
                      <span className={`text-xs font-bold ${isFollowed ? 'text-[#de7c68]' : 'text-[#4b585b]/40 dark:text-[#95a5a8]/40'}`}>
                        {isFollowed ? '✓' : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Author Subscriptions */}
            <div>
              <h2 className="text-xl font-bold text-[#1e2228] dark:text-white mb-1">
                Featured Authors
              </h2>
              <p className="text-xs text-[#4b585b] dark:text-[#c4cec9] mb-5">
                Get notified when these engineers, researchers, and market columnists publish.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAuthors.map((author) => {
                  const isFollowed = currentUser.followedAuthorIds.includes(author.id);
                  return (
                    <div
                      key={author.id}
                      className="p-5 bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl border border-[#e2e6de] dark:border-[#333a44] flex items-start gap-3.5"
                    >
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#e2e6de] dark:border-[#333a44]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm text-[#1e2228] dark:text-white truncate">
                            {author.name}
                          </h4>
                          <button
                            onClick={() => toggleAuthorFollow(author.id)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                              isFollowed
                                ? 'bg-[#f3f5f0] dark:bg-[#1e2228] text-[#4b585b] dark:text-[#c4cec9] border border-[#e2e6de] dark:border-[#333a44]'
                                : 'bg-[#de7c68] text-white hover:bg-[#cc6752]'
                            }`}
                          >
                            {isFollowed ? 'Following' : '+ Follow'}
                          </button>
                        </div>
                        <p className="text-xs text-[#4b585b] dark:text-[#c4cec9] line-clamp-2">
                          {author.bio}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS PANEL */}
        {activeTab === 'notifications' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-[#1e2228] dark:text-white mb-4">
              Reader Notifications
            </h2>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => n.articleId && onReadArticle(n.articleId)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    !n.read
                      ? 'bg-[#fbeee9]/60 dark:bg-[#de7c68]/15 border-[#de7c68]/40'
                      : 'bg-[#fdfdfc] dark:bg-[#262b32] border-[#e2e6de] dark:border-[#333a44]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#fbeee9] dark:bg-[#de7c68]/20 text-[#de7c68] flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#1e2228] dark:text-white">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-[#4b585b] dark:text-[#95a5a8] font-mono">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#4b585b] dark:text-[#c4cec9] mt-1 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
