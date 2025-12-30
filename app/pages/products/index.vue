<template>
  <div class="p-8 min-h-screen bg-white dark:bg-zinc-950 animate-fade-in transition-colors duration-200">
    <!-- Header -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Products</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Manage your product inventory</p>
      </div>
      <NuxtLink 
        to="/products/new" 
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors no-underline shadow-lg shadow-amber-500/30"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4" />
        Add Product
      </NuxtLink>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-package" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Total Products</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">{{ products.length }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-dollar-sign" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Total Cost Value</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">${{ totalCostValue.toFixed(2) }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-tag" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Total Sell Value</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">${{ totalSellValue.toFixed(2) }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Total Profit Margin</div>
        </div>
        <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${{ totalProfit.toFixed(2) }}</div>
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
    
    <!-- Products Table -->
    <div v-else class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-zinc-200 dark:bg-zinc-800 border-b border-amber-500/50">
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">SKU</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Product Name</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Cost Price</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Selling Price</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Profit</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Supplier</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            <tr v-for="product in products" :key="product.product_id" class="hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 bg-amber-500/20 border border-amber-500 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-md">
                  {{ product.sku }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">{{ product.product_name }}</td>
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">${{ product.cost_price.toFixed(2) }}</td>
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">${{ product.selling_price.toFixed(2) }}</td>
              <td class="px-6 py-4">
                <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">${{ (product.profit || 0).toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{{ product.supplier?.company_name || '-' }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink 
                    :to="`/products/${product.product_id}/edit`" 
                    class="p-2 text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors no-underline"
                    title="Edit"
                  >
                    <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    @click="handleDelete(product.product_id!)" 
                    class="p-2 text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
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
      <div v-if="products.length === 0" class="text-center py-16">
        <div class="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-lucide-package" class="w-8 h-8 text-zinc-500 dark:text-zinc-600" />
        </div>
        <h3 class="text-lg font-medium text-zinc-900 dark:text-white mb-1">No products yet</h3>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Get started by adding your first product.</p>
        <NuxtLink 
          to="/products/new" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors no-underline"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Add Product
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { products, loading, error, fetchProducts, deleteProduct } = useProducts();

onMounted(() => {
  fetchProducts();
});

const totalCostValue = computed(() => {
  return products.value.reduce((sum, p) => sum + Number(p.cost_price || 0), 0);
});

const totalSellValue = computed(() => {
  return products.value.reduce((sum, p) => sum + Number(p.selling_price || 0), 0);
});

const totalProfit = computed(() => {
  return products.value.reduce((sum, p) => sum + Number(p.profit || 0), 0);
});

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await deleteProduct(id);
  }
};
</script>
