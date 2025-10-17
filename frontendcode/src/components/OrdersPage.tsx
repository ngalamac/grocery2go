import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


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
  const navigate = useNavigate();

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

  const percentByStatus = useMemo(() => ({
    'pending': 0.25,
    'in-progress': 0.6,
    'delivered': 1
  }), []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-10 text-center text-gray-500">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow transition">
              <div className="cursor-pointer" onClick={()=>navigate(`/dashboard/order/${o.id}`)}>
                <div className="font-semibold">Order #{o.id}</div>
                <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">{o.itemsCount} items</div>
                <div className="font-semibold text-primary-600">{o.total.toFixed(0)} CFA</div>
                <div className={`text-xs px-2 py-1 rounded ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{o.status}</div>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden w-full">
                  <div className="h-full bg-primary-500" style={{ width: `${(percentByStatus as any)[o.status]*100}%` }} />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={()=>navigate(`/dashboard/order/${o.id}`)} className="text-sm text-primary-700">Track</button>
                  <span className="text-neutral-300">•</span>
                  <button onClick={()=>navigate('/shop')} className="text-sm text-primary-700">Reorder</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

