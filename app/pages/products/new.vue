<template>
  <div class="page-container">
    <ProductForm @submit="handleSubmit" />
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

<style scoped>
.page-container {
  padding: 2rem;
}
</style>
