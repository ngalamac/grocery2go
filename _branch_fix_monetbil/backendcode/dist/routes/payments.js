"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
// Start a Monetbil payment for an order
router.post('/monetbil/start', paymentController_1.startMonetbilPayment);
// Check Monetbil payment status for an order
router.get('/monetbil/check', paymentController_1.checkMonetbilPayment);
// Notification webhook (Monetbil -> our server)
router.post('/monetbil/notify', paymentController_1.monetbilNotify);
exports.default = router;
