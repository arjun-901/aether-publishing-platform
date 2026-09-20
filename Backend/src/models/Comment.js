import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true, index: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: '' },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

function formatAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

commentSchema.methods.toPublic = function (userId) {
  return {
    id: this._id.toString(),
    articleId: this.articleId.toString(),
    parentId: this.parentId ? this.parentId.toString() : null,
    authorId: this.authorId.toString(),
    authorName: this.authorName,
    authorAvatar: this.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(this.authorName)}`,
    content: this.content,
    createdAt: formatAgo(this.createdAt),
    likes: this.likedBy?.length || 0,
    isLikedByMe: userId ? this.likedBy.some((id) => id.toString() === userId.toString()) : false,
    replies: [],
  };
};

export default mongoose.model('Comment', commentSchema);
