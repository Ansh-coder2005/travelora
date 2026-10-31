// API Client for TRAVELORA Full-Stack Server
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function getAuthToken() {
  return localStorage.getItem('travelora_auth_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('travelora_auth_token', token);
  } else {
    localStorage.removeItem('travelora_auth_token');
  }
}

async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.warn(`[API] Error on ${endpoint}:`, error.message);
    throw error;
  }
}

// 1. Authentication APIs
export const authAPI = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) setAuthToken(data.token);
    return data;
  },

  register: async ({ name, email, password, phone }) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone })
    });
    if (data.token) setAuthToken(data.token);
    return data;
  },

  getMe: async () => {
    return await apiRequest('/auth/me');
  },

  getUsers: async () => {
    return await apiRequest('/auth/users');
  }
};

// 2. Destinations APIs
export const destinationsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/destinations${query ? `?${query}` : ''}`);
  },

  getById: async (id) => {
    return await apiRequest(`/destinations/${id}`);
  },

  create: async (destData) => {
    return await apiRequest('/destinations', {
      method: 'POST',
      body: JSON.stringify(destData)
    });
  },

  update: async (id, destData) => {
    return await apiRequest(`/destinations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(destData)
    });
  },

  delete: async (id) => {
    return await apiRequest(`/destinations/${id}`, {
      method: 'DELETE'
    });
  }
};

// 3. Tour Packages APIs
export const packagesAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/packages${query ? `?${query}` : ''}`);
  },

  getById: async (id) => {
    return await apiRequest(`/packages/${id}`);
  },

  create: async (pkgData) => {
    return await apiRequest('/packages', {
      method: 'POST',
      body: JSON.stringify(pkgData)
    });
  },

  update: async (id, pkgData) => {
    return await apiRequest(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pkgData)
    });
  },

  delete: async (id) => {
    return await apiRequest(`/packages/${id}`, {
      method: 'DELETE'
    });
  }
};

// 4. Bookings APIs
export const bookingsAPI = {
  getAll: async () => {
    return await apiRequest('/bookings');
  },

  getById: async (id) => {
    return await apiRequest(`/bookings/${id}`);
  },

  create: async (bookingData) => {
    return await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  updateStatus: async (id, status) => {
    return await apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  delete: async (id) => {
    return await apiRequest(`/bookings/${id}`, {
      method: 'DELETE'
    });
  }
};

// 5. Planned Trips (AI Itineraries) APIs
export const tripsAPI = {
  getAll: async () => {
    return await apiRequest('/trips');
  },

  save: async (tripData) => {
    return await apiRequest('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData)
    });
  },

  delete: async (id) => {
    return await apiRequest(`/trips/${id}`, {
      method: 'DELETE'
    });
  }
};

// 6. Wishlist APIs
export const wishlistAPI = {
  getAll: async () => {
    return await apiRequest('/wishlist');
  },

  toggle: async (destinationId) => {
    return await apiRequest('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ destinationId })
    });
  }
};

// 7. Admin Analytics APIs
export const adminAPI = {
  getStats: async () => {
    return await apiRequest('/admin/stats');
  }
};

// 8. Contact APIs
export const contactAPI = {
  submit: async (contactData) => {
    return await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  },

  getAll: async () => {
    return await apiRequest('/contact');
  }
};

// 9. Newsletter APIs
export const newsletterAPI = {
  subscribe: async (email) => {
    return await apiRequest('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  getAll: async () => {
    return await apiRequest('/newsletter');
  }
};
