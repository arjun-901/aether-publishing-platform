import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['new_article', 'system'], default: 'new_article' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    authorAvatar: { type: String, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.methods.toPublic = function () {
  const ago = formatAgo(this.createdAt);
  return {
    id: this._id.toString(),
    type: this.type,
    title: this.title,
    message: this.message,
    timestamp: ago,
    read: this.read,
    articleId: this.articleId?.toString(),
    authorAvatar: this.authorAvatar,
  };
};

function formatAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default mongoose.model('Notification', notificationSchema);
