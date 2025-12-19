<template>
  <div class="p-8">
    <!-- Header -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-bold text-zinc-900 tracking-tight">Sales</h1>
        <p class="mt-1 text-zinc-500">Track and manage your sales transactions</p>
      </div>
      <NuxtLink 
        to="/sales/new" 
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors no-underline"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4" />
        Record Sale
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-zinc-200 rounded-xl p-5 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-calendar" class="w-4 h-4 text-zinc-400" />
          <span class="text-sm text-zinc-600">Filter by date:</span>
        </div>
        <input 
          v-model="startDate" 
          type="date" 
          class="px-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          @change="handleFilterChange"
        />
        <span class="text-zinc-400">to</span>
        <input 
          v-model="endDate" 
          type="date" 
          class="px-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          @change="handleFilterChange"
        />
        <button 
          @click="handleFilterChange" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors"
        >
          <UIcon name="i-lucide-filter" class="w-4 h-4" />
          Apply
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-zinc-400 animate-spin" />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-red-500" />
      </div>
      <p class="text-zinc-600">{{ error }}</p>
    </div>
    
    <!-- Sales Table -->
    <div v-else class="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-zinc-50 border-b border-zinc-200">
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Product</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Quantity</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Total Amount</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-zinc-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr v-for="sale in sales" :key="sale.sale_id" class="hover:bg-zinc-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-calendar" class="w-4 h-4 text-zinc-400" />
                  <span class="text-sm text-zinc-600">{{ formatDate(sale.sale_date) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-zinc-900">{{ sale.product?.product_name || '-' }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-md">
                  {{ sale.quantity }} units
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-semibold text-emerald-600">${{ (sale.total_amount || 0).toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end">
                  <button 
                    @click="handleDelete(sale.sale_id!)" 
                    class="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      
      <!-- Summary Footer -->
      <div v-if="sales.length > 0" class="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
        <span class="text-sm text-zinc-600">{{ sales.length }} transactions</span>
        <div class="flex items-center gap-2">
          <span class="text-sm text-zinc-600">Total Sales:</span>
          <span class="text-lg font-bold text-emerald-600">${{ totalSales.toFixed(2) }}</span>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="sales.length === 0" class="text-center py-16">
        <div class="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-lucide-receipt" class="w-8 h-8 text-zinc-400" />
        </div>
        <h3 class="text-lg font-medium text-zinc-900 mb-1">No sales recorded</h3>
        <p class="text-sm text-zinc-500 mb-4">Get started by recording your first sale.</p>
        <NuxtLink 
          to="/sales/new" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors no-underline"
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

const startDate = ref('');
const endDate = ref('');

const totalSales = computed(() => {
  return sales.value.reduce((sum: number, sale: any) => sum + sale.total_amount, 0);
});

onMounted(() => {
  fetchSales();
});

const handleFilterChange = () => {
  fetchSales(startDate.value, endDate.value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this sale?')) {
    await deleteSale(id);
  }
};
</script>
