import mongoose, { Schema, Document } from 'mongoose';

interface ICartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface IAdditionalItem {
  name: string;
  estimatedPrice: number;
}

interface ICustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

interface IOrderEvent {
  timestamp: Date;
  type: 'status' | 'note';
  title: string;
  description?: string;
}

export interface IOrder extends Document {
  userId?: string;
  items: ICartItem[];
  additionalItems: IAdditionalItem[];
  subtotal: number;
  shoppingFee: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shopping' | 'out-for-delivery' | 'delivered' | 'cancelled';
  customerInfo: ICustomerInfo;
  specialInstructions?: string;
  budget: number;
  eta?: string;
  riderName?: string;
  events: IOrderEvent[];
  payment?: {
    provider: 'monetbil';
    paymentId?: string;
    paymentRef?: string;
    status?: 'initiated' | 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded';
    message?: string;
    operator?: string;
    channelName?: string;
    channelUSSD?: string;
    currency?: string;
    amount?: number;
    fee?: number;
    revenue?: number;
    raw?: any;
    lastCheckedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    additionalItems: [
      {
        name: { type: String, required: true },
        estimatedPrice: { type: Number, required: true }
      }
    ],
    subtotal: { type: Number, required: true },
    shoppingFee: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shopping', 'out-for-delivery', 'delivered', 'cancelled'],
      default: 'pending'
    },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true }
    },
    specialInstructions: { type: String },
    budget: { type: Number, required: true },
    eta: { type: String },
    riderName: { type: String },
    events: [
      {
        timestamp: { type: Date, default: Date.now },
        type: { type: String, enum: ['status', 'note'], required: true },
        title: { type: String, required: true },
        description: { type: String }
      }
    ],
    payment: {
      provider: { type: String, enum: ['monetbil'], default: 'monetbil' },
      paymentId: { type: String },
      paymentRef: { type: String },
      status: {
        type: String,
        enum: ['initiated', 'pending', 'success', 'failed', 'cancelled', 'refunded'],
        default: 'initiated'
      },
      message: { type: String },
      operator: { type: String },
      channelName: { type: String },
      channelUSSD: { type: String },
      currency: { type: String },
      amount: { type: Number },
      fee: { type: Number },
      revenue: { type: Number },
      raw: { type: Schema.Types.Mixed },
      lastCheckedAt: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
