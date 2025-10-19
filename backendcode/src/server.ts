import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import reviewRoutes from './routes/reviews';
import restaurantRoutes from './routes/restaurants';
import couponRoutes from './routes/coupons';
import wishlistRoutes from './routes/wishlist';
import paymentRoutes from './routes/payments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS using ALLOWED_ORIGINS (comma-separated) or allow all in development
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = allowedOriginsEnv
  .split(',')
  .map((o) => o.trim())
  .filter((o) => o.length > 0);

const corsOptions = {
  origin: (origin, callback) => {
    // In development, or for requests with no origin (e.g., mobile apps, curl), allow
    if (!origin || (allowedOrigins.length > 0 && allowedOrigins.includes(origin))) {
      callback(null, true);
    } else if (allowedOrigins.length === 0 && process.env.NODE_ENV !== 'production') {
      // Allow all origins in development if ALLOWED_ORIGINS is not set
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Only start the server when this file is executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
