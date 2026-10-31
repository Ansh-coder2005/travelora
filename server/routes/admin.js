import express from 'express';
import db from '../db/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { formatBooking } from './bookings.js';

const router = express.Router();

// GET /api/admin/stats (Admin only)
router.get('/stats', authenticateToken, requireAdmin, (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalDestinations = db.prepare('SELECT COUNT(*) as count FROM destinations').get().count;
    const totalPackages = db.prepare('SELECT COUNT(*) as count FROM packages').get().count;
    const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;

    const confirmedStats = db.prepare(`
      SELECT 
        COUNT(*) as count,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM bookings 
      WHERE status = 'Confirmed'
    `).get();

    // Category breakdown
    const categoryStats = [
      { category: 'Mountains', bookings: 0, revenue: 0 },
      { category: 'Beaches', bookings: 0, revenue: 0 },
      { category: 'Adventure', bookings: 0, revenue: 0 },
      { category: 'Historical', bookings: 0, revenue: 0 },
      { category: 'Wildlife', bookings: 0, revenue: 0 },
      { category: 'City Tours', bookings: 0, revenue: 0 }
    ];

    const allBookings = db.prepare('SELECT * FROM bookings').all();
    const allPackages = db.prepare('SELECT id, category FROM packages').all();

    allBookings.forEach((b) => {
      const matchedPkg = allPackages.find((p) => p.id === b.package_id);
      const cat = matchedPkg ? matchedPkg.category : 'Mountains';
      const target = categoryStats.find((c) => c.category === cat) || categoryStats[0];
      target.bookings += 1;
      target.revenue += b.total_amount;
    });

    const recentBookings = db.prepare('SELECT * FROM bookings ORDER BY booked_at DESC LIMIT 5').all().map(formatBooking);
    const recentUsers = db.prepare('SELECT id, name, email, role, joined_date, created_at FROM users ORDER BY created_at DESC LIMIT 5').all();

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalDestinations,
        totalPackages,
        totalBookings,
        confirmedBookingsCount: confirmedStats.count,
        totalRevenue: confirmedStats.revenue,
        categoryStats,
        recentBookings,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin analytics.' });
  }
});

export default router;
