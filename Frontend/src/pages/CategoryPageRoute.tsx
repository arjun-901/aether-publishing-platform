import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CategoryPage } from '../components/CategoryPage';
import { Article, CategoryType } from '../types';
import { slugToCategory } from '../utils/routes';
import { MOCK_CATEGORIES } from '../data/mockData';

interface Props {
  articles: Article[];
  categories: CategoryType[];
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
}

export const CategoryPageRoute: React.FC<Props> = ({
  articles,
  categories,
  isBookmarked,
  onToggleBookmark,
}) => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const category = slugToCategory(categorySlug || '', categories);

  if (!category) {
    return (
      <div className="text-center py-32">
        <p className="text-[#4b585b]">Category not found</p>
        <button onClick={() => navigate('/')} className="mt-4 text-[#de7c68] text-sm font-semibold">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <CategoryPage
      category={category}
      categoryInfo={MOCK_CATEGORIES.find((c) => c.name === category)}
      articles={articles.filter((a) => a.category === category)}
      onBack={() => navigate('/')}
      onReadArticle={(id) => {
        const a = articles.find((x) => x.id === id);
        if (a) navigate(`/blog/${a.slug}`);
      }}
      isBookmarked={isBookmarked}
      onToggleBookmark={onToggleBookmark}
      isCategoryFollowed={false}
      onToggleFollowCategory={() => {}}
    />
  );
};
