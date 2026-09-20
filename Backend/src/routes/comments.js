import { Router } from 'express';
import Comment from '../models/Comment.js';
import Article from '../models/Article.js';
import { authRequired, readerOnly, optionalAuth } from '../middleware/auth.js';

const router = Router();

function buildCommentTree(comments, userId) {
  const map = new Map();
  const roots = [];

  comments.forEach((c) => {
    map.set(c._id.toString(), { ...c.toPublic(userId), replies: [] });
  });

  map.forEach((item) => {
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId).replies.push(item);
    } else if (!item.parentId) {
      roots.push(item);
    }
  });

  return roots;
}

router.get('/article/:articleId', optionalAuth, async (req, res) => {
  try {
    const comments = await Comment.find({ articleId: req.params.articleId }).sort({ createdAt: 1 });
    const userId = req.user?._id;
    const tree = buildCommentTree(comments, userId);
    const total = comments.length;
    res.json({ comments: tree, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authRequired, readerOnly, async (req, res) => {
  try {
    const { articleId, content, parentId } = req.body;
    if (!articleId || !content?.trim()) {
      return res.status(400).json({ error: 'Article and comment text required' });
    }

    const article = await Article.findById(articleId);
    if (!article || article.status !== 'published') {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (parentId) {
      const parent = await Comment.findById(parentId);
      if (!parent || parent.articleId.toString() !== articleId) {
        return res.status(400).json({ error: 'Invalid reply target' });
      }
    }

    const user = req.user;
    const comment = await Comment.create({
      articleId,
      parentId: parentId || null,
      authorId: user._id,
      authorName: user.name,
      authorAvatar: user.avatar || user.toPublic().avatar,
      content: content.trim(),
    });

    article.commentsCount = await Comment.countDocuments({ articleId });
    await article.save();

    res.status(201).json({ comment: comment.toPublic(user._id.toString()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/like', authRequired, readerOnly, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const userId = req.user._id;
    const idx = comment.likedBy.findIndex((id) => id.toString() === userId.toString());

    if (idx >= 0) {
      comment.likedBy.splice(idx, 1);
    } else {
      comment.likedBy.push(userId);
    }

    await comment.save();
    res.json({
      liked: idx < 0,
      likes: comment.likedBy.length,
      comment: comment.toPublic(userId.toString()),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
