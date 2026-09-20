import { Router } from 'express';
import User from '../models/User.js';
import Article from '../models/Article.js';
import { authRequired, readerOnly } from '../middleware/auth.js';

const router = Router();

router.use(authRequired, readerOnly);

router.get('/me', (req, res) => {
  res.json({ user: req.user.toPublic() });
});

router.post('/bookmarks/sync', async (req, res) => {
  try {
    const { articleIds = [] } = req.body;
    const user = req.user;
    const existing = new Set(user.bookmarkedArticleIds.map((id) => id.toString()));
    for (const id of articleIds) {
      const article = await Article.findById(id);
      if (article && article.status === 'published') existing.add(id);
    }
    user.bookmarkedArticleIds = [...existing];
    await user.save();
    res.json({ user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/bookmarks/:articleId', async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article || article.status !== 'published') {
      return res.status(404).json({ error: 'Article not found' });
    }

    const user = req.user;
    const id = article._id.toString();
    const idx = user.bookmarkedArticleIds.findIndex((b) => b.toString() === id);

    if (idx >= 0) {
      user.bookmarkedArticleIds.splice(idx, 1);
    } else {
      user.bookmarkedArticleIds.push(article._id);
    }

    await user.save();
    res.json({
      bookmarked: idx < 0,
      user: user.toPublic(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
