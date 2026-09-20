import React, { useState, useEffect } from 'react';
import {
  Shield,
  LogIn,
  LogOut,
  UserPlus,
  PenTool,
  FileText,
  Trash2,
  Edit3,
  Send,
  Save,
  Users,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
} from 'lucide-react';
import { api, ApiUser, ApiArticle, saveSession, clearSession } from '../api/client';
import { Loader2 } from 'lucide-react';
import { Article, CategoryType } from '../types';
import { RichEditor } from './RichEditor';

interface AdminPageProps {
  categories: CategoryType[];
  onArticlePublished: () => void;
  onPreviewArticle: (id: string) => void;
  showToast: (msg: string) => void;
}

type Tab = 'login' | 'members' | 'write' | 'posts';

export const AdminPage: React.FC<AdminPageProps> = ({
  categories,
  onArticlePublished,
  onPreviewArticle,
  showToast,
}) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState('');

  const [members, setMembers] = useState<ApiUser[]>([]);
  const [myArticles, setMyArticles] = useState<ApiArticle[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', bio: '' });

  const isAdmin = user?.role === 'admin';
  const canWrite = user?.role === 'admin' || user?.role === 'writer';

  // Backend se verify — bina success ke admin access nahi
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('aether_token');
      if (!token) {
        setAuthChecking(false);
        return;
      }
      try {
        const { user: u } = await api.me();
        setUser(u);
        setTab(u.role === 'admin' ? 'posts' : 'posts');
      } catch {
        clearSession();
        setUser(null);
        setTab('login');
      } finally {
        setAuthChecking(false);
      }
    };
    verifySession();
  }, []);

  useEffect(() => {
    if (user && tab === 'members' && isAdmin) loadMembers();
    if (user && tab === 'posts' && canWrite) loadMyArticles();
  }, [user, tab]);

  const loadMembers = async () => {
    try {
      const { members: m } = await api.getMembers();
      setMembers(m);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Failed to load members');
    }
  };

  const loadMyArticles = async () => {
    try {
      const { articles } = await api.getMyArticles();
      setMyArticles(articles);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Failed to load articles');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token, user: u } = await api.login(email, password);
      saveSession(token, u);
      setUser(u);
      setTab(u.role === 'admin' ? 'members' : 'posts');
      showToast(`Welcome back, ${u.name}!`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setTab('login');
    setShowEditor(false);
    showToast('Logged out successfully');
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addMember(newMember);
      setNewMember({ name: '', email: '', password: '', bio: '' });
      loadMembers();
      showToast('Writer member added! They can now login and write blogs.');
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Failed to add member');
    }
  };

  const handleSaveArticle = async (data: Partial<Article>, isPublish: boolean) => {
    try {
      const payload = {
        title: data.title,
        subtitle: data.subtitle,
        excerpt: data.excerpt,
        contentHtml: data.contentHtml,
        coverImage: data.coverImage,
        category: data.category,
        tags: data.tags,
        readTimeMinutes: data.readTimeMinutes,
        status: (isPublish ? 'published' : 'draft') as 'published' | 'draft',
      };

      if (editingArticle) {
        await api.updateArticle(editingArticle.id, payload);
        showToast(isPublish ? 'Story published! Notification sent to all readers.' : 'Draft saved.');
      } else {
        await api.createArticle(payload);
        showToast(isPublish ? '🎉 Story published! Notification sent to all readers.' : 'Draft created.');
      }

      setShowEditor(false);
      setEditingArticle(null);
      loadMyArticles();
      if (isPublish) onArticlePublished();
      setTab('posts');
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Failed to save article');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this story permanently?')) return;
    try {
      await api.deleteArticle(id);
      loadMyArticles();
      showToast('Article deleted');
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const toArticle = (a: ApiArticle): Article => ({
    ...a,
    category: a.category as CategoryType,
  });

  if (showEditor && canWrite) {
    return (
      <RichEditor
        initialArticle={editingArticle}
        onSaveArticle={handleSaveArticle}
        onPreviewArticle={(a) => onPreviewArticle(a.slug || a.id)}
        categories={categories}
        onBack={() => {
          setShowEditor(false);
          setEditingArticle(null);
        }}
      />
    );
  }

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#de7c68] animate-spin" />
      </div>
    );
  }

  // Sirf admin login — bina login ke kuch aur nahi dikhega
  if (!user) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#1e2228] to-[#262b32] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#de7c68] to-[#f2c6b1] flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-sm text-[#95a5a8] mt-2">Admin & approved writers only</p>
          </div>

          <div className="bg-[#262b32] rounded-3xl border border-[#333a44] p-8 shadow-xl">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-900/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white mb-1 block">Admin Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#95a5a8]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#333a44] bg-[#1e2228] text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#de7c68]"
                    placeholder="admin@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-white mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#95a5a8]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#333a44] bg-[#1e2228] text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#de7c68]"
                    placeholder="•••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#de7c68] hover:bg-[#cc6752] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Signing in...' : 'Admin Sign In'}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#fafbf8] to-[#f3f5f0] dark:from-[#1e2228] dark:to-[#262b32] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#de7c68]/10 text-[#de7c68] text-xs font-semibold mb-4">
            <Shield className="w-3.5 h-3.5" />
            Admin & Writer Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1e2228] dark:text-white tracking-tight">
            Aether Press Control Center
          </h1>
        </div>

        {user && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white dark:bg-[#262b32] rounded-2xl border border-[#e2e6de] dark:border-[#333a44] shadow-sm">
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-sm text-[#1e2228] dark:text-white">{user.name}</p>
                <p className="text-xs text-[#de7c68] font-mono capitalize">{user.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => setTab('members')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === 'members' ? 'bg-[#de7c68] text-white' : 'bg-[#f3f5f0] dark:bg-[#1e2228] text-[#4b585b] dark:text-[#c4cec9]'}`}
                >
                  <Users className="w-3.5 h-3.5 inline mr-1.5" />
                  Members
                </button>
              )}
              {canWrite && (
                <>
                  <button
                    onClick={() => { setTab('write'); setEditingArticle(null); setShowEditor(true); }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#637e6f] text-white hover:bg-[#526b5c] transition-all"
                  >
                    <PenTool className="w-3.5 h-3.5 inline mr-1.5" />
                    New Post
                  </button>
                  <button
                    onClick={() => setTab('posts')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === 'posts' ? 'bg-[#de7c68] text-white' : 'bg-[#f3f5f0] dark:bg-[#1e2228] text-[#4b585b]'}`}
                  >
                    <FileText className="w-3.5 h-3.5 inline mr-1.5" />
                    {isAdmin ? 'All Blogs' : 'My Posts'}
                  </button>
                </>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#e2e6de] dark:border-[#333a44] text-[#4b585b] hover:text-red-500 transition-all"
              >
                <LogOut className="w-3.5 h-3.5 inline mr-1.5" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Members Management (Admin only) */}
        {isAdmin && tab === 'members' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#262b32] rounded-3xl border border-[#e2e6de] dark:border-[#333a44] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1e2228] dark:text-white mb-1 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#de7c68]" />
                Add Writer Member
              </h3>
              <p className="text-xs text-[#4b585b] dark:text-[#95a5a8] mb-5">
                Only members you add here can login and write blogs on Aether Press.
              </p>
              <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Full Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-[#e2e6de] dark:border-[#333a44] bg-[#f3f5f0] dark:bg-[#1e2228] text-sm focus:outline-none focus:ring-2 focus:ring-[#de7c68]"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-[#e2e6de] dark:border-[#333a44] bg-[#f3f5f0] dark:bg-[#1e2228] text-sm focus:outline-none focus:ring-2 focus:ring-[#de7c68]"
                />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-[#e2e6de] dark:border-[#333a44] bg-[#f3f5f0] dark:bg-[#1e2228] text-sm focus:outline-none focus:ring-2 focus:ring-[#de7c68]"
                />
                <input
                  placeholder="Bio (optional)"
                  value={newMember.bio}
                  onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-[#e2e6de] dark:border-[#333a44] bg-[#f3f5f0] dark:bg-[#1e2228] text-sm focus:outline-none focus:ring-2 focus:ring-[#de7c68]"
                />
                <button
                  type="submit"
                  className="sm:col-span-2 py-3 rounded-xl bg-[#637e6f] hover:bg-[#526b5c] text-white font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Writer — They Can Now Write Blogs
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-[#262b32] rounded-3xl border border-[#e2e6de] dark:border-[#333a44] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1e2228] dark:text-white mb-4">
                Approved Writers ({members.length})
              </h3>
              {members.length === 0 ? (
                <p className="text-sm text-[#4b585b] dark:text-[#95a5a8] text-center py-8">
                  No writers added yet. Add your first member above.
                </p>
              ) : (
                <div className="space-y-3">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#f3f5f0] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44]"
                    >
                      <div className="flex items-center gap-3">
                        <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-semibold text-sm text-[#1e2228] dark:text-white">{m.name}</p>
                          <p className="text-xs text-[#4b585b] dark:text-[#95a5a8]">{m.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-lg font-mono ${m.isActive !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600'}`}>
                          {m.isActive !== false ? 'Active' : 'Disabled'}
                        </span>
                        <button
                          onClick={async () => {
                            await api.toggleMember(m.id, m.isActive === false);
                            loadMembers();
                          }}
                          className="p-2 rounded-lg hover:bg-white dark:hover:bg-[#262b32] text-xs text-[#4b585b]"
                        >
                          Toggle
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Remove ${m.name}?`)) {
                              await api.deleteMember(m.id);
                              loadMembers();
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Posts */}
        {canWrite && tab === 'posts' && (
          <div className="bg-white dark:bg-[#262b32] rounded-3xl border border-[#e2e6de] dark:border-[#333a44] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1e2228] dark:text-white">
                {isAdmin ? 'All Blogs (Edit / Delete)' : 'My Stories'}
              </h3>
              <button
                onClick={() => { setEditingArticle(null); setShowEditor(true); }}
                className="px-4 py-2 rounded-xl bg-[#de7c68] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <PenTool className="w-3.5 h-3.5" />
                Write New
              </button>
            </div>

            {myArticles.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-[#7d998a] mx-auto mb-3" />
                <p className="text-sm text-[#4b585b] dark:text-[#95a5a8]">No stories yet. Start writing your first blog!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myArticles.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#f3f5f0] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44]"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={a.coverImage} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#1e2228] dark:text-white truncate">{a.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase ${a.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700'}`}>
                            {a.status}
                          </span>
                          <span className="text-[10px] text-[#95a5a8]">{a.category}</span>
                          <span className="text-[10px] text-[#95a5a8]">{a.views} views</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {a.status === 'published' && (
                        <button
                          onClick={() => onPreviewArticle(a.slug)}
                          className="p-2 rounded-lg hover:bg-white dark:hover:bg-[#262b32] text-[#4b585b]"
                          title="View on site"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => { setEditingArticle(toArticle(a)); setShowEditor(true); }}
                        className="p-2 rounded-lg hover:bg-white dark:hover:bg-[#262b32] text-[#de7c68]"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
