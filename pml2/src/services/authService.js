import axios from 'axios';

// API base URL - adjust this based on where your Django server is running
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication services
export const authService = {
  // Admin login
  adminLogin: async (credentials) => {
    try {
      const response = await authClient.post('/admin/login/', credentials);
      
      // Store user info in localStorage for persisting the login state
      if (response.data && response.data.status === 'success') {
        localStorage.setItem('currentUser', JSON.stringify({
          type: 'admin',
          ...response.data.data
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },
  
  // Manager login
  managerLogin: async (credentials) => {
    try {
      const response = await authClient.post('/manager/login/', credentials);
      
      // Store user info in localStorage for persisting the login state
      if (response.data && response.data.status === 'success') {
        localStorage.setItem('currentUser', JSON.stringify({
          type: 'manager',
          ...response.data.data
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Manager login error:', error);
      throw error;
    }
  },
  
  // Team member login
  teamMemberLogin: async (credentials) => {
    try {
      const response = await authClient.post('/team-member/login/', credentials);
      
      // Store user info in localStorage for persisting the login state
      if (response.data && response.data.status === 'success') {
        localStorage.setItem('currentUser', JSON.stringify({
          type: 'team-member',
          ...response.data.data
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Team member login error:', error);
      throw error;
    }
  },
  
  // Logout
  logout: () => {
    // Remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  },
  
  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
      return null;
    }
  },
  
  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('currentUser');
  },
  
  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.type === 'admin';
  },
  
  // Check if user is manager
  isManager: () => {
    const user = authService.getCurrentUser();
    return user && user.type === 'manager';
  },
  
  // Check if user is team member
  isTeamMember: () => {
    const user = authService.getCurrentUser();
    return user && user.type === 'team-member';
  }
};
