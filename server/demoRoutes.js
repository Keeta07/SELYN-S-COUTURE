import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const demoSecret = process.env.JWT_SECRET || 'local-demo-secret';

const products = [
  {
    _id: 'demo-1',
    name: 'Emerald Occasion Gown',
    category: "Women's Wear",
    description: 'Structured satin gown with hand-finished details for formal events.',
    price: 85000,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80'],
    sizes: ['S', 'M', 'L', 'Custom'],
    colors: ['Emerald', 'Ivory'],
    stock: 8,
    featured: true,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-2',
    name: 'Tailored Senator Set',
    category: "Men's Wear",
    description: 'Clean-cut native wear set with premium fabric and refined embroidery.',
    price: 65000,
    images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80'],
    sizes: ['M', 'L', 'XL', 'Custom'],
    colors: ['Black', 'Wine', 'Cream'],
    stock: 12,
    featured: true,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-3',
    name: 'Statement Fascinator',
    category: 'Fascinators',
    description: 'Lightweight sculptural fascinator for weddings, church, and ceremonies.',
    price: 28000,
    images: ['https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?auto=format&fit=crop&w=900&q=80'],
    colors: ['Blush', 'Gold', 'Navy'],
    stock: 20,
    featured: true,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-4',
    name: 'School Uniform Package',
    category: 'School Uniforms',
    description: 'Durable school uniform production for nursery, primary, and secondary schools.',
    price: 12000,
    images: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80'],
    sizes: ['Bulk'],
    stock: 500,
    featured: false,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-5',
    name: 'Beginner Fashion Training',
    category: 'Training Services',
    description: 'Hands-on course covering measurements, pattern drafting, cutting, and sewing.',
    price: 120000,
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80'],
    sizes: ['8 weeks', '12 weeks'],
    stock: 30,
    featured: false,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const orders = [];
const requests = [];

function requireDemoAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = jwt.verify(token, demoSecret);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    next();
  } catch (_error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== 'admin@selynscouture.com' || password !== 'Admin123!') {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const user = {
    id: 'demo-admin',
    name: 'Selyn Admin',
    email,
    role: 'admin'
  };

  res.json({
    token: jwt.sign({ id: user.id, role: user.role }, demoSecret, { expiresIn: '7d' }),
    user
  });
});

router.get('/products', (req, res) => {
  const { category, search, featured } = req.query;
  const filtered = products.filter((product) => {
    const matchesCategory = !category || category === 'All' || product.category === category;
    const matchesFeatured = !featured || String(product.featured) === featured;
    const text = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    const matchesSearch = !search || text.includes(String(search).toLowerCase());
    return product.isActive && matchesCategory && matchesFeatured && matchesSearch;
  });

  res.json(filtered);
});

router.post('/products', requireDemoAdmin, (req, res) => {
  const product = {
    _id: `demo-${Date.now()}`,
    ...req.body,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  products.unshift(product);
  res.status(201).json(product);
});

router.post('/orders', (req, res) => {
  const order = {
    _id: `order-${Date.now()}`,
    ...req.body,
    total: req.body.items?.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0) || 0,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  orders.unshift(order);
  res.status(201).json(order);
});

router.get('/orders', requireDemoAdmin, (_req, res) => {
  res.json(orders);
});

router.post('/requests', (req, res) => {
  const request = {
    _id: `request-${Date.now()}`,
    ...req.body,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  requests.unshift(request);
  res.status(201).json(request);
});

router.get('/requests', requireDemoAdmin, (_req, res) => {
  res.json(requests);
});

router.get('/dashboard/summary', requireDemoAdmin, (_req, res) => {
  res.json({
    products: products.filter((product) => product.isActive).length,
    orders: orders.length,
    requests: requests.length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0)
  });
});

export default router;
