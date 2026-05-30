import express from 'express';
import Product from '../models/Product.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { category, search, featured } = req.query;
  const filter = { isActive: true };

  if (category && category !== 'All') filter.category = category;
  if (featured) filter.featured = featured === 'true';
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { category: new RegExp(search, 'i') }
    ];
  }

  const products = await Product.find(filter).sort({ featured: -1, createdAt: -1 });
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.post('/', protect, adminOnly, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product archived' });
});

export default router;
