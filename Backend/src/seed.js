import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Article from './models/Article.js';
import Notification from './models/Notification.js';

const sampleArticles = [
  {
    title: 'The Future of AI in Everyday Life',
    subtitle: 'How machine learning is reshaping our daily routines',
    excerpt: 'From smart homes to personalized healthcare, AI is no longer science fiction—it is the infrastructure of modern living.',
    category: 'AI',
    tags: ['AI', 'Technology', 'Future'],
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=85',
    readTimeMinutes: 6,
    isFeatured: true,
    contentHtml: '<p>Artificial intelligence has moved from research labs into our pockets, homes, and workplaces. This article explores the practical impact of AI on everyday decisions—from what we watch to how doctors diagnose illness.</p><h2>The Quiet Revolution</h2><p>Unlike past tech waves, AI adoption feels invisible. Recommendation engines, voice assistants, and predictive text are so embedded we barely notice them.</p>',
  },
  {
    title: 'India Tech Startup Funding Hits Record High',
    subtitle: 'Q1 2026 sees unprecedented venture capital inflow',
    excerpt: 'Indian startups raised over $4.2B in the first quarter, with AI and fintech leading the charge.',
    category: 'Business',
    tags: ['Startups', 'Funding', 'India'],
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=85',
    readTimeMinutes: 4,
    contentHtml: '<p>The Indian startup ecosystem continues its remarkable growth trajectory. Venture capital firms are doubling down on AI-native companies and deep-tech ventures.</p>',
  },
  {
    title: 'Breaking: New Cloud Policy Framework Announced',
    subtitle: 'Government unveils guidelines for data sovereignty',
    excerpt: 'The new framework aims to balance innovation with data protection for cloud service providers.',
    category: 'News',
    tags: ['Policy', 'Cloud', 'Government'],
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
    readTimeMinutes: 3,
    isTrending: true,
    contentHtml: '<p>In a landmark announcement today, officials outlined a comprehensive cloud policy that will affect how enterprises store and process citizen data.</p>',
  },
  {
    title: 'Morning Brief: Markets, Tech & Global Headlines',
    subtitle: 'Your 5-minute digest for September 16, 2026',
    excerpt: 'Stock markets rally, semiconductor shortages ease, and major tech earnings beat expectations.',
    category: 'Daily News',
    tags: ['Markets', 'Briefing', 'Daily'],
    coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=85',
    readTimeMinutes: 5,
    contentHtml: '<p>Good morning. Here is everything you need to know before markets open.</p><ul><li>Nifty crosses 26,000 milestone</li><li>Apple announces India manufacturing expansion</li><li>OpenAI releases new reasoning model</li></ul>',
  },
  {
    title: 'Building Scalable APIs with Express and MongoDB',
    subtitle: 'A practical guide for modern backend development',
    excerpt: 'Learn how to structure a production-ready REST API with authentication, validation, and clean architecture.',
    category: 'Full Stack Development',
    tags: ['Express', 'MongoDB', 'Backend'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=85',
    readTimeMinutes: 8,
    contentHtml: '<p>Modern web applications demand backends that are fast, secure, and easy to maintain. Express.js paired with MongoDB offers an excellent foundation.</p>',
  },
  {
    title: 'AWS Lambda vs EC2: When to Use What',
    subtitle: 'Cost and performance comparison for serverless vs traditional compute',
    excerpt: 'Choosing the right AWS compute option can save thousands monthly. Here is a decision framework.',
    category: 'AWS',
    tags: ['AWS', 'Serverless', 'DevOps'],
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=85',
    readTimeMinutes: 7,
    contentHtml: '<p>Serverless is not always cheaper. This guide walks through real-world scenarios where Lambda shines—and where EC2 remains the better choice.</p>',
  },
];

async function seed() {
  await connectDB();

  // Create demo admin
  let admin = await User.findOne({ email: 'arjun@gmail.com' });
  if (!admin) {
    admin = await User.create({
      name: 'Arjun Singh',
      email: 'arjun@gmail.com',
      password: '12345',
      role: 'admin',
      bio: 'Founder & Editor-in-Chief at Aether Press.',
      handle: '@arjun_singh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });
    console.log('Admin created: arjun@gmail.com / 12345');
  } else {
    console.log('Admin already exists');
  }

  const articleCount = await Article.countDocuments();
  if (articleCount === 0) {
    for (const data of sampleArticles) {
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const article = await Article.create({
        ...data,
        slug,
        status: 'published',
        publishedAt: new Date(),
        authorId: admin._id,
        authorName: admin.name,
        authorAvatar: admin.avatar,
        authorHandle: admin.handle,
        views: Math.floor(Math.random() * 5000) + 100,
        claps: Math.floor(Math.random() * 500),
      });

      await Notification.create({
        type: 'new_article',
        title: 'New Story Published',
        message: `${admin.name} published "${article.title}"`,
        articleId: article._id,
        authorAvatar: admin.avatar,
      });
    }
    console.log(`Seeded ${sampleArticles.length} sample articles`);
  } else {
    console.log(`${articleCount} articles already exist, skipping seed`);
  }

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
