// Client-side auth plugin that syncs localStorage with cookies for SSR
export default defineNuxtPlugin(() => {
  const router = useRouter();
  const authCookie = useCookie('isAuthenticated', { maxAge: 60 * 60 * 24 * 7 });
  const expiryCookie = useCookie('tokenExpiry', { maxAge: 60 * 60 * 24 * 7 });
  
  const clearAuth = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    authCookie.value = null;
    expiryCookie.value = null;
  };
  
  const syncCookies = () => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const expiry = localStorage.getItem('tokenExpiry');
    if (isAuth && expiry) {
      authCookie.value = isAuth;
      expiryCookie.value = expiry;
    }
  };
  
  // Check auth on every route change
  router.beforeEach((to, from) => {
    // Skip for login page
    if (to.path === '/login') {
      return true;
    }
    
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    let shouldRedirect = false;
    
    if (!isAuthenticated) {
      shouldRedirect = true;
    } else if (tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry);
      if (Date.now() > expiryTime) {
        shouldRedirect = true;
      }
    } else {
      shouldRedirect = true;
    }
    
    if (shouldRedirect) {
      clearAuth();
      return '/login';
    }
    
    // Sync cookies for SSR
    syncCookies();
    return true;
  });
  
  // Also check on initial page load
  const route = useRoute();
  if (route.path !== '/login') {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    let shouldRedirect = false;
    
    if (!isAuthenticated) {
      shouldRedirect = true;
    } else if (tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry);
      if (Date.now() > expiryTime) {
        shouldRedirect = true;
      }
    } else {
      shouldRedirect = true;
    }
    
    if (shouldRedirect) {
      clearAuth();
      navigateTo('/login', { replace: true });
    } else {
      // Sync cookies on successful auth
      syncCookies();
    }
  }
});
