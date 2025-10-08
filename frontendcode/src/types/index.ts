export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  type: 'shop' | 'market';
  description?: string;
  stock?: number;
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
  subtotal: number;
  shoppingFee: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'in-progress' | 'delivered';
  customerInfo: CustomerInfo;
  extraInfo?: string;
  createdAt: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}
