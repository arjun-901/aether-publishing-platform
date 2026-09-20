import { Router } from 'express';
import Article from '../models/Article.js';
import Notification from '../models/Notification.js';
import { authRequired, writerOnly } from '../middleware/auth.js';

const router = Router();

function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'untitled';
}

async function createNewArticleNotification(article, author) {
  await Notification.create({
    type: 'new_article',
    title: 'New Story Published',
    message: `${author.name} published "${article.title}"`,
    articleId: article._id,
    authorAvatar: author.avatar,
  });
}

// Public: get published articles
router.get('/', async (req, res) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};

    if (status === 'all' && req.headers.authorization) {
      // writers see their drafts via /mine
    } else {
      filter.status = 'published';
    }

    if (category && category !== 'all') filter.category = category;

    let articles = await Article.find(filter).sort({ publishedAt: -1, createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.authorName.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    res.json({ articles: articles.map((a) => a.toPublic()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Writer: my articles (drafts + published)
router.get('/mine', authRequired, writerOnly, async (req, res) => {
  try {
    const filter =
      req.user.role === 'admin'
        ? {}
        : { authorId: req.user._id };

    const articles = await Article.find(filter).sort({ updatedAt: -1 });
    res.json({ articles: articles.map((a) => a.toPublic()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let article = await Article.findById(idOrSlug).catch(() => null);
    if (!article) article = await Article.findOne({ slug: idOrSlug });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    if (article.status !== 'published') {
      return res.status(404).json({ error: 'Article not found' });
    }

    article.views += 1;
    await article.save();
    res.json({ article: article.toPublic() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authRequired, writerOnly, async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;
    let slug = makeSlug(data.title || 'untitled');
    const existing = await Article.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const isPublish = data.status === 'published';
    const article = await Article.create({
      slug,
      title: data.title || 'Untitled',
      subtitle: data.subtitle || '',
      excerpt: data.excerpt || '',
      contentHtml: data.contentHtml || '',
      coverImage: data.coverImage || '',
      category: data.category || 'News',
      tags: data.tags || [],
      authorId: user._id,
      authorName: user.name,
      authorAvatar: user.avatar || user.toPublic().avatar,
      authorHandle: user.handle || user.toPublic().handle,
      readTimeMinutes: data.readTimeMinutes || 5,
      status: isPublish ? 'published' : 'draft',
      publishedAt: isPublish ? new Date() : null,
      isFeatured: data.isFeatured || false,
    });

    if (isPublish) {
      await createNewArticleNotification(article, user.toPublic());
    }

    res.status(201).json({ article: article.toPublic() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authRequired, writerOnly, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    if (req.user.role !== 'admin' && article.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only edit your own articles' });
    }

    const wasDraft = article.status === 'draft';
    const data = req.body;

    if (data.title) {
      article.title = data.title;
      if (!data.keepSlug) article.slug = makeSlug(data.title);
    }
    if (data.subtitle !== undefined) article.subtitle = data.subtitle;
    if (data.excerpt !== undefined) article.excerpt = data.excerpt;
    if (data.contentHtml !== undefined) article.contentHtml = data.contentHtml;
    if (data.coverImage !== undefined) article.coverImage = data.coverImage;
    if (data.category) article.category = data.category;
    if (data.tags) article.tags = data.tags;
    if (data.readTimeMinutes) article.readTimeMinutes = data.readTimeMinutes;

    if (data.status === 'published' && article.status !== 'published') {
      article.status = 'published';
      article.publishedAt = new Date();
      await article.save();
      await createNewArticleNotification(article, req.user.toPublic());
    } else if (data.status) {
      article.status = data.status;
      if (data.status === 'draft') article.publishedAt = null;
      await article.save();
    } else {
      await article.save();
    }

    if (wasDraft && data.status === 'published') {
      // already handled above
    }

    res.json({ article: article.toPublic() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authRequired, writerOnly, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    if (req.user.role !== 'admin' && article.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own articles' });
    }

    await article.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
