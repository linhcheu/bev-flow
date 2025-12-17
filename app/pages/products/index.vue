<template>
  <div class="px-12 py-10">
    <div class="flex justify-between items-center mb-12">
      <div>
        <h1 class="text-4xl font-light text-neutral-800 tracking-wide mb-2">Products</h1>
        <p class="text-sm text-neutral-500 tracking-wider uppercase">Inventory Management</p>
      </div>
      <NuxtLink 
        to="/products/new" 
        class="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 no-underline"
      >
        Add Product
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-16 text-neutral-500">Loading products...</div>
    <div v-else-if="error" class="text-center py-16 text-red-600">{{ error }}</div>
    
    <div v-else class="bg-white border border-neutral-200 rounded-sm overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-neutral-50 border-b border-neutral-200">
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">SKU</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Product Name</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Cost Price</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Selling Price</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Profit</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Supplier</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-for="product in products" :key="product.product_id" class="hover:bg-neutral-50 transition-colors duration-200">
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ product.sku }}</td>
            <td class="px-8 py-5 text-sm text-neutral-900">{{ product.product_name }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">${{ product.cost_price.toFixed(2) }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">${{ product.selling_price.toFixed(2) }}</td>
            <td class="px-8 py-5 text-sm font-medium text-[#D4AF37]">${{ (product.profit || 0).toFixed(2) }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ product.supplier?.company_name || '-' }}</td>
            <td class="px-8 py-5 flex gap-3">
              <NuxtLink 
                :to="`/products/${product.product_id}/edit`" 
                class="px-4 py-2 text-xs bg-neutral-100 text-neutral-700 rounded-sm hover:bg-neutral-200 transition-colors uppercase tracking-wider no-underline"
              >
                Edit
              </NuxtLink>
              <button 
                @click="handleDelete(product.product_id!)" 
                class="px-4 py-2 text-xs bg-red-50 text-red-700 rounded-sm hover:bg-red-100 transition-colors uppercase tracking-wider"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
