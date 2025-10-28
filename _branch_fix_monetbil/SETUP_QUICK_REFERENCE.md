# Quick Setup Reference - G2G Marketplace

## 🚀 Quick Start Commands

### Backend Setup
```bash
cd backendcode
npm install
export PORT=5000
npm run dev
```

### Frontend Setup
```bash
cd frontendcode
npm install
npm run dev
```

## 🔧 Environment Files Required

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## ✅ Verification Commands

```bash
# Test backend health
curl http://localhost:5000/health

# Expected response: {"status":"OK","message":"Server is running"}

# Test frontend
# Open http://localhost:5173 in browser
```

## 🔗 Key URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## 📋 Conversation Reference
- **Conversation ID:** bc-5604aba0-3abc-45b3-aae4-640a90afdc87
- **Full Log:** [CONVERSATION_CONTINUATION_LOG.md](./CONVERSATION_CONTINUATION_LOG.md)
- **Status:** ✅ All systems operational

---
*This file preserves key setup information from the conversation continuation.*
