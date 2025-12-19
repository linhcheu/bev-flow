<template>
  <div class="p-8">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-zinc-400 animate-spin" />
    </div>
    <ProductForm v-else-if="product" :product="product" :is-edit="true" @submit="handleSubmit" />
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
