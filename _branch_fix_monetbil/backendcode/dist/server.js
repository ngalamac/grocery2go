"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const restaurants_1 = __importDefault(require("./routes/restaurants"));
const coupons_1 = __importDefault(require("./routes/coupons"));
const wishlist_1 = __importDefault(require("./routes/wishlist"));
const payments_1 = __importDefault(require("./routes/payments"));
dotenv_1.default.config();
const app = (0, express_1.default)();
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
        }
        else if (allowedOrigins.length === 0 && process.env.NODE_ENV !== 'production') {
            // Allow all origins in development if ALLOWED_ORIGINS is not set
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, database_1.connectDB)();
app.use('/api/auth', auth_1.default);
app.use('/api/products', products_1.default);
app.use('/api/orders', orders_1.default);
app.use('/api/reviews', reviews_1.default);
app.use('/api/coupons', coupons_1.default);
app.use('/api/wishlist', wishlist_1.default);
app.use('/api/restaurants', restaurants_1.default);
app.use('/api/payments', payments_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});
// Only start the server when this file is executed directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
exports.default = app;
