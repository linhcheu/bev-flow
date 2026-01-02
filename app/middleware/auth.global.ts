import { AUTH_CONFIG } from '../utils/auth-config';

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware for login page
  if (to.path === '/login') {
    return;
  }
  
  // Check if user is authenticated (using localStorage on client)
  if (process.client) {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return navigateTo('/login');
    }
    
    // Check if token has expired
    if (tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry);
      const currentTime = Date.now();
      
      if (currentTime > expiryTime) {
        // Token expired - clear auth data and redirect to login
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('tokenExpiry');
        return navigateTo('/login');
      }
    } else {
      // No expiry set - treat as expired
      localStorage.removeItem('isAuthenticated');
      return navigateTo('/login');
    }
  }
});
