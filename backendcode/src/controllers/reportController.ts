import { Request, Response } from 'express';
import Order from '../models/Order';

export const getSummary = async (req: Request, res: Response) => {
  try {
    const [totals] = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSales: { $sum: '$total' },
        },
      },
    ]);

    const since = new Date();
    since.setDate(since.getDate() - 6);

    const daily = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalOrders: totals?.totalOrders ?? 0,
      totalSales: totals?.totalSales ?? 0,
      daily,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load summary', error });
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10));
    const top = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: limit },
    ]);
    res.json(top);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load top products', error });
  }
};
