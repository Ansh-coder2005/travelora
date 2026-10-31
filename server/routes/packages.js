import express from 'express';
import db from '../db/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

export function formatPackage(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    destination: row.destination,
    destinationId: row.destination_id,
    category: row.category,
    duration: row.duration,
    daysCount: row.days_count,
    nightsCount: row.nights_count,
    price: row.price,
    originalPrice: row.original_price,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    image: row.image,
    overview: row.overview,
    hotelInfo: row.hotel_info,
    transportInfo: row.transport_info,
    inclusions: typeof row.inclusions === 'string' ? JSON.parse(row.inclusions || '[]') : row.inclusions || [],
    exclusions: typeof row.exclusions === 'string' ? JSON.parse(row.exclusions || '[]') : row.exclusions || [],
    itinerary: typeof row.itinerary === 'string' ? JSON.parse(row.itinerary || '[]') : row.itinerary || []
  };
}

// GET /api/packages
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM packages WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim()) {
      query += ' AND (title LIKE ? OR destination LIKE ? OR overview LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY rating DESC';
    const rows = db.prepare(query).all(...params);
    const packages = rows.map(formatPackage);

    return res.json({ success: true, count: packages.length, packages });
  } catch (error) {
    console.error('Fetch packages error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve tour packages.' });
  }
});

// GET /api/packages/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM packages WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Tour package not found.' });
    }
    return res.json({ success: true, package: formatPackage(row) });
  } catch (error) {
    console.error('Fetch package detail error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve package.' });
  }
});

// POST /api/packages (Admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const {
      id,
      title,
      destination,
      destinationId,
      category,
      duration,
      daysCount,
      nightsCount,
      price,
      originalPrice,
      rating,
      reviewsCount,
      image,
      overview,
      hotelInfo,
      transportInfo,
      inclusions,
      exclusions,
      itinerary
    } = req.body;

    if (!title || !destination) {
      return res.status(400).json({ success: false, message: 'Title and destination are required.' });
    }

    const pkgId = id || 'pkg-' + Date.now();
    const parsedDays = parseInt(daysCount) || parseInt(duration ? duration.charAt(0) : 5) || 5;
    const parsedNights = parseInt(nightsCount) || Math.max(1, parsedDays - 1);
    const parsedPrice = parseInt(price) || 20000;

    const stmt = db.prepare(`
      INSERT INTO packages (
        id, title, destination, destination_id, category, duration, days_count,
        nights_count, price, original_price, rating, reviews_count, image,
        overview, hotel_info, transport_info, inclusions, exclusions, itinerary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      pkgId,
      title.trim(),
      destination.trim(),
      destinationId || '',
      category || 'Mountains',
      duration || `${parsedDays} Days / ${parsedNights} Nights`,
      parsedDays,
      parsedNights,
      parsedPrice,
      originalPrice ? parseInt(originalPrice) : Math.round(parsedPrice * 1.2),
      rating ? parseFloat(rating) : 4.9,
      reviewsCount ? parseInt(reviewsCount) : 25,
      image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      overview || 'Custom curated travel package with premium stays and private transfers.',
      hotelInfo || '4-Star Boutique Resort',
      transportInfo || 'Private Chauffeur Sedan',
      JSON.stringify(inclusions || ['All accommodations', 'Daily buffet breakfast', 'Private transfers']),
      JSON.stringify(exclusions || ['Flight tickets', 'Personal tips & laundry']),
      JSON.stringify(itinerary || [
        { day: 1, title: 'Arrival and Orientation', description: 'Check in and relax.', stay: 'Boutique Hotel' }
      ])
    );

    const created = db.prepare('SELECT * FROM packages WHERE id = ?').get(pkgId);
    return res.status(201).json({
      success: true,
      message: 'Package created successfully!',
      package: formatPackage(created)
    });
  } catch (error) {
    console.error('Create package error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create tour package.' });
  }
});

// PUT /api/packages/:id (Admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM packages WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Tour package not found.' });
    }

    const {
      title,
      destination,
      category,
      duration,
      daysCount,
      nightsCount,
      price,
      originalPrice,
      rating,
      reviewsCount,
      image,
      overview,
      hotelInfo,
      transportInfo,
      inclusions,
      exclusions,
      itinerary
    } = req.body;

    const stmt = db.prepare(`
      UPDATE packages SET
        title = COALESCE(?, title),
        destination = COALESCE(?, destination),
        category = COALESCE(?, category),
        duration = COALESCE(?, duration),
        days_count = COALESCE(?, days_count),
        nights_count = COALESCE(?, nights_count),
        price = COALESCE(?, price),
        original_price = COALESCE(?, original_price),
        rating = COALESCE(?, rating),
        reviews_count = COALESCE(?, reviews_count),
        image = COALESCE(?, image),
        overview = COALESCE(?, overview),
        hotel_info = COALESCE(?, hotel_info),
        transport_info = COALESCE(?, transport_info),
        inclusions = COALESCE(?, inclusions),
        exclusions = COALESCE(?, exclusions),
        itinerary = COALESCE(?, itinerary)
      WHERE id = ?
    `);

    stmt.run(
      title,
      destination,
      category,
      duration,
      daysCount !== undefined ? parseInt(daysCount) : null,
      nightsCount !== undefined ? parseInt(nightsCount) : null,
      price !== undefined ? parseInt(price) : null,
      originalPrice !== undefined ? parseInt(originalPrice) : null,
      rating !== undefined ? parseFloat(rating) : null,
      reviewsCount !== undefined ? parseInt(reviewsCount) : null,
      image,
      overview,
      hotelInfo,
      transportInfo,
      inclusions ? JSON.stringify(inclusions) : null,
      exclusions ? JSON.stringify(exclusions) : null,
      itinerary ? JSON.stringify(itinerary) : null,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM packages WHERE id = ?').get(req.params.id);
    return res.json({
      success: true,
      message: 'Package updated successfully!',
      package: formatPackage(updated)
    });
  } catch (error) {
    console.error('Update package error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update tour package.' });
  }
});

// DELETE /api/packages/:id (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM packages WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Tour package not found.' });
    }

    db.prepare('DELETE FROM packages WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Package deleted successfully.' });
  } catch (error) {
    console.error('Delete package error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete tour package.' });
  }
});

export default router;
