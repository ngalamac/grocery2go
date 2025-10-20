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

export const paymentsApi = {
  startMonetbil: (data: { orderId: string; phone: string; operator?: string }) =>
    apiRequest('/payments/monetbil/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkMonetbil: (orderId: string) =>
    apiRequest(`/payments/monetbil/check?orderId=${orderId}`),

  cancelMonetbil: (orderId: string) =>
    apiRequest('/payments/monetbil/cancel', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),
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

export const settingsApi = {
  getFees: () => apiRequest('/settings/fees'),
  updateFees: (data: any) =>
    apiRequest('/settings/fees', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const restaurantsApi = {
  getAll: (params?: { city?: string; cuisine?: string; search?: string; isOpen?: boolean; isFeatured?: boolean }) => {
    const query = new URLSearchParams((params as any) || {}).toString();
    return apiRequest(`/restaurants${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiRequest(`/restaurants/${id}`),

  getBySlug: (slug: string) => apiRequest(`/restaurants/slug/${slug}`),

  create: (data: any) =>
    apiRequest('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/restaurants/${id}`, {
      method: 'DELETE',
    }),

  addMenuItem: (id: string, data: any) =>
    apiRequest(`/restaurants/${id}/menu`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateMenuItem: (id: string, itemId: string, data: any) =>
    apiRequest(`/restaurants/${id}/menu/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteMenuItem: (id: string, itemId: string) =>
    apiRequest(`/restaurants/${id}/menu/${itemId}`, {
      method: 'DELETE',
    }),
};
