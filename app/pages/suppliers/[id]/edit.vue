<template>
  <div class="p-8 min-h-screen bg-white">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <NuxtLink to="/suppliers" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 no-underline mb-3">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Suppliers
        </NuxtLink>
        <h1 class="text-2xl font-semibold text-zinc-900">Edit Supplier</h1>
        <p class="mt-1 text-sm text-zinc-500">Update supplier information</p>
      </div>
      
      <div v-if="loading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-amber-500 animate-spin" />
      </div>
      <div v-else-if="supplier" class="bg-white border border-zinc-200 rounded-lg p-6">
        <SupplierForm :supplier="supplier" :is-edit="true" @submit="handleSubmit" />
      </div>
    </div>
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
