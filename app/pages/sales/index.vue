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

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-receipt" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Total Sales</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">${{ totalSales.toFixed(2) }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-file-text" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Transactions</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">{{ sales.length }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-package" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Items Sold</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">{{ totalQuantity }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Avg. Sale</div>
        </div>
        <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${{ avgSale.toFixed(2) }}</div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="w-16 h-16 bg-red-500/20 border border-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-red-400" />
      </div>
      <p class="text-zinc-600 dark:text-zinc-400">{{ error }}</p>
    </div>
    
    <!-- Sales Table -->
    <div v-else class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-zinc-200 dark:bg-zinc-800 border-b border-amber-500/50">
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Invoice No.</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Product</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Qty</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Unit Price</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Total</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            <tr v-for="sale in sales" :key="sale.sale_id" class="hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 bg-amber-500/20 border border-amber-500 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-md">
                  {{ sale.invoice_number }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
                    <UIcon name="i-lucide-user" class="w-4 h-4 text-zinc-900" />
                  </div>
                  <span class="text-sm font-medium text-zinc-900 dark:text-white">{{ sale.customer_name || '-' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{{ formatDate(sale.sale_date) }}</td>
              <td class="px-6 py-4">
                <div>
                  <span class="text-sm font-medium text-zinc-900 dark:text-white">{{ sale.product?.product_name }}</span>
                  <span class="block text-xs text-zinc-500">{{ sale.product?.sku }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300 text-right">{{ sale.quantity }}</td>
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300 text-right">${{ Number(sale.unit_price).toFixed(2) }}</td>
              <td class="px-6 py-4 text-right">
                <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">${{ Number(sale.total_amount).toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end">
                  <button 
                    class="p-2 text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                    @click="handleDelete(sale.sale_id!)" 
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
      <div v-if="sales.length === 0" class="text-center py-16">
        <div class="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-lucide-receipt" class="w-8 h-8 text-zinc-500 dark:text-zinc-600" />
        </div>
        <h3 class="text-lg font-medium text-zinc-900 dark:text-white mb-1">No sales recorded</h3>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Start by recording your first sale transaction.</p>
        <NuxtLink 
          to="/sales/new" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors no-underline"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Record Sale
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { sales, loading, error, fetchSales, deleteSale } = useSales();

onMounted(() => {
  fetchSales();
});

const totalSales = computed(() => {
  return sales.value.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);
});

const totalQuantity = computed(() => {
  return sales.value.reduce((sum, sale) => sum + sale.quantity, 0);
});

const avgSale = computed(() => {
  if (sales.value.length === 0) return 0;
  return totalSales.value / sales.value.length;
});

const formatDate = (date?: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this sale?')) {
    await deleteSale(id);
  }
};
</script>
