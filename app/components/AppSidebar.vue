<template>
  <aside class="w-64 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 fixed h-screen overflow-y-auto border-r border-amber-500/30 flex flex-col shadow-2xl transition-colors duration-200">
    <!-- Logo Section -->
    <div class="px-6 py-8 border-b border-amber-500/30">
      <div class="flex items-center justify-between mb-4">
        <NuxtLink to="/" class="flex items-center gap-3 no-underline flex-1">
          <div class="w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-500 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
            <img src="/images/logo-2.png" alt="BEV Flow Logo" class="w-full h-full object-cover" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">BEV Flow</h2>
            <p class="text-[10px] text-amber-500 tracking-wider uppercase font-semibold">Inventory System</p>
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 px-3 py-6">
      <div class="space-y-1">
        <p class="px-4 mb-3 text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider">Main Menu</p>
        
        <NuxtLink 
          v-for="item in mainMenuItems" 
          :key="item.path"
          :to="item.path" 
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 no-underline group',
            isActive(item.path) 
              ? 'bg-amber-500 text-zinc-900 font-semibold shadow-lg shadow-amber-500/30' 
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
          ]"
        >
          <UIcon 
            :name="item.icon" 
            :class="[
              'w-5 h-5 transition-colors',
              isActive(item.path) ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-amber-500'
            ]" 
          />
          <span class="font-medium">{{ item.label }}</span>
        </NuxtLink>
      </div>
      
      <div class="mt-8 space-y-1">
        <p class="px-4 mb-3 text-[10px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider">Quick Actions</p>
        
        <NuxtLink 
          v-for="item in quickActionItems" 
          :key="item.path"
          :to="item.path" 
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 no-underline group',
            isActive(item.path) 
              ? 'bg-amber-500 text-zinc-900 font-semibold shadow-lg shadow-amber-500/30' 
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
          ]"
        >
          <UIcon 
            :name="item.icon" 
            :class="[
              'w-5 h-5 transition-colors',
              isActive(item.path) ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-amber-500'
            ]" 
          />
          <span class="font-medium">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
    
    <!-- User Section -->
    <div class="px-3 py-4 border-t border-amber-500/30">
      <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-amber-500/30">
        <div class="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center">
          <UIcon name="i-lucide-user" class="w-4 h-4 text-zinc-900" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-zinc-900 dark:text-white truncate">Admin User</p>
          <p class="text-xs text-zinc-600 dark:text-zinc-400 truncate">admin@bevflow.com</p>
        </div>
        <button 
          @click="handleLogout"
          class="p-2 text-zinc-600 dark:text-zinc-400 hover:text-amber-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          title="Logout"
        >
          <UIcon name="i-lucide-log-out" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const mainMenuItems = [
  { path: '/', label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
  { path: '/profile', label: 'Profile', icon: 'i-lucide-user-circle' },
  { path: '/products', label: 'Products', icon: 'i-lucide-package' },
  { path: '/suppliers', label: 'Suppliers', icon: 'i-lucide-building-2' },
  { path: '/purchase-orders', label: 'Purchase Orders', icon: 'i-lucide-clipboard-list' },
  { path: '/sales', label: 'Sales', icon: 'i-lucide-trending-up' },
  { path: '/forecasts', label: 'Forecasts', icon: 'i-lucide-bar-chart-3' },
];

const quickActionItems = [
  { path: '/products/new', label: 'Add Product', icon: 'i-lucide-plus-circle' },
  { path: '/sales/new', label: 'Record Sale', icon: 'i-lucide-receipt' },
];

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

const handleLogout = () => {
  router.push('/login');
};
</script>
