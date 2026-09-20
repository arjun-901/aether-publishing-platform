import React, { useState } from 'react';
import {
  PenTool,
  FileText,
  Clock,
  Eye,
  Trash2,
  Edit3,
  TrendingUp,
  Users,
  Sparkles,
  BarChart3,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Article, UserProfile } from '../types';

interface WriterDashboardProps {
  articles: Article[];
  currentUser: UserProfile;
  onNewArticle: () => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onPreviewArticle: (article: Article) => void;
}

export const WriterDashboard: React.FC<WriterDashboardProps> = ({
  articles,
  currentUser,
  onNewArticle,
  onEditArticle,
  onDeleteArticle,
  onPreviewArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'my-articles' | 'drafts' | 'analytics' | 'settings'>('my-articles');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter articles written by current user or all mock author articles
  const publishedArticles = articles.filter((a) => a.status === 'published');
  const draftArticles = articles.filter((a) => a.status === 'draft');

  const displayedArticles = (activeTab === 'drafts' ? draftArticles : publishedArticles).filter((a) => {
    if (filterCategory === 'all') return true;
    return a.category === filterCategory;
  });

  const totalViews = publishedArticles.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalClaps = publishedArticles.reduce((acc, curr) => acc + (curr.claps || 0), 0);

  return (
    <div className="min-h-screen bg-[#fafbf8] dark:bg-[#1e2228] text-[#1e2228] dark:text-[#f3f5f0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2e6de] dark:border-[#333a44]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-mono font-semibold px-2 py-0.5 rounded bg-[#fbeee9] text-[#de7c68] dark:bg-[#de7c68]/20 dark:text-[#f2c6b1] border border-[#de7c68]/20">
                Author Studio
              </span>
              <span className="text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono">
                {currentUser.handle}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1e2228] dark:text-white">
              Publication Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="writer-new-article-btn"
              onClick={onNewArticle}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#de7c68] hover:bg-[#cc6752] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Article</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
          <div className="p-5 bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl border border-[#e2e6de] dark:border-[#333a44] shadow-xs">
            <div className="flex items-center justify-between text-[#4b585b] dark:text-[#95a5a8] text-xs mb-2">
              <span>Total Story Views</span>
              <Eye className="w-4 h-4 text-[#de7c68]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1e2228] dark:text-white">
              {totalViews.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center text-xs text-[#7d998a] font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>+18.4% this month</span>
            </div>
          </div>

          <div className="p-5 bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl border border-[#e2e6de] dark:border-[#333a44] shadow-xs">
            <div className="flex items-center justify-between text-[#4b585b] dark:text-[#95a5a8] text-xs mb-2">
              <span>Reader Claps & Likes</span>
              <Sparkles className="w-4 h-4 text-[#f2c6b1]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1e2228] dark:text-white">
              {totalClaps.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center text-xs text-[#7d998a] font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>+24.1% engagement rate</span>
            </div>
          </div>

          <div className="p-5 bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl border border-[#e2e6de] dark:border-[#333a44] shadow-xs">
            <div className="flex items-center justify-between text-[#4b585b] dark:text-[#95a5a8] text-xs mb-2">
              <span>Subscribers / Followers</span>
              <Users className="w-4 h-4 text-[#7d998a]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1e2228] dark:text-white">
              14,200
            </div>
            <div className="mt-2 flex items-center text-xs text-[#7d998a] font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>+380 new readers</span>
            </div>
          </div>

          <div className="p-5 bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl border border-[#e2e6de] dark:border-[#333a44] shadow-xs">
            <div className="flex items-center justify-between text-[#4b585b] dark:text-[#95a5a8] text-xs mb-2">
              <span>Published Stories</span>
              <FileText className="w-4 h-4 text-[#5d6d71]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1e2228] dark:text-white">
              {publishedArticles.length}
            </div>
            <div className="mt-2 text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono">
              {draftArticles.length} active drafts
            </div>
          </div>
        </div>

        {/* Main Dashboard Layout: Navigation Tabs & List */}
        <div className="bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl border border-[#e2e6de] dark:border-[#333a44] shadow-xs overflow-hidden">
          
          {/* Tab bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#e2e6de] dark:border-[#333a44]">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                id="tab-my-articles"
                onClick={() => setActiveTab('my-articles')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === 'my-articles'
                    ? 'bg-[#1e2228] text-white dark:bg-[#f3f5f0] dark:text-[#1e2228]'
                    : 'text-[#4b585b] dark:text-[#c4cec9] hover:bg-[#f3f5f0] dark:hover:bg-[#333a44]'
                }`}
              >
                Published Stories ({publishedArticles.length})
              </button>

              <button
                id="tab-drafts"
                onClick={() => setActiveTab('drafts')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === 'drafts'
                    ? 'bg-[#1e2228] text-white dark:bg-[#f3f5f0] dark:text-[#1e2228]'
                    : 'text-[#4b585b] dark:text-[#c4cec9] hover:bg-[#f3f5f0] dark:hover:bg-[#333a44]'
                }`}
              >
                Drafts ({draftArticles.length})
              </button>

              <button
                id="tab-analytics"
                onClick={() => setActiveTab('analytics')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-[#1e2228] text-white dark:bg-[#f3f5f0] dark:text-[#1e2228]'
                    : 'text-[#4b585b] dark:text-[#c4cec9] hover:bg-[#f3f5f0] dark:hover:bg-[#333a44]'
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Quick category filter dropdown */}
            {(activeTab === 'my-articles' || activeTab === 'drafts') && (
              <div className="flex items-center gap-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-[#4b585b] dark:text-[#95a5a8]" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#fafbf8] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44] rounded-lg text-xs text-[#1e2228] dark:text-[#f3f5f0] focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="AI">AI</option>
                  <option value="Business">Business</option>
                  <option value="News">News</option>
                  <option value="Daily News">Daily News</option>
                  <option value="Articles">Articles</option>
                  <option value="AWS">AWS</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}
          </div>

          {/* Tab Content: Articles Table */}
          {(activeTab === 'my-articles' || activeTab === 'drafts') && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e6de] dark:border-[#333a44] text-[11px] font-semibold text-[#4b585b] dark:text-[#95a5a8] uppercase tracking-wider bg-[#fafbf8] dark:bg-[#1e2228]/50">
                    <th className="py-3 px-6">Story Title & Excerpt</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Performance</th>
                    <th className="py-3 px-4">Published Date</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e6de] dark:divide-[#333a44] text-xs">
                  {displayedArticles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#4b585b] dark:text-[#95a5a8]">
                        No articles found in this filter.
                      </td>
                    </tr>
                  ) : (
                    displayedArticles.map((article) => (
                      <tr
                        key={article.id}
                        className="hover:bg-[#f3f5f0]/60 dark:hover:bg-[#333a44]/30 transition-colors group"
                      >
                        {/* Title & Cover */}
                        <td className="py-4 px-6 max-w-md">
                          <div className="flex items-center gap-3">
                            <img
                              src={article.coverImage}
                              alt=""
                              className="w-12 h-10 rounded-lg object-cover shrink-0 border border-[#e2e6de] dark:border-[#333a44]"
                            />
                            <div className="min-w-0">
                              <h3
                                onClick={() => onPreviewArticle(article)}
                                className="font-semibold text-sm text-[#1e2228] dark:text-white truncate hover:text-[#de7c68] dark:hover:text-[#f2c6b1] cursor-pointer"
                              >
                                {article.title}
                              </h3>
                              <p className="text-[#4b585b] dark:text-[#95a5a8] text-[11px] truncate">
                                {article.excerpt}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f3f5f0] dark:bg-[#1e2228] text-[#4b585b] dark:text-[#c4cec9] border border-[#e2e6de] dark:border-[#333a44]">
                            {article.category}
                          </span>
                        </td>

                        {/* Status badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                              article.status === 'published'
                                ? 'bg-[#eaf0ec] text-[#637e6f] dark:bg-[#7d998a]/20 dark:text-[#7d998a]'
                                : 'bg-[#fbeee9] text-[#de7c68] dark:bg-[#de7c68]/20 dark:text-[#f2c6b1]'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {article.status}
                          </span>
                        </td>

                        {/* Performance */}
                        <td className="py-4 px-4 whitespace-nowrap font-mono text-[#4b585b] dark:text-[#c4cec9]">
                          <div>{article.views.toLocaleString()} views</div>
                          <div className="text-[10px] text-[#4b585b]/70 dark:text-[#95a5a8]">{article.claps} claps</div>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 whitespace-nowrap font-mono text-[#4b585b] dark:text-[#95a5a8]">
                          {article.publishedAt}
                        </td>

                        {/* Quick Actions */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`edit-article-${article.id}`}
                              onClick={() => onEditArticle(article)}
                              className="p-1.5 text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white hover:bg-[#f3f5f0] dark:hover:bg-[#333a44] rounded-lg transition-colors"
                              title="Edit in Rich Editor"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              id={`preview-article-${article.id}`}
                              onClick={() => onPreviewArticle(article)}
                              className="p-1.5 text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white hover:bg-[#f3f5f0] dark:hover:bg-[#333a44] rounded-lg transition-colors"
                              title="Preview Article"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              id={`delete-article-${article.id}`}
                              onClick={() => onDeleteArticle(article.id)}
                              className="p-1.5 text-[#4b585b] hover:text-[#de7c68] dark:text-[#95a5a8] dark:hover:text-[#de7c68] hover:bg-[#fbeee9] dark:hover:bg-[#de7c68]/10 rounded-lg transition-colors"
                              title="Delete Story"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab Content: Analytics Overview */}
          {activeTab === 'analytics' && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-[#1e2228] dark:text-white mb-2">
                Audience Traffic & Reader Retention
              </h3>
              <p className="text-sm text-[#4b585b] dark:text-[#c4cec9] mb-6 font-normal">
                Aggregated reading completion rates, referral sources, and subscriber conversion trends.
              </p>

              {/* Graphical simulation bars */}
              <div className="space-y-4 max-w-2xl">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1 text-[#1e2228] dark:text-white">
                    <span>Direct Platform Subscribers (68%)</span>
                    <span className="font-mono text-[#7d998a]">98,200 reads</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#f3f5f0] dark:bg-[#1e2228] rounded-full overflow-hidden">
                    <div className="h-full bg-[#de7c68] rounded-full w-[68%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1 text-[#1e2228] dark:text-white">
                    <span>Tech Aggregators & Syndication (22%)</span>
                    <span className="font-mono text-[#7d998a]">31,500 reads</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#f3f5f0] dark:bg-[#1e2228] rounded-full overflow-hidden">
                    <div className="h-full bg-[#7d998a] rounded-full w-[22%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1 text-[#1e2228] dark:text-white">
                    <span>Organic Search & References (10%)</span>
                    <span className="font-mono text-[#7d998a]">14,200 reads</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#f3f5f0] dark:bg-[#1e2228] rounded-full overflow-hidden">
                    <div className="h-full bg-[#f2c6b1] rounded-full w-[10%]" />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
