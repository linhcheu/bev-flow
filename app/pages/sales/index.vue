<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Sales</h1>
          <p class="mt-1 text-sm text-zinc-500">Track and manage your sales transactions</p>
        </div>
        <NuxtLink 
          to="/sales/new" 
          class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 no-underline w-full sm:w-auto"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Record Sale
        </NuxtLink>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-receipt" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Total Sales</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">${{ totalSales.toFixed(2) }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-file-text" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Transactions</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">{{ sales.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-package" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Items Sold</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">{{ totalQuantity }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Avg. Sale</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-emerald-600">${{ avgSale.toFixed(2) }}</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-amber-500 animate-spin" />
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <UIcon name="i-lucide-alert-circle" class="w-6 h-6 text-red-500" />
        </div>
        <p class="text-sm text-zinc-500">{{ error }}</p>
      </div>
      
      <!-- Sales Table -->
      <div v-else class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-zinc-50 border-b border-zinc-200">
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Invoice No.</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Customer</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Product</th>
                <th class="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Qty</th>
                <th class="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Unit Price</th>
                <th class="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Total</th>
                <th class="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="sale in sales" :key="sale.sale_id" class="hover:bg-zinc-50 transition-colors">
                <td class="px-5 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                    {{ sale.invoice_number }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2">
                      <div class="w-7 h-7 bg-zinc-100 rounded-full flex items-center justify-center">
                      <UIcon name="i-lucide-user" class="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                    <span class="text-sm text-zinc-900">{{ sale.customer_name || '-' }}</span>
                  </div>
                </td>
                <td class="px-5 py-4 text-sm text-zinc-600">{{ formatDate(sale.sale_date) }}</td>
                <td class="px-5 py-4">
                  <div>
                    <span class="text-sm text-zinc-900">{{ sale.product?.product_name }}</span>
                    <span class="block text-xs text-zinc-400">{{ sale.product?.sku }}</span>
                  </div>
                </td>
                <td class="px-5 py-4 text-sm text-zinc-600 text-right">{{ sale.quantity }}</td>
                <td class="px-5 py-4 text-sm text-zinc-600 text-right">${{ Number(sale.unit_price).toFixed(2) }}</td>
                <td class="px-5 py-4 text-right">
                  <span class="text-sm font-medium text-emerald-600">${{ Number(sale.total_amount).toFixed(2) }}</span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end">
                    <button 
                      class="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
        <div v-if="sales.length === 0" class="text-center py-12">
          <div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-receipt" class="w-6 h-6 text-zinc-400" />
          </div>
          <h3 class="text-sm font-medium text-zinc-900 mb-1">No sales recorded</h3>
          <p class="text-sm text-zinc-500 mb-4">Start by recording your first sale transaction.</p>
          <NuxtLink 
            to="/sales/new" 
            class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors no-underline"
          >
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
            Record Sale
          </NuxtLink>
        </div>
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
