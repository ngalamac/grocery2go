import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStoreItem {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  isAvailable?: boolean;
}

export interface IStore extends Document {
  name: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  categories: string[]; // e.g., 'Groceries', 'Supermarket'
  rating: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  minOrder?: number;
  address?: string;
  city?: string;
  isOpen: boolean;
  isFeatured?: boolean;
  tags?: string[];
  menu: IStoreItem[];
  createdAt: Date;
  updatedAt: Date;
}

const StoreItemSchema = new Schema<IStoreItem>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  isAvailable: { type: Boolean, default: true },
});

const StoreSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    logo: { type: String },
    coverImage: { type: String },
    categories: [{ type: String, index: true }],
    rating: { type: Number, min: 0, max: 5, default: 0 },
    deliveryTimeMin: { type: Number, required: true },
    deliveryTimeMax: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    minOrder: { type: Number },
    address: { type: String },
    city: { type: String, index: true },
    isOpen: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
    menu: [StoreItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStore>('Store', StoreSchema);
