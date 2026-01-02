<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6 lg:mb-8">
        <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p class="mt-1 text-sm text-zinc-500">Welcome back! Here's your business overview.</p>
      </div>
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 lg:mb-8">
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-package" class="w-4 h-4 text-amber-600" />
            </div>
            <span class="text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <p class="text-lg sm:text-xl font-semibold text-zinc-900">{{ stats.totalProducts }}</p>
          <p class="text-[10px] sm:text-xs text-zinc-500 mt-1">Total Products</p>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-building-2" class="w-4 h-4 text-amber-600" />
            </div>
            <span class="text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full">+3</span>
          </div>
          <p class="text-lg sm:text-xl font-semibold text-zinc-900">{{ stats.totalSuppliers }}</p>
          <p class="text-[10px] sm:text-xs text-zinc-500 mt-1">Total Suppliers</p>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-clipboard-list" class="w-4 h-4 text-amber-600" />
            </div>
            <span class="text-[10px] sm:text-xs font-medium text-amber-600 bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded-full">Pending</span>
          </div>
          <p class="text-lg sm:text-xl font-semibold text-zinc-900">{{ stats.activePOs }}</p>
          <p class="text-[10px] sm:text-xs text-zinc-500 mt-1">Active POs</p>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-amber-600" />
            </div>
            <span class="text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full">+8.2%</span>
          </div>
          <p class="text-lg sm:text-xl font-semibold text-zinc-900">${{ stats.monthlySales.toFixed(2) }}</p>
          <p class="text-[10px] sm:text-xs text-zinc-500 mt-1">Monthly Sales</p>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5 col-span-2 sm:col-span-1">
          <div class="flex items-center justify-between mb-3">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-wallet" class="w-4 h-4 text-amber-600" />
            </div>
            <span class="text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full">+15%</span>
          </div>
          <p class="text-lg sm:text-xl font-semibold text-zinc-900">${{ stats.monthlyProfit.toFixed(2) }}</p>
          <p class="text-[10px] sm:text-xs text-zinc-500 mt-1">Monthly Profit</p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
        <!-- Sales by Category Chart -->
        <div class="lg:col-span-2 bg-white border border-zinc-200 rounded-lg p-4 sm:p-6">
          <div class="flex items-center gap-2 mb-4 sm:mb-6">
            <UIcon name="i-lucide-pie-chart" class="w-5 h-5 text-amber-600" />
            <h3 class="text-sm sm:text-base font-medium text-zinc-900">Sales by Beer Category</h3>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <!-- Donut Chart -->
            <div class="flex items-center justify-center">
              <svg width="180" height="180" viewBox="0 0 200 200" class="transform -rotate-90 w-40 h-40 sm:w-[180px] sm:h-[180px]">
                <circle cx="100" cy="100" r="70" fill="none" class="stroke-zinc-100" stroke-width="30" />
                <circle
                  v-for="segment in chartSegments"
                  :key="segment.category"
                  cx="100" cy="100" r="70" fill="none"
                  :stroke="segment.color"
                  stroke-width="30"
                  :stroke-dasharray="`${segment.percentage * 4.4} 440`"
                  :stroke-dashoffset="segment.offset"
                />
                <circle cx="100" cy="100" r="50" class="fill-white" />
              </svg>
            </div>
            
            <!-- Legend -->
            <div class="space-y-2">
              <div 
                v-for="category in analytics.categories" 
                :key="category.name"
                class="flex items-center justify-between py-1.5"
              >
                <div class="flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full" :style="{backgroundColor: category.color}" />
                  <span class="text-sm text-zinc-600">{{ category.name }}</span>
                </div>
                <span class="text-sm font-medium text-zinc-900">{{ category.percentage }}%</span>
              </div>
            </div>
          </div>
          
          <!-- Summary -->
          <div class="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-2 gap-4">
            <div class="bg-zinc-50 rounded-lg p-4">
              <p class="text-xs text-zinc-500 mb-1">Total Revenue</p>
              <p class="text-lg font-semibold text-zinc-900">${{ analytics.totalRevenue.toLocaleString() }}</p>
            </div>
            <div class="bg-amber-50 rounded-lg p-4">
              <p class="text-xs text-amber-600 mb-1">Top Category</p>
              <p class="text-lg font-semibold text-amber-700">{{ analytics.categories[0]?.name || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div class="bg-white border border-zinc-200 rounded-lg p-6">
          <div class="flex items-center gap-2 mb-6">
            <UIcon name="i-lucide-beer" class="w-5 h-5 text-amber-600" />
            <h3 class="text-base font-medium text-zinc-900">Top Selling Beers</h3>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="(product, index) in analytics.topProducts" 
              :key="product.name"
              class="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg"
            >
              <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm font-semibold text-amber-700">
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-zinc-900 truncate">{{ product.name }}</p>
                <p class="text-xs text-zinc-500">{{ product.type }}</p>
              </div>
              <span class="text-sm font-semibold text-amber-600">{{ product.sold }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white border border-zinc-200 rounded-lg p-6">
        <h2 class="text-base font-medium text-zinc-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <NuxtLink 
          to="/products/new" 
          class="flex flex-col items-center gap-2 p-4 bg-zinc-50 border border-zinc-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors no-underline"
        >
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-package-plus" class="w-5 h-5 text-amber-600" />
          </div>
          <span class="text-sm font-medium text-zinc-700">Add Product</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/suppliers/new" 
          class="flex flex-col items-center gap-2 p-4 bg-zinc-50 border border-zinc-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors no-underline"
        >
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-building-2" class="w-5 h-5 text-amber-600" />
          </div>
          <span class="text-sm font-medium text-zinc-700">Add Supplier</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/purchase-orders/new" 
          class="flex flex-col items-center gap-2 p-4 bg-zinc-50 border border-zinc-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors no-underline"
        >
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-file-plus" class="w-5 h-5 text-amber-600" />
          </div>
          <span class="text-sm font-medium text-zinc-700">Create PO</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/sales/new" 
          class="flex flex-col items-center gap-2 p-4 bg-zinc-50 border border-zinc-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors no-underline"
        >
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-receipt" class="w-5 h-5 text-amber-600" />
          </div>
          <span class="text-sm font-medium text-zinc-700">Record Sale</span>
        </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { DashboardStats } from '~/types';

const stats = ref<DashboardStats>({
  totalProducts: 0,
  totalSuppliers: 0,
  activePOs: 0,
  monthlySales: 0,
  monthlyProfit: 0,
});

// Analytics Data for charts
const analytics = ref({
  totalRevenue: 245000,
  topProducts: [
    { name: 'Angkor Beer', type: 'Lager', sold: 1250 },
    { name: 'Anchor Beer', type: 'Pilsner', sold: 980 },
    { name: 'ABC Extra Stout', type: 'Stout', sold: 850 },
    { name: 'Tiger Beer', type: 'Lager', sold: 720 },
    { name: 'Heineken', type: 'Premium', sold: 650 },
  ],
  categories: [
    { name: 'Premium Lager', percentage: 28, color: '#8b5cf6' },
    { name: 'Craft Beer', percentage: 18, color: '#3b82f6' },
    { name: 'Stout & Porter', percentage: 15, color: '#22c55e' },
    { name: 'IPA', percentage: 12, color: '#06b6d4' },
    { name: 'Wheat Beer', percentage: 10, color: '#ec4899' },
    { name: 'Pale Ale', percentage: 8, color: '#f59e0b' },
    { name: 'Light Beer', percentage: 5, color: '#eab308' },
    { name: 'Dark Lager', percentage: 4, color: '#f97316' },
  ],
});

// Calculate chart segments for donut chart
const chartSegments = computed(() => {
  let cumulativePercentage = 0;
  return analytics.value.categories.map((category) => {
    const segment = {
      category: category.name,
      percentage: category.percentage,
      color: category.color,
      offset: -cumulativePercentage * 4.4,
    };
    cumulativePercentage += category.percentage;
    return segment;
  });
});

onMounted(async () => {
  try {
    const response = await $fetch<DashboardStats>('/api/dashboard/stats');
    stats.value = response;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }
});
</script>