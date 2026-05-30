import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { customer, items, notes, source = 'website' } = req.body;

  if (!customer?.name || !customer?.phone || !items?.length) {
    return res.status(400).json({ message: 'Customer name, phone, and items are required' });
  }

  const productIds = items.map((item) => item.product).filter(Boolean);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const normalizedItems = items.map((item) => {
    const product = productMap.get(item.product);
    const price = product?.price ?? item.price ?? 0;
    const quantity = Number(item.quantity || 1);

    return {
      product: product?._id,
      name: product?.name ?? item.name,
      price,
      quantity,
      size: item.size,
      color: item.color
    };
  });

  const total = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({ customer, items: normalizedItems, total, notes, source });

  res.status(201).json(order);
});

router.get('/', protect, adminOnly, async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

export default router;
