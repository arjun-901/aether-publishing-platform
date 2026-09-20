import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArticleDetail } from '../components/ArticleDetail';
import { api } from '../api/client';
import { Article, UserProfile } from '../types';
import { Loader2 } from 'lucide-react';
import { blogUrl } from '../utils/routes';

interface BlogPageProps {
  allArticles: Article[];
  readerUser: UserProfile | null;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
  onCategoryClick: (cat: string) => void;
  onLoginRequired: () => void;
  showToast: (msg: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  allArticles,
  readerUser,
  isBookmarked,
  onToggleBookmark,
  onCategoryClick,
  onLoginRequired,
  showToast,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .getArticle(slug)
      .then(({ article: a }) => {
        setArticle(a as Article);
        document.title = `${a.title} | Aether Press`;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', a.excerpt);
      })
      .catch(() => {
        showToast('Article not found');
        navigate('/');
      })
      .finally(() => setLoading(false));

    return () => {
      document.title = 'Aether Press — Blog & News Platform';
    };
  }, [slug, navigate, showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-[#de7c68] animate-spin" />
      </div>
    );
  }

  if (!article) return null;

  const related = allArticles.filter(
    (a) => a.id !== article.id && a.category === article.category
  );

  return (
    <ArticleDetail
      article={article}
      relatedArticles={related}
      onBack={() => navigate('/')}
      onReadArticle={(idOrSlug) => {
        const found = allArticles.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
        navigate(`/blog/${found?.slug || idOrSlug}`);
      }}
      onCategoryClick={onCategoryClick}
      isBookmarked={isBookmarked(article.id)}
      onToggleBookmark={onToggleBookmark}
      isAuthorFollowed={false}
      onToggleFollowAuthor={() => showToast('Follow coming soon')}
      readerUser={readerUser}
      onLoginRequired={onLoginRequired}
      showToast={showToast}
      shareUrl={blogUrl(article.slug)}
    />
  );
};
