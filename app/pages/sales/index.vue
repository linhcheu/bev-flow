<template>
  <div class="p-8 min-h-screen bg-white dark:bg-zinc-950 animate-fade-in transition-colors duration-200">
    <!-- Header -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Sales</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Track and manage your sales transactions</p>
      </div>
      <NuxtLink 
        to="/sales/new" 
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors no-underline shadow-lg shadow-amber-500/30"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4" />
        Record Sale
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-5 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-calendar" class="w-4 h-4 text-amber-600 dark:text-amber-500" />
          <span class="text-sm text-zinc-700 dark:text-zinc-300">Filter by date:</span>
        </div>
        <input 
          v-model="startDate" 
          type="date" 
          class="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-amber-500/50 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          @change="handleFilterChange"
        />
        <span class="text-zinc-500">to</span>
        <input 
          v-model="endDate" 
          type="date" 
          class="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-amber-500/50 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          @change="handleFilterChange"
        />
        <button 
          @click="handleFilterChange" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors"
        >
          <UIcon name="i-lucide-filter" class="w-4 h-4" />
          Apply
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
    </div>

    <!-- Sales List -->
    <div v-else class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-zinc-200 dark:bg-zinc-800 border-b border-amber-500/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Product</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Quantity</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Unit Price</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Total</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Payment</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            <tr v-for="sale in sales" :key="sale.id" class="hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                {{ new Date(sale.saleDate).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-zinc-900 dark:text-white">{{ sale.productName }}</div>
                <div class="text-xs text-zinc-600 dark:text-zinc-500">{{ sale.productSku }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{{ sale.quantity }}</td>
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">${{ sale.unitPrice.toFixed(2) }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-amber-600 dark:text-amber-500">${{ sale.totalAmount.toFixed(2) }}</td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  sale.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 
                  sale.paymentStatus === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500' : 
                  'bg-red-500/20 text-red-400 border border-red-500'
                ]">
                  {{ sale.paymentStatus }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <div class="flex items-center gap-2">
                  <button 
                    @click="viewSale(sale.id)" 
                    class="text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                    title="View"
                  >
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  </button>
                  <button 
                    @click="deleteSale(sale.id)" 
                    class="text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Delete"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!sales.length && !loading" class="text-center py-16">
        <UIcon name="i-lucide-receipt" class="w-16 h-16 text-zinc-500 dark:text-zinc-700 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-zinc-700 dark:text-zinc-400 mb-2">No sales found</h3>
        <p class="text-sm text-zinc-600 dark:text-zinc-500 mb-6">Start recording your first sale transaction</p>
        <NuxtLink 
          to="/sales/new" 
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors no-underline"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Record Sale
        </NuxtLink>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-lg">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Total Sales</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">${{ totalSales.toFixed(2) }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-lg">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-package" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Items Sold</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">{{ totalQuantity }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-lg">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-receipt" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Transactions</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">{{ sales.length }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Sale {
  id: number;
  saleDate: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

const sales = ref<Sale[]>([]);
const loading = ref(false);
const startDate = ref('');
const endDate = ref('');

const totalSales = computed(() => {
  return sales.value.reduce((sum, sale) => sum + sale.totalAmount, 0);
});

const totalQuantity = computed(() => {
  return sales.value.reduce((sum, sale) => sum + sale.quantity, 0);
});

const handleFilterChange = () => {
  console.log('Filtering sales from', startDate.value, 'to', endDate.value);
  // TODO: Implement filtering logic
};

const viewSale = (id: number) => {
  console.log('Viewing sale:', id);
  // TODO: Implement view logic
};

const deleteSale = (id: number) => {
  if (confirm('Are you sure you want to delete this sale?')) {
    sales.value = sales.value.filter(s => s.id !== id);
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    // TODO: Replace with actual API call
    // const response = await $fetch('/api/sales');
    // sales.value = response;
  } catch (error) {
    console.error('Failed to fetch sales:', error);
  } finally {
    loading.value = false;
  }
});
</script>
