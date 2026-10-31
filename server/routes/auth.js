import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/database.js';
import { generateToken, authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(trimmedEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const userId = `usr_${Date.now()}`;
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);
    const joinedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const avatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`;

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, phone, avatar, role, joined_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      name.trim(),
      trimmedEmail,
      passwordHash,
      phone ? phone.trim() : '+91 99999 88888',
      avatar,
      'user',
      joinedDate
    );

    const newUser = {
      id: userId,
      name: name.trim(),
      email: trimmedEmail,
      phone: phone || '+91 99999 88888',
      avatar,
      role: 'user',
      joined_date: joinedDate
    };

    const token = generateToken(newUser);
    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(trimmedEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User does not exist.' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      joined_date: user.joined_date
    };

    const token = generateToken(userProfile);
    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: userProfile
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

// GET /api/auth/users (Admin only)
router.get('/users', authenticateToken, requireAdmin, (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, phone, avatar, role, joined_date, created_at FROM users ORDER BY created_at DESC').all();
    return res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
});

export default router;
