<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-5xl mx-auto">
      <div class="mb-4 sm:mb-6">
        <NuxtLink to="/products" class="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 hover:text-zinc-700 no-underline mb-2 sm:mb-3">
          <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Products
        </NuxtLink>
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Edit Product</h1>
        <p class="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-500">Update product information</p>
      </div>
      
      <div v-if="loading" class="flex items-center justify-center py-12 sm:py-20">
        <UIcon name="i-lucide-loader-2" class="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 animate-spin" />
      </div>
      <div v-else-if="product" class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-6">
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
