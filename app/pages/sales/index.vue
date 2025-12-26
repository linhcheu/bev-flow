<template>
  <div class="p-8 min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-200">
    <!-- Header -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
      class="flex justify-between items-start mb-8"
    >
      <div>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Sales</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Track and manage your sales transactions</p>
      </div>
      <NuxtLink 
        to="/sales/new" 
        class="btn-primary no-underline"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4" />
        Record Sale
      </NuxtLink>
    </div>

    <!-- Summary Cards -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 50 } }"
      class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6"
    >
      <div class="stat-card">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-receipt" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Total Sales</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">${{ totalSales.toFixed(2) }}</div>
      </div>
      
      <div class="stat-card">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-file-text" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Transactions</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">{{ sales.length }}</div>
      </div>
      
      <div class="stat-card">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-package" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Items Sold</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">{{ totalQuantity }}</div>
      </div>
      
      <div class="stat-card">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Avg. Sale</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">${{ avgSale.toFixed(2) }}</div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-3">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
        <p class="text-sm text-zinc-500">Loading sales...</p>
      </div>
    </div>

    <!-- Sales Table -->
    <div 
      v-else
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
      class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl overflow-hidden shadow-2xl"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-zinc-200 dark:bg-zinc-800 border-b border-amber-500/50">
              <th class="table-header">Invoice No.</th>
              <th class="table-header">Customer</th>
              <th class="table-header">Date</th>
              <th class="table-header">Product</th>
              <th class="table-header text-right">Qty</th>
              <th class="table-header text-right">Unit Price</th>
              <th class="table-header text-right">Total</th>
              <th class="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            <tr 
              v-for="(sale, index) in sales" 
              :key="sale.sale_id" 
              v-motion
              :initial="{ opacity: 0, x: -20 }"
              :enter="{ opacity: 1, x: 0, transition: { delay: index * 50 } }"
              class="hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <td class="table-cell">
                <span class="badge badge-warning font-semibold">
                  {{ sale.invoice_number }}
                </span>
              </td>
              <td class="table-cell">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-lucide-user" class="w-4 h-4 text-zinc-900" />
                  </div>
                  <span class="font-medium text-zinc-900 dark:text-white">{{ sale.customer_name || '-' }}</span>
                </div>
              </td>
              <td class="table-cell">{{ formatDate(sale.sale_date) }}</td>
              <td class="table-cell">
                <div>
                  <span class="font-medium text-zinc-900 dark:text-white">{{ sale.product?.product_name }}</span>
                  <span class="block text-xs text-zinc-500">{{ sale.product?.sku }}</span>
                </div>
              </td>
              <td class="table-cell text-right">{{ sale.quantity }}</td>
              <td class="table-cell text-right">${{ Number(sale.unit_price).toFixed(2) }}</td>
              <td class="table-cell text-right">
                <span class="font-semibold text-emerald-600 dark:text-emerald-400">${{ Number(sale.total_amount).toFixed(2) }}</span>
              </td>
              <td class="table-cell">
                <div class="flex items-center justify-end gap-1">
                  <button 
                    @click="handleDelete(sale.sale_id!)" 
                    class="icon-btn icon-btn-danger"
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
      <div v-if="sales.length === 0" class="text-center py-16">
        <div 
          v-motion
          :initial="{ scale: 0.8, opacity: 0 }"
          :enter="{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200 } }"
          class="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <UIcon name="i-lucide-receipt" class="w-8 h-8 text-zinc-500 dark:text-zinc-600" />
        </div>
        <h3 class="text-lg font-medium text-zinc-900 dark:text-white mb-1">No sales recorded</h3>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Start by recording your first sale transaction.</p>
        <NuxtLink 
          to="/sales/new" 
          class="btn-primary no-underline"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Record Sale
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { sales, loading, fetchSales, deleteSale } = useSales();

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
