<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Products</h1>
          <p class="mt-1 text-sm text-zinc-500">Manage your product inventory</p>
        </div>
        <NuxtLink 
          to="/products/new" 
          class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 no-underline w-full sm:w-auto"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Add Product
        </NuxtLink>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-package" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Total Products</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">{{ products.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-dollar-sign" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Total Cost Value</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">${{ totalCostValue.toFixed(2) }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-tag" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Total Sell Value</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">${{ totalSellValue.toFixed(2) }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Total Profit</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-emerald-600">${{ totalProfit.toFixed(2) }}</div>
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
      
      <!-- Products Table -->
      <div v-else class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[640px]">
            <thead>
              <tr class="bg-zinc-50 border-b border-zinc-200">
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">SKU</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Product Name</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Cost Price</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Selling Price</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Profit</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Supplier</th>
              <th class="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr v-for="product in products" :key="product.product_id" class="hover:bg-zinc-50 transition-colors">
              <td class="px-5 py-4">
                <span class="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                  {{ product.sku }}
                </span>
              </td>
              <td class="px-5 py-4 text-sm font-medium text-zinc-900">{{ product.product_name }}</td>
              <td class="px-5 py-4 text-sm text-zinc-600">${{ product.cost_price.toFixed(2) }}</td>
              <td class="px-5 py-4 text-sm text-zinc-600">${{ product.selling_price.toFixed(2) }}</td>
              <td class="px-5 py-4">
                <span class="text-sm font-medium text-emerald-600">${{ (product.profit || 0).toFixed(2) }}</span>
              </td>
              <td class="px-5 py-4 text-sm text-zinc-600">{{ product.supplier?.company_name || '-' }}</td>
              <td class="px-5 py-4">
                <div class="flex items-center justify-end gap-1">
                  <NuxtLink 
                    :to="`/products/${product.product_id}/edit`" 
                    class="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors no-underline"
                    title="Edit"
                  >
                    <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    @click="handleDelete(product.product_id!)" 
                    class="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
      <div v-if="products.length === 0" class="text-center py-12">
        <div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <UIcon name="i-lucide-package" class="w-6 h-6 text-zinc-400" />
        </div>
        <h3 class="text-sm font-medium text-zinc-900 mb-1">No products yet</h3>
        <p class="text-sm text-zinc-500 mb-4">Get started by adding your first product.</p>
        <NuxtLink 
          to="/products/new" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Add Product
        </NuxtLink>
      </div>
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
