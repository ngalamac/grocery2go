"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', orderController_1.createOrder);
router.get('/track', orderController_1.trackOrder);
router.get('/user', auth_1.authenticate, orderController_1.getUserOrders);
router.get('/:id', orderController_1.getOrderById);
router.get('/', auth_1.authenticate, auth_1.requireAdmin, orderController_1.getAllOrders);
router.patch('/:id/status', auth_1.authenticate, auth_1.requireAdmin, orderController_1.updateOrderStatus);
exports.default = router;
