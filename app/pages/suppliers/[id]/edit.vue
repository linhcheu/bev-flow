<template>
  <div class="p-8">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-zinc-400 animate-spin" />
    </div>
    <SupplierForm v-else-if="supplier" :supplier="supplier" :is-edit="true" @submit="handleSubmit" />
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
