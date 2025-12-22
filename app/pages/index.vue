<template>
  <div class="p-8 min-h-screen bg-white dark:bg-zinc-950 animate-fade-in transition-colors duration-200">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Dashboard</h1>
      <p class="mt-1 text-zinc-600 dark:text-zinc-400">Welcome back! Here's your business overview.</p>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-package" class="w-5 h-5 text-zinc-900" />
          </div>
          <span class="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500 px-2 py-1 rounded-full">+12%</span>
        </div>
        <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ stats.totalProducts }}</p>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Total Products</p>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-building-2" class="w-5 h-5 text-zinc-900" />
          </div>
          <span class="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500 px-2 py-1 rounded-full">+3</span>
        </div>
        <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ stats.totalSuppliers }}</p>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Total Suppliers</p>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-clipboard-list" class="w-5 h-5 text-zinc-900" />
          </div>
          <span class="text-xs font-bold text-amber-400 bg-amber-500/20 border border-amber-500 px-2 py-1 rounded-full">Pending</span>
        </div>
        <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ stats.activePOs }}</p>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Active POs</p>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-zinc-900" />
          </div>
          <span class="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500 px-2 py-1 rounded-full">+8.2%</span>
        </div>
        <p class="text-2xl font-bold text-zinc-900 dark:text-white">${{ stats.monthlySales.toFixed(2) }}</p>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Monthly Sales</p>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-wallet" class="w-5 h-5 text-zinc-900" />
          </div>
          <span class="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500 px-2 py-1 rounded-full">+15%</span>
        </div>
        <p class="text-2xl font-bold text-zinc-900 dark:text-white">${{ stats.monthlyProfit.toFixed(2) }}</p>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Monthly Profit</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-2xl">
      <h2 class="text-lg font-semibold text-zinc-900 dark:text-white mb-5">Quick Actions</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink 
          to="/products/new" 
          class="flex flex-col items-center gap-3 p-5 bg-zinc-100 dark:bg-zinc-800 border border-amber-500/50 rounded-xl hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200 no-underline group"
        >
          <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center transition-all">
            <UIcon name="i-lucide-package-plus" class="w-6 h-6 text-zinc-900" />
          </div>
          <span class="text-sm font-medium text-zinc-900 dark:text-white">Add Product</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/suppliers/new" 
          class="flex flex-col items-center gap-3 p-5 bg-zinc-100 dark:bg-zinc-800 border border-amber-500/50 rounded-xl hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200 no-underline group"
        >
          <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center transition-all">
            <UIcon name="i-lucide-building-2" class="w-6 h-6 text-zinc-900" />
          </div>
          <span class="text-sm font-medium text-zinc-900 dark:text-white">Add Supplier</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/purchase-orders/new" 
          class="flex flex-col items-center gap-3 p-5 bg-zinc-100 dark:bg-zinc-800 border border-amber-500/50 rounded-xl hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200 no-underline group"
        >
          <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center transition-all">
            <UIcon name="i-lucide-file-plus" class="w-6 h-6 text-zinc-900" />
          </div>
          <span class="text-sm font-medium text-zinc-900 dark:text-white">Create PO</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/sales/new" 
          class="flex flex-col items-center gap-3 p-5 bg-zinc-100 dark:bg-zinc-800 border border-amber-500/50 rounded-xl hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200 no-underline group"
        >
          <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center transition-all">
            <UIcon name="i-lucide-receipt" class="w-6 h-6 text-zinc-900" />
          </div>
          <span class="text-sm font-medium text-zinc-900 dark:text-white">Record Sale</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { DashboardStats } from '~/types';


const stats = ref<DashboardStats>({
  totalProducts: 0,
  totalSuppliers: 0,
  activePOs: 0,
  monthlySales: 0,
  monthlyProfit: 0,
});

onMounted(async () => {
  // TODO: Replace with actual API endpoint
  try {
    const response = await $fetch<DashboardStats>('/api/dashboard/stats');
    stats.value = response;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }
});
</script>