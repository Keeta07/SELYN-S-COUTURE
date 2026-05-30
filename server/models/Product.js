import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Men's Wear",
        "Women's Wear",
        'Fascinators',
        'Hats',
        'Bags',
        'Home Accessories',
        'Resin Art',
        'School Uniforms',
        'Training Services'
      ]
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
