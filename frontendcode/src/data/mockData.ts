import { Product, Category, Testimonial, Feature } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Fresh Fruit', icon: 'apple', subcategories: ['Tropical', 'Berries', 'Citrus'] },
  { id: '2', name: 'Fresh Meat', icon: 'beef', subcategories: ['Chicken', 'Beef', 'Fish'] },
  { id: '3', name: 'Kitchen Accessories', icon: 'utensils', subcategories: ['Cookware', 'Utensils', 'Storage'] },
  { id: '4', name: 'Dhals', icon: 'wheat', subcategories: ['Lentils', 'Beans', 'Peas'] },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Coconut',
    price: 2.64,
    image: 'https://images.pexels.com/photos/1435307/pexels-photo-1435307.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4,
    category: 'Fresh Fruit',
    type: 'market',
    stock: 50
  },
  {
    id: '2',
    name: 'Papaya',
    price: 1.24,
    image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4,
    category: 'Fresh Fruit',
    type: 'market',
    stock: 30
  },
  {
    id: '3',
    name: 'Cherry',
    price: 10.34,
    image: 'https://images.pexels.com/photos/109275/pexels-photo-109275.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    category: 'Fresh Fruit',
    type: 'market',
    stock: 20
  },
  {
    id: '4',
    name: 'Strawberry',
    price: 3.13,
    image: 'https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    category: 'Fresh Fruit',
    type: 'market',
    stock: 45
  },
  {
    id: '5',
    name: 'Chana Dhal',
    price: 1.56,
    image: 'https://images.pexels.com/photos/4198018/pexels-photo-4198018.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    category: 'Dhals',
    type: 'shop',
    stock: 100
  },
  {
    id: '6',
    name: 'Flax Seeds',
    price: 5.56,
    image: 'https://images.pexels.com/photos/4198017/pexels-photo-4198017.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    category: 'Dhals',
    type: 'shop',
    stock: 80
  },
  {
    id: '7',
    name: 'Parsley',
    price: 1.39,
    image: 'https://images.pexels.com/photos/4113897/pexels-photo-4113897.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4,
    category: 'Fresh Fruit',
    type: 'market',
    stock: 60
  },
  {
    id: '8',
    name: 'Basil Leaves',
    price: 1.88,
    image: 'https://images.pexels.com/photos/4198889/pexels-photo-4198889.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    category: 'Fresh Fruit',
    type: 'market',
    stock: 40
  },
  {
    id: '9',
    name: 'Yellow Zucchini',
    price: 1.89,
    image: 'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    category: 'Fresh Fruit',
    type: 'market',
    stock: 35
  },
  {
    id: '10',
    name: 'Cheese',
    price: 2.43,
    image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4,
    category: 'Fresh Meat',
    type: 'shop',
    stock: 55
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Christina',
    role: 'Art Director',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: 'Ullamcorper malesuada proin libero nunc consequat sagittis id consectetur purus un rit ido.',
    rating: 5,
    approved: true
  },
  {
    id: '2',
    name: 'Michael Johnson',
    role: 'Business Owner',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    text: 'Amazing quality and fast delivery! The fresh produce is always top-notch.',
    rating: 5,
    approved: true
  }
];

export const features: Feature[] = [
  {
    icon: 'truck',
    title: 'Free Shipping',
    description: 'Deliver to door'
  },
  {
    icon: 'clock',
    title: '24x7 Support',
    description: 'In safe hands'
  },
  {
    icon: 'piggy-bank',
    title: 'Big Saving',
    description: 'At lowest price'
  },
  {
    icon: 'rotate-ccw',
    title: 'Money Back',
    description: 'Easy to return'
  },
  {
    icon: 'smartphone',
    title: 'Online Store',
    description: 'A huge branding'
  },
  {
    icon: 'award',
    title: 'Award Winner',
    description: 'For best services'
  }
];

export const quickCategories = [
  { name: 'Fresh Juice', icon: '🥤' },
  { name: 'Carrot', icon: '🥕' },
  { name: 'Fresh Meat', icon: '🥩' },
  { name: 'Ice Cream', icon: '🍦' },
  { name: 'Apple', icon: '🍎' },
  { name: 'Cup Cream', icon: '🥛' },
  { name: 'Breast Meat', icon: '🍗' },
  { name: 'Cool Drinks', icon: '🥤' }
];
