<template>
  <div class="p-8 min-h-screen bg-white">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <NuxtLink to="/products" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 no-underline mb-3">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Products
        </NuxtLink>
        <h1 class="text-2xl font-semibold text-zinc-900">Edit Product</h1>
        <p class="mt-1 text-sm text-zinc-500">Update product information</p>
      </div>
      
      <div v-if="loading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-amber-500 animate-spin" />
      </div>
      <div v-else-if="product" class="bg-white border border-zinc-200 rounded-lg p-6">
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
