import express from 'express';
import Request from '../models/Request.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const request = await Request.create(req.body);
  res.status(201).json(request);
});

router.get('/', protect, adminOnly, async (_req, res) => {
  const requests = await Request.find().sort({ createdAt: -1 });
  res.json(requests);
});

router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!request) return res.status(404).json({ message: 'Request not found' });
  res.json(request);
});

export default router;
