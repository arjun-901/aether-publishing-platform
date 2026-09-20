import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aether-press-secret-key-2026';

export function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

export async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Login required' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive account' });
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Session expired. Please login again.' });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
}

export function writerOnly(req, res, next) {
  if (!['admin', 'writer'].includes(req.user?.role)) {
    return res.status(403).json({ error: 'Writer access only' });
  }
  next();
}

export function readerOnly(req, res, next) {
  if (req.user?.role !== 'reader') {
    return res.status(403).json({ error: 'Reader account required' });
  }
  next();
}

export async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) req.user = user;
    }
  } catch {
    // guest — no user
  }
  next();
}
