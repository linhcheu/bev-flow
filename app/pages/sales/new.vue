<template>
  <div class="p-8 min-h-screen bg-zinc-950 animate-fade-in">
    <div class="max-w-3xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white tracking-tight">Record Sale</h1>
        <p class="mt-1 text-zinc-400">Record a new sales transaction</p>
      </div>
      <div class="bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 shadow-2xl">
        <SaleForm @submit="handleSubmit" />
      </div>
    </div>
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
