"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.approveReview = exports.getAllReviews = exports.getProductReviews = exports.createReview = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const Product_1 = __importDefault(require("../models/Product"));
const createReview = async (req, res) => {
    try {
        const { productId, rating, comment, userName } = req.body;
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const review = new Review_1.default({
            productId,
            userId: req.userId,
            userName,
            rating,
            comment,
            approved: false
        });
        await review.save();
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createReview = createReview;
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review_1.default.find({ productId, approved: true }).sort({ createdAt: -1 });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getProductReviews = getProductReviews;
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review_1.default.find().sort({ createdAt: -1 }).populate('productId', 'name');
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAllReviews = getAllReviews;
const approveReview = async (req, res) => {
    try {
        const review = await Review_1.default.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        const reviews = await Review_1.default.find({ productId: review.productId, approved: true });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Product_1.default.findByIdAndUpdate(review.productId, { rating: avgRating });
        res.json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.approveReview = approveReview;
const deleteReview = async (req, res) => {
    try {
        const review = await Review_1.default.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json({ message: 'Review deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteReview = deleteReview;
