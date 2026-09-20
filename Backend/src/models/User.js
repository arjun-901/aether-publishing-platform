import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 5 },
    role: { type: String, enum: ['admin', 'writer', 'reader'], default: 'reader' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    handle: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    bookmarkedArticleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    followedCategories: [{ type: String }],
    followedAuthorIds: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(this.name)}`,
    bio: this.bio || 'Aether Press reader.',
    handle: this.handle || `@${this.name.toLowerCase().replace(/\s+/g, '_')}`,
    isActive: this.isActive,
    bookmarkedArticleIds: (this.bookmarkedArticleIds || []).map((id) => id.toString()),
    followedCategories: this.followedCategories || [],
    followedAuthorIds: this.followedAuthorIds || [],
  };
};

export default mongoose.model('User', userSchema);
