<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Sales Transactions</h1>
      <NuxtLink to="/sales/new" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Record Sale</NuxtLink>
    </div>

    <div class="flex gap-4 mb-8">
      <input 
        v-model="startDate" 
        type="date" 
        class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @change="handleFilterChange"
      />
      <input 
        v-model="endDate" 
        type="date" 
        class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @change="handleFilterChange"
      />
      <button @click="handleFilterChange" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">Filter</button>
    </div>

    <div v-if="loading" class="text-center py-8">Loading sales...</div>
    <div v-else-if="error" class="text-center py-8 text-red-600">{{ error }}</div>
    
    <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sale Date</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity Sold</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="sale in sales" :key="sale.sale_id" class="hover:bg-gray-50">
            <td class="px-6 py-4">{{ formatDate(sale.sale_date) }}</td>
            <td class="px-6 py-4">{{ sale.product?.product_name || '-' }}</td>
            <td class="px-6 py-4">{{ sale.quantity_sold }}</td>
            <td class="px-6 py-4">${{ sale.total_amount.toFixed(2) }}</td>
            <td class="px-6 py-4">
              <button @click="handleDelete(sale.sale_id!)" class="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="sales.length > 0" class="px-6 py-4 bg-gray-50 text-right">
        <strong class="text-lg">Total Sales: ${{ totalSales.toFixed(2) }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { sales, loading, error, fetchSales, deleteSale } = useSales();

const startDate = ref('');
const endDate = ref('');

const totalSales = computed(() => {
  return sales.value.reduce((sum, sale) => sum + sale.total_amount, 0);
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
