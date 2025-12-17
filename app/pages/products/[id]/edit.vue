<template>
  <div class="page-container">
    <div v-if="loading" class="loading">Loading...</div>
    <ProductForm v-else :product="product" :is-edit="true" @submit="handleSubmit" />
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

<style scoped>
.page-container {
  padding: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
}
</style>
