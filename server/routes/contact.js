import express from 'express';
import db from '../db/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/contact (Public)
router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO contacts (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(name.trim(), email.trim().toLowerCase(), subject ? subject.trim() : 'General Inquiry', message.trim());

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent to our travel support team.'
    });
  } catch (error) {
    console.error('Contact submit error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit contact message.' });
  }
});

// GET /api/contact (Admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const inquiries = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    return res.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    console.error('Fetch contact inquiries error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve contact inquiries.' });
  }
});

export default router;
