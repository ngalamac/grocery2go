import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewsContext';
import { useCoupon } from '../context/CouponContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'reviews' | 'coupons' | 'settings' | 'featured' | 'orders'>('reviews');
  if (!user || user.role !== 'admin') {
    return <div className="max-w-4xl mx-auto px-4 py-10 text-center text-gray-600">Admin access required.</div>;
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['reviews','coupons','settings','featured','orders'] as const).map(k => (
          <button key={k} onClick={() => setTab(k)} className={`px-3 py-2 rounded ${tab===k?'bg-[#7cb342] text-white':'bg-gray-100'}`}>{k}</button>
        ))}
      </div>
      {tab === 'reviews' && <AdminReviews />}
      {tab === 'coupons' && <AdminCoupons />}
      {tab === 'settings' && <AdminSettings />}
      {tab === 'featured' && <AdminFeatured />}
      {tab === 'orders' && <AdminOrders />}
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

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => { try { setOrders(JSON.parse(localStorage.getItem('g2g_orders_all') || '[]')); } catch {} }, []);
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="font-semibold mb-3">All Orders</h2>
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="flex items-center justify-between text-sm border-b pb-2">
            <div className="font-mono">{o.id}</div>
            <div>{new Date(o.createdAt).toLocaleString()}</div>
            <div>{o.itemsCount} items</div>
            <div className="font-semibold text-[#7cb342]">{o.total.toFixed(0)} CFA</div>
            <div className="text-xs">{o.userEmail}</div>
          </div>
        ))}
        {orders.length === 0 && <div className="text-sm text-gray-500">No orders yet.</div>}
      </div>
    </div>
  );
};

export default AdminDashboard;

