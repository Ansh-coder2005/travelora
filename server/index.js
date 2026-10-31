import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

import authRoutes from './routes/auth.js';
import destinationRoutes from './routes/destinations.js';
import packageRoutes from './routes/packages.js';
import bookingRoutes from './routes/bookings.js';
import tripRoutes from './routes/trips.js';
import wishlistRoutes from './routes/wishlist.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';
import newsletterRoutes from './routes/newsletter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize SQLite database and seed initial data
initDatabase();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'TRAVELORA REST Backend Engine',
    database: 'SQLite (travelora.db)',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend production build if present
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Server Error]:', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 TRAVELORA Full-Stack Server running on port ${PORT}`);
  console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
  console.log(`🛡️  Admin Account: admin@travelora.com / admin123`);
  console.log(`👤 Demo User Account: ansh.sharma@travelora.demo / password123`);
  console.log(`=======================================================`);
});

// Export app and server for programmatic testing
export { app, server };
