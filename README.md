# Selyn's Couture

A deployment-ready full-stack fashion e-commerce web application for Selyn's Couture.

## Stack

- React + Vite frontend
- Tailwind CSS styling
- Node.js + Express API
- MongoDB Atlas via Mongoose
- JWT authentication
- Netlify frontend + Express serverless function

## Features

- Product catalog and category filtering
- Product management API for admins
- WhatsApp checkout links
- Custom order requests
- Training applications
- School uniform bulk order requests
- Admin dashboard for products, orders, custom requests, uniforms, and training leads
- Responsive storefront and dashboard

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and add your MongoDB Atlas URI, JWT secret, and WhatsApp number.

3. Seed the catalog and admin user:

   ```bash
   npm run seed
   ```

   Default seeded admin:

   - Email: `admin@selynscouture.com`
   - Password: `Admin123!`

4. Start the app:

   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173`; backend runs on `http://localhost:5000`.

## Netlify Deployment

Set these environment variables in Netlify:

- `MONGODB_URI`
- `JWT_SECRET`
- `WHATSAPP_NUMBER`
- `VITE_API_URL=/api`
- `VITE_WHATSAPP_NUMBER`

Netlify uses `netlify.toml` to build the React app and route `/api/*` calls to the Express serverless function.
