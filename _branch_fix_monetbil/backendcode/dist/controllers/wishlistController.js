"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const User_1 = __importDefault(require("../models/User"));
const getWishlist = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId).populate('wishlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.wishlist);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getWishlist = getWishlist;
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        const updatedUser = await User_1.default.findById(req.userId).populate('wishlist');
        res.json(updatedUser?.wishlist);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();
        const updatedUser = await User_1.default.findById(req.userId).populate('wishlist');
        res.json(updatedUser?.wishlist);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.removeFromWishlist = removeFromWishlist;
