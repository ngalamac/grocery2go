"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monetbilNotify = exports.checkMonetbilPayment = exports.startMonetbilPayment = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const monetbil_1 = require("../services/monetbil");
const startMonetbilPayment = async (req, res) => {
    try {
        const { orderId, phone, operator } = req.body;
        if (!orderId || !phone) {
            return res.status(400).json({ message: 'orderId and phone are required' });
        }
        const order = await Order_1.default.findById(orderId);
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        const amount = Math.round(order.total);
        const payment_ref = `ORD-${order._id}`;
        const resp = await (0, monetbil_1.placePayment)({
            amount,
            phonenumber: phone,
            operator,
            currency: 'XAF',
            country: 'CM',
            payment_ref,
            first_name: order.customerInfo.name,
            email: order.customerInfo.email,
            user: order.userId?.toString(),
        });
        order.payment = {
            ...(order.payment || { provider: 'monetbil' }),
            provider: 'monetbil',
            paymentRef: payment_ref,
            paymentId: resp.paymentId,
            status: 'pending',
            message: resp.message,
            operator: resp.channel,
            channelName: resp.channel_name,
            channelUSSD: resp.channel_ussd,
            currency: 'XAF',
            amount,
            raw: resp,
            lastCheckedAt: new Date(),
        };
        await order.save();
        return res.json({
            status: resp.status,
            message: resp.message,
            paymentId: resp.paymentId,
            payment_url: resp.payment_url,
            channel: resp.channel,
            channel_name: resp.channel_name,
            channel_ussd: resp.channel_ussd,
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to start payment', error });
    }
};
exports.startMonetbilPayment = startMonetbilPayment;
const checkMonetbilPayment = async (req, res) => {
    try {
        const { orderId } = req.query;
        if (!orderId)
            return res.status(400).json({ message: 'orderId is required' });
        const order = await Order_1.default.findById(orderId);
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        if (!order.payment?.paymentId)
            return res.status(400).json({ message: 'Payment not initialized' });
        const resp = await (0, monetbil_1.checkPayment)(order.payment.paymentId);
        if (resp.transaction) {
            const t = resp.transaction;
            let status = 'failed';
            if (t.status === 1)
                status = 'success';
            else if (t.status === -1)
                status = 'cancelled';
            else if (t.status === -2)
                status = 'refunded';
            order.payment = {
                ...(order.payment || { provider: 'monetbil' }),
                provider: 'monetbil',
                paymentId: resp.paymentId,
                status,
                message: t.message || resp.message,
                operator: t.mobile_operator_code || order.payment?.operator,
                currency: t.currency,
                amount: t.amount,
                fee: t.fee,
                revenue: t.revenue,
                raw: resp,
                lastCheckedAt: new Date(),
            };
            if (status === 'success' && order.status === 'pending') {
                order.status = 'confirmed';
                order.events.push({
                    timestamp: new Date(),
                    type: 'status',
                    title: 'Payment Confirmed',
                    description: 'Payment received via Monetbil',
                });
            }
            await order.save();
        }
        else {
            order.payment = {
                ...(order.payment || { provider: 'monetbil' }),
                provider: 'monetbil',
                paymentId: resp.paymentId,
                status: 'pending',
                message: resp.message,
                raw: resp,
                lastCheckedAt: new Date(),
            };
            await order.save();
        }
        return res.json({
            orderId: order._id,
            payment: order.payment,
            orderStatus: order.status,
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to check payment', error });
    }
};
exports.checkMonetbilPayment = checkMonetbilPayment;
const monetbilNotify = async (req, res) => {
    try {
        const body = req.body;
        const paymentId = body?.paymentId || body?.payment_id || body?.id;
        const payment_ref = body?.payment_ref;
        let order = null;
        if (payment_ref) {
            order = await Order_1.default.findOne({ 'payment.paymentRef': payment_ref });
        }
        if (!order && paymentId) {
            order = await Order_1.default.findOne({ 'payment.paymentId': paymentId });
        }
        if (!order) {
            return res.status(404).json({ message: 'Order not found for notification' });
        }
        const id = order.payment?.paymentId || paymentId;
        if (!id)
            return res.status(400).json({ message: 'Missing paymentId' });
        const resp = await (0, monetbil_1.checkPayment)(id);
        if (resp.transaction) {
            const t = resp.transaction;
            let status = 'failed';
            if (t.status === 1)
                status = 'success';
            else if (t.status === -1)
                status = 'cancelled';
            else if (t.status === -2)
                status = 'refunded';
            order.payment = {
                ...(order.payment || { provider: 'monetbil' }),
                provider: 'monetbil',
                paymentId: resp.paymentId,
                status,
                message: t.message || resp.message,
                operator: t.mobile_operator_code || order.payment?.operator,
                currency: t.currency,
                amount: t.amount,
                fee: t.fee,
                revenue: t.revenue,
                raw: resp,
                lastCheckedAt: new Date(),
            };
            if (status === 'success' && order.status === 'pending') {
                order.status = 'confirmed';
                order.events.push({
                    timestamp: new Date(),
                    type: 'status',
                    title: 'Payment Confirmed',
                    description: 'Payment received via Monetbil',
                });
            }
            await order.save();
        }
        return res.json({ ok: true });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to process notification', error });
    }
};
exports.monetbilNotify = monetbilNotify;
