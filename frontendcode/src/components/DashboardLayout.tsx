import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-4 gap-6">
        <aside className="bg-white rounded-lg shadow-sm p-4 h-fit">
          <nav className="space-y-2 text-sm">
            <NavLink to="/dashboard/orders" className={(p: { isActive: boolean }) => `block px-3 py-2 rounded ${p.isActive?'bg-[#e8f5e9] text-[#2e7d32]':'hover:bg-gray-50'}`}>My Orders</NavLink>
            <NavLink to="/dashboard/wishlist" className={(p: { isActive: boolean }) => `block px-3 py-2 rounded ${p.isActive?'bg-[#e8f5e9] text-[#2e7d32]':'hover:bg-gray-50'}`}>Wishlist</NavLink>
            <NavLink to="/dashboard/profile" className={(p: { isActive: boolean }) => `block px-3 py-2 rounded ${p.isActive?'bg-[#e8f5e9] text-[#2e7d32]':'hover:bg-gray-50'}`}>Profile</NavLink>
          </nav>
        </aside>
        <main className="md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

