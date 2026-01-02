<template>
  <aside 
    :class="[
      'fixed h-screen overflow-y-auto border-r border-zinc-200 flex flex-col bg-white z-50 transition-all duration-300',
      isExpanded ? 'w-64' : 'w-20',
      isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo Section -->
    <div class="px-4 py-5 border-b border-zinc-100 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3 no-underline" @click="closeMobileSidebar">
        <div class="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 shrink-0">
          <img src="/images/logo-2.png" alt="BEV Flow Logo" class="w-full h-full object-cover" />
        </div>
        <div v-if="isExpanded" class="overflow-hidden">
          <h2 class="text-base font-semibold text-zinc-900 whitespace-nowrap">BEV Flow</h2>
          <p class="text-[10px] text-amber-600 tracking-wider uppercase font-medium">Inventory System</p>
        </div>
      </NuxtLink>
      
      <!-- Collapse Button (Desktop) -->
      <button 
        @click="toggleSidebar"
        class="hidden lg:flex p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg"
        :title="isExpanded ? 'Collapse sidebar' : 'Expand sidebar'"
      >
        <UIcon :name="isExpanded ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open'" class="w-4 h-4" />
      </button>
      
      <!-- Close Button (Mobile) -->
      <button 
        @click="closeMobileSidebar"
        class="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg"
      >
        <UIcon name="i-lucide-x" class="w-4 h-4" />
      </button>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto">
      <div class="space-y-0.5">
        <p v-if="isExpanded" class="px-3 mb-2 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Main Menu</p>
        
        <NuxtLink 
          v-for="item in mainMenuItems" 
          :key="item.path"
          :to="item.path" 
          :class="[
            'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm no-underline',
            isActive(item.path) 
              ? 'bg-amber-50 text-amber-700 font-medium' 
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50',
            !isExpanded && 'justify-center'
          ]"
          :title="!isExpanded ? item.label : undefined"
          @click="closeMobileSidebar"
        >
          <UIcon 
            :name="item.icon" 
            :class="['w-5 h-5 shrink-0', isActive(item.path) ? 'text-amber-600' : 'text-zinc-400']" 
          />
          <span v-if="isExpanded">{{ item.label }}</span>
        </NuxtLink>
      </div>
      
      <div class="mt-6 space-y-0.5">
        <p v-if="isExpanded" class="px-3 mb-2 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Quick Actions</p>
        
        <NuxtLink 
          v-for="item in quickActionItems" 
          :key="item.path"
          :to="item.path" 
          :class="[
            'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm no-underline',
            isActive(item.path) 
              ? 'bg-amber-50 text-amber-700 font-medium' 
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50',
            !isExpanded && 'justify-center'
          ]"
          :title="!isExpanded ? item.label : undefined"
          @click="closeMobileSidebar"
        >
          <UIcon 
            :name="item.icon" 
            :class="['w-5 h-5 shrink-0', isActive(item.path) ? 'text-amber-600' : 'text-zinc-400']" 
          />
          <span v-if="isExpanded">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
    
    <!-- User Section -->
    <div class="px-3 py-4 border-t border-zinc-100">
      <div :class="['flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-50', !isExpanded && 'justify-center px-2']">
        <div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-user" class="w-4 h-4 text-amber-600" />
        </div>
        <div v-if="isExpanded" class="flex-1 min-w-0">
          <p class="text-sm font-medium text-zinc-900 truncate">Admin User</p>
          <p class="text-xs text-zinc-500 truncate">admin@bevflow.com</p>
        </div>
        <button 
          v-if="isExpanded"
          @click="handleLogout"
          class="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded"
          title="Logout"
        >
          <UIcon name="i-lucide-log-out" class="w-4 h-4" />
        </button>
      </div>
      <button 
        v-if="!isExpanded"
        @click="handleLogout"
        class="mt-2 w-full p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg flex items-center justify-center"
        title="Logout"
      >
        <UIcon name="i-lucide-log-out" class="w-4 h-4" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { isExpanded, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();

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
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated');
  closeMobileSidebar();
  router.push('/login');
};
</script>
