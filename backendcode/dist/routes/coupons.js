"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const couponController_1 = require("../controllers/couponController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/validate/:code', couponController_1.validateCoupon);
router.post('/apply', couponController_1.applyCoupon);
router.get('/', auth_1.authenticate, auth_1.requireAdmin, couponController_1.getAllCoupons);
router.post('/', auth_1.authenticate, auth_1.requireAdmin, couponController_1.createCoupon);
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, couponController_1.updateCoupon);
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, couponController_1.deleteCoupon);
exports.default = router;
