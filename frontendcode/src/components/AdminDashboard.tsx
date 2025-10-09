import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewsContext';
import { useProducts } from '../context/ProductsContext';
import { reviewsApi, ordersApi, couponsApi } from '../services/api';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'reviews' | 'coupons' | 'orders' | 'products'>('reviews');

  if (!user || user.role !== 'admin') {
    return <div className="max-w-4xl mx-auto px-4 py-10 text-center text-gray-600">Admin access required.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['reviews','coupons','orders','products'] as const).map(k => (
          <button key={k} onClick={() => setTab(k)} className={`px-3 py-2 rounded ${tab===k?'bg-[#7cb342] text-white':'bg-gray-100'}`}>
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>
      {tab === 'reviews' && <AdminReviews />}
      {tab === 'coupons' && <AdminCoupons />}
      {tab === 'orders' && <AdminOrders />}
      {tab === 'products' && <AdminProducts />}
    </div>
  );
};

const AdminReviews: React.FC = () => {
  const { toggleApprove } = useReviews();
  const [all, setAll] = useState<any[]>([]);

  const loadReviews = async () => {
    try {
      const data = await reviewsApi.getAll();
      setAll(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const handleApprove = async (id: string) => {
    await toggleApprove(id);
    await loadReviews();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="font-semibold mb-3">Reviews Moderation</h2>
      <div className="space-y-3">
        {all.map(r => (
          <div key={r._id} className="flex items-center justify-between border-b pb-2">
            <div className="text-sm">
              <div className="font-semibold">{r.userName} on Product</div>
              <div className="text-gray-600">{r.comment}</div>
              <div className="text-yellow-500">Rating: {r.rating}/5</div>
            </div>
            <button
              onClick={() => handleApprove(r._id)}
              className={`px-3 py-1 rounded ${r.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              {r.approved ? 'Approved' : 'Approve'}
            </button>
          </div>
        ))}
        {all.length === 0 && <div className="text-sm text-gray-500">No reviews yet.</div>}
      </div>
    </div>
  );
};

const AdminCoupons: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(10);
  const [expiresAt, setExpiresAt] = useState('');

  const loadCoupons = async () => {
    try {
      const data = await couponsApi.getAll();
      setList(data);
    } catch (error) {
      console.error('Failed to load coupons:', error);
    }
  };

  useEffect(() => { loadCoupons(); }, []);

  const add = async () => {
    if (!code || !expiresAt) return;
    try {
      await couponsApi.create({
        code: code.toUpperCase(),
        discount,
        expiresAt: new Date(expiresAt).toISOString(),
        active: true
      });
      setCode('');
      setDiscount(10);
      setExpiresAt('');
      await loadCoupons();
    } catch (error) {
      console.error('Failed to create coupon:', error);
    }
  };

  const remove = async (id: string) => {
    try {
      await couponsApi.delete(id);
      await loadCoupons();
    } catch (error) {
      console.error('Failed to delete coupon:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="font-semibold mb-3">Coupons</h2>
      <div className="flex gap-2 mb-3 flex-wrap">
        <input
          value={code}
          onChange={e=>setCode(e.target.value)}
          placeholder="CODE"
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          value={discount}
          onChange={e=>setDiscount(Number(e.target.value))}
          placeholder="Discount %"
          className="border rounded px-3 py-2 w-32"
        />
        <input
          type="date"
          value={expiresAt}
          onChange={e=>setExpiresAt(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button onClick={add} className="px-3 py-2 bg-[#7cb342] text-white rounded">Add</button>
      </div>
      <div className="space-y-2">
        {list.map(c => (
          <div key={c._id} className="flex items-center justify-between text-sm border-b pb-2">
            <div>
              <span className="font-mono font-bold">{c.code}</span> — {c.discount}% off
              <span className="text-gray-500 ml-2">Expires: {new Date(c.expiresAt).toLocaleDateString()}</span>
            </div>
            <button onClick={()=>remove(c._id)} className="text-red-600">Remove</button>
          </div>
        ))}
        {list.length === 0 && <div className="text-sm text-gray-500">No coupons yet.</div>}
      </div>
    </div>
  );
};

const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, removeProduct } = useProducts();
  const [draft, setDraft] = useState({ name: '', price: 0, image: '', rating: 5, category: 'Pantry', type: 'shop' as 'shop'|'market', description: '', stock: 0 });
  const [editId, setEditId] = useState<string|null>(null);
  const [edit, setEdit] = useState(draft);
  const [preview, setPreview] = useState('');

  const create = async () => {
    if (!draft.name || !draft.price || !draft.image) return;
    await addProduct({ ...draft, price: Number(draft.price) });
    setDraft({ name: '', price: 0, image: '', rating: 5, category: 'Pantry', type: 'shop', description: '', stock: 0 });
    setPreview('');
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <h2 className="font-semibold">Add Product</h2>
        <input value={draft.name} onChange={e=>setDraft({ ...draft, name: e.target.value })} placeholder="Name" className="w-full border rounded px-3 py-2" />
        <input type="number" value={draft.price} onChange={e=>setDraft({ ...draft, price: Number(e.target.value) })} placeholder="Price (CFA)" className="w-full border rounded px-3 py-2" />
        <input value={draft.image} onChange={e=>{ setDraft({ ...draft, image: e.target.value }); setPreview(e.target.value); }} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
        {preview && <img src={preview} alt="preview" className="w-full h-32 object-cover rounded" onError={()=>setPreview('')} />}
        <input value={draft.category} onChange={e=>setDraft({ ...draft, category: e.target.value })} placeholder="Category" className="w-full border rounded px-3 py-2" />
        <select value={draft.type} onChange={e=>setDraft({ ...draft, type: e.target.value as any })} className="w-full border rounded px-3 py-2">
          <option value="shop">Shop</option>
          <option value="market">Market</option>
        </select>
        <input type="number" value={draft.stock} onChange={e=>setDraft({ ...draft, stock: Number(e.target.value) })} placeholder="Stock" className="w-full border rounded px-3 py-2" />
        <textarea value={draft.description} onChange={e=>setDraft({ ...draft, description: e.target.value })} placeholder="Description" className="w-full border rounded px-3 py-2" rows={3} />
        <button onClick={create} className="px-3 py-2 bg-[#7cb342] text-white rounded">Create</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="font-semibold mb-2">Products</h2>
        <div className="max-h-[480px] overflow-auto divide-y">
          {products.map(p => (
            <div key={p.id} className="py-3 flex items-center gap-3">
              <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold text-sm">{p.name}</div>
                <div className="text-xs text-gray-500">{p.price} CFA • {p.category} • {p.type}</div>
              </div>
              <button onClick={()=>{ setEditId(p.id); setEdit({ name: p.name, price: p.price, image: p.image, rating: p.rating, category: p.category, type: p.type, description: p.description || '', stock: p.stock || 0 }); }} className="text-blue-600 text-sm">Edit</button>
              <button onClick={()=>removeProduct(p.id)} className="text-red-600 text-sm">Delete</button>
            </div>
          ))}
          {products.length === 0 && <div className="text-sm text-gray-500">No products.</div>}
        </div>
      </div>
      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setEditId(null)} />
          <div className="relative bg-white w-full max-w-lg mx-4 rounded-lg shadow-xl p-4 space-y-3">
            <h3 className="font-semibold">Edit Product</h3>
            <input value={edit.name} onChange={e=>setEdit({ ...edit, name: e.target.value })} placeholder="Name" className="w-full border rounded px-3 py-2" />
            <input type="number" value={edit.price} onChange={e=>setEdit({ ...edit, price: Number(e.target.value) })} placeholder="Price" className="w-full border rounded px-3 py-2" />
            <input value={edit.image} onChange={e=>setEdit({ ...edit, image: e.target.value })} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
            <input value={edit.category} onChange={e=>setEdit({ ...edit, category: e.target.value })} placeholder="Category" className="w-full border rounded px-3 py-2" />
            <select value={edit.type} onChange={e=>setEdit({ ...edit, type: e.target.value as any })} className="w-full border rounded px-3 py-2">
              <option value="shop">Shop</option>
              <option value="market">Market</option>
            </select>
            <input type="number" value={edit.stock} onChange={e=>setEdit({ ...edit, stock: Number(e.target.value) })} placeholder="Stock" className="w-full border rounded px-3 py-2" />
            <textarea value={edit.description} onChange={e=>setEdit({ ...edit, description: e.target.value })} placeholder="Description" className="w-full border rounded px-3 py-2" rows={3} />
            <div className="flex justify-end gap-2">
              <button onClick={()=>setEditId(null)} className="px-3 py-2 bg-gray-100 rounded">Cancel</button>
              <button onClick={()=>{ updateProduct(editId, edit as any); setEditId(null); }} className="px-3 py-2 bg-[#7cb342] text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await ordersApi.updateStatus(id, { status });
      await loadOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="font-semibold mb-3">All Orders</h2>
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o._id} className="text-sm border-b pb-2">
            <div className="flex items-center justify-between">
              <div className="font-mono">{o._id}</div>
              <div>{new Date(o.createdAt).toLocaleString()}</div>
              <div>{o.items?.length || 0} items</div>
              <div className="font-semibold text-[#7cb342]">{o.total?.toFixed(0)} CFA</div>
              <div className="text-xs">{o.customerInfo?.email}</div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs">Status:</span>
              <select
                value={o.status}
                onChange={e=>updateStatus(o._id, e.target.value)}
                className="border rounded px-2 py-1 text-xs"
              >
                {['pending','confirmed','shopping','out-for-delivery','delivered','cancelled'].map(s=>
                  <option key={s} value={s}>{s}</option>
                )}
              </select>
            </div>
          </div>
        ))}
        {orders.length === 0 && <div className="text-sm text-gray-500">No orders yet.</div>}
      </div>
    </div>
  );
};

export default AdminDashboard;
