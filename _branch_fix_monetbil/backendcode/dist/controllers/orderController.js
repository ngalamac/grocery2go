"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackOrder = exports.updateOrderStatus = exports.getOrderById = exports.getUserOrders = exports.getAllOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const createOrder = async (req, res) => {
    try {
        const orderData = {
            ...req.body,
            userId: req.userId,
            events: [
                {
                    timestamp: new Date(),
                    type: 'status',
                    title: 'Order Placed',
                    description: 'Your order has been received'
                }
            ]
        };
        const order = new Order_1.default(orderData);
        await order.save();
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createOrder = createOrder;
const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;
        const query = {};
        if (status)
            query.status = status;
        const orders = await Order_1.default.find(query).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAllOrders = getAllOrders;
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getUserOrders = getUserOrders;
const getOrderById = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (req, res) => {
    try {
        const { status, eta, riderName, note } = req.body;
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (status)
            order.status = status;
        if (eta)
            order.eta = eta;
        if (riderName)
            order.riderName = riderName;
        const statusTitles = {
            confirmed: 'Order Confirmed',
            shopping: 'Shopping in Progress',
            'out-for-delivery': 'Out for Delivery',
            delivered: 'Delivered',
            cancelled: 'Order Cancelled'
        };
        if (status && statusTitles[status]) {
            order.events.push({
                timestamp: new Date(),
                type: 'status',
                title: statusTitles[status],
                description: note || ''
            });
        }
        else if (note) {
            order.events.push({
                timestamp: new Date(),
                type: 'note',
                title: 'Update',
                description: note
            });
        }
        await order.save();
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const trackOrder = async (req, res) => {
    try {
        const { orderId, email } = req.query;
        if (!orderId || !email) {
            return res.status(400).json({ message: 'Order ID and email are required' });
        }
        const order = await Order_1.default.findOne({
            _id: orderId,
            'customerInfo.email': email
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.trackOrder = trackOrder;
