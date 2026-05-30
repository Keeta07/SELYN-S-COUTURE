import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    size: String,
    color: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: String,
      phone: { type: String, required: true },
      address: String
    },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    notes: String,
    status: {
      type: String,
      enum: ['new', 'confirmed', 'in production', 'ready', 'completed', 'cancelled'],
      default: 'new'
    },
    source: { type: String, enum: ['website', 'whatsapp'], default: 'website' }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
