<template>
  <aside 
    :class="[
      'fixed h-screen overflow-y-auto border-r border-zinc-200 flex flex-col bg-white z-50',
      'transition-all duration-300 ease-out',
      isExpanded ? 'w-64' : 'w-16 sm:w-20',
      isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo Section -->
    <div class="px-4 py-5 border-b border-zinc-100 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3 no-underline" @click="closeMobileSidebar">
        <div class="w-9 h-9 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 shrink-0">
          <img src="/images/logo-1.png" alt="BEV Flow Logo" class="w-full h-full object-cover" />
        </div>
        <div v-if="isExpanded" class="overflow-hidden">
          <h2 class="text-sm font-semibold text-zinc-900 whitespace-nowrap">BEV Flow</h2>
          <p class="text-[10px] text-zinc-500 tracking-wide">Inventory System</p>
        </div>
      </NuxtLink>
      
      <!-- Close Button (Mobile) -->
      <button 
        @click="closeMobileSidebar"
        class="lg:hidden p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
      >
        <UIcon name="i-lucide-x" class="w-5 h-5" />
      </button>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto">
      <div class="space-y-1">
        <p v-if="isExpanded" class="px-3 mb-2 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Menu</p>
        
        <NuxtLink 
          v-for="item in mainMenuItems" 
          :key="item.path"
          :to="item.path" 
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm no-underline transition-colors',
            isActive(item.path) 
              ? 'bg-zinc-100 text-zinc-900 font-medium' 
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50',
            !isExpanded && 'justify-center'
          ]"
          :title="!isExpanded ? item.label : undefined"
          @click="closeMobileSidebar"
        >
          <UIcon 
            :name="item.icon" 
            :class="['w-[18px] h-[18px] shrink-0', isActive(item.path) ? 'text-zinc-700' : 'text-zinc-400']" 
          />
          <span v-if="isExpanded">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
    
    <!-- Bottom Section -->
    <div class="px-3 py-4 border-t border-zinc-100 space-y-2">
      <!-- Expand/Collapse Toggle (Desktop) -->
      <button 
        @click="toggleSidebar"
        :class="[
          'hidden lg:flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
          'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50',
          !isExpanded && 'justify-center'
        ]"
        :title="isExpanded ? 'Collapse sidebar' : 'Expand sidebar'"
      >
        <UIcon :name="isExpanded ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open'" class="w-[18px] h-[18px]" />
        <span v-if="isExpanded" class="text-xs">{{ isExpanded ? 'Collapse' : 'Expand' }}</span>
      </button>
      
      <!-- User Section -->
      <NuxtLink to="/profile" :class="['flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-50 no-underline hover:bg-zinc-100 transition-colors', !isExpanded && 'justify-center px-2']">
        <div class="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-user" class="w-4 h-4 text-zinc-600" />
        </div>
        <div v-if="isExpanded" class="flex-1 min-w-0">
          <p class="text-sm font-medium text-zinc-900 truncate">{{ userName }}</p>
          <p class="text-[10px] text-zinc-500 truncate">{{ userEmail }}</p>
        </div>
        <button 
          v-if="isExpanded"
          @click.prevent="handleLogout"
          class="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Logout"
        >
          <UIcon name="i-lucide-log-out" class="w-4 h-4" />
        </button>
      </NuxtLink>
      <button 
        v-if="!isExpanded"
        @click="handleLogout"
        class="w-full p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors"
        title="Logout"
      >
        <UIcon name="i-lucide-log-out" class="w-4 h-4" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const { isExpanded, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();

// User data
const userName = ref('Admin');
const userEmail = ref('admin@bevflow.com');

// Fetch user profile
const fetchUserProfile = async () => {
  try {
    const data = await $fetch('/api/profile');
    userName.value = data.name || 'Admin';
    userEmail.value = data.email || 'admin@bevflow.com';
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};

onMounted(() => {
  fetchUserProfile();
});

const mainMenuItems = [
  { path: '/', label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
  { path: '/analytics', label: 'Analytics', icon: 'i-lucide-bar-chart-2' },
  { path: '/products', label: 'Products', icon: 'i-lucide-package' },
  { path: '/suppliers', label: 'Suppliers', icon: 'i-lucide-building-2' },
  { path: '/purchase-orders', label: 'Orders', icon: 'i-lucide-clipboard-list' },
  { path: '/sales', label: 'Sales', icon: 'i-lucide-receipt' },
  { path: '/forecasts', label: 'Forecasts', icon: 'i-lucide-trending-up' },
  { path: '/profile', label: 'Profile', icon: 'i-lucide-user-circle' },
];

const isActive = (path: string) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};

// Cookies for SSR auth
const authCookie = useCookie('isAuthenticated');
const expiryCookie = useCookie('tokenExpiry');

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('tokenExpiry');
  // Also clear cookies
  authCookie.value = null;
  expiryCookie.value = null;
  closeMobileSidebar();
  router.push('/login');
};
</script>
