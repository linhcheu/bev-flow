import { AUTH_CONFIG } from '../utils/auth-config';

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware for login page
  if (to.path === '/login') {
    return;
  }
  
  // On server-side, we can't check localStorage, so we let the page render
  // The client-side will handle the redirect
  if (import.meta.server) {
    return;
  }
  
  // Check if user is authenticated (using localStorage on client)
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  
  // If not authenticated, redirect to login immediately
  if (!isAuthenticated) {
    return navigateTo('/login', { replace: true });
  }
  
  // Check if token has expired
  if (tokenExpiry) {
    const expiryTime = parseInt(tokenExpiry);
    const currentTime = Date.now();
    
    if (currentTime > expiryTime) {
      // Token expired - clear auth data and redirect to login
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('tokenExpiry');
      return navigateTo('/login', { replace: true });
    }
  } else {
    // No expiry set - treat as expired
    localStorage.removeItem('isAuthenticated');
    return navigateTo('/login', { replace: true });
  }
});
