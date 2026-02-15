<template>
  <div class="login-container">
    <!-- Left Side - Branding (Hidden on mobile/tablet, visible on large screens) -->
    <div class="login-branding">
      <!-- Subtle Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-50"></div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center h-full px-8 lg:px-12 xl:px-16 py-12">
        <!-- Logo -->
        <div class="mb-8 xl:mb-12">
          <div class="w-16 h-16 xl:w-20 xl:h-20 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm mb-6">
            <img src="/images/logo-1.png" alt="BEV Flow Logo" class="w-full h-full object-cover" />
          </div>
          <h1 class="text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-zinc-900 mb-3 tracking-tight">BEV Flow</h1>
          <p class="text-base xl:text-lg text-zinc-500 font-normal">Beverage Inventory Management System</p>
        </div>
                                    
        <!-- Features -->
        <div class="space-y-4 xl:space-y-5">
          <div class="flex items-center gap-3 xl:gap-4">
            <div class="w-9 h-9 xl:w-10 xl:h-10 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-package" class="w-4 h-4 xl:w-5 xl:h-5 text-zinc-600" />
            </div>
            <div>
              <p class="text-zinc-800 font-medium text-sm xl:text-base">Inventory Tracking</p>
              <p class="text-xs xl:text-sm text-zinc-500">Real-time stock management</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3 xl:gap-4">
            <div class="w-9 h-9 xl:w-10 xl:h-10 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-trending-up" class="w-4 h-4 xl:w-5 xl:h-5 text-zinc-600" />
            </div>
            <div>
              <p class="text-zinc-800 font-medium text-sm xl:text-base">Sales Analytics</p>
              <p class="text-xs xl:text-sm text-zinc-500">Data-driven insights</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3 xl:gap-4">
            <div class="w-9 h-9 xl:w-10 xl:h-10 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-bar-chart-3" class="w-4 h-4 xl:w-5 xl:h-5 text-zinc-600" />
            </div>
            <div>
              <p class="text-zinc-800 font-medium text-sm xl:text-base">Stock Analytics</p>
              <p class="text-xs xl:text-sm text-zinc-500">ROP & EOQ analysis</p>
            </div>
          </div>
        </div>
        
        <!-- Footer on branding side -->
        <div class="mt-auto pt-8 xl:pt-12">
          <p class="text-xs text-zinc-400">© 2026 BEV Flow. All rights reserved.</p>
        </div>
      </div>
    </div>
    
    <!-- Right Side - Login Form -->
    <div class="login-form-container">
      <div class="login-form-wrapper">
        <!-- Logo (visible on mobile/tablet only) -->
        <div class="login-mobile-header">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-zinc-200 shadow-sm mx-auto mb-3">
            <img src="/images/logo-1.png" alt="BEV Flow Logo" class="w-full h-full object-cover" />
          </div>
          <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">BEV Flow</h1>
          <p class="text-xs sm:text-sm text-zinc-500 mt-1">Inventory Management</p>
        </div>
        
        <!-- Form Header -->
        <div class="mb-6 sm:mb-8 text-center lg:text-left">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-semibold text-zinc-900 tracking-tight">Welcome back</h2>
          <p class="mt-1.5 sm:mt-2 text-sm text-zinc-500">Sign in to continue</p>
        </div>
        
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-zinc-700 mb-1.5 sm:mb-2">
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <UIcon name="i-lucide-mail" class="w-4 h-4 text-zinc-400" />
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                placeholder="you@example.com"
                class="login-input !pl-11"
              />
            </div>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-zinc-700 mb-1.5 sm:mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <UIcon name="i-lucide-lock" class="w-4 h-4 text-zinc-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                placeholder="••••••••"
                class="login-input !pl-11 !pr-11"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors z-10"
              >
                <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                v-model="form.remember" 
                type="checkbox" 
                class="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0"
              />
              <span class="text-xs sm:text-sm text-zinc-600">Remember me</span>
            </label>
            <a href="#" class="text-xs sm:text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
              Forgot password?
            </a>
          </div>
          
          <!-- Error Message -->
          <div v-if="error" class="p-3 sm:p-4 bg-red-50 border border-red-100 rounded-lg">
            <p class="text-xs sm:text-sm text-red-600 flex items-center gap-2">
              <UIcon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
              {{ error }}
            </p>
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="login-button"
          >
            <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
          </button>
        </form>
        
        <!-- Demo Credentials -->
        <div class="mt-6 sm:mt-8 p-3 sm:p-4 bg-zinc-50 border border-zinc-100 rounded-lg">
          <p class="text-[10px] sm:text-xs text-zinc-400 mb-2 sm:mb-3 uppercase tracking-wide font-medium">Demo Accounts</p>
          <div class="space-y-2 text-xs sm:text-sm">
            <div class="flex items-center justify-between text-zinc-600">
              <span class="text-zinc-400">Admin:</span>
              <span>admin@bevflow.com / admin123</span>
            </div>
            <div class="flex items-center justify-between text-zinc-600">
              <span class="text-zinc-400">Manager:</span>
              <span>manager@bevflow.com / manager123</span>
            </div>
            <div class="flex items-center justify-between text-zinc-600">
              <span class="text-zinc-400">Staff:</span>
              <span>staff@bevflow.com / staff123</span>
            </div>
          </div>
        </div>
        
        <!-- Footer (Mobile/Tablet) -->
        <p class="lg:hidden mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-zinc-400">
          © 2026 BEV Flow. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AUTH_CONFIG, getSessionExpiry } from '../utils/auth-config';

