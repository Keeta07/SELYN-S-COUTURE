import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import demoRoutes from './demoRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use((req, _res, next) => {
  if (req.url.startsWith('/.netlify/functions/api/')) {
    req.url = req.url.replace('/.netlify/functions/api/', '/api/');
  }

  if (!req.url.startsWith('/api') && req.url !== '/') {
    req.url = `/api${req.url}`;
  }

  next();
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    name: "Selyn's Couture API",
    mode: process.env.MONGODB_URI ? 'mongodb' : 'local-demo'
  });
});

if (!process.env.MONGODB_URI) {
  app.use('/api', demoRoutes);
} else {
  app.use(async (_req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (_error) {
      res.status(500).json({ message: 'Database connection failed' });
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/requests', requestRoutes);
  app.use('/api/dashboard', dashboardRoutes);
}

app.use((error, _req, res, _next) => {
  const status = error.name === 'ValidationError' ? 400 : 500;
  res.status(status).json({ message: error.message || 'Server error' });
});

export default app;
