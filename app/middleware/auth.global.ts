export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware for login page
  if (to.path === '/login') {
    return;
  }
  
  // On server-side, always redirect to login
  // The client will handle proper auth check after hydration
  if (import.meta.server) {
    // Server-side: Check for auth cookie
    const authCookie = useCookie('isAuthenticated');
    const expiryCookie = useCookie('tokenExpiry');
    
    if (!authCookie.value) {
      return navigateTo('/login', { replace: true });
    }
    
    // Check expiry
    if (expiryCookie.value) {
      const expiryTime = parseInt(expiryCookie.value);
      if (Date.now() > expiryTime) {
        authCookie.value = null;
        expiryCookie.value = null;
        return navigateTo('/login', { replace: true });
      }
    } else {
      authCookie.value = null;
      return navigateTo('/login', { replace: true });
    }
    
    return;
  }
  
  // Client-side: Check localStorage AND sync with cookies
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  
  // Sync localStorage to cookies for SSR
  const authCookie = useCookie('isAuthenticated', { maxAge: 60 * 60 * 24 * 7 }); // 7 days
  const expiryCookie = useCookie('tokenExpiry', { maxAge: 60 * 60 * 24 * 7 });
  const userIdCookie = useCookie('userId', { maxAge: 60 * 60 * 24 * 7 });
  const userRoleCookie = useCookie('userRole', { maxAge: 60 * 60 * 24 * 7 });
  
  // If not authenticated, redirect to login immediately
  if (!isAuthenticated) {
    authCookie.value = null;
    expiryCookie.value = null;
    userIdCookie.value = null;
    userRoleCookie.value = null;
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
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      authCookie.value = null;
      expiryCookie.value = null;
      userIdCookie.value = null;
      userRoleCookie.value = null;
      return navigateTo('/login', { replace: true });
    }
    
    // Sync to cookies for SSR
    authCookie.value = isAuthenticated;
    expiryCookie.value = tokenExpiry;
    userIdCookie.value = localStorage.getItem('userId');
    userRoleCookie.value = localStorage.getItem('userRole');
  } else {
    // No expiry set - treat as expired
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    authCookie.value = null;
    expiryCookie.value = null;
    userIdCookie.value = null;
    userRoleCookie.value = null;
    return navigateTo('/login', { replace: true });
  }
});
