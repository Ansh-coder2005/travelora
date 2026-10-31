import express from 'express';
import db from '../db/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

export function formatDestination(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    country: row.country,
    category: row.category,
    rating: row.rating,
    reviewCount: row.review_count,
    pricePerDay: row.price_per_day,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    bannerImage: row.banner_image,
    galleryImages: typeof row.gallery_images === 'string' ? JSON.parse(row.gallery_images || '[]') : row.gallery_images || [],
    bestTimeToVisit: row.best_time_to_visit,
    estimatedExpenses: typeof row.estimated_expenses === 'string' ? JSON.parse(row.estimated_expenses || '{}') : row.estimated_expenses || {},
    topAttractions: typeof row.top_attractions === 'string' ? JSON.parse(row.top_attractions || '[]') : row.top_attractions || [],
    popularActivities: typeof row.popular_activities === 'string' ? JSON.parse(row.popular_activities || '[]') : row.popular_activities || [],
    travelTips: typeof row.travel_tips === 'string' ? JSON.parse(row.travel_tips || '[]') : row.travel_tips || [],
    isTrending: Boolean(row.is_trending),
    featured: Boolean(row.featured)
  };
}

// GET /api/destinations
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM destinations WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim()) {
      query += ' AND (name LIKE ? OR region LIKE ? OR country LIKE ? OR short_description LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY is_trending DESC, rating DESC';
    const rows = db.prepare(query).all(...params);
    const destinations = rows.map(formatDestination);

    return res.json({ success: true, count: destinations.length, destinations });
  } catch (error) {
    console.error('Fetch destinations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve destinations.' });
  }
});

// GET /api/destinations/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM destinations WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }
    return res.json({ success: true, destination: formatDestination(row) });
  } catch (error) {
    console.error('Fetch destination detail error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve destination.' });
  }
});

// POST /api/destinations (Admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const {
      id,
      name,
      region,
      country,
      category,
      rating,
      reviewCount,
      pricePerDay,
      shortDescription,
      fullDescription,
      bannerImage,
      galleryImages,
      bestTimeToVisit,
      estimatedExpenses,
      topAttractions,
      popularActivities,
      travelTips,
      isTrending,
      featured
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Destination name is required.' });
    }

    const destId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const stmt = db.prepare(`
      INSERT INTO destinations (
        id, name, region, country, category, rating, review_count, price_per_day,
        short_description, full_description, banner_image, gallery_images,
        best_time_to_visit, estimated_expenses, top_attractions, popular_activities,
        travel_tips, is_trending, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      destId,
      name.trim(),
      region || 'Scenic Region',
      country || 'India',
      category || 'Mountains',
      rating ? parseFloat(rating) : 4.8,
      reviewCount ? parseInt(reviewCount) : 10,
      pricePerDay ? parseInt(pricePerDay) : 3500,
      shortDescription || 'A captivating destination known for scenic vistas.',
      fullDescription || 'Experience memorable views, local hospitality, and world-class tourism amenities.',
      bannerImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      JSON.stringify(galleryImages || ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80']),
      bestTimeToVisit || 'October to April',
      JSON.stringify(estimatedExpenses || { stayPerNight: 2500, mealPerDay: 800, localTravel: 600, activities: 700 }),
      JSON.stringify(topAttractions || [{ name: 'Central Landmark', description: 'Iconic viewpoint.' }]),
      JSON.stringify(popularActivities || ['Sightseeing', 'Cultural Walking Tour']),
      JSON.stringify(travelTips || ['Carry comfortable footwear.']),
      isTrending ? 1 : 0,
      featured ? 1 : 0
    );

    const created = db.prepare('SELECT * FROM destinations WHERE id = ?').get(destId);
    return res.status(201).json({
      success: true,
      message: 'Destination added successfully!',
      destination: formatDestination(created)
    });
  } catch (error) {
    console.error('Create destination error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create destination.' });
  }
});

// PUT /api/destinations/:id (Admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM destinations WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    const {
      name,
      region,
      country,
      category,
      rating,
      reviewCount,
      pricePerDay,
      shortDescription,
      fullDescription,
      bannerImage,
      galleryImages,
      bestTimeToVisit,
      estimatedExpenses,
      topAttractions,
      popularActivities,
      travelTips,
      isTrending,
      featured
    } = req.body;

    const stmt = db.prepare(`
      UPDATE destinations SET
        name = COALESCE(?, name),
        region = COALESCE(?, region),
        country = COALESCE(?, country),
        category = COALESCE(?, category),
        rating = COALESCE(?, rating),
        review_count = COALESCE(?, review_count),
        price_per_day = COALESCE(?, price_per_day),
        short_description = COALESCE(?, short_description),
        full_description = COALESCE(?, full_description),
        banner_image = COALESCE(?, banner_image),
        gallery_images = COALESCE(?, gallery_images),
        best_time_to_visit = COALESCE(?, best_time_to_visit),
        estimated_expenses = COALESCE(?, estimated_expenses),
        top_attractions = COALESCE(?, top_attractions),
        popular_activities = COALESCE(?, popular_activities),
        travel_tips = COALESCE(?, travel_tips),
        is_trending = COALESCE(?, is_trending),
        featured = COALESCE(?, featured)
      WHERE id = ?
    `);

    stmt.run(
      name,
      region,
      country,
      category,
      rating !== undefined ? parseFloat(rating) : null,
      reviewCount !== undefined ? parseInt(reviewCount) : null,
      pricePerDay !== undefined ? parseInt(pricePerDay) : null,
      shortDescription,
      fullDescription,
      bannerImage,
      galleryImages ? JSON.stringify(galleryImages) : null,
      bestTimeToVisit,
      estimatedExpenses ? JSON.stringify(estimatedExpenses) : null,
      topAttractions ? JSON.stringify(topAttractions) : null,
      popularActivities ? JSON.stringify(popularActivities) : null,
      travelTips ? JSON.stringify(travelTips) : null,
      isTrending !== undefined ? (isTrending ? 1 : 0) : null,
      featured !== undefined ? (featured ? 1 : 0) : null,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM destinations WHERE id = ?').get(req.params.id);
    return res.json({
      success: true,
      message: 'Destination updated successfully!',
      destination: formatDestination(updated)
    });
  } catch (error) {
    console.error('Update destination error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update destination.' });
  }
});

// DELETE /api/destinations/:id (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM destinations WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    db.prepare('DELETE FROM destinations WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Destination deleted successfully.' });
  } catch (error) {
    console.error('Delete destination error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete destination.' });
  }
});

export default router;
