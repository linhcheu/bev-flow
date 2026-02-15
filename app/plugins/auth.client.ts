// Client-side auth plugin that syncs localStorage with cookies for SSR
// Session policy: 7 days, auto-logout at midnight before Monday
export default defineNuxtPlugin(() => {
  const router = useRouter();
  const authCookie = useCookie('isAuthenticated', { maxAge: 60 * 60 * 24 * 7 });
  const expiryCookie = useCookie('tokenExpiry', { maxAge: 60 * 60 * 24 * 7 });
  
  const clearAuth = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
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

  const isExpired = (): boolean => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (!tokenExpiry) return true;
    const expiryTime = parseInt(tokenExpiry);
    return isNaN(expiryTime) || Date.now() > expiryTime;
  };
  
  // Check auth on every route change
  router.beforeEach((to) => {
    if (to.path === '/login') return true;
    
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated || isExpired()) {
      clearAuth();
      return '/login';
    }
    
    syncCookies();
    return true;
  });
  
  // Check on initial page load
  const route = useRoute();
  if (route.path !== '/login') {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated || isExpired()) {
      clearAuth();
      navigateTo('/login', { replace: true });
    } else {
      syncCookies();
    }
  }

  // Periodic session check: every 60 seconds, verify expiry
  // This ensures the user is logged out at midnight Monday even if they stay on the page
  setInterval(() => {
    const currentRoute = router.currentRoute.value;
    if (currentRoute.path === '/login') return;

    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated || isExpired()) {
      clearAuth();
      router.push('/login');
    }
  }, 60 * 1000);
});
