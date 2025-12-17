<template>
  <div class="px-12 py-10">
    <div class="flex justify-between items-center mb-12">
      <div>
        <h1 class="text-4xl font-light text-neutral-800 tracking-wide mb-2">Sales Forecasts</h1>
        <p class="text-sm text-neutral-500 tracking-wider uppercase">Predictive Analytics</p>
      </div>
      <NuxtLink 
        to="/forecasts/generate" 
        class="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 no-underline"
      >
        Generate Forecast
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-16 text-neutral-500">Loading forecasts...</div>
    <div v-else-if="error" class="text-center py-16 text-red-600">{{ error }}</div>
    
    <div v-else class="bg-white border border-neutral-200 rounded-sm overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-neutral-50 border-b border-neutral-200">
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Product</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Forecast Month</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Predicted Quantity</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Based On</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-for="forecast in forecasts" :key="forecast.forecast_id" class="hover:bg-neutral-50 transition-colors duration-200">
            <td class="px-8 py-5 text-sm text-neutral-900">{{ forecast.product?.product_name || '-' }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ formatMonth(forecast.forecast_month) }}</td>
            <td class="px-8 py-5 text-sm font-medium text-[#D4AF37]">{{ forecast.predicted_quantity }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ forecast.based_on_months || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const { forecasts, loading, error, fetchForecasts } = useForecasts();

onMounted(() => {
  fetchForecasts();
});

const formatMonth = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};
</script>
