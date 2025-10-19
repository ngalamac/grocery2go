import { Request, Response } from 'express';
import Order from '../models/Order';
import { MonetbilOperator, checkPayment, placePayment } from '../services/monetbil';

export const startMonetbilPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, phone, operator } = req.body as {
      orderId: string;
      phone: string;
      operator?: MonetbilOperator;
    };

    if (!orderId || !phone) {
      return res.status(400).json({ message: 'orderId and phone are required' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const amount = Math.round(order.total);
    const payment_ref = `ORD-${order._id}`;

    const resp = await placePayment({
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
    } as any;
    await order.save();

    return res.json({
      status: resp.status,
      message: resp.message,
      paymentId: resp.paymentId,
      payment_url: (resp as any).payment_url,
      channel: resp.channel,
      channel_name: resp.channel_name,
      channel_ussd: resp.channel_ussd,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to start payment', error });
  }
};

export const checkMonetbilPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.query as { orderId: string };
    if (!orderId) return res.status(400).json({ message: 'orderId is required' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.payment?.paymentId) return res.status(400).json({ message: 'Payment not initialized' });

    const resp = await checkPayment(order.payment.paymentId);

    if (resp.transaction) {
      const t = resp.transaction;
      let status: 'success' | 'failed' | 'cancelled' | 'refunded' = 'failed';
      if (t.status === 1) status = 'success';
      else if (t.status === -1) status = 'cancelled';
      else if (t.status === -2) status = 'refunded';

      order.payment = {
        ...(order.payment || { provider: 'monetbil' }),
        provider: 'monetbil',
        paymentId: resp.paymentId,
        status,
        message: t.message || resp.message,
        operator: (t as any).mobile_operator_code || order.payment?.operator,
        currency: t.currency,
        amount: t.amount,
        fee: t.fee,
        revenue: t.revenue,
        raw: resp,
        lastCheckedAt: new Date(),
      } as any;

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
    } else {
      order.payment = {
        ...(order.payment || { provider: 'monetbil' }),
        provider: 'monetbil',
        paymentId: resp.paymentId,
        status: 'pending',
        message: resp.message,
        raw: resp,
        lastCheckedAt: new Date(),
      } as any;
      await order.save();
    }

    return res.json({
      orderId: order._id,
      payment: order.payment,
      orderStatus: order.status,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to check payment', error });
  }
};

export const monetbilNotify = async (req: Request, res: Response) => {
  try {
    const body = req.body as any;
    const paymentId = body?.paymentId || body?.payment_id || body?.id;
    const payment_ref = body?.payment_ref;

    let order = null as any;
    if (payment_ref) {
      order = await Order.findOne({ 'payment.paymentRef': payment_ref });
    }

    if (!order && paymentId) {
      order = await Order.findOne({ 'payment.paymentId': paymentId });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found for notification' });
    }

    const id = order.payment?.paymentId || paymentId;
    if (!id) return res.status(400).json({ message: 'Missing paymentId' });

    const resp = await checkPayment(id);

    if (resp.transaction) {
      const t = resp.transaction;
      let status: 'success' | 'failed' | 'cancelled' | 'refunded' = 'failed';
      if (t.status === 1) status = 'success';
      else if (t.status === -1) status = 'cancelled';
      else if (t.status === -2) status = 'refunded';

      order.payment = {
        ...(order.payment || { provider: 'monetbil' }),
        provider: 'monetbil',
        paymentId: resp.paymentId,
        status,
        message: t.message || resp.message,
        operator: (t as any).mobile_operator_code || order.payment?.operator,
        currency: t.currency,
        amount: t.amount,
        fee: t.fee,
        revenue: t.revenue,
        raw: resp,
        lastCheckedAt: new Date(),
      } as any;

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
  } catch (error) {
    return res.status(500).json({ message: 'Failed to process notification', error });
  }
};
