import express from 'express';
import db from '../db/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/wishlist
router.get('/', optionalAuth, (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'usr_demo_01';
    const rows = db.prepare('SELECT destination_id FROM wishlists WHERE user_id = ?').all(userId);
    const destinationIds = rows.map((r) => r.destination_id);
    return res.json({ success: true, count: destinationIds.length, wishlist: destinationIds });
  } catch (error) {
    console.error('Fetch wishlist error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve wishlist.' });
  }
});

// POST /api/wishlist/toggle
router.post('/toggle', optionalAuth, (req, res) => {
  try {
    const { destinationId } = req.body;
    if (!destinationId) {
      return res.status(400).json({ success: false, message: 'Destination ID is required.' });
    }

    const userId = req.user ? req.user.id : 'usr_demo_01';
    const existing = db.prepare('SELECT id FROM wishlists WHERE user_id = ? AND destination_id = ?').get(userId, destinationId);

    let inWishlist;
    if (existing) {
      db.prepare('DELETE FROM wishlists WHERE id = ?').run(existing.id);
      inWishlist = false;
    } else {
      db.prepare('INSERT INTO wishlists (user_id, destination_id) VALUES (?, ?)').run(userId, destinationId);
      inWishlist = true;
    }

    const rows = db.prepare('SELECT destination_id FROM wishlists WHERE user_id = ?').all(userId);
    const wishlist = rows.map((r) => r.destination_id);

    return res.json({
      success: true,
      inWishlist,
      message: inWishlist ? 'Added to wishlist' : 'Removed from wishlist',
      wishlist
    });
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle wishlist.' });
  }
});

export default router;
