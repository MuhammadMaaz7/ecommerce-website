const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  
  return data;
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Products API
export const productsAPI = {
  getAll: async (params?: { search?: string; category?: string; sort?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.sort) queryParams.append("sort", params.sort);
    if (params?.page) queryParams.append("page", params.page.toString());

    const response = await fetch(`${API_URL}/products?${queryParams}`);
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return handleResponse(response);
  },

  getFeatured: async () => {
    const response = await fetch(`${API_URL}/products/featured`);
    return handleResponse(response);
  },

  addReview: async (productId: string, review: { rating: number; comment: string }) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(review),
    });
    return handleResponse(response);
  },

  canReview: async (productId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/products/${productId}/can-review`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Cart API
export const cartAPI = {
  get: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  add: async (productId: string, quantity: number = 1) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse(response);
  },

  update: async (productId: string, quantity: number) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/cart/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },

  remove: async (productId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  clear: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getMyOrders: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/orders/myorders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateToPaid: async (id: string, paymentResult: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/orders/${id}/pay`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentResult),
    });
    return handleResponse(response);
  },

  confirmOrder: async (token: string) => {
    const response = await fetch(`${API_URL}/orders/confirm/${token}`, {
      method: "POST",
    });
    return handleResponse(response);
  },
};

// Admin API
export const adminAPI = {
  // Dashboard
  getStats: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Products
  createProduct: async (productData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  updateProduct: async (id: string, productData: any) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  deleteProduct: async (id: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Orders
  getAllOrders: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (id: string, status: string, trackingNumber?: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, trackingNumber }),
    });
    return handleResponse(response);
  },

  // Users
  getAllUsers: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Wishlist API
export const wishlistAPI = {
  get: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  add: async (productId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/wishlist/${productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  remove: async (productId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  clear: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/wishlist`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Auth API
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateProfile: async (userData: { name?: string; email?: string; password?: string }) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};
