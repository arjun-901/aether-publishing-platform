import React, { useState, useEffect } from 'react';
import {
  Clock,
  Bookmark,
  Share2,
  Heart,
  ArrowLeft,
  Check,
  UserPlus,
  UserCheck,
  Sparkles,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Article, UserProfile } from '../types';
import { ArticleCard } from './ArticleCard';
import { CommentsSection } from './CommentsSection';

interface ArticleDetailProps {
  article: Article;
  relatedArticles: Article[];
  onBack: () => void;
  onReadArticle: (id: string) => void;
  onCategoryClick: (category: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isAuthorFollowed: boolean;
  onToggleFollowAuthor: (authorId: string) => void;
  readerUser?: UserProfile | null;
  onLoginRequired?: () => void;
  showToast?: (msg: string) => void;
  shareUrl?: string;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  relatedArticles,
  onBack,
  onReadArticle,
  onCategoryClick,
  isBookmarked,
  onToggleBookmark,
  isAuthorFollowed,
  onToggleFollowAuthor,
  readerUser = null,
  onLoginRequired = () => {},
  showToast = () => {},
  shareUrl,
}) => {
  // Reading progress state
  const [readingProgress, setReadingProgress] = useState(0);
  const [clapsCount, setClapsCount] = useState(article.claps || 12);
  const [hasClapped, setHasClapped] = useState(false);
  const [floatingClaps, setFloatingClaps] = useState<{ id: number; x: number }[]>([]);
  const [copiedShare, setCopiedShare] = useState(false);

  // Scroll listener for reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClap = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClapsCount((prev) => prev + 1);
    setHasClapped(true);

    // Floating +1 indicator animation
    const rect = e.currentTarget.getBoundingClientRect();
    const newId = Date.now();
    setFloatingClaps((prev) => [...prev, { id: newId, x: Math.random() * 20 - 10 }]);

    setTimeout(() => {
      setFloatingClaps((prev) => prev.filter((item) => item.id !== newId));
    }, 1000);

    // Micro burst
    confetti({
      particleCount: 20,
      spread: 40,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
    });
  };

  const handleShare = async () => {
    const url = shareUrl || `${window.location.origin}/blog/${article.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.excerpt, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      await navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#1e2228] text-[#1e2228] dark:text-[#f3f5f0] transition-colors">
      
      {/* READING PROGRESS BAR AT VERY TOP */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-[#f3f5f0] dark:bg-[#262b32] z-50">
        <div
          className="h-full bg-gradient-to-r from-[#de7c68] via-[#f2c6b1] to-[#7d998a] transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Article Header Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        
        {/* Top bar with back button & category */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            id="article-detail-back-btn"
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>All Articles</span>
          </button>

          <button
            onClick={() => onCategoryClick(article.category)}
            className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#fbeee9] text-[#de7c68] dark:bg-[#de7c68]/20 dark:text-[#f2c6b1] border border-[#de7c68]/30 hover:bg-[#de7c68] hover:text-white transition-colors"
          >
            {article.category}
          </button>
        </div>

        {/* Article Headline - Modern clean sans */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1e2228] dark:text-white leading-[1.14] mb-6">
          {article.title}
        </h1>

        {/* Subtitle / Deck */}
        {article.subtitle && (
          <p className="text-xl sm:text-2xl text-[#4b585b] dark:text-[#c4cec9] font-normal leading-relaxed mb-8">
            {article.subtitle}
          </p>
        )}

        {/* Author Card & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-[#e2e6de] dark:border-[#333a44] mb-8">
          
          <div className="flex items-center gap-3.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-13 h-13 rounded-full object-cover ring-2 ring-[#7d998a]/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-base text-[#1e2228] dark:text-white">
                  {article.author.name}
                </span>
                <button
                  onClick={() => onToggleFollowAuthor(article.author.id)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                    isAuthorFollowed
                      ? 'bg-[#f3f5f0] dark:bg-[#262b32] text-[#4b585b] dark:text-[#95a5a8] border border-[#e2e6de] dark:border-[#333a44]'
                      : 'bg-[#fbeee9] dark:bg-[#de7c68]/20 text-[#de7c68] dark:text-[#f2c6b1] hover:bg-[#de7c68] hover:text-white font-semibold'
                  }`}
                >
                  {isAuthorFollowed ? 'Following' : '+ Follow'}
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono mt-0.5">
                <span>{article.publishedAt}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#7d998a]" />
                  {article.readTimeMinutes} min read
                </span>
              </div>
            </div>
          </div>

          {/* Social actions: Claps, Share, Bookmark */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleClap}
              id="article-clap-btn"
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#e2e6de] dark:border-[#333a44] text-[#1e2228] dark:text-[#f3f5f0] hover:border-[#de7c68] hover:text-[#de7c68] transition-colors"
              title="Clap for this story"
            >
              <span className="text-base">👏</span>
              <span className="text-xs font-mono font-semibold">{clapsCount.toLocaleString()}</span>

              {/* Floating +1 markers */}
              {floatingClaps.map((item) => (
                <span
                  key={item.id}
                  className="absolute -top-7 text-xs font-bold font-mono text-[#de7c68] animate-out fade-out slide-out-to-top-4 duration-700 pointer-events-none"
                  style={{ left: `calc(50% + ${item.x}px)` }}
                >
                  +1
                </span>
              ))}
            </button>

            <button
              id="article-bookmark-btn"
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2.5 rounded-full border transition-all ${
                isBookmarked
                  ? 'bg-[#de7c68] text-white border-[#de7c68]'
                  : 'border-[#e2e6de] dark:border-[#333a44] text-[#4b585b] dark:text-[#95a5a8] hover:bg-[#f3f5f0] dark:hover:bg-[#262b32]'
              }`}
              title="Bookmark story"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>

            <button
              id="article-share-btn"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#e2e6de] dark:border-[#333a44] text-[#4b585b] dark:text-[#95a5a8] hover:bg-[#f3f5f0] dark:hover:bg-[#262b32] transition-all text-xs"
              title="Copy share link"
            >
              {copiedShare ? <Check className="w-4 h-4 text-[#7d998a]" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
            </button>
          </div>

        </div>

        {/* Large Panoramic Cover Image */}
        <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl border border-[#e2e6de] dark:border-[#333a44]">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full max-h-[520px] object-cover"
          />
        </div>

        {/* BEAUTIFULLY TYPESET ARTICLE BODY */}
        <div
          className="rich-editor-content prose prose-zinc dark:prose-invert max-w-none text-[#1e2228] dark:text-[#eaf0ec] text-lg leading-relaxed font-normal"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Tags Section */}
        <div className="mt-12 pt-6 border-t border-[#e2e6de] dark:border-[#333a44] flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#f3f5f0] dark:bg-[#262b32] text-[#4b585b] dark:text-[#c4cec9] border border-[#e2e6de] dark:border-[#333a44]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Bottom Author Bio Card */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-[#fafbf8] dark:bg-[#262b32] border border-[#e2e6de] dark:border-[#333a44] flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#7d998a]/30"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-lg font-bold text-[#1e2228] dark:text-white">
                Written by {article.author.name}
              </h3>
              <span className="text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono">
                {article.author.followersCount.toLocaleString()} followers
              </span>
            </div>
            <p className="text-sm text-[#4b585b] dark:text-[#c4cec9] leading-relaxed mb-3">
              {article.author.bio}
            </p>
            <button
              onClick={() => onToggleFollowAuthor(article.author.id)}
              className="text-xs font-semibold text-[#de7c68] hover:underline"
            >
              {isAuthorFollowed ? 'Unfollow Author' : `Follow ${article.author.name} for upcoming publications &rarr;`}
            </button>
          </div>
        </div>

        <CommentsSection
          articleId={article.id}
          readerUser={readerUser}
          onLoginRequired={onLoginRequired}
          showToast={showToast}
        />

        {/* RELATED ARTICLES SECTION */}
        {relatedArticles.length > 0 && (
          <section className="mt-20 pt-10 border-t border-[#e2e6de] dark:border-[#333a44]">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2228] dark:text-white mb-6">
              More in {article.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((rel) => (
                <ArticleCard
                  key={rel.id}
                  article={rel}
                  onReadArticle={onReadArticle}
                  onCategoryClick={onCategoryClick}
                  isBookmarked={false}
                  onToggleBookmark={onToggleBookmark}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
