<template>
  <div class="px-12 py-10">
    <div class="flex justify-between items-center mb-12">
      <div>
        <h1 class="text-4xl font-light text-neutral-800 tracking-wide mb-2">Sales Transactions</h1>
        <p class="text-sm text-neutral-500 tracking-wider uppercase">Sales History</p>
      </div>
      <NuxtLink 
        to="/sales/new" 
        class="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 no-underline"
      >
        Record Sale
      </NuxtLink>
    </div>

    <div class="flex gap-4 mb-8">
      <input 
        v-model="startDate" 
        type="date" 
        class="px-6 py-3 border border-neutral-300 rounded-sm text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
        @change="handleFilterChange"
      />
      <input 
        v-model="endDate" 
        type="date" 
        class="px-6 py-3 border border-neutral-300 rounded-sm text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
        @change="handleFilterChange"
      />
      <button 
        @click="handleFilterChange" 
        class="px-8 py-3 bg-neutral-800 text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300"
      >
        Filter
      </button>
    </div>

    <div v-if="loading" class="text-center py-16 text-neutral-500">Loading sales...</div>
    <div v-else-if="error" class="text-center py-16 text-red-600">{{ error }}</div>
    
    <div v-else class="bg-white border border-neutral-200 rounded-sm overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-neutral-50 border-b border-neutral-200">
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Sale Date</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Product</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Quantity Sold</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Total Amount</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-for="sale in sales" :key="sale.sale_id" class="hover:bg-neutral-50 transition-colors duration-200">
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ formatDate(sale.sale_date) }}</td>
            <td class="px-8 py-5 text-sm text-neutral-900">{{ sale.product?.product_name || '-' }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ sale.quantity_sold }}</td>
            <td class="px-8 py-5 text-sm font-medium text-[#D4AF37]">${{ sale.total_amount.toFixed(2) }}</td>
            <td class="px-8 py-5">
              <button 
                @click="handleDelete(sale.sale_id!)" 
                class="px-4 py-2 text-xs bg-red-50 text-red-700 rounded-sm hover:bg-red-100 transition-colors uppercase tracking-wider"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="sales.length > 0" class="px-8 py-6 bg-neutral-50 border-t border-neutral-200 text-right">
        <span class="text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em] mr-4">Total Sales:</span>
        <span class="text-2xl font-light text-[#D4AF37]">${{ totalSales.toFixed(2) }}</span>
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
