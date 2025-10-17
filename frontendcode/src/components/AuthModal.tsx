import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await signup({ email, password, name });
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={closeAuthModal} />
      <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-semibold">{mode === 'login' ? 'Login' : 'Create account'}</h2>
          <button onClick={closeAuthModal} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="John Doe"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 disabled:opacity-50"
          >
            {loading ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Create Account')}
          </button>
          <div className="relative text-center">
            <span className="px-3 text-xs text-neutral-500 bg-white relative z-10">or continue with</span>
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-neutral-200" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button type="button" className="border rounded-xl py-2 text-sm">Google</button>
            <button type="button" className="border rounded-xl py-2 text-sm">Apple</button>
            <button type="button" className="border rounded-xl py-2 text-sm">Facebook</button>
          </div>
          <div className="text-sm text-center text-gray-600">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button type="button" onClick={() => setMode('signup')} className="text-primary-600 hover:underline">Sign up</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')} className="text-primary-600 hover:underline">Login</button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

