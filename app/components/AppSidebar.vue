<template>
  <aside class="w-64 bg-zinc-950 text-zinc-100 fixed h-screen overflow-y-auto border-r border-zinc-800/50 flex flex-col">
    <!-- Logo Section -->
    <div class="px-6 py-8 border-b border-zinc-800/50">
      <NuxtLink to="/" class="flex items-center gap-3 no-underline">
        <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
          <UIcon name="i-lucide-wine" class="w-5 h-5 text-zinc-900" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-white tracking-wide">BEV Flow Hello</h2>
          <p class="text-[10px] text-zinc-500 tracking-wider uppercase">Inventory System</p>
        </div>
      </NuxtLink>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 px-3 py-6">
      <div class="space-y-1">
        <p class="px-4 mb-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Main Menu</p>
        
        <NuxtLink 
          v-for="item in mainMenuItems" 
          :key="item.path"
          :to="item.path" 
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 no-underline group',
            isActive(item.path) 
              ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-400' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          ]"
        >
          <UIcon 
            :name="item.icon" 
            :class="[
              'w-5 h-5 transition-colors',
              isActive(item.path) ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'
            ]" 
          />
          <span class="font-medium">{{ item.label }}</span>
        </NuxtLink>
      </div>
      
      <div class="mt-8 space-y-1">
        <p class="px-4 mb-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Quick Actions</p>
        
        <NuxtLink 
          v-for="item in quickActionItems" 
          :key="item.path"
          :to="item.path" 
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 no-underline group',
            isActive(item.path) 
              ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-400' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          ]"
        >
          <UIcon 
            :name="item.icon" 
            :class="[
              'w-5 h-5 transition-colors',
              isActive(item.path) ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'
            ]" 
          />
          <span class="font-medium">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
    
    <!-- User Section -->
    <div class="px-3 py-4 border-t border-zinc-800/50">
      <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900/50">
        <div class="w-9 h-9 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center">
          <UIcon name="i-lucide-user" class="w-4 h-4 text-zinc-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-zinc-200 truncate">Admin User</p>
          <p class="text-xs text-zinc-500 truncate">admin@bevflow.com</p>
        </div>
        <button 
          @click="handleLogout"
          class="p-2 text-zinc-500 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition-colors"
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
