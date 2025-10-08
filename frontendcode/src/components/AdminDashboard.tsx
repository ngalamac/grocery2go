import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewsContext';
import { useCoupon } from '../context/CouponContext';
import { useProducts } from '../context/ProductsContext';
import { getOrderById, setOrderStatus, updateOrder, addOrderEvent } from '../utils/orders';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'reviews' | 'coupons' | 'settings' | 'featured' | 'orders' | 'products' | 'users'>('reviews');
  if (!user || user.role !== 'admin') {
    return <div className="max-w-4xl mx-auto px-4 py-10 text-center text-gray-600">Admin access required.</div>;
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['reviews','coupons','settings','featured','orders','products','users'] as const).map(k => (
          <button key={k} onClick={() => setTab(k)} className={`px-3 py-2 rounded ${tab===k?'bg-[#7cb342] text-white':'bg-gray-100'}`}>{k}</button>
        ))}
      </div>
      {tab === 'reviews' && <AdminReviews />}
      {tab === 'coupons' && <AdminCoupons />}
      {tab === 'settings' && <AdminSettings />}
      {tab === 'featured' && <AdminFeatured />}
      {tab === 'orders' && <AdminOrders />}
      {tab === 'products' && <AdminProducts />}
      {tab === 'users' && <AdminUsers />}
    </div>
  );
};

