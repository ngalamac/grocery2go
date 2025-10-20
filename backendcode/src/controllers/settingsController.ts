import { Request, Response } from 'express';
import Settings, { IFeesSettings } from '../models/Settings';

export const getFees = async (req: Request, res: Response) => {
  try {
    let s = await Settings.findOne({ key: 'fees' });
    if (!s) {
      s = await Settings.create({ key: 'fees', fees: {} as any });
    }
    return res.json(s.fees);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load fees', error });
  }
};

export const updateFees = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<IFeesSettings>;

    const allowed: (keyof IFeesSettings)[] = [
      'minServiceFee',
      'stepAfterAmount',
      'stepSizeAmount',
      'stepIncrement',
      'perExtraItemStartingAt',
      'perExtraItemAmount',
      'deliveryFeeFlat',
    ];

    const update: Partial<IFeesSettings> = {};
    for (const k of allowed) {
      if (body[k] != null) (update as any)[k] = Number(body[k]);
    }

    const s = await Settings.findOneAndUpdate(
      { key: 'fees' },
      { $set: Object.fromEntries(Object.entries(update).map(([k, v]) => [`fees.${k}`, v])) },
      { upsert: true, new: true }
    );

    return res.json(s?.fees);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update fees', error });
  }
};
