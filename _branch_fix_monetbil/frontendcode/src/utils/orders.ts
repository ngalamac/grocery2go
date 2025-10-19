import { CartItem, AdditionalItem, CustomerInfo, Order } from '../types';
import { ordersApi } from '../services/api';

export async function createOrder(params: {
  userId?: string;
  items: CartItem[];
  additionalItems: AdditionalItem[];
  subtotal: number;
  shoppingFee: number;
  deliveryFee: number;
  total: number;
  budget: number;
  specialInstructions?: string;
  customerInfo: CustomerInfo;
}): Promise<Order> {
  const orderData = {
    items: params.items.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity
    })),
    additionalItems: params.additionalItems,
    subtotal: params.subtotal,
    shoppingFee: params.shoppingFee,
    deliveryFee: params.deliveryFee,
    total: params.total,
    budget: params.budget,
    specialInstructions: params.specialInstructions,
    customerInfo: params.customerInfo
  };

  const response = await ordersApi.create(orderData);

  return {
    id: response._id,
    items: params.items,
    additionalItems: response.additionalItems,
    subtotal: response.subtotal,
    shoppingFee: response.shoppingFee,
    deliveryFee: response.deliveryFee,
    total: response.total,
    status: response.status,
    customerInfo: response.customerInfo,
    specialInstructions: response.specialInstructions,
    budget: response.budget,
    createdAt: response.createdAt,
    eta: response.eta,
    riderName: response.riderName,
    events: response.events?.map((e: any) => ({
      id: e._id,
      timestamp: e.timestamp,
      type: e.type,
      title: e.title,
      description: e.description
    })) || []
  };
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const response = await ordersApi.getById(orderId);
    return {
      id: response._id,
      items: response.items,
      additionalItems: response.additionalItems,
      subtotal: response.subtotal,
      shoppingFee: response.shoppingFee,
      deliveryFee: response.deliveryFee,
      total: response.total,
      status: response.status,
      customerInfo: response.customerInfo,
      specialInstructions: response.specialInstructions,
      budget: response.budget,
      createdAt: response.createdAt,
      eta: response.eta,
      riderName: response.riderName,
      events: response.events?.map((e: any) => ({
        id: e._id,
        timestamp: e.timestamp,
        type: e.type,
        title: e.title,
        description: e.description
      })) || []
    };
  } catch {
    return null;
  }
}
