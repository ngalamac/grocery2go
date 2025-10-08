export interface Product {
  id: string;
  name: string;
  price: number;
  priceRange?: string;
  image: string;
  rating: number;
  category: string;
  type: 'shop' | 'market';
  description?: string;
  stock?: number;
}

export interface AdditionalItem {
  name: string;
  estimatedPrice: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
  approved: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  additionalItems: AdditionalItem[];
  subtotal: number;
  shoppingFee: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  customerInfo: CustomerInfo;
  specialInstructions?: string;
  budget: number;
  createdAt: string;
  eta?: string;
  riderName?: string;
  events?: OrderEvent[];
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shopping' | 'out-for-delivery' | 'delivered' | 'cancelled';

export interface OrderEvent {
  id: string;
  timestamp: string;
  type: 'status' | 'note';
  title: string;
  description?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}
