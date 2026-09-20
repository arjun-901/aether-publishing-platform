import React from 'react';
import { Sparkles, Clock, ArrowRight, Bookmark, Flame } from 'lucide-react';
import { Article } from '../types';

interface HeroSectionProps {
  article: Article;
  onReadArticle: (id: string) => void;
  onCategoryClick: (category: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  article,
  onReadArticle,
  onCategoryClick,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <section className="relative w-full pt-4 pb-10 sm:py-8 lg:py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Pill Marker */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fbeee9] text-[#de7c68] dark:bg-[#de7c68]/20 dark:text-[#f2c6b1] border border-[#de7c68]/30">
            <Flame className="w-3.5 h-3.5 text-[#de7c68] fill-[#de7c68]" />
            <span>Featured Editorial</span>
          </span>
          <span className="text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono">
            Latest Issue
          </span>
        </div>

        {/* Hero Card Container */}
        <div className="relative group bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl sm:rounded-3xl border border-[#e2e6de] dark:border-[#333a44] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Column: Metadata, Title, Excerpt, Author */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-12 flex flex-col justify-between z-10">
              <div>
                {/* Category & Time */}
                <div className="flex flex-wrap items-center gap-2.5 mb-4 sm:mb-6">
                  <button
                    id="hero-category-tag-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategoryClick(article.category);
                    }}
                    className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#1e2228] text-white dark:bg-[#f3f5f0] dark:text-[#1e2228] hover:bg-[#de7c68] dark:hover:bg-[#de7c68] dark:hover:text-white transition-colors"
                  >
                    {article.category}
                  </button>

                  <span className="flex items-center gap-1 text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#7d998a]" />
                    {article.readTimeMinutes} min read
                  </span>

                  <span className="text-[#e2e6de] dark:text-[#333a44]">•</span>

                  <span className="text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono">
                    {article.publishedAt}
                  </span>
                </div>

                {/* Hero Title - Simple, crisp, premium look */}
                <h1
                  id="hero-article-title"
                  onClick={() => onReadArticle(article.id)}
                  className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-[#1e2228] dark:text-white leading-[1.18] mb-4 hover:text-[#de7c68] dark:hover:text-[#f2c6b1] cursor-pointer transition-colors"
                >
                  {article.title}
                </h1>

                {/* Excerpt */}
                <p className="text-[#4b585b] dark:text-[#c4cec9] text-base sm:text-lg leading-relaxed line-clamp-3 mb-6 sm:mb-8 font-normal">
                  {article.excerpt}
                </p>
              </div>

              {/* Bottom Row: Author & CTAs */}
              <div className="pt-6 border-t border-[#e2e6de] dark:border-[#333a44] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#7d998a]/30"
                  />
                  <div>
                    <h3 className="font-semibold text-sm text-[#1e2228] dark:text-white">
                      {article.author.name}
                    </h3>
                    <p className="text-xs text-[#4b585b] dark:text-[#95a5a8] line-clamp-1">
                      {article.author.roleTitle}
                    </p>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    id="hero-bookmark-toggle-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(article.id);
                    }}
                    className={`p-3 rounded-full border transition-all ${
                      isBookmarked
                        ? 'bg-[#de7c68] text-white border-[#de7c68]'
                        : 'border-[#e2e6de] dark:border-[#333a44] text-[#4b585b] dark:text-[#95a5a8] hover:text-[#1e2228] dark:hover:text-white hover:bg-[#f3f5f0] dark:hover:bg-[#1e2228]'
                    }`}
                    aria-label="Bookmark article"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
                  </button>

                  <button
                    id="hero-read-article-cta-btn"
                    onClick={() => onReadArticle(article.id)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white bg-[#de7c68] hover:bg-[#cc6752] shadow-md hover:shadow-lg transition-all active:scale-95 group/btn"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </div>

            </div>

            {/* Right Column: Hero Cover Image with aspect ratio & gradient overlay */}
            <div
              onClick={() => onReadArticle(article.id)}
              className="lg:col-span-5 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[460px] cursor-pointer overflow-hidden bg-[#f3f5f0] dark:bg-[#1e2228]"
            >
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              {/* Floating tag badge */}
              <div className="absolute bottom-4 right-4 bg-[#1e2228]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-mono border border-white/10">
                {article.views.toLocaleString()} views
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
