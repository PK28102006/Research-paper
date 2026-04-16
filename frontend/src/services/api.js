const API_URL = import.meta.env.VITE_API_URL || 'https://research-paper-tau.vercel.app/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

export const api = {
  // ==================== AUTH ====================
  
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await handleResponse(res);
      
      // Store token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: error.message };
    }
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await handleResponse(res);
      
      // Store token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });
      
      return await handleResponse(res);
    } catch (error) {
      console.error('Get current user failed:', error);
      return { success: false, message: error.message };
    }
  },

  // ==================== USERS ====================
  
  getUsers: async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders(),
      });
      
      const data = await handleResponse(res);
      return data.users || [];
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  getUserById: async (userId) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        headers: getAuthHeaders(),
      });
      
      const data = await handleResponse(res);
      return data.user;
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  getUsersByRole: async (role) => {
    try {
      const res = await fetch(`${API_URL}/users/role/${role}`, {
        headers: getAuthHeaders(),
      });
      
      const data = await handleResponse(res);
      return data.users || [];
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  getReviewers: async () => {
    try {
      const res = await fetch(`${API_URL}/users/reviewers`, {
        headers: getAuthHeaders(),
      });
      
      const data = await handleResponse(res);
      return data.reviewers || [];
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  updateUser: async (user) => {
    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(user),
      });
      
      return await handleResponse(res);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      return await handleResponse(res);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // ==================== PAPERS ====================
  
  getPapers: async () => {
    try {
      const res = await fetch(`${API_URL}/papers`, {
        headers: getAuthHeaders(),
      });
      
      const data = await handleResponse(res);
      return data.papers || [];
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  getPaperById: async (paperId) => {
    try {
      const res = await fetch(`${API_URL}/papers/${paperId}`, {
        headers: getAuthHeaders(),
      });
      
      const data = await handleResponse(res);
      return data.paper;
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  submitPaper: async (paper) => {
    try {
      const res = await fetch(`${API_URL}/papers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(paper),
      });
      
      return await handleResponse(res);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  updatePaper: async (paper) => {
    try {
      const res = await fetch(`${API_URL}/papers/${paper.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(paper),
      });
      
      return await handleResponse(res);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  deletePaper: async (paperId) => {
    try {
      const res = await fetch(`${API_URL}/papers/${paperId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      return await handleResponse(res);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  updatePaperStatus: async (paperId, status, comments = null, rejectionReason = null) => {
    try {
      const res = await fetch(`${API_URL}/papers/${paperId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, comments, rejectionReason }),
      });
      
      return await handleResponse(res);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  addCommentToPaper: async (paperId, text) => {
    try {
      const res = await fetch(`${API_URL}/papers/${paperId}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text }),
      });
      
      return await handleResponse(res);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  assignPaperToReviewer: async (paperId, reviewerId) => {
    try {
      const res = await fetch(`${API_URL}/papers/${paperId}/assign`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reviewerId }),
      });
      
      return await handleResponse(res);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};