definePageMeta({
  layout: 'auth'
});

const router = useRouter();

// Check if already authenticated - redirect to dashboard
if (import.meta.client) {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  
  if (isAuthenticated && tokenExpiry) {
    const expiryTime = parseInt(tokenExpiry);
    if (Date.now() < expiryTime) {
      // User is authenticated and token is valid, redirect to dashboard
      navigateTo('/', { replace: true });
    }
  }
}

const form = ref({
  email: '',
  password: '',
  remember: false
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

// Cookies for SSR auth
const authCookie = useCookie('isAuthenticated', { maxAge: 60 * 60 * 24 * 7 });
const expiryCookie = useCookie('tokenExpiry', { maxAge: 60 * 60 * 24 * 7 });
const userIdCookie = useCookie('userId', { maxAge: 60 * 60 * 24 * 7 });
const userRoleCookie = useCookie('userRole', { maxAge: 60 * 60 * 24 * 7 });

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // Call the actual login API
    const response = await $fetch<{ 
      success: boolean; 
      user: { 
        user_id: number; 
        full_name: string; 
        email: string; 
        role: string;
        username: string;
      } 
    }>('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password
      }
    });
    
    if (response.success && response.user) {
      // Set authenticated flag in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      
      // Store user info
      localStorage.setItem('userId', response.user.user_id.toString());
      localStorage.setItem('userEmail', response.user.email);
      localStorage.setItem('userName', response.user.full_name || response.user.username);
      localStorage.setItem('userRole', response.user.role);
      
      // Set token expiry time - expires at midnight before next Monday
      const expiryTime = getSessionExpiry();
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      
      // Also set cookies for SSR
      authCookie.value = 'true';
      expiryCookie.value = expiryTime.toString();
      userIdCookie.value = response.user.user_id.toString();
      userRoleCookie.value = response.user.role;
      
      router.push('/');
    } else {
      error.value = 'Invalid email or password. Please try again.';
    }
  } catch (e: any) {
    // Handle API error response
    if (e?.data?.message) {
      error.value = e.data.message;
    } else if (e?.statusMessage) {
      error.value = e.statusMessage;
    } else {
      error.value = 'Invalid email or password. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
