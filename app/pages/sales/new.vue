<template>
  <div class="page-container">
    <SaleForm @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import type { Sale } from '~/types';

const { createSale } = useSales();
const router = useRouter();

const handleSubmit = async (sale: Sale) => {
  const result = await createSale(sale);
  if (result) {
    router.push('/sales');
  }
};
</script>

<style scoped>
.page-container {
  padding: 2rem;
}
</style>
