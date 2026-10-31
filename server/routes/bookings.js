import express from 'express';
import db from '../db/database.js';
import { authenticateToken, optionalAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

function generateBookingId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TRV-2026-${rand}`;
}

export function formatBooking(row) {
  if (!row) return null;
  return {
    bookingId: row.booking_id,
    userId: row.user_id,
    packageId: row.package_id,
    packageTitle: row.package_title,
    destination: row.destination,
    travelDate: row.travel_date,
    travellersCount: row.travellers_count,
    leadTraveller: typeof row.lead_traveller === 'string' ? JSON.parse(row.lead_traveller || '{}') : row.lead_traveller || {},
    pricePerPerson: row.price_per_person,
    taxes: row.taxes,
    totalAmount: row.total_amount,
    status: row.status,
    paymentMode: row.payment_mode,
    image: row.image,
    bookedAt: row.booked_at
  };
}

// GET /api/bookings
router.get('/', optionalAuth, (req, res) => {
  try {
    let rows;
    if (req.user && req.user.role === 'admin') {
      // Admin sees all bookings
      rows = db.prepare('SELECT * FROM bookings ORDER BY booked_at DESC').all();
    } else if (req.user) {
      // User sees their own bookings
      rows = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY booked_at DESC').all(req.user.id);
    } else {
      // Unauthenticated / demo guest fallback
      rows = db.prepare('SELECT * FROM bookings ORDER BY booked_at DESC').all();
    }

    const bookings = rows.map(formatBooking);
    return res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
  }
});

// GET /api/bookings/:id
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM bookings WHERE booking_id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    return res.json({ success: true, booking: formatBooking(row) });
  } catch (error) {
    console.error('Fetch booking detail error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve booking.' });
  }
});

// POST /api/bookings
router.post('/', optionalAuth, (req, res) => {
  try {
    const {
      packageId,
      packageTitle,
      destination,
      travelDate,
      travellersCount,
      leadTraveller,
      pricePerPerson,
      image
    } = req.body;

    if (!destination || !travelDate || !pricePerPerson) {
      return res.status(400).json({ success: false, message: 'Destination, date, and pricing are required.' });
    }

    const count = parseInt(travellersCount) || 1;
    const perPerson = parseInt(pricePerPerson) || 0;
    const baseTotal = perPerson * count;
    const taxes = Math.round(baseTotal * 0.18);
    const totalAmount = baseTotal + taxes;
    const bookingId = generateBookingId();
    const userId = req.user ? req.user.id : (leadTraveller?.email ? `usr_${Date.now()}` : 'usr_demo_01');

    const stmt = db.prepare(`
      INSERT INTO bookings (
        booking_id, user_id, package_id, package_title, destination, travel_date,
        travellers_count, lead_traveller, price_per_person, taxes, total_amount,
        status, payment_mode, image, booked_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const bookedAt = new Date().toISOString();
    stmt.run(
      bookingId,
      userId,
      packageId || 'custom-pkg',
      packageTitle || `${destination} Custom Tour`,
      destination,
      travelDate,
      count,
      JSON.stringify(leadTraveller || {}),
      perPerson,
      taxes,
      totalAmount,
      'Confirmed',
      'Demo Instant Confirmation (Verified)',
      image || 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80',
      bookedAt
    );

    const created = db.prepare('SELECT * FROM bookings WHERE booking_id = ?').get(bookingId);
    return res.status(201).json({
      success: true,
      message: `Booking confirmed! Reference: ${bookingId}`,
      booking: formatBooking(created)
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create booking reservation.' });
  }
});

// PATCH /api/bookings/:id/status
router.patch('/:id/status', optionalAuth, (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const existing = db.prepare('SELECT * FROM bookings WHERE booking_id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    db.prepare('UPDATE bookings SET status = ? WHERE booking_id = ?').run(status, req.params.id);
    const updated = db.prepare('SELECT * FROM bookings WHERE booking_id = ?').get(req.params.id);

    return res.json({
      success: true,
      message: `Booking status updated to ${status}.`,
      booking: formatBooking(updated)
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update booking status.' });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', optionalAuth, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM bookings WHERE booking_id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    db.prepare('DELETE FROM bookings WHERE booking_id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Booking record deleted successfully.' });
  } catch (error) {
    console.error('Delete booking error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete booking.' });
  }
});

export default router;
