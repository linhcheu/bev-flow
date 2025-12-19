<template>
  <div class="min-h-screen bg-zinc-950 flex">
    <!-- Left Side - Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-0 left-0 w-full h-full" 
          style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
        </div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center px-16">
        <div class="mb-12">
          <div class="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-amber-500/20">
            <UIcon name="i-lucide-wine" class="w-8 h-8 text-zinc-900" />
          </div>
          <h1 class="text-5xl font-bold text-white mb-4 tracking-tight">BEV Flow</h1>
          <p class="text-xl text-zinc-400 font-light">Streamline your beverage inventory management</p>
        </div>
                                    
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
              <UIcon name="i-lucide-package" class="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p class="text-white font-medium">Product Management</p>
              <p class="text-sm text-zinc-500">Track inventory in real-time</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
              <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p class="text-white font-medium">Sales Analytics</p>
              <p class="text-sm text-zinc-500">Gain insights from your data</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
              <UIcon name="i-lucide-bar-chart-3" class="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p class="text-white font-medium">Smart Forecasting</p>
              <p class="text-sm text-zinc-500">AI-powered demand prediction</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      <div class="absolute top-20 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
    </div>
    
    <!-- Right Side - Login Form -->
    <div class="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden mb-10 text-center">
          <div class="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-wine" class="w-7 h-7 text-zinc-900" />
          </div>
          <h1 class="text-2xl font-bold text-white">BEV Flow</h1>
        </div>
        
        <!-- Form Header -->
        <div class="mb-10">
          <h2 class="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
          <p class="mt-2 text-zinc-500">Sign in to your account to continue</p>
        </div>
        
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-zinc-300 mb-2">
              Email address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UIcon name="i-lucide-mail" class="w-5 h-5 text-zinc-500" />
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                placeholder="Enter your email"
                class="w-full pl-12 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200"
              />
            </div>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-zinc-300 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UIcon name="i-lucide-lock" class="w-5 h-5 text-zinc-500" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                placeholder="Enter your password"
                class="w-full pl-12 pr-12 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                v-model="form.remember" 
                type="checkbox" 
                class="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0"
              />
              <span class="text-sm text-zinc-400">Remember me</span>
            </label>
            <a href="#" class="text-sm text-amber-400 hover:text-amber-300 transition-colors">
              Forgot password?
            </a>
          </div>
          
          <!-- Error Message -->
          <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p class="text-sm text-red-400 flex items-center gap-2">
              <UIcon name="i-lucide-alert-circle" class="w-4 h-4" />
              {{ error }}
            </p>
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-900 font-semibold rounded-xl hover:from-amber-400 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <UIcon v-if="loading" name="i-lucide-loader-2" class="w-5 h-5 animate-spin" />
            <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
          </button>
        </form>
        
        <!-- Demo Credentials -->
        <div class="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <p class="text-xs text-zinc-500 mb-2">Demo credentials:</p>
          <p class="text-sm text-zinc-400">
            <span class="text-zinc-500">Email:</span> admin@bevflow.com
          </p>
          <p class="text-sm text-zinc-400">
            <span class="text-zinc-500">Password:</span> admin123
          </p>
        </div>
        
        <!-- Footer -->
        <p class="mt-8 text-center text-sm text-zinc-600">
          2024 BEV Flow. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
});

const router = useRouter();

const form = ref({
  email: '',
  password: '',
  remember: false
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo validation
    if (form.value.email === 'admin@bevflow.com' && form.value.password === 'admin123') {
      router.push('/');
    } else {
      error.value = 'Invalid email or password. Please try again.';
    }
  } catch (e) {
    error.value = 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
