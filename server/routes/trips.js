import express from 'express';
import db from '../db/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

export function formatTrip(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    destination: row.destination,
    days: row.days,
    travellers: row.travellers,
    travelStyle: row.travel_style,
    interests: typeof row.interests === 'string' ? JSON.parse(row.interests || '[]') : row.interests || [],
    totalEstimatedCost: row.total_estimated_cost,
    budgetStatus: row.budget_status,
    daysItinerary: typeof row.days_itinerary === 'string' ? JSON.parse(row.days_itinerary || '[]') : row.days_itinerary || [],
    createdAt: row.created_at
  };
}

// GET /api/trips
router.get('/', optionalAuth, (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'usr_demo_01';
    const rows = db.prepare('SELECT * FROM planned_trips WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    const trips = rows.map(formatTrip);
    return res.json({ success: true, count: trips.length, trips });
  } catch (error) {
    console.error('Fetch trips error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve planned trips.' });
  }
});

// POST /api/trips
router.post('/', optionalAuth, (req, res) => {
  try {
    const {
      id,
      destination,
      days,
      travellers,
      travelStyle,
      interests,
      totalEstimatedCost,
      budgetStatus,
      daysItinerary
    } = req.body;

    if (!destination) {
      return res.status(400).json({ success: false, message: 'Destination is required.' });
    }

    const tripId = id || `plan-${Date.now()}`;
    const userId = req.user ? req.user.id : 'usr_demo_01';

    // Remove existing if duplicate id
    db.prepare('DELETE FROM planned_trips WHERE id = ?').run(tripId);

    const stmt = db.prepare(`
      INSERT INTO planned_trips (
        id, user_id, destination, days, travellers, travel_style, interests,
        total_estimated_cost, budget_status, days_itinerary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      tripId,
      userId,
      destination,
      days ? parseInt(days) : 3,
      travellers ? parseInt(travellers) : 1,
      travelStyle || 'Balanced Explorer',
      JSON.stringify(interests || []),
      totalEstimatedCost ? parseInt(totalEstimatedCost) : 30000,
      budgetStatus || 'Within Budget',
      JSON.stringify(daysItinerary || [])
    );

    const created = db.prepare('SELECT * FROM planned_trips WHERE id = ?').get(tripId);
    return res.status(201).json({
      success: true,
      message: 'Itinerary saved to My Trips!',
      trip: formatTrip(created)
    });
  } catch (error) {
    console.error('Save trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save planned trip.' });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', optionalAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM planned_trips WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Planned trip removed.' });
  } catch (error) {
    console.error('Delete trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete trip.' });
  }
});

export default router;
