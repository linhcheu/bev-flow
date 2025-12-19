<template>
  <div class="p-8">
    <!-- Header -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-bold text-zinc-900 tracking-tight">Forecasts</h1>
        <p class="mt-1 text-zinc-500">AI-powered sales predictions and analytics</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-zinc-400 animate-spin" />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-red-500" />
      </div>
      <p class="text-zinc-600">{{ error }}</p>
    </div>
    
    <!-- Forecasts Table -->
    <div v-else class="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-zinc-50 border-b border-zinc-200">
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Product</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Forecast Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Predicted Quantity</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Confidence</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-zinc-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr v-for="forecast in forecasts" :key="forecast.forecast_id" class="hover:bg-zinc-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    <UIcon name="i-lucide-package" class="w-4 h-4 text-blue-600" />
                  </div>
                  <span class="text-sm font-medium text-zinc-900">{{ forecast.product?.product_name || '-' }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-calendar" class="w-4 h-4 text-zinc-400" />
                  <span class="text-sm text-zinc-600">{{ formatDate(forecast.forecast_date) }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg">
                  <UIcon name="i-lucide-trending-up" class="w-4 h-4" />
                  {{ forecast.predicted_quantity }} units
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-zinc-600">{{ ((forecast.confidence_level || 0.8) * 100).toFixed(0) }}%</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end">
                  <button 
                    @click="handleDelete(forecast.forecast_id!)" 
                    class="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="forecasts.length === 0" class="text-center py-16">
        <div class="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-lucide-bar-chart-3" class="w-8 h-8 text-zinc-400" />
        </div>
        <h3 class="text-lg font-medium text-zinc-900 mb-1">No forecasts available</h3>
        <p class="text-sm text-zinc-500">Forecasts will be generated based on your sales data.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { forecasts, loading, error, fetchForecasts, deleteForecast } = useForecasts();

onMounted(() => {
  fetchForecasts();
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this forecast?')) {
    await deleteForecast(id);
  }
};
</script>
