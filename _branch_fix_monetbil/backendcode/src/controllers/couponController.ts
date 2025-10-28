import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.findOne({
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const applyCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOneAndUpdate(
      {
        code: code.toUpperCase(),
        active: true,
        expiresAt: { $gte: new Date() }
      },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon' });
    }

    res.json({
      code: coupon.code,
      discount: coupon.discount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
