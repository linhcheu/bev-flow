// Client-side auth plugin that runs before route navigation
export default defineNuxtPlugin(() => {
  const router = useRouter();
  
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
      // Clear any stale auth data
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      
      return '/login';
    }
    
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
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      
      navigateTo('/login', { replace: true });
    }
  }
});
