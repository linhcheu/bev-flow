<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-5xl mx-auto">
      <div class="mb-4 sm:mb-6">
        <NuxtLink to="/suppliers" class="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 hover:text-zinc-700 no-underline mb-2 sm:mb-3">
          <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Suppliers
        </NuxtLink>
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Add Supplier</h1>
        <p class="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-500">Create a new supplier in your directory</p>
      </div>
      <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-6">
        <SupplierForm @submit="handleSubmit" />
      </div>
    </div>
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
