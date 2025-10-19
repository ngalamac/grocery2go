import { Request, Response } from 'express';
import Order from '../models/Order';
import { MonetbilOperator, checkPayment, placePayment, createWidgetPayment } from '../services/monetbil';

export const startMonetbilPayment = async (req: Request, res: Response) => {
  console.log('ENTERING startMonetbilPayment FUNCTION');
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

    // Idempotency: only short-circuit if we actually have a paymentId or URL to reuse
    const existingUrl = (order.payment as any)?.paymentUrl || (order.payment as any)?.raw?.payment_url;
    if (
      order.payment?.provider === 'monetbil' &&
      ['initiated', 'pending'].includes(order.payment.status || '') &&
      (order.payment.paymentId || existingUrl)
    ) {
      return res.json({
        status: 'REQUEST_ACCEPTED',
        message: order.payment.message || 'Payment already initiated',
        paymentId: order.payment.paymentId,
        payment_url: existingUrl,
        channel: order.payment.operator,
        channel_name: order.payment.channelName,
        channel_ussd: order.payment.channelUSSD,
      });
    }

    const amount = Math.round(order.total);
    const payment_ref = `ORD-${order._id}`;

    // Concurrency-safe: mark payment as initiated only if not already pending/initiated
    const initiated = await Order.findOneAndUpdate(
      {
        _id: order._id,
        $or: [
          { 'payment.status': { $exists: false } },
          { 'payment.status': { $nin: ['initiated', 'pending'] } },
        ],
      },
      {
        $set: {
          'payment.provider': 'monetbil',
          'payment.paymentRef': payment_ref,
          'payment.status': 'initiated',
          'payment.message': 'Starting Monetbil payment',
          'payment.currency': 'XAF',
          'payment.amount': amount,
          'payment.lastCheckedAt': new Date(),
        },
      },
      { new: true }
    );

    if (!initiated) {
      // Another request started the payment concurrently; return existing state
      const fresh = await Order.findById(order._id);
      return res.json({
        status: 'REQUEST_ACCEPTED',
        message: fresh?.payment?.message || 'Payment already initiated',
        paymentId: fresh?.payment?.paymentId,
        payment_url: (fresh as any)?.payment?.paymentUrl || (fresh as any)?.payment?.raw?.payment_url,
        channel: fresh?.payment?.operator,
        channel_name: fresh?.payment?.channelName,
        channel_ussd: fresh?.payment?.channelUSSD,
      });
    }

    // Prefer Widget API v2.1 to obtain a hosted payment URL
    const widget = await createWidgetPayment({
      amount,
      phone,
      payment_ref,
      return_url: `${process.env.PUBLIC_WEB_BASE_URL || 'https://grocery2go.shop'}/payment/success`,
      cancel_url: `${process.env.PUBLIC_WEB_BASE_URL || 'https://grocery2go.shop'}/payment/cancel`,
      notify_url: process.env.MONETBIL_NOTIFY_URL,
      user: order.customerInfo.email,
    });

    // Fallback to legacy API if widget did not return a URL
    let resp: any = widget?.payment_url
      ? { status: 'REQUEST_ACCEPTED', message: 'Widget URL created', payment_url: widget.payment_url }
      : await placePayment({
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

    await Order.findByIdAndUpdate(order._id, {
      $set: {
        'payment.paymentId': resp.paymentId,
        'payment.status': 'pending',
        'payment.message': resp.message || (widget?.payment_url ? 'Redirect to Monetbil' : undefined),
        'payment.operator': resp.channel,
        'payment.channelName': resp.channel_name,
        'payment.channelUSSD': resp.channel_ussd,
        'payment.paymentUrl': (resp as any)?.payment_url || widget?.payment_url,
        'payment.raw': resp?.payment_url ? { widget: true, ...resp } : resp,
        'payment.lastCheckedAt': new Date(),
      },
    });

    return res.json({
      status: resp.status,
      message: resp.message || 'Redirect to Monetbil',
      paymentId: resp.paymentId,
      payment_url: (resp as any)?.payment_url || widget?.payment_url,
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
    if (!order.payment?.paymentId) {
      // For Widget API flows, we may have a hosted URL without a paymentId yet
      const existingUrl = (order as any)?.payment?.paymentUrl || (order as any)?.payment?.raw?.payment_url;
      if (existingUrl) {
        return res.json({
          orderId: order._id,
          payment: order.payment,
          orderStatus: order.status,
          payment_url: existingUrl,
        });
      }
      return res.status(400).json({ message: 'Payment not initialized' });
    }

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
      payment_url: (order as any)?.payment?.paymentUrl || (order as any)?.payment?.raw?.payment_url,
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

export const cancelMonetbilPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body as { orderId: string };
    if (!orderId) return res.status(400).json({ message: 'orderId is required' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.payment?.status === 'success') {
      return res.status(400).json({ message: 'Cannot cancel a successful payment' });
    }

    order.payment = undefined as any;
    await order.save();

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to cancel payment', error });
  }
};
