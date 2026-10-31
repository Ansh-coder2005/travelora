import express from 'express';
import db from '../db/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/newsletter
router.post('/', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM subscribers WHERE email = ?').get(trimmedEmail);

    if (existing) {
      return res.json({ success: true, message: 'You are already subscribed to Travelora updates!' });
    }

    db.prepare('INSERT INTO subscribers (email) VALUES (?)').run(trimmedEmail);
    return res.status(201).json({
      success: true,
      message: 'Subscribed successfully! Welcome to the Travelora Inner Circle.'
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return res.status(500).json({ success: false, message: 'Failed to subscribe to newsletter.' });
  }
});

// GET /api/newsletter (Admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const subscribers = db.prepare('SELECT * FROM subscribers ORDER BY created_at DESC').all();
    return res.json({ success: true, count: subscribers.length, subscribers });
  } catch (error) {
    console.error('Fetch subscribers error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve newsletter subscribers.' });
  }
});

export default router;
