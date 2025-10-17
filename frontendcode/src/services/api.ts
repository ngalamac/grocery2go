const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (options.headers) {
    Object.entries(options.headers as Record<string, string>).forEach(([k, v]) => {
      headers[k] = v as string;
    });
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: () => apiRequest('/auth/profile'),

  updateProfile: (data: any) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const productsApi = {
  getAll: (params?: { category?: string; type?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/products${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiRequest(`/products/${id}`),

  create: (data: any) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),
};

export const ordersApi = {
  create: (data: any) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (params?: { status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/orders${query ? `?${query}` : ''}`);
  },

  getUserOrders: () => apiRequest('/orders/user'),

  getById: (id: string) => apiRequest(`/orders/${id}`),

  updateStatus: (id: string, data: any) =>
    apiRequest(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  track: (orderId: string, email: string) =>
    apiRequest(`/orders/track?orderId=${orderId}&email=${email}`),
};

export const reviewsApi = {
  create: (data: any) =>
    apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProductReviews: (productId: string) =>
    apiRequest(`/reviews/product/${productId}`),

  getAll: () => apiRequest('/reviews'),

  approve: (id: string) =>
    apiRequest(`/reviews/${id}/approve`, {
      method: 'PATCH',
    }),

  delete: (id: string) =>
    apiRequest(`/reviews/${id}`, {
      method: 'DELETE',
    }),
};

export const couponsApi = {
  validate: (code: string) => apiRequest(`/coupons/validate/${code}`),

  apply: (code: string) =>
    apiRequest('/coupons/apply', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  getAll: () => apiRequest('/coupons'),

  create: (data: any) =>
    apiRequest('/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/coupons/${id}`, {
      method: 'DELETE',
    }),
};

export const wishlistApi = {
  get: () => apiRequest('/wishlist'),

  add: (productId: string) =>
    apiRequest('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  remove: (productId: string) =>
    apiRequest(`/wishlist/${productId}`, {
      method: 'DELETE',
    }),
};
