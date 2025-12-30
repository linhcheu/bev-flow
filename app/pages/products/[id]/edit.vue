<template>
  <div class="p-8 min-h-screen bg-white dark:bg-zinc-950 animate-fade-in transition-colors duration-200">
    <div class="max-w-3xl mx-auto">
      <div class="mb-8">
        <NuxtLink to="/products" class="btn-ghost no-underline mb-4 -ml-3">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Products
        </NuxtLink>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Edit Product</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Update product information</p>
      </div>
      
      <div v-if="loading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
      </div>
      <div v-else-if="product" class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-2xl">
        <ProductForm :product="product" :is-edit="true" @submit="handleSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types';

const route = useRoute();
const router = useRouter();
const { getProduct, updateProduct, loading } = useProducts();

const product = ref<Product | null>(null);
const id = Number(route.params.id);

onMounted(async () => {
  product.value = await getProduct(id);
});

const handleSubmit = async (updatedProduct: Product) => {
  const result = await updateProduct(id, updatedProduct);
  if (result) {
    router.push('/products');
  }
};
</script>
