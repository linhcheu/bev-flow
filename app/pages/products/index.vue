<template>
  <div class="p-8">
    <!-- Header -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-bold text-zinc-900 tracking-tight">Products</h1>
        <p class="mt-1 text-zinc-500">Manage your product inventory</p>
      </div>
      <NuxtLink 
        to="/products/new" 
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors no-underline"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4" />
        Add Product
      </NuxtLink>
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
    
    <!-- Products Table -->
    <div v-else class="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-zinc-50 border-b border-zinc-200">
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">SKU</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Product Name</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Cost Price</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Selling Price</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Profit</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Supplier</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-zinc-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr v-for="product in products" :key="product.product_id" class="hover:bg-zinc-50/50 transition-colors">
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-md">
                  {{ product.sku }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-zinc-900">{{ product.product_name }}</td>
              <td class="px-6 py-4 text-sm text-zinc-600">${{ product.cost_price.toFixed(2) }}</td>
              <td class="px-6 py-4 text-sm text-zinc-600">${{ product.selling_price.toFixed(2) }}</td>
              <td class="px-6 py-4">
                <span class="text-sm font-semibold text-emerald-600">${{ (product.profit || 0).toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-zinc-600">{{ product.supplier?.company_name || '-' }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink 
                    :to="`/products/${product.product_id}/edit`" 
                    class="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors no-underline"
                    title="Edit"
                  >
                    <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    @click="handleDelete(product.product_id!)" 
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
      
      <!-- Empty State -->
      <div v-if="products.length === 0" class="text-center py-16">
        <div class="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-lucide-package" class="w-8 h-8 text-zinc-400" />
        </div>
        <h3 class="text-lg font-medium text-zinc-900 mb-1">No products yet</h3>
        <p class="text-sm text-zinc-500 mb-4">Get started by adding your first product.</p>
        <NuxtLink 
          to="/products/new" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors no-underline"
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

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await deleteProduct(id);
  }
};
</script>
