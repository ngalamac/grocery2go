import mongoose, { Schema, Document } from 'mongoose';

export interface IFeesSettings {
  minServiceFee: number;
  stepAfterAmount: number;
  stepSizeAmount: number;
  stepIncrement: number;
  perExtraItemStartingAt: number;
  perExtraItemAmount: number;
  deliveryFeeFlat: number;
}

export interface ISettings extends Document {
  key: 'fees';
  fees: IFeesSettings;
  updatedAt: Date;
}

const FeesSchema = new Schema<IFeesSettings>({
  minServiceFee: { type: Number, required: true, default: 500 },
  stepAfterAmount: { type: Number, required: true, default: 10000 },
  stepSizeAmount: { type: Number, required: true, default: 5000 },
  stepIncrement: { type: Number, required: true, default: 100 },
  perExtraItemStartingAt: { type: Number, required: true, default: 10 },
  perExtraItemAmount: { type: Number, required: true, default: 50 },
  deliveryFeeFlat: { type: Number, required: true, default: 1000 },
});

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, enum: ['fees'], unique: true, required: true },
    fees: { type: FeesSchema, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
