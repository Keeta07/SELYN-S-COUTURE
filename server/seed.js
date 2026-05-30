import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const products = [
  {
    name: 'Emerald Occasion Gown',
    category: "Women's Wear",
    description: 'Structured satin gown with hand-finished details for formal events.',
    price: 85000,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80'],
    sizes: ['S', 'M', 'L', 'Custom'],
    colors: ['Emerald', 'Ivory'],
    stock: 8,
    featured: true
  },
  {
    name: 'Tailored Senator Set',
    category: "Men's Wear",
    description: 'Clean-cut native wear set with premium fabric and refined embroidery.',
    price: 65000,
    images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80'],
    sizes: ['M', 'L', 'XL', 'Custom'],
    colors: ['Black', 'Wine', 'Cream'],
    stock: 12,
    featured: true
  },
  {
    name: 'Statement Fascinator',
    category: 'Fascinators',
    description: 'Lightweight sculptural fascinator for weddings, church, and ceremonies.',
    price: 28000,
    images: ['https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?auto=format&fit=crop&w=900&q=80'],
    colors: ['Blush', 'Gold', 'Navy'],
    stock: 20,
    featured: true
  },
  {
    name: 'Wide Brim Event Hat',
    category: 'Hats',
    description: 'Elegant brim hat finished for formal day events and special occasions.',
    price: 35000,
    images: ['https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80'],
    colors: ['Black', 'Taupe', 'Ivory'],
    stock: 14
  },
  {
    name: 'Structured Mini Bag',
    category: 'Bags',
    description: 'Polished everyday bag with clean hardware and a compact silhouette.',
    price: 42000,
    images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80'],
    colors: ['Chocolate', 'Black', 'Berry'],
    stock: 10
  },
  {
    name: 'Resin Serving Tray',
    category: 'Resin Art',
    description: 'Hand-poured resin tray with metallic accents for gifting or home styling.',
    price: 32000,
    images: ['https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=900&q=80'],
    colors: ['Pearl', 'Gold'],
    stock: 15
  },
  {
    name: 'School Uniform Package',
    category: 'School Uniforms',
    description: 'Durable school uniform production for nursery, primary, and secondary schools.',
    price: 12000,
    images: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80'],
    sizes: ['Bulk'],
    stock: 500
  },
  {
    name: 'Beginner Fashion Training',
    category: 'Training Services',
    description: 'Hands-on course covering measurements, pattern drafting, cutting, and sewing.',
    price: 120000,
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80'],
    sizes: ['8 weeks', '12 weeks'],
    stock: 30
  }
];

async function seed() {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(products);

  const adminEmail = 'admin@selynscouture.com';
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      name: 'Selyn Admin',
      email: adminEmail,
      password: 'Admin123!',
      role: 'admin'
    });
  }

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
