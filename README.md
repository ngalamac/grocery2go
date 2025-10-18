# G2G Marketplace - Full Stack Application

A complete e-commerce platform with MongoDB backend and React frontend.

> **📋 Conversation Log:** See [CONVERSATION_CONTINUATION_LOG.md](./CONVERSATION_CONTINUATION_LOG.md) for detailed setup and troubleshooting information from conversation `bc-5604aba0-3abc-45b3-aae4-640a90afdc87`.

## Project Structure

```
project/
├── backendcode/          # Express.js + MongoDB backend
└── frontendcode/         # React + TypeScript frontend
```

## Backend Setup (backendcode/)

### Prerequisites
- Node.js v16 or higher
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Navigate to backend directory:
```bash
cd backendcode
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
MONGODB_URI=mongodb+srv://ngalamac:<YOUR_PASSWORD>@cluster0.ciqkcdy.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

**IMPORTANT:** Replace `<YOUR_PASSWORD>` with your actual MongoDB password.

4. Start the development server:
```bash
npm run dev
```

The backend API will be running at `http://localhost:5000`

### API Documentation

See `backendcode/README.md` for complete API documentation.

## Frontend Setup (frontendcode/)

### Installation

1. Navigate to frontend directory:
```bash
cd frontendcode
```
2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured with:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

## Running the Complete Application

1. **Start the Backend** (Terminal 1):
```bash
cd backendcode
npm run dev
```

2. **Start the Frontend** (Terminal 2):
```bash
cd frontendcode
npm run dev
```

3. Open your browser to `http://localhost:5173`

## Database Collections

The MongoDB database includes the following collections:
- **users** - User accounts and authentication
- **products** - Product catalog
- **orders** - Customer orders
- **reviews** - Product reviews
- **coupons** - Discount coupons

## Default Admin Account

To create an admin account, you'll need to register a user first, then manually update the database:

1. Register a new user through the application
2. In MongoDB Atlas, find the user in the `users` collection
3. Set `isAdmin: true` for that user document

Alternatively, use this MongoDB command:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

## Features

- User authentication with JWT
- Product browsing and search
- Shopping cart and wishlist
- Order management
- Review system
- Coupon system
- Admin dashboard for managing products, orders, reviews, and coupons

## Technology Stack

### Backend
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Lucide React for icons

## Building for Production

### Backend
```bash
cd backendcode
npm run build
npm start
```

### Frontend
```bash
cd frontendcode
npm run build
```
The production build will be in `frontendcode/dist/`

## Troubleshooting

### Backend Issues
- Ensure MongoDB connection string has the correct password
- Check that MongoDB Atlas IP whitelist includes your IP
- Verify PORT 5000 is not in use

### Frontend Issues
- Ensure backend is running on port 5000
- Check browser console for API errors
- Verify VITE_API_URL in .env matches backend URL

## Notes
- All localStorage and Supabase dependencies have been removed
- The application now uses MongoDB exclusively for data persistence
- Mock data has been removed - all data comes from the database
