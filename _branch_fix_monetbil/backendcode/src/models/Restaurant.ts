import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMenuItem {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string; // e.g., Burgers, Pizza, Drinks
  isAvailable?: boolean;
}

export interface IRestaurant extends Document {
  name: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  cuisine: string[];
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
  menu: IMenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  isAvailable: { type: Boolean, default: true },
});

const RestaurantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    logo: { type: String },
    coverImage: { type: String },
    cuisine: [{ type: String, index: true }],
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
    menu: [MenuItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
