import { Request, Response } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response) => {
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

    const order = new Order(orderData);
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const query: any = {};

    if (status) query.status = status;

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status, eta, riderName, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (eta) order.eta = eta;
    if (riderName) order.riderName = riderName;

    const statusTitles: Record<string, string> = {
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
    } else if (note) {
      order.events.push({
        timestamp: new Date(),
        type: 'note',
        title: 'Update',
        description: note
      });
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, email } = req.query;

    if (!orderId || !email) {
      return res.status(400).json({ message: 'Order ID and email are required' });
    }

    const order = await Order.findOne({
      _id: orderId,
      'customerInfo.email': email
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
