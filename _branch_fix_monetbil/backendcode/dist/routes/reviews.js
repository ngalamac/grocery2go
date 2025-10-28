"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.authenticate, reviewController_1.createReview);
router.get('/product/:productId', reviewController_1.getProductReviews);
router.get('/', auth_1.authenticate, auth_1.requireAdmin, reviewController_1.getAllReviews);
router.patch('/:id/approve', auth_1.authenticate, auth_1.requireAdmin, reviewController_1.approveReview);
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, reviewController_1.deleteReview);
exports.default = router;
