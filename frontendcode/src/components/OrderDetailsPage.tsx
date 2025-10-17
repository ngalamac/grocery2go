import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../utils/orders';
import { Check, MapPin, ShoppingBag, Truck } from 'lucide-react';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  useEffect(() => { if (id) setOrder(getOrderById(id)); }, [id]);
  if (!order) return <div className="max-w-3xl mx-auto px-4 py-10">Order not found.</div>;
  const events = (order.events || []).slice().reverse();
  const steps = useMemo(() => {
    const labels: Record<string, string> = {
      pending: 'Order placed',
      confirmed: 'Shopper confirmed',
      shopping: 'Shopping in progress',
      'out-for-delivery': 'Out for delivery',
      delivered: 'Delivered',
    };
    const icons: Record<string, JSX.Element> = {
      pending: <ShoppingBag size={16} />,
      confirmed: <Check size={16} />,
      shopping: <ShoppingBag size={16} />,
      'out-for-delivery': <Truck size={16} />,
      delivered: <MapPin size={16} />,
    } as const;
    const orderStates = ['pending','confirmed','shopping','out-for-delivery','delivered'];
    const currentIdx = Math.max(0, orderStates.indexOf(order.status));
    return orderStates.map((key, idx) => ({
      key,
      label: labels[key],
      icon: icons[key],
      status: idx < currentIdx ? 'done' : idx === currentIdx ? 'current' : 'todo'
    }));
  }, [order.status]);
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h1 className="text-xl font-bold">Order #{order.id}</h1>
          <div className={`text-xs px-2 py-1 rounded ${order.status==='delivered'?'bg-green-100 text-green-700':order.status==='cancelled'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{order.status}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500">Placed</div>
            <div className="font-semibold">{new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500">ETA</div>
            <div className="font-semibold">{order.eta || '—'}</div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500">Rider</div>
            <div className="font-semibold">{order.riderName || '—'}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-2">Items</h2>
            <div className="space-y-2">
              {order.items.map((it: any) => (
                <div key={it.id} className="flex items-center gap-2 border-b pb-2">
                  <img src={it.image} alt={it.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{it.name}</div>
                    <div className="text-xs text-gray-500">Qty {it.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold">{(it.price*it.quantity).toFixed(0)} CFA</div>
                </div>
              ))}
              {order.additionalItems?.map((it: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 border-b pb-2">
                  <div className="w-12 h-12 bg-gray-100 rounded" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{it.name}</div>
                  </div>
                  <div className="text-sm font-semibold">{it.estimatedPrice.toFixed(0)} CFA</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">{order.subtotal.toFixed(0)} CFA</span></div>
              <div className="flex justify-between"><span>Shopping Fee</span><span className="font-semibold">{order.shoppingFee.toFixed(0)} CFA</span></div>
              <div className="flex justify-between"><span>Delivery Fee</span><span className="font-semibold">{order.deliveryFee.toFixed(0)} CFA</span></div>
              <div className="flex justify-between border-t pt-1 text-lg font-bold"><span>Total</span><span className="text-primary-600">{order.total.toFixed(0)} CFA</span></div>
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Tracking</h2>
            {/* Steps */}
            <div className="bg-neutral-50 rounded-lg p-4 mb-4">
              <ol className="flex items-center justify-between">
                {steps.map((s, idx) => (
                  <li key={s.key} className="flex-1 flex items-center">
                    <div className={`flex items-center gap-2 ${s.status==='done'?'text-primary-600':s.status==='current'?'text-neutral-900':'text-neutral-400'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${s.status==='done'?'bg-primary-50 border-primary-200':s.status==='current'?'bg-white border-neutral-300':'bg-white border-neutral-200'}`}>
                        {s.status==='done' ? <Check size={16} /> : s.icon}
                      </div>
                      <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{s.label}</span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`flex-1 h-px mx-2 ${idx < steps.findIndex(x=>x.status==='current') ? 'bg-primary-200' : 'bg-neutral-200'}`} />
                    )}
                  </li>
                ))}
              </ol>
            </div>
            {/* Events */}
            <div className="space-y-3">
              {events.length === 0 && <div className="text-sm text-gray-500">No updates yet.</div>}
              {events.map((e: any) => (
                <div key={e.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${e.type==='status'?'bg-primary-500':'bg-blue-500'}`} />
                  <div>
                    <div className="text-sm font-semibold">{e.title}</div>
                    <div className="text-xs text-gray-500">{new Date(e.timestamp).toLocaleString()}</div>
                    {e.description && <div className="text-sm">{e.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

