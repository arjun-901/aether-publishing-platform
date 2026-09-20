export type CategoryType =
  | 'AI'
  | 'Business'
  | 'News'
  | 'Daily News'
  | 'Articles'
  | 'AWS'
  | 'Full Stack Development'
  | 'Other';

export type UserRole = 'admin' | 'writer' | 'reader' | 'guest';

export interface Author {
  id: string;
  name: string;
  avatar: string;
  roleTitle: string;
  bio: string;
  followersCount: number;
  handle: string;
  verified?: boolean;
}

export interface Comment {
  id: string;
  articleId: string;
  parentId?: string | null;
  authorId?: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLikedByMe?: boolean;
  replies?: Comment[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  contentHtml: string;
  coverImage: string;
  category: CategoryType;
  tags: string[];
  author: Author;
  publishedAt: string;
  readTimeMinutes: number;
  views: number;
  likes: number;
  claps: number;
  status: 'published' | 'draft';
  isTrending?: boolean;
  isFeatured?: boolean;
  commentsCount: number;
}

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
  followersCount: number;
  accentColor: string;
  icon: string;
}

export interface NotificationItem {
  id: string;
  type: 'new_article' | 'clap' | 'follow' | 'comment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  articleId?: string;
  authorAvatar?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio: string;
  handle: string;
  followedCategories: CategoryType[];
  followedAuthorIds: string[];
  bookmarkedArticleIds: string[];
  publishedArticlesCount: number;
  draftsCount: number;
  totalViews: number;
}
