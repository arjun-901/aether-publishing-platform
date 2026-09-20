import { Router } from 'express';
import User from '../models/User.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = Router();

router.use(authRequired, adminOnly);

// List all members (writers)
router.get('/members', async (req, res) => {
  try {
    const members = await User.find({ role: 'writer' }).sort({ createdAt: -1 });
    res.json({ members: members.map((m) => m.toPublic()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new writer member
router.post('/members', async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const member = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'writer',
      bio: bio || 'Contributing Author at Aether Press.',
      handle: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
    });

    res.status(201).json({ member: member.toPublic() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle member active status
router.patch('/members/:id', async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member || member.role !== 'writer') {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (req.body.isActive !== undefined) member.isActive = req.body.isActive;
    if (req.body.name) member.name = req.body.name;
    if (req.body.bio) member.bio = req.body.bio;
    await member.save();

    res.json({ member: member.toPublic() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/members/:id', async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member || member.role !== 'writer') {
      return res.status(404).json({ error: 'Member not found' });
    }
    await member.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
