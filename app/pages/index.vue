<template>
  <div class="px-12 py-10">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl font-light text-neutral-800 tracking-wide mb-2">Dashboard</h1>
      <p class="text-sm text-neutral-500 tracking-wider uppercase">Overview & Insights</p>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
      <div class="bg-white border border-neutral-200 p-8 rounded-sm hover:shadow-lg transition-shadow duration-300">
        <h3 class="text-[10px] font-medium text-neutral-500 uppercase tracking-[0.15em] mb-3">Total Products</h3>
        <p class="text-4xl font-light text-neutral-900">{{ stats.totalProducts }}</p>
      </div>
      
      <div class="bg-white border border-neutral-200 p-8 rounded-sm hover:shadow-lg transition-shadow duration-300">
        <h3 class="text-[10px] font-medium text-neutral-500 uppercase tracking-[0.15em] mb-3">Total Suppliers</h3>
        <p class="text-4xl font-light text-neutral-900">{{ stats.totalSuppliers }}</p>
      </div>
      
      <div class="bg-white border border-neutral-200 p-8 rounded-sm hover:shadow-lg transition-shadow duration-300">
        <h3 class="text-[10px] font-medium text-neutral-500 uppercase tracking-[0.15em] mb-3">Active POs</h3>
        <p class="text-4xl font-light text-neutral-900">{{ stats.activePOs }}</p>
      </div>
      
      <div class="bg-white border border-neutral-200 p-8 rounded-sm hover:shadow-lg transition-shadow duration-300">
        <h3 class="text-[10px] font-medium text-neutral-500 uppercase tracking-[0.15em] mb-3">Monthly Sales</h3>
        <p class="text-4xl font-light text-[#D4AF37]">${{ stats.monthlySales.toFixed(2) }}</p>
      </div>
      
      <div class="bg-white border border-neutral-200 p-8 rounded-sm hover:shadow-lg transition-shadow duration-300">
        <h3 class="text-[10px] font-medium text-neutral-500 uppercase tracking-[0.15em] mb-3">Monthly Profit</h3>
        <p class="text-4xl font-light text-[#D4AF37]">${{ stats.monthlyProfit.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-2xl font-light text-neutral-800 mb-6 tracking-wide">Quick Actions</h2>
      <div class="flex flex-wrap gap-4">
        <NuxtLink 
          to="/products/new" 
          class="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 no-underline"
        >
          Add Product
        </NuxtLink>
        <NuxtLink 
          to="/suppliers/new" 
          class="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 no-underline"
        >
          Add Supplier
        </NuxtLink>
        <NuxtLink 
          to="/purchase-orders/new" 
          class="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 no-underline"
        >
          Create PO
        </NuxtLink>
        <NuxtLink 
          to="/sales/new" 
          class="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 no-underline"
        >
          Record Sale
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