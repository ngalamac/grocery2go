import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';


type StoredOrder = {
  id: string;
  createdAt: string;
  total: number;
  itemsCount: number;
  status: 'pending' | 'in-progress' | 'delivered';
};

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(`g2g_orders_${user.id}`) || '[]';
      setOrders(JSON.parse(raw));
    } catch {}
  }, [user]);

  if (!user) {
    return <div className="max-w-4xl mx-auto px-4 py-10 text-center text-gray-600">Login to see your orders.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center text-gray-500">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Order #{o.id}</div>
                <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-sm text-gray-600">{o.itemsCount} items</div>
              <div className="font-semibold text-[#7cb342]">{o.total.toFixed(0)} CFA</div>
              <div className={`text-xs px-2 py-1 rounded ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{o.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

