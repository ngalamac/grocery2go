import { CartItem, AdditionalItem, CustomerInfo, Order, OrderEvent, OrderStatus } from '../types';

const USER_ORDERS_KEY = (userId: string) => `g2g_orders_${userId}`;
const ALL_ORDERS_KEY = 'g2g_orders_all_full';

export function createOrder(params: {
  userId: string;
  userEmail: string;
  items: CartItem[];
  additionalItems: AdditionalItem[];
  subtotal: number;
  shoppingFee: number;
  deliveryFee: number;
  total: number;
  budget: number;
  specialInstructions?: string;
  customerInfo: CustomerInfo;
}): Order {
  const id = Math.random().toString(36).slice(2, 8).toUpperCase();
  const createdAt = new Date().toISOString();
  const events: OrderEvent[] = [
    { id: `e_${Date.now()}`, timestamp: createdAt, type: 'status', title: 'Order placed' }
  ];
  const order: Order = {
    id,
    items: params.items,
    additionalItems: params.additionalItems,
    subtotal: params.subtotal,
    shoppingFee: params.shoppingFee,
    deliveryFee: params.deliveryFee,
    total: params.total,
    status: 'pending',
    customerInfo: params.customerInfo,
    specialInstructions: params.specialInstructions,
    budget: params.budget,
    createdAt,
    events
  };
  // Save user-specific summary list
  const listRaw = localStorage.getItem(USER_ORDERS_KEY(params.userId)) || '[]';
  const list = JSON.parse(listRaw);
  const summary = { id: order.id, createdAt: order.createdAt, total: order.total, itemsCount: order.items.reduce((n: number, it: CartItem) => n + it.quantity, 0) + order.additionalItems.length, status: order.status };
  localStorage.setItem(USER_ORDERS_KEY(params.userId), JSON.stringify([summary, ...list]));
  // Save full order for admin
  const fullRaw = localStorage.getItem(ALL_ORDERS_KEY) || '[]';
  const full = JSON.parse(fullRaw);
  localStorage.setItem(ALL_ORDERS_KEY, JSON.stringify([{ ...order, userEmail: params.userEmail, userId: params.userId }, ...full]));
  // Save individual order record for quick lookup
  localStorage.setItem(`g2g_order_${order.id}`, JSON.stringify(order));
  return order;
}

export function getOrderById(orderId: string): Order | null {
  try {
    const raw = localStorage.getItem(`g2g_order_${orderId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function updateOrder(orderId: string, patch: Partial<Order>) {
  const existing = getOrderById(orderId);
  if (!existing) return;
  const next: Order = { ...existing, ...patch, id: existing.id };
  localStorage.setItem(`g2g_order_${orderId}`, JSON.stringify(next));
  // Update global list summary status if changed
  try {
    const fullRaw = localStorage.getItem(ALL_ORDERS_KEY) || '[]';
    const full = JSON.parse(fullRaw).map((o: any) => (o.id === orderId ? { ...o, ...next } : o));
    localStorage.setItem(ALL_ORDERS_KEY, JSON.stringify(full));
  } catch {}
}

export function addOrderEvent(orderId: string, event: OrderEvent) {
  const existing = getOrderById(orderId);
  if (!existing) return;
  const events = [{ ...event, id: event.id || `e_${Date.now()}`, timestamp: new Date().toISOString() }, ...(existing.events || [])];
  updateOrder(orderId, { events });
}

export function setOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  addOrderEvent(orderId, { id: `e_${Date.now()}`, timestamp: new Date().toISOString(), type: 'status', title: status, description: note });
  updateOrder(orderId, { status });
}
