<template>
  <div class="p-8">
    <SupplierForm @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import type { Supplier } from '~/types';

const { createSupplier } = useSuppliers();
const router = useRouter();

const handleSubmit = async (supplier: Supplier) => {
  const result = await createSupplier(supplier);
  if (result) {
    router.push('/suppliers');
  }
};
</script>
