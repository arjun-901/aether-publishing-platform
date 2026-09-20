const API_BASE = '/api';

function getAdminToken() {
  return localStorage.getItem('aether_token');
}

function getReaderToken() {
  return localStorage.getItem('aether_reader_token');
}

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const authToken = token !== undefined ? token : getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data as T;
}

async function readerRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, options, getReaderToken());
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: ApiUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<{ user: ApiUser }>('/auth/me'),

  getArticle: (slugOrId: string) =>
    request<{ article: ApiArticle }>(`/articles/${encodeURIComponent(slugOrId)}`),

  getArticles: (params?: { category?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    const qs = q.toString();
    return request<{ articles: ApiArticle[] }>(`/articles${qs ? `?${qs}` : ''}`);
  },

  getMyArticles: () => request<{ articles: ApiArticle[] }>('/articles/mine'),

  createArticle: (data: Partial<ApiArticle> & { status: string }) =>
    request<{ article: ApiArticle }>('/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateArticle: (id: string, data: Partial<ApiArticle> & { status?: string }) =>
    request<{ article: ApiArticle }>(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteArticle: (id: string) =>
    request<{ success: boolean }>(`/articles/${id}`, { method: 'DELETE' }),

  getNotifications: () => request<{ notifications: ApiNotification[] }>('/notifications'),

  markNotificationsRead: () =>
    request<{ success: boolean }>('/notifications/read-all', { method: 'PATCH' }),

  getMembers: () => request<{ members: ApiUser[] }>('/admin/members'),

  addMember: (data: { name: string; email: string; password: string; bio?: string }) =>
    request<{ member: ApiUser }>('/admin/members', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  toggleMember: (id: string, isActive: boolean) =>
    request<{ member: ApiUser }>(`/admin/members/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),

  deleteMember: (id: string) =>
    request<{ success: boolean }>(`/admin/members/${id}`, { method: 'DELETE' }),
};

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'writer' | 'reader';
  avatar: string;
  bio: string;
  handle: string;
  isActive?: boolean;
  bookmarkedArticleIds?: string[];
  followedCategories?: string[];
  followedAuthorIds?: string[];
}

export interface ApiReaderUser extends ApiUser {
  role: 'reader';
  bookmarkedArticleIds: string[];
  followedCategories: string[];
  followedAuthorIds: string[];
}

export const readerApi = {
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: ApiReaderUser }>('/auth/reader/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: ApiReaderUser }>('/auth/reader/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => readerRequest<{ user: ApiReaderUser }>('/reader/me'),

  toggleBookmark: (articleId: string) =>
    readerRequest<{ bookmarked: boolean; user: ApiReaderUser }>(`/reader/bookmarks/${articleId}`, {
      method: 'PATCH',
    }),

  syncBookmarks: (articleIds: string[]) =>
    readerRequest<{ user: ApiReaderUser }>('/reader/bookmarks/sync', {
      method: 'POST',
      body: JSON.stringify({ articleIds }),
    }),

  getComments: (articleId: string) =>
    request<{ comments: ApiComment[]; total: number }>(
      `/comments/article/${articleId}`,
      {},
      getReaderToken()
    ),

  postComment: (articleId: string, content: string, parentId?: string) =>
    readerRequest<{ comment: ApiComment }>('/comments', {
      method: 'POST',
      body: JSON.stringify({ articleId, content, parentId }),
    }),

  likeComment: (commentId: string) =>
    readerRequest<{ liked: boolean; likes: number; comment: ApiComment }>(
      `/comments/${commentId}/like`,
      { method: 'PATCH' }
    ),
};

export interface ApiComment {
  id: string;
  articleId: string;
  parentId?: string | null;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLikedByMe?: boolean;
  replies?: ApiComment[];
}

export function saveReaderSession(token: string, user: ApiReaderUser) {
  localStorage.setItem('aether_reader_token', token);
  localStorage.setItem('aether_reader_user', JSON.stringify(user));
}

export function clearReaderSession() {
  localStorage.removeItem('aether_reader_token');
  localStorage.removeItem('aether_reader_user');
}

export function getSavedReaderUser(): ApiReaderUser | null {
  const raw = localStorage.getItem('aether_reader_user');
  return raw ? JSON.parse(raw) : null;
}

export function readerToProfile(user: ApiReaderUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: 'reader' as const,
    avatar: user.avatar,
    bio: user.bio,
    handle: user.handle,
    bookmarkedArticleIds: user.bookmarkedArticleIds || [],
    followedCategories: (user.followedCategories || []) as import('../types').CategoryType[],
    followedAuthorIds: user.followedAuthorIds || [],
    publishedArticlesCount: 0,
    draftsCount: 0,
    totalViews: 0,
  };
}

export interface ApiArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  contentHtml: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
    roleTitle: string;
    bio: string;
    followersCount: number;
    handle: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  views: number;
  likes: number;
  claps: number;
  status: 'published' | 'draft';
  isFeatured?: boolean;
  isTrending?: boolean;
  commentsCount: number;
}

export interface ApiNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  articleId?: string;
  authorAvatar?: string;
}

export function saveSession(token: string, user: ApiUser) {
  localStorage.setItem('aether_token', token);
  localStorage.setItem('aether_admin_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('aether_token');
  localStorage.removeItem('aether_admin_user');
}

export function getSavedUser(): ApiUser | null {
  const raw = localStorage.getItem('aether_admin_user');
  return raw ? JSON.parse(raw) : null;
}
