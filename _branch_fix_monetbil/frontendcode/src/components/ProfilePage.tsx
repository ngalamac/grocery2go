import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { show } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!user) return;
    setEmail(user.email);
    try {
      const raw = localStorage.getItem(`g2g_profile_${user.id}`);
      const saved = raw ? JSON.parse(raw) : {};
      setName(saved.name || user.name || '');
    } catch {}
  }, [user]);

  if (!user) {
    return <div className="max-w-xl mx-auto px-4 py-10 text-center text-gray-600">Login to manage your profile.</div>;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(`g2g_profile_${user.id}`, JSON.stringify({ name }));
      show('Profile updated', { type: 'success' });
    } catch {}
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <form onSubmit={handleSave} className="space-y-4 bg-white rounded-lg shadow-sm p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7cb342]" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input value={email} readOnly className="w-full border rounded px-4 py-3 bg-gray-100" />
        </div>
        <button className="w-full bg-[#7cb342] text-white py-3 rounded font-semibold hover:bg-[#689f38] transition">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfilePage;

