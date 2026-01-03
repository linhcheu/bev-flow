<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-5xl mx-auto">
      <div class="mb-4 sm:mb-6">
        <NuxtLink to="/products" class="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 hover:text-amber-600 no-underline mb-2 sm:mb-3">
          <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Products
        </NuxtLink>
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Add Product</h1>
        <p class="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-500">Create a new product in your inventory</p>
      </div>
      <ProductForm @submit="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types';

const { createProduct } = useProducts();
const router = useRouter();

const handleSubmit = async (product: Product) => {
  const result = await createProduct(product);
  if (result) {
    router.push('/products');
  }
};
</script>
