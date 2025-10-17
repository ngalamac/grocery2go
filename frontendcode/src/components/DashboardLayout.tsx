import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Container } from './ui';

const DashboardLayout: React.FC = () => {
  return (
    <Container className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="bg-white rounded-lg shadow-sm p-4 h-fit">
          <nav className="space-y-2 text-sm">
            <NavLink to="/dashboard/orders" className={(p: { isActive: boolean }) => `block px-3 py-2 rounded ${p.isActive?'bg-primary-50 text-primary-700':'hover:bg-gray-50'}`}>My Orders</NavLink>
            <NavLink to="/dashboard/wishlist" className={(p: { isActive: boolean }) => `block px-3 py-2 rounded ${p.isActive?'bg-primary-50 text-primary-700':'hover:bg-gray-50'}`}>Wishlist</NavLink>
            <NavLink to="/dashboard/profile" className={(p: { isActive: boolean }) => `block px-3 py-2 rounded ${p.isActive?'bg-primary-50 text-primary-700':'hover:bg-gray-50'}`}>Profile</NavLink>
          </nav>
        </aside>
        <main className="md:col-span-3">
          <Outlet />
        </main>
      </div>
    </Container>
  );
};

export default DashboardLayout;

