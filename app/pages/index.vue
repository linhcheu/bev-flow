<template>
  <div class="p-8">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
      <p class="mt-1 text-zinc-500">Welcome back! Here's your business overview.</p>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
      <div class="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg hover:shadow-zinc-200/50 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-package" class="w-5 h-5 text-blue-600" />
          </div>
          <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
        </div>
        <p class="text-2xl font-bold text-zinc-900">{{ stats.totalProducts }}</p>
        <p class="text-sm text-zinc-500 mt-1">Total Products</p>
      </div>
      
      <div class="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg hover:shadow-zinc-200/50 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-building-2" class="w-5 h-5 text-purple-600" />
          </div>
          <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+3</span>
        </div>
        <p class="text-2xl font-bold text-zinc-900">{{ stats.totalSuppliers }}</p>
        <p class="text-sm text-zinc-500 mt-1">Total Suppliers</p>
      </div>
      
      <div class="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg hover:shadow-zinc-200/50 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-clipboard-list" class="w-5 h-5 text-amber-600" />
          </div>
          <span class="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Pending</span>
        </div>
        <p class="text-2xl font-bold text-zinc-900">{{ stats.activePOs }}</p>
        <p class="text-sm text-zinc-500 mt-1">Active POs</p>
      </div>
      
      <div class="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg hover:shadow-zinc-200/50 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-emerald-600" />
          </div>
          <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+8.2%</span>
        </div>
        <p class="text-2xl font-bold text-zinc-900">${{ stats.monthlySales.toFixed(2) }}</p>
        <p class="text-sm text-zinc-500 mt-1">Monthly Sales</p>
      </div>
      
      <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-200/50 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-wallet" class="w-5 h-5 text-white" />
          </div>
          <span class="text-xs font-medium text-white/90 bg-white/20 px-2 py-1 rounded-full">+15%</span>
        </div>
        <p class="text-2xl font-bold text-white">${{ stats.monthlyProfit.toFixed(2) }}</p>
        <p class="text-sm text-white/80 mt-1">Monthly Profit</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white border border-zinc-200 rounded-xl p-6">
      <h2 class="text-lg font-semibold text-zinc-900 mb-5">Quick Actions</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink 
          to="/products/new" 
          class="flex flex-col items-center gap-3 p-5 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-all duration-200 no-underline group"
        >
          <div class="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center group-hover:border-amber-300 group-hover:bg-amber-50 transition-all">
            <UIcon name="i-lucide-package-plus" class="w-6 h-6 text-zinc-600 group-hover:text-amber-600" />
          </div>
          <span class="text-sm font-medium text-zinc-700">Add Product</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/suppliers/new" 
          class="flex flex-col items-center gap-3 p-5 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-all duration-200 no-underline group"
        >
          <div class="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center group-hover:border-amber-300 group-hover:bg-amber-50 transition-all">
            <UIcon name="i-lucide-building-2" class="w-6 h-6 text-zinc-600 group-hover:text-amber-600" />
          </div>
          <span class="text-sm font-medium text-zinc-700">Add Supplier</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/purchase-orders/new" 
          class="flex flex-col items-center gap-3 p-5 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-all duration-200 no-underline group"
        >
          <div class="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center group-hover:border-amber-300 group-hover:bg-amber-50 transition-all">
            <UIcon name="i-lucide-file-plus" class="w-6 h-6 text-zinc-600 group-hover:text-amber-600" />
          </div>
          <span class="text-sm font-medium text-zinc-700">Create PO</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/sales/new" 
          class="flex flex-col items-center gap-3 p-5 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-all duration-200 no-underline group"
        >
          <div class="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center group-hover:border-amber-300 group-hover:bg-amber-50 transition-all">
            <UIcon name="i-lucide-receipt" class="w-6 h-6 text-zinc-600 group-hover:text-amber-600" />
          </div>
          <span class="text-sm font-medium text-zinc-700">Record Sale</span>
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