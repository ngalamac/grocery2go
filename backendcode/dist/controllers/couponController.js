"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.getAllCoupons = exports.applyCoupon = exports.validateCoupon = void 0;
const Coupon_1 = __importDefault(require("../models/Coupon"));
const validateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const coupon = await Coupon_1.default.findOne({
            code: code.toUpperCase(),
            active: true,
            expiresAt: { $gte: new Date() }
        });
        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or expired coupon' });
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }
        res.json({
            code: coupon.code,
            discount: coupon.discount
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.validateCoupon = validateCoupon;
const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon_1.default.findOneAndUpdate({
            code: code.toUpperCase(),
            active: true,
            expiresAt: { $gte: new Date() }
        }, { $inc: { usedCount: 1 } }, { new: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon' });
        }
        res.json({
            code: coupon.code,
            discount: coupon.discount
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.applyCoupon = applyCoupon;
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon_1.default.find().sort({ createdAt: -1 });
        res.json(coupons);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAllCoupons = getAllCoupons;
const createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon_1.default(req.body);
        await coupon.save();
        res.status(201).json(coupon);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createCoupon = createCoupon;
const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.json(coupon);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateCoupon = updateCoupon;
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon_1.default.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.json({ message: 'Coupon deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteCoupon = deleteCoupon;
