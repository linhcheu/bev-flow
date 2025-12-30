<template>
  <div class="p-8 min-h-screen bg-white dark:bg-zinc-950 animate-fade-in transition-colors duration-200">
    <div class="max-w-3xl mx-auto">
      <div class="mb-8">
        <NuxtLink to="/products" class="btn-ghost no-underline mb-4 -ml-3">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Products
        </NuxtLink>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Add Product</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Create a new product in your inventory</p>
      </div>
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-2xl">
        <ProductForm @submit="handleSubmit" />
      </div>
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
