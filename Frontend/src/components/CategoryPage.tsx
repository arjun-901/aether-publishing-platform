import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  Users,
  Layers,
  BookOpen
} from 'lucide-react';
import { Article, CategoryInfo, CategoryType } from '../types';
import { ArticleCard } from './ArticleCard';

interface CategoryPageProps {
  category: CategoryType;
  categoryInfo?: CategoryInfo;
  articles: Article[];
  onBack: () => void;
  onReadArticle: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
  isCategoryFollowed: boolean;
  onToggleFollowCategory: (cat: CategoryType) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  categoryInfo,
  articles,
  onBack,
  onReadArticle,
  isBookmarked,
  onToggleBookmark,
  isCategoryFollowed,
  onToggleFollowCategory,
}) => {
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  const filteredArticles = articles.filter((a) => a.category === category);

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.claps || b.views) - (a.claps || a.views);
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return (
    <div className="min-h-screen bg-[#fafbf8] dark:bg-[#1e2228] text-[#1e2228] dark:text-[#f3f5f0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Link */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-medium text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Categories</span>
        </button>

        {/* Category Header Banner */}
        <div className="relative p-8 sm:p-12 rounded-3xl bg-[#fdfdfc] dark:bg-[#262b32] border border-[#e2e6de] dark:border-[#333a44] shadow-sm overflow-hidden mb-10">
          <div className="max-w-3xl relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#fbeee9] text-[#de7c68] dark:bg-[#de7c68]/20 dark:text-[#f2c6b1] font-mono border border-[#de7c68]/20">
                Category Archive
              </span>
              <span className="text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono">
                {filteredArticles.length} published essays
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1e2228] dark:text-white mb-4">
              {category}
            </h1>

            <p className="text-[#4b585b] dark:text-[#c4cec9] text-base sm:text-lg leading-relaxed mb-6">
              {categoryInfo?.description ||
                `In-depth analyses, engineering case studies, and perspectives surrounding ${category}.`}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                id={`category-follow-btn-${category.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onToggleFollowCategory(category)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isCategoryFollowed
                    ? 'bg-[#f3f5f0] dark:bg-[#1e2228] text-[#4b585b] dark:text-[#c4cec9] border border-[#e2e6de] dark:border-[#333a44]'
                    : 'bg-[#de7c68] hover:bg-[#cc6752] text-white shadow-md'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{isCategoryFollowed ? 'Subscribed to Alerts' : `Follow ${category}`}</span>
              </button>

              <span className="text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono">
                {(categoryInfo?.followersCount || 12400).toLocaleString()} followers
              </span>
            </div>
          </div>
        </div>

        {/* Filter / Sort Row */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#e2e6de] dark:border-[#333a44]">
          <h2 className="text-xl font-bold text-[#1e2228] dark:text-white">
            All Stories ({sortedArticles.length})
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#4b585b] dark:text-[#95a5a8]">Sort:</span>
            <div className="flex p-0.5 bg-[#f3f5f0] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44] rounded-lg">
              <button
                onClick={() => setSortBy('latest')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  sortBy === 'latest'
                    ? 'bg-white dark:bg-[#262b32] text-[#1e2228] dark:text-white shadow-xs font-semibold'
                    : 'text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  sortBy === 'popular'
                    ? 'bg-white dark:bg-[#262b32] text-[#1e2228] dark:text-white shadow-xs font-semibold'
                    : 'text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white'
                }`}
              >
                Most Clapped
              </button>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {sortedArticles.length === 0 ? (
          <div className="text-center py-20 bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl border border-[#e2e6de] dark:border-[#333a44]">
            <BookOpen className="w-10 h-10 text-[#4b585b] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1e2228] dark:text-white mb-1">
              No articles published in {category} yet.
            </h3>
            <p className="text-xs text-[#4b585b] dark:text-[#c4cec9]">
              Be the first author to publish a perspective in this topic.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onReadArticle={onReadArticle}
                isBookmarked={isBookmarked(article.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
