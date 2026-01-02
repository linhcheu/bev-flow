<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <NuxtLink to="/products" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-amber-600 no-underline mb-3">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Products
        </NuxtLink>
        <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Add Product</h1>
        <p class="mt-1 text-sm text-zinc-500">Create a new product in your inventory</p>
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