const AdminReviews: React.FC = () => {
  const { toggleApprove } = useReviews();
  const [all, setAll] = useState<any[]>([]);
  useEffect(() => {
    try { setAll(JSON.parse(localStorage.getItem('g2g_reviews') || '[]')); } catch {}
  }, []);
  const refresh = () => { try { setAll(JSON.parse(localStorage.getItem('g2g_reviews') || '[]')); } catch {} };
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="font-semibold mb-3">Reviews Moderation</h2>
      <div className="space-y-3">
        {all.map(r => (
          <div key={r.id} className="flex items-center justify-between border-b pb-2">
            <div className="text-sm">
              <div className="font-semibold">{r.author} on {r.productId}</div>
              <div className="text-gray-600">{r.text}</div>
            </div>
            <button onClick={() => { toggleApprove(r.id); refresh(); }} className={`px-3 py-1 rounded ${r.approved ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{r.approved ? 'Unapprove' : 'Approve'}</button>
          </div>
        ))}
        {all.length === 0 && <div className="text-sm text-gray-500">No reviews yet.</div>}
      </div>
    </div>
  );
};

const AdminCoupons: React.FC = () => {
  const { applied } = useCoupon();
  const [list, setList] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('g2g_coupons') || '[]'); } catch { return []; }
  });
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent'|'fixed'>('percent');
  const [value, setValue] = useState(10);
  const save = (next: any[]) => { setList(next); try { localStorage.setItem('g2g_coupons', JSON.stringify(next)); } catch {} };
  const add = () => { if (!code) return; save([{ code: code.toUpperCase(), type, value }, ...list]); setCode(''); };
  const remove = (c: string) => save(list.filter(x => x.code !== c));
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="font-semibold mb-3">Coupons</h2>
      <div className="flex gap-2 mb-3">
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="CODE" className="border rounded px-3 py-2" />
        <select value={type} onChange={e=>setType(e.target.value as any)} className="border rounded px-2">
          <option value="percent">Percent</option>
          <option value="fixed">Fixed (CFA)</option>
        </select>
        <input type="number" value={value} onChange={e=>setValue(Number(e.target.value))} className="border rounded px-3 py-2 w-24" />
        <button onClick={add} className="px-3 py-2 bg-[#7cb342] text-white rounded">Add</button>
      </div>
      <div className="space-y-2">
        {list.map(c => (
          <div key={c.code} className="flex items-center justify-between text-sm border-b pb-2">
            <div><span className="font-mono">{c.code}</span> — {c.type} {c.value}</div>
            <button onClick={()=>remove(c.code)} className="text-red-600">Remove</button>
          </div>
        ))}
        {list.length === 0 && <div className="text-sm text-gray-500">No coupons yet.</div>}
      </div>
      {applied && <div className="text-xs text-gray-500 mt-2">Currently applied in checkout: {applied.code}</div>}
    </div>
  );
};

const AdminSettings: React.FC = () => {
  const [about, setAbout] = useState('');
  const [contact, setContact] = useState('');
  useEffect(() => {
    try {
      setAbout(localStorage.getItem('g2g_setting_about') || '');
      setContact(localStorage.getItem('g2g_setting_contact') || '');
    } catch {}
  }, []);
  const save = () => {
    try {
      localStorage.setItem('g2g_setting_about', about);
      localStorage.setItem('g2g_setting_contact', contact);
      alert('Saved');
    } catch {}
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
      <h2 className="font-semibold">Site Settings</h2>
      <div>
        <label className="block text-sm font-medium mb-1">About blurb</label>
        <textarea value={about} onChange={e=>setAbout(e.target.value)} className="w-full border rounded px-3 py-2" rows={4} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contact notice</label>
        <textarea value={contact} onChange={e=>setContact(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
      </div>
      <button onClick={save} className="px-3 py-2 bg-[#7cb342] text-white rounded">Save</button>
    </div>
  );
};

const AdminFeatured: React.FC = () => {
  const [ids, setIds] = useState<string>('');
  useEffect(() => { try { setIds(localStorage.getItem('g2g_featured_ids') || ''); } catch {} }, []);
  const save = () => { try { localStorage.setItem('g2g_featured_ids', ids); alert('Saved'); } catch {} };
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
      <h2 className="font-semibold">Featured Products</h2>
      <p className="text-sm text-gray-500">Enter product IDs (comma-separated) to feature on Home.</p>
      <input value={ids} onChange={e=>setIds(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="e.g. 1,2,3,4" />
      <button onClick={save} className="px-3 py-2 bg-[#7cb342] text-white rounded">Save</button>
    </div>
  );
};

const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, removeProduct } = useProducts();
  const [draft, setDraft] = useState({ name: '', price: 0, image: '', rating: 5, category: 'Pantry', type: 'shop' as 'shop'|'market', description: '' });
  const [preview, setPreview] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ name: '', price: 0, image: '', rating: 5, category: 'Pantry', type: 'shop' as 'shop'|'market', description: '' });
  const create = () => {
    if (!draft.name || !draft.image) return;
    addProduct({ ...draft, price: Number(draft.price) });
    setDraft({ name: '', price: 0, image: '', rating: 5, category: 'Pantry', type: 'shop', description: '' });
    setPreview('');
  };
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
        <h2 className="font-semibold">Add Product</h2>
        <input value={draft.name} onChange={e=>setDraft({ ...draft, name: e.target.value })} placeholder="Name" className="w-full border rounded px-3 py-2" />
        <input type="number" value={draft.price} onChange={e=>setDraft({ ...draft, price: Number(e.target.value) })} placeholder="Price (CFA)" className="w-full border rounded px-3 py-2" />
        <input value={draft.image} onChange={e=>{ setDraft({ ...draft, image: e.target.value }); setPreview(e.target.value); }} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
        {preview && (
          <img src={preview} alt="preview" className="w-full h-32 object-cover rounded" onError={()=>setPreview('')} />
        )}
        <input value={draft.category} onChange={e=>setDraft({ ...draft, category: e.target.value })} placeholder="Category" className="w-full border rounded px-3 py-2" />
        <select value={draft.type} onChange={e=>setDraft({ ...draft, type: e.target.value as any })} className="w-full border rounded px-3 py-2">
          <option value="shop">Shop</option>
          <option value="market">Market</option>
        </select>
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
              <button onClick={()=>{ setEditId(p.id); setEdit({ name: p.name, price: p.price, image: p.image, rating: p.rating, category: p.category, type: p.type, description: p.description || '' }); }} className="text-blue-600 text-sm">Edit</button>
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
  useEffect(() => { try { setOrders(JSON.parse(localStorage.getItem('g2g_orders_all') || '[]')); } catch {} }, []);
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="font-semibold mb-3">All Orders</h2>
      <div className="space-y-3">
        {orders.slice(0, 200).map(o => (
          <div key={o.id} className="text-sm border-b pb-2">
            <div className="flex items-center justify-between">
              <div className="font-mono">{o.id}</div>
              <div>{new Date(o.createdAt).toLocaleString()}</div>
              <div>{o.itemsCount} items</div>
              <div className="font-semibold text-[#7cb342]">{o.total.toFixed(0)} CFA</div>
              <div className="text-xs">{o.userEmail}</div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs">Status:</span>
              <select value={o.status} onChange={e=>{ setOrderStatus(o.id, e.target.value as any); const next = orders.map(x => x.id===o.id?{...x, status: e.target.value}:x); setOrders(next); }} className="border rounded px-2 py-1 text-xs">
                {['pending','confirmed','shopping','out-for-delivery','delivered','cancelled'].map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={()=>{ const ord = getOrderById(o.id); if (ord) { const eta = prompt('Set ETA (e.g., Today 4pm)') || ''; updateOrder(o.id, { eta }); alert('ETA updated'); } }} className="px-2 py-1 bg-gray-100 rounded">Set ETA</button>
              <button onClick={()=>{ const note = prompt('Add note'); if (note) addOrderEvent(o.id, { id: '', timestamp: '', type: 'note', title: 'Note', description: note }); alert('Note added'); }} className="px-2 py-1 bg-gray-100 rounded">Add Note</button>
            </div>
          </div>
        ))}
        {orders.length === 0 && <div className="text-sm text-gray-500">No orders yet.</div>}
      </div>
    </div>
  );
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<Record<string, any>>({});
  const reload = () => { try { const raw = localStorage.getItem('g2g_auth_users'); setUsers(raw ? JSON.parse(raw) : {}); } catch { setUsers({}); } };
  useEffect(() => { reload(); }, []);
  const setRole = (email: string, role: 'user'|'admin') => {
    const next = { ...users };
    const key = email.toLowerCase();
    if (!next[key]) return;
    next[key] = { ...next[key], role };
    try { localStorage.setItem('g2g_auth_users', JSON.stringify(next)); } catch {}
    setUsers(next);
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="font-semibold mb-3">Users</h2>
      <div className="space-y-2">
        {Object.values(users).map((u: any) => (
          <div key={u.email} className="flex items-center justify-between text-sm border-b pb-2">
            <div>
              <div className="font-semibold">{u.name || '(no name)'} <span className="text-gray-500">&lt;{u.email}&gt;</span></div>
              <div className="text-xs text-gray-500">id: {u.id}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">Role:</span>
              <select value={u.role || 'user'} onChange={e=>setRole(u.email, e.target.value as any)} className="border rounded px-2 py-1 text-xs">
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>
        ))}
        {Object.keys(users).length === 0 && <div className="text-sm text-gray-500">No users yet.</div>}
      </div>
    </div>
  );
};

export default AdminDashboard;

