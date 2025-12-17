<template>
  <div class="page-container">
    <div v-if="loading" class="loading">Loading...</div>
    <SupplierForm v-else :supplier="supplier" :is-edit="true" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import type { Supplier } from '~/types';

const route = useRoute();
const router = useRouter();
const { getSupplier, updateSupplier, loading } = useSuppliers();

const supplier = ref<Supplier | null>(null);
const id = Number(route.params.id);

onMounted(async () => {
  supplier.value = await getSupplier(id);
});

const handleSubmit = async (updatedSupplier: Supplier) => {
  const result = await updateSupplier(id, updatedSupplier);
  if (result) {
    router.push('/suppliers');
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
