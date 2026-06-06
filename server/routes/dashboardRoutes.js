import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Request from '../models/Request.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', protect, adminOnly, async (_req, res) => {
  const [products, orders, requests, revenue, pendingOrders, customers] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Request.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.countDocuments({ status: { $in: ['new', 'pending', 'processing'] } }),
    Order.distinct('customer.phone')
  ]);

  res.json({
    products,
    orders,
    customers: customers.filter(Boolean).length,
    pendingOrders,
    requests,
    revenue: revenue[0]?.total || 0
  });
});

export default router;
