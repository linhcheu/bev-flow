<template>
  <div class="min-h-screen bg-zinc-950 animate-fade-in transition-colors duration-200">
    <!-- Top Navigation Bar -->
    <nav class="bg-zinc-950 border-b border-zinc-800 shadow-lg">
      <div class="px-8 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo and Title -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg overflow-hidden bg-amber-500/10 p-1">
              <img src="/images/logo-2.png" alt="BEV Flow Logo" class="w-full h-full object-cover" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">BEV Flow Analytics</h1>
              <p class="text-sm text-zinc-300">Business Dashboard</p>
            </div>
          </div>
          
          <!-- Admin Info & Navigation -->
          <div class="flex items-center gap-4">
            <!-- Admin Profile -->
            <div class="flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-amber-500/50 rounded-lg">
              <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500">
                <img src="/images/logo-2.png" alt="Admin" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="text-sm font-semibold text-white">{{ adminInfo.name }}</p>
                <div class="flex items-center gap-1 text-xs text-zinc-300">
                  <UIcon name="i-lucide-phone" class="w-3 h-3" />
                  <span>{{ adminInfo.phone }}</span>
                </div>
              </div>
            </div>

            <!-- Back Button -->
            <NuxtLink 
              to="/" 
              class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 no-underline shadow-lg shadow-amber-500/30"
            >
              <UIcon name="i-lucide-home" class="w-4 h-4" />
              Back to Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="p-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left & Center Columns - Analytics -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Welcome Card -->
          <div class="relative bg-zinc-900 rounded-2xl p-8 text-white shadow-2xl overflow-hidden border-2 border-amber-500">
            <div class="absolute inset-0 bg-linear-to-br from-amber-500/10 to-amber-600/5"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <UIcon name="i-lucide-trending-up" class="w-6 h-6 text-zinc-900" />
                </div>
                <h2 class="text-3xl font-bold text-white">Analytics Dashboard</h2>
              </div>
              <p class="text-zinc-300 text-lg">Track your beverage business performance in real-time</p>
            </div>
          </div>

          <!-- Key Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <!-- Total Products -->
            <div class="bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all group">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center transition-colors">
                  <UIcon name="i-lucide-package" class="w-6 h-6 text-zinc-900" />
                </div>
                <span class="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500 px-3 py-1.5 rounded-full">+15%</span>
              </div>
              <p class="text-3xl font-bold text-white mb-1">{{ analytics.totalProducts }}</p>
              <p class="text-sm text-zinc-300 font-medium">Total Products</p>
              <div class="mt-3 pt-3 border-t border-zinc-800">
                <p class="text-xs text-zinc-400">Beer brands available</p>
              </div>
            </div>

            <!-- Monthly Sales -->
            <div class="bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all group">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center transition-colors">
                  <UIcon name="i-lucide-trending-up" class="w-6 h-6 text-zinc-900" />
                </div>
                <span class="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500 px-3 py-1.5 rounded-full">+28%</span>
              </div>
              <p class="text-3xl font-bold text-white mb-1">${{ analytics.monthlySales.toLocaleString() }}</p>
              <p class="text-sm text-zinc-300 font-medium">Monthly Sales</p>
              <div class="mt-3 pt-3 border-t border-zinc-800">
                <p class="text-xs text-zinc-400">This month revenue</p>
              </div>
            </div>

            <!-- Sales Rate -->
            <div class="bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all group">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center transition-colors">
                  <UIcon name="i-lucide-activity" class="w-6 h-6 text-zinc-900" />
                </div>
                <span class="text-xs font-bold text-amber-400 bg-amber-500/20 border border-amber-500 px-3 py-1.5 rounded-full">Live</span>
              </div>
              <p class="text-3xl font-bold text-white mb-1">{{ analytics.salesRate }}%</p>
              <p class="text-sm text-zinc-300 font-medium">Sales Rate</p>
              <div class="mt-3 pt-3 border-t border-zinc-800">
                <p class="text-xs text-zinc-400">Growth rate this quarter</p>
              </div>
            </div>
          </div>

          <!-- Analytics Chart Section - Donut Chart -->
          <div class="bg-zinc-900 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <UIcon name="i-lucide-pie-chart" class="w-5 h-5 text-zinc-900" />
              </div>
              <h3 class="text-xl font-bold text-white">Sales by Beer Category</h3>
            </div>
            
            <!-- Donut Chart -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
              <!-- Chart -->
              <div class="flex items-center justify-center">
                <svg width="280" height="280" viewBox="0 0 280 280" class="transform -rotate-90">
                  <!-- Background circle -->
                  <circle
                    cx="140"
                    cy="140"
                    r="100"
                    fill="none"
                    stroke="#27272a"
                    stroke-width="40"
                  ></circle>
                  
                  <!-- Dynamic segments -->
                  <circle
                    v-for="(segment, index) in chartSegments"
                    :key="segment.category"
                    cx="140"
                    cy="140"
                    r="100"
                    fill="none"
                    :stroke="segment.color"
                    stroke-width="40"
                    :stroke-dasharray="`${segment.percentage * 6.28} 628`"
                    :stroke-dashoffset="segment.offset"
                    class="transition-all duration-500"
                  ></circle>
                  
                  <!-- Center circle -->
                  <circle
                    cx="140"
                    cy="140"
                    r="70"
                    fill="#18181b"
                  ></circle>
                </svg>
              </div>
              
              <!-- Legend -->
              <div class="space-y-3">
                <div 
                  v-for="category in analytics.categories" 
                  :key="category.name"
                  class="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div 
                      class="w-3 h-3 rounded-full"
                      :style="{backgroundColor: category.color}"
                    ></div>
                    <span class="text-sm text-white font-medium">{{ category.name }}</span>
                  </div>
                  <span class="text-sm font-bold text-white">{{ category.percentage }}%</span>
                </div>
              </div>
            </div>
            
            <!-- Summary Stats -->
            <div class="pt-6 border-t border-zinc-800 grid grid-cols-2 gap-4">
              <div class="bg-zinc-800 border border-amber-500/30 rounded-lg p-4">
                <p class="text-xs text-zinc-300 mb-1">Total Revenue</p>
                <p class="text-2xl font-bold text-white">${{ analytics.totalRevenue.toLocaleString() }}</p>
              </div>
              <div class="bg-amber-500/10 border border-amber-500 rounded-lg p-4">
                <p class="text-xs text-amber-400 mb-1">Top Category</p>
                <p class="text-2xl font-bold text-amber-500">{{ analytics.categories[0]?.name || 'N/A' }}</p>
              </div>
            </div>

            <!-- Product Performance -->
            <div class="pt-6 border-t border-zinc-800">
              <h4 class="text-lg font-semibold text-white mb-4">Top Selling Beers</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  v-for="product in analytics.topProducts" 
                  :key="product.name"
                  class="bg-zinc-800 border border-amber-500/50 rounded-xl p-4 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all"
                >
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                      <UIcon name="i-lucide-beer" class="w-5 h-5 text-zinc-900" />
                    </div>
                    <div>
                      <p class="font-bold text-white">{{ product.name }}</p>
                      <p class="text-xs text-zinc-300">{{ product.type }}</p>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-zinc-300">Sold:</span>
                    <span class="text-lg font-bold text-amber-500">{{ product.sold }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Total Suppliers -->
            <div class="bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center">
                  <UIcon name="i-lucide-building-2" class="w-7 h-7 text-zinc-900" />
                </div>
                <div>
                  <p class="text-3xl font-bold text-white">{{ analytics.totalSuppliers }}</p>
                  <p class="text-sm text-zinc-300 font-medium">Active Suppliers</p>
                </div>
              </div>
              <div class="pt-4 border-t border-zinc-800">
                <p class="text-xs text-zinc-400">Providing quality beverages</p>
              </div>
            </div>

            <!-- Average Order Value -->
            <div class="bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center">
                  <UIcon name="i-lucide-dollar-sign" class="w-7 h-7 text-zinc-900" />
                </div>
                <div>
                  <p class="text-3xl font-bold text-white">${{ analytics.avgOrderValue }}</p>
                  <p class="text-sm text-zinc-300 font-medium">Avg. Order Value</p>
                </div>
              </div>
              <div class="pt-4 border-t border-zinc-800">
                <p class="text-xs text-zinc-400">Per transaction average</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Suppliers Directory -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Admin Profile Card -->
          <div class="relative bg-zinc-900 rounded-2xl p-6 text-white shadow-2xl overflow-hidden border-2 border-amber-500">
            <div class="absolute inset-0 bg-linear-to-br from-amber-500/10 to-amber-600/5"></div>
            <div class="relative z-10">
              <div class="flex items-start gap-4 mb-4">
                <div class="w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-500 shrink-0">
                  <img src="/images/logo-2.png" alt="Admin" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-white mb-1">{{ adminInfo.name }}</h3>
                  <p class="text-sm text-zinc-300 mb-2">{{ adminInfo.role }}</p>
                  <div class="flex items-center gap-2 text-sm text-zinc-200">
                    <UIcon name="i-lucide-phone" class="w-4 h-4 text-amber-500" />
                    <span>{{ adminInfo.phone }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-zinc-200 mt-1">
                    <UIcon name="i-lucide-mail" class="w-4 h-4 text-amber-500" />
                    <span>{{ adminInfo.email }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Suppliers Header Card -->
          <div class="relative bg-zinc-900 rounded-2xl p-6 text-white shadow-2xl overflow-hidden border-2 border-amber-500">
            <div class="absolute inset-0 bg-linear-to-br from-amber-500/10 to-amber-600/5"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <UIcon name="i-lucide-users" class="w-5 h-5 text-zinc-900" />
                </div>
                <h2 class="text-2xl font-bold text-white">Our Suppliers</h2>
              </div>
              <p class="text-zinc-300 text-sm">Trusted beer suppliers directory</p>
            </div>
          </div>

          <!-- Supplier List -->
          <div class="bg-zinc-900 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl">
            <h3 class="text-lg font-bold text-white mb-5">Supplier Directory</h3>
            
            <div class="space-y-4">
                <div 
                  v-for="supplier in suppliers" 
                  :key="supplier.id"
                  class="bg-zinc-800 border border-amber-500/50 rounded-xl p-5 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all"
                >
                  <!-- Supplier Header -->
                  <div class="flex items-start gap-3 mb-4">
                    <div class="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
                      <UIcon name="i-lucide-building-2" class="w-6 h-6 text-zinc-900" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="text-base font-bold text-white mb-1">{{ supplier.name }}</h4>
                      <div class="flex items-center gap-2 text-sm text-zinc-300 mb-2">
                        <UIcon name="i-lucide-phone" class="w-4 h-4 text-emerald-400" />
                        <span class="font-medium">{{ supplier.phone }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Beer Products -->
                  <div class="mb-3">
                    <p class="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Beer Brands:</p>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="beer in supplier.beers" 
                        :key="beer"
                        class="px-3 py-1.5 bg-amber-500/10 border border-amber-500 rounded-lg text-xs font-semibold text-amber-400 flex items-center gap-1"
                      >
                        <UIcon name="i-lucide-beer" class="w-3 h-3" />
                        {{ beer }}
                      </span>
                    </div>
                  </div>

                  <!-- Additional Info -->
                  <div class="pt-3 border-t border-zinc-700 flex items-center justify-between">
                    <span class="text-xs text-zinc-300">Stock Level:</span>
                    <span class="text-xs font-bold text-emerald-400">{{ supplier.stockLevel }}</span>
                  </div>
                </div>
            </div>
          </div>

          <!-- Add New Supplier Button -->
          <button class="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30">
            <UIcon name="i-lucide-plus-circle" class="w-5 h-5" />
            Add New Supplier
          </button>

          <!-- Quick Stats -->
          <div class="bg-zinc-900 border-2 border-amber-500 rounded-xl p-5 shadow-lg">
            <h4 class="text-sm font-bold text-white mb-4">Quick Stats</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-zinc-300">Total Beer Types:</span>
                <span class="text-sm font-bold text-white">{{ quickStats.totalBeerTypes }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-zinc-300">Orders This Month:</span>
                <span class="text-sm font-bold text-white">{{ quickStats.ordersThisMonth }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-zinc-300">Avg. Delivery Time:</span>
                <span class="text-sm font-bold text-white">{{ quickStats.avgDeliveryTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Define page meta to remove default layout
definePageMeta({
  layout: false,
});

// Analytics Data
const analytics = ref({
  totalProducts: 45,
  monthlySales: 125800,
  salesRate: 87.5,
  totalSuppliers: 8,
  avgOrderValue: 2450,
  maxSales: 45000,
  monthlyPerformance: [
    { month: 'January', sales: 35000 },
    { month: 'February', sales: 42000 },
    { month: 'March', sales: 38500 },
    { month: 'April', sales: 45000 },
    { month: 'May', sales: 41000 },
    { month: 'June', sales: 43500 },
  ],
  totalRevenue: 245000,
  avgMonthly: 40833,
  topProducts: [
    { name: 'Angkor Beer', type: 'Lager', sold: 1250 },
    { name: 'Anchor Beer', type: 'Pilsner', sold: 980 },
    { name: 'ABC Extra Stout', type: 'Stout', sold: 850 },
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

// Admin Information
const adminInfo = ref({
  name: 'Admin User',
  role: 'System Administrator',
  phone: '+855 23 456 7890',
  email: 'admin@bevflow.com',
});

// Calculate chart segments for donut chart
const chartSegments = computed(() => {
  let cumulativePercentage = 0;
  return analytics.value.categories.map((category) => {
    const segment = {
      category: category.name,
      percentage: category.percentage,
      color: category.color,
      offset: -cumulativePercentage * 6.28,
    };
    cumulativePercentage += category.percentage;
    return segment;
  });
});

// Suppliers Data with Beer Brands
const suppliers = ref([
  {
    id: 1,
    name: 'Angkor Beer Distributor',
    phone: '+855 23 123 4567',
    beers: ['Angkor', 'Angkor Extra', 'Angkor Premium'],
    stockLevel: 'High',
  },
  {
    id: 2,
    name: 'Anchor Beer Supply Co.',
    phone: '+855 23 234 5678',
    beers: ['Anchor Smooth', 'Anchor Strong'],
    stockLevel: 'Medium',
  },
  {
    id: 3,
    name: 'ABC Beer Imports',
    phone: '+855 23 345 6789',
    beers: ['ABC Extra Stout', 'ABC Premium'],
    stockLevel: 'High',
  },
  {
    id: 4,
    name: 'Tiger Beer Distributor',
    phone: '+855 23 456 7890',
    beers: ['Tiger Beer', 'Tiger Crystal'],
    stockLevel: 'Medium',
  },
  {
    id: 5,
    name: 'Cambodia Brewery Ltd',
    phone: '+855 23 567 8901',
    beers: ['Angkor', 'Bayon Beer', 'Klang Beer'],
    stockLevel: 'High',
  },
  {
    id: 6,
    name: 'International Beer Supply',
    phone: '+855 23 678 9012',
    beers: ['Heineken', 'Tiger', 'Anchor'],
    stockLevel: 'Low',
  },
]);

// Quick Stats
const quickStats = ref({
  totalBeerTypes: 15,
  ordersThisMonth: 234,
  avgDeliveryTime: '2-3 days',
});
</script>

<style scoped>
/* Optional: Add any additional custom styles */
</style>
