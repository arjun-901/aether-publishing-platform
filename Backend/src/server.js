import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import articleRoutes from './routes/articles.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';
import readerRoutes from './routes/reader.js';
import commentRoutes from './routes/comments.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (_, res) => res.json({ status: 'ok', name: 'Aether Press API' }));

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reader', readerRoutes);
app.use('/api/comments', commentRoutes);

async function start() {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
