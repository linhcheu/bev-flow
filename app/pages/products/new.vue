<template>
  <div class="p-8 min-h-screen bg-zinc-950 animate-fade-in">
    <div class="max-w-3xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white tracking-tight">Add Product</h1>
        <p class="mt-1 text-zinc-400">Create a new product in your inventory</p>
      </div>
      <div class="bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-2xl">
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
