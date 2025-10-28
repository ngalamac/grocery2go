# E-Commerce Backend API

Backend API built with Express.js and MongoDB for the G2G marketplace application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
MONGODB_URI=mongodb+srv://ngalamac:<your-password>@cluster0.ciqkcdy.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

Replace `<your-password>` with your actual MongoDB password.

## Development

Run the development server:
```bash
npm run dev
```

## Production

Build and start:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update user profile (authenticated)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/user` - Get user orders (authenticated)
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status (admin only)
- `GET /api/orders/track?orderId=&email=` - Track order

### Reviews
- `POST /api/reviews` - Create review (authenticated)
- `GET /api/reviews/product/:productId` - Get product reviews
- `GET /api/reviews` - Get all reviews (admin only)
- `PATCH /api/reviews/:id/approve` - Approve review (admin only)
- `DELETE /api/reviews/:id` - Delete review (admin only)

### Coupons
- `GET /api/coupons/validate/:code` - Validate coupon code
- `POST /api/coupons/apply` - Apply coupon
- `GET /api/coupons` - Get all coupons (admin only)
- `POST /api/coupons` - Create coupon (admin only)
- `PUT /api/coupons/:id` - Update coupon (admin only)
- `DELETE /api/coupons/:id` - Delete coupon (admin only)

### Wishlist
- `GET /api/wishlist` - Get user wishlist (authenticated)
- `POST /api/wishlist` - Add to wishlist (authenticated)
- `DELETE /api/wishlist/:productId` - Remove from wishlist (authenticated)
