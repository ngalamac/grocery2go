import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  priceRange?: string;
  image: string;
  rating: number;
  category: string;
  type: 'shop' | 'market';
  description?: string;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    priceRange: { type: String },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    category: { type: String, required: true },
    type: { type: String, enum: ['shop', 'market'], required: true },
    description: { type: String },
    stock: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
