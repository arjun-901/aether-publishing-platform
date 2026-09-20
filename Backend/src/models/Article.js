import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    contentHtml: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    category: {
      type: String,
      enum: ['AI', 'Business', 'News', 'Daily News', 'Articles', 'AWS', 'Full Stack Development', 'Other'],
      default: 'News',
    },
    tags: [{ type: String }],
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: '' },
    authorHandle: { type: String, default: '' },
    publishedAt: { type: Date, default: null },
    readTimeMinutes: { type: Number, default: 5 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    claps: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

articleSchema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    slug: this.slug,
    title: this.title,
    subtitle: this.subtitle,
    excerpt: this.excerpt,
    contentHtml: this.contentHtml,
    coverImage: this.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85',
    category: this.category,
    tags: this.tags || [],
    author: {
      id: this.authorId?.toString() || '',
      name: this.authorName,
      avatar: this.authorAvatar,
      roleTitle: 'Contributing Author',
      bio: '',
      followersCount: 0,
      handle: this.authorHandle,
    },
    publishedAt: this.publishedAt ? this.publishedAt.toISOString().split('T')[0] : '',
    readTimeMinutes: this.readTimeMinutes,
    views: this.views,
    likes: this.likes,
    claps: this.claps,
    status: this.status,
    isFeatured: this.isFeatured,
    isTrending: this.isTrending,
    commentsCount: this.commentsCount,
  };
};

export default mongoose.model('Article', articleSchema);
