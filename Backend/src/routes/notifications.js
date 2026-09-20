import { Router } from 'express';
import Notification from '../models/Notification.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json({ notifications: notifications.map((n) => n.toPublic()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
