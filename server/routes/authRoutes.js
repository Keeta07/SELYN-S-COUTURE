import express from 'express';
import User from '../models/User.js';
import { createToken } from '../utils/token.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    token: createToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    token: createToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

export default router;
