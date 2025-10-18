"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const OrderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            productId: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    additionalItems: [
        {
            name: { type: String, required: true },
            estimatedPrice: { type: Number, required: true }
        }
    ],
    subtotal: { type: Number, required: true },
    shoppingFee: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shopping', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    customerInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true }
    },
    specialInstructions: { type: String },
    budget: { type: Number, required: true },
    eta: { type: String },
    riderName: { type: String },
    events: [
        {
            timestamp: { type: Date, default: Date.now },
            type: { type: String, enum: ['status', 'note'], required: true },
            title: { type: String, required: true },
            description: { type: String }
        }
    ],
    payment: {
        provider: { type: String, enum: ['monetbil'], default: 'monetbil' },
        paymentId: { type: String },
        paymentRef: { type: String },
        status: {
            type: String,
            enum: ['initiated', 'pending', 'success', 'failed', 'cancelled', 'refunded'],
            default: 'initiated'
        },
        message: { type: String },
        operator: { type: String },
        channelName: { type: String },
        channelUSSD: { type: String },
        currency: { type: String },
        amount: { type: Number },
        fee: { type: Number },
        revenue: { type: Number },
        raw: { type: mongoose_1.Schema.Types.Mixed },
        lastCheckedAt: { type: Date }
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Order', OrderSchema);
