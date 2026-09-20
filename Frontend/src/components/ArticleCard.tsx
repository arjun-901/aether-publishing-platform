import React from 'react';
import { Clock, Bookmark, Sparkles, TrendingUp } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onReadArticle: (id: string) => void;
  onCategoryClick?: (category: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  variant?: 'grid' | 'compact' | 'featured';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onReadArticle,
  onCategoryClick,
  isBookmarked,
  onToggleBookmark,
  variant = 'grid',
}) => {
  return (
    <article
      id={`article-card-${article.id}`}
      onClick={() => onReadArticle(article.id)}
      className="group relative flex flex-col bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl border border-[#e2e6de] dark:border-[#333a44] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#7d998a]/60 dark:hover:border-[#7d998a]/60 transition-all duration-300 cursor-pointer"
    >
      {/* Card Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f3f5f0] dark:bg-[#1e2228]">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40" />

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <button
            id={`card-category-badge-${article.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onCategoryClick?.(article.category);
            }}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#fdfdfc]/95 dark:bg-[#1e2228]/95 text-[#1e2228] dark:text-white border border-[#e2e6de] dark:border-[#333a44] backdrop-blur-md shadow-sm hover:bg-[#de7c68] hover:text-white dark:hover:bg-[#de7c68] transition-colors"
          >
            {article.category}
          </button>

          {article.isTrending && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#de7c68] text-white backdrop-blur-md shadow-sm">
              <TrendingUp className="w-3 h-3" />
              <span>Trending</span>
            </span>
          )}
        </div>

        {/* Bookmark Quick Action Button */}
        <button
          id={`card-bookmark-btn-${article.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(article.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isBookmarked
              ? 'bg-[#de7c68] text-white shadow'
              : 'bg-[#1e2228]/60 text-white hover:bg-[#1e2228]/90'
          }`}
          aria-label="Bookmark article"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Read time & Date */}
          <div className="flex items-center gap-2 text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono mb-2.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#7d998a]" />
              {article.readTimeMinutes} min
            </span>
            <span>•</span>
            <span>{article.publishedAt}</span>
          </div>

          {/* Article Title - Crisp modern sans */}
          <h2 className="text-lg sm:text-xl font-bold text-[#1e2228] dark:text-white group-hover:text-[#de7c68] dark:group-hover:text-[#f2c6b1] transition-colors line-clamp-2 leading-snug mb-2.5">
            {article.title}
          </h2>

          {/* Excerpt */}
          <p className="text-[#4b585b] dark:text-[#c4cec9] text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        </div>

        {/* Footer: Author info & Claps */}
        <div className="pt-4 border-t border-[#e2e6de] dark:border-[#333a44] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-7 h-7 rounded-full object-cover border border-[#e2e6de] dark:border-[#333a44]"
            />
            <span className="text-xs font-semibold text-[#1e2228] dark:text-[#f3f5f0] truncate max-w-[120px] sm:max-w-[150px]">
              {article.author.name}
            </span>
          </div>

          <div className="text-[11px] font-mono text-[#4b585b] dark:text-[#95a5a8]">
            {article.claps > 0 ? `${article.claps.toLocaleString()} claps` : `${article.views.toLocaleString()} views`}
          </div>
        </div>
      </div>
    </article>
  );
};
