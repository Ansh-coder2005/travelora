import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { INITIAL_DESTINATIONS } from '../../src/data/destinationsData.js';
import { INITIAL_PACKAGES } from '../../src/data/packagesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../travelora.db');

// Ensure directory exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

export function initDatabase() {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      avatar TEXT,
      role TEXT NOT NULL DEFAULT 'user', -- 'user' or 'admin'
      joined_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Destinations Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS destinations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      region TEXT,
      country TEXT,
      category TEXT,
      rating REAL DEFAULT 4.8,
      review_count INTEGER DEFAULT 0,
      price_per_day INTEGER DEFAULT 0,
      short_description TEXT,
      full_description TEXT,
      banner_image TEXT,
      gallery_images TEXT,          -- JSON Array
      best_time_to_visit TEXT,
      estimated_expenses TEXT,      -- JSON Object
      top_attractions TEXT,         -- JSON Array
      popular_activities TEXT,      -- JSON Array
      travel_tips TEXT,             -- JSON Array
      is_trending INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Packages Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      destination TEXT NOT NULL,
      destination_id TEXT,
      category TEXT,
      duration TEXT,
      days_count INTEGER DEFAULT 1,
      nights_count INTEGER DEFAULT 0,
      price INTEGER NOT NULL,
      original_price INTEGER,
      rating REAL DEFAULT 4.9,
      reviews_count INTEGER DEFAULT 0,
      image TEXT,
      overview TEXT,
      hotel_info TEXT,
      transport_info TEXT,
      inclusions TEXT,              -- JSON Array
      exclusions TEXT,              -- JSON Array
      itinerary TEXT,               -- JSON Array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Bookings Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      booking_id TEXT PRIMARY KEY,
      user_id TEXT,
      package_id TEXT,
      package_title TEXT,
      destination TEXT,
      travel_date TEXT,
      travellers_count INTEGER DEFAULT 1,
      lead_traveller TEXT,          -- JSON Object
      price_per_person INTEGER DEFAULT 0,
      taxes INTEGER DEFAULT 0,
      total_amount INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Confirmed',
      payment_mode TEXT,
      image TEXT,
      booked_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Planned Trips (AI Generated) Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS planned_trips (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      destination TEXT NOT NULL,
      days INTEGER,
      travellers INTEGER,
      travel_style TEXT,
      interests TEXT,               -- JSON Array
      total_estimated_cost INTEGER,
      budget_status TEXT,
      days_itinerary TEXT,          -- JSON Array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Wishlist Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS wishlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      destination_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, destination_id)
    );
  `);

  // 7. Contact Inquiries Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. Newsletter Subscribers Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  // Seed Users
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('[DB] Seeding default users (Admin & Demo Users)...');
    const saltRounds = 10;
    const adminHash = bcrypt.hashSync('admin123', saltRounds);
    const userHash = bcrypt.hashSync('password123', saltRounds);

    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, phone, avatar, role, joined_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 1. Admin
    insertUser.run(
      'usr_admin_01',
      'Travelora Admin',
      'admin@travelora.com',
      adminHash,
      '+91 98000 11111',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      'admin',
      'January 2026'
    );

    // 2. Demo User Ansh
    insertUser.run(
      'usr_demo_01',
      'Ansh Sharma',
      'ansh.sharma@travelora.demo',
      userHash,
      '+91 98765 43210',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      'user',
      'January 2026'
    );

    // 3. Demo User Elena
    insertUser.run(
      'usr_demo_02',
      'Elena Rostova',
      'elena@travelora.demo',
      userHash,
      '+1 415 555 2671',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      'user',
      'February 2026'
    );
  }

  // Seed Destinations
  const destCount = db.prepare('SELECT COUNT(*) as count FROM destinations').get().count;
  if (destCount === 0 && INITIAL_DESTINATIONS && INITIAL_DESTINATIONS.length > 0) {
    console.log(`[DB] Seeding ${INITIAL_DESTINATIONS.length} default destinations...`);
    const insertDest = db.prepare(`
      INSERT INTO destinations (
        id, name, region, country, category, rating, review_count, price_per_day,
        short_description, full_description, banner_image, gallery_images,
        best_time_to_visit, estimated_expenses, top_attractions, popular_activities,
        travel_tips, is_trending, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const d of INITIAL_DESTINATIONS) {
      insertDest.run(
        d.id,
        d.name,
        d.region || '',
        d.country || '',
        d.category || 'General',
        d.rating || 4.8,
        d.reviewCount || 0,
        d.pricePerDay || 3000,
        d.shortDescription || '',
        d.fullDescription || '',
        d.bannerImage || '',
        JSON.stringify(d.galleryImages || []),
        d.bestTimeToVisit || 'All year round',
        JSON.stringify(d.estimatedExpenses || {}),
        JSON.stringify(d.topAttractions || []),
        JSON.stringify(d.popularActivities || []),
        JSON.stringify(d.travelTips || []),
        d.isTrending ? 1 : 0,
        d.featured ? 1 : 0
      );
    }
  }

  // Seed Packages
  const pkgCount = db.prepare('SELECT COUNT(*) as count FROM packages').get().count;
  if (pkgCount === 0 && INITIAL_PACKAGES && INITIAL_PACKAGES.length > 0) {
    console.log(`[DB] Seeding ${INITIAL_PACKAGES.length} default tour packages...`);
    const insertPkg = db.prepare(`
      INSERT INTO packages (
        id, title, destination, destination_id, category, duration, days_count,
        nights_count, price, original_price, rating, reviews_count, image,
        overview, hotel_info, transport_info, inclusions, exclusions, itinerary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of INITIAL_PACKAGES) {
      insertPkg.run(
        p.id,
        p.title,
        p.destination,
        p.destinationId || '',
        p.category || 'General',
        p.duration || '5 Days / 4 Nights',
        p.daysCount || 5,
        p.nightsCount || 4,
        p.price,
        p.originalPrice || Math.round(p.price * 1.2),
        p.rating || 4.9,
        p.reviewsCount || 0,
        p.image || '',
        p.overview || '',
        p.hotelInfo || '',
        p.transportInfo || '',
        JSON.stringify(p.inclusions || []),
        JSON.stringify(p.exclusions || []),
        JSON.stringify(p.itinerary || [])
      );
    }
  }

  // Seed Initial Sample Bookings
  const bookingCount = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
  if (bookingCount === 0) {
    console.log('[DB] Seeding default sample bookings...');
    const insertBooking = db.prepare(`
      INSERT INTO bookings (
        booking_id, user_id, package_id, package_title, destination, travel_date,
        travellers_count, lead_traveller, price_per_person, taxes, total_amount,
        status, payment_mode, image, booked_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBooking.run(
      'TRV-2026-LD789A',
      'usr_demo_01',
      'pkg-ladakh-expedition',
      'Magical Ladakh Expedition',
      'Ladakh, India',
      '2026-11-15',
      2,
      JSON.stringify({
        fullName: 'Ansh Sharma',
        email: 'ansh.sharma@travelora.demo',
        phone: '+91 98765 43210',
        city: 'Delhi, India'
      }),
      28999,
      10439,
      68437,
      'Confirmed',
      'Demo Instant Confirmation (Verified)',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80',
      '2026-10-20T10:30:00.000Z'
    );

    insertBooking.run(
      'TRV-2026-KL412B',
      'usr_demo_01',
      'pkg-kerala-backwaters',
      'Serene Kerala Backwaters & Munnar Hills',
      'Kerala, India',
      '2026-12-05',
      1,
      JSON.stringify({
        fullName: 'Ansh Sharma',
        email: 'ansh.sharma@travelora.demo',
        phone: '+91 98765 43210',
        city: 'Delhi, India'
      }),
      22500,
      4050,
      26550,
      'Confirmed',
      'Demo Instant Confirmation (Verified)',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
      '2026-10-24T14:15:00.000Z'
    );
  }

  // Seed Initial Wishlist
  const wishCount = db.prepare('SELECT COUNT(*) as count FROM wishlists').get().count;
  if (wishCount === 0) {
    const insertWish = db.prepare('INSERT INTO wishlists (user_id, destination_id) VALUES (?, ?)');
    insertWish.run('usr_demo_01', 'ladakh-india');
    insertWish.run('usr_demo_01', 'swiss-alps-switzerland');
    insertWish.run('usr_demo_01', 'bali-indonesia');
  }
}

export default db;
