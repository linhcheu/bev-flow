<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Forecasts</h1>
        <p class="mt-1 text-sm text-zinc-500">AI-powered sales predictions and analytics</p>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-bar-chart-3" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Total Forecasts</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">{{ forecasts.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-package" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Predicted Units</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">{{ totalPredictedQuantity }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-target" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Avg. Confidence</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-emerald-600">{{ avgConfidence.toFixed(0) }}%</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-calendar" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Products Forecasted</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">{{ uniqueProducts }}</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-amber-500 animate-spin" />
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <UIcon name="i-lucide-alert-circle" class="w-6 h-6 text-red-500" />
        </div>
        <p class="text-sm text-zinc-500">{{ error }}</p>
      </div>
      
      <!-- Forecasts Table -->
      <div v-else class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-zinc-50 border-b border-zinc-200">
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Product</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Forecast Date</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Predicted Quantity</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Confidence</th>
                <th class="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="forecast in forecasts" :key="forecast.forecast_id" class="hover:bg-zinc-50 transition-colors">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                      <UIcon name="i-lucide-package" class="w-4 h-4 text-amber-600" />
                    </div>
                    <span class="text-sm font-medium text-zinc-900">{{ forecast.product?.product_name || '-' }}</span>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center gap-1.5 text-sm text-zinc-600">
                    <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 text-zinc-400" />
                    {{ formatDate(forecast.forecast_date) }}
                  </div>
                </td>
                <td class="px-5 py-4">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">
                    <UIcon name="i-lucide-trending-up" class="w-3 h-3" />
                    {{ forecast.predicted_quantity }} units
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 bg-zinc-100 rounded-full h-1.5 overflow-hidden max-w-20">
                      <div 
                        class="h-full bg-amber-500 rounded-full"
                        :style="{width: `${((forecast.confidence_level || 0.8) * 100)}%`}"
                      />
                    </div>
                    <span class="text-xs font-medium text-zinc-600 min-w-10 text-right">
                      {{ ((forecast.confidence_level || 0.8) * 100).toFixed(0) }}%
                    </span>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end">
                    <button 
                      class="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                      @click="handleDelete(forecast.forecast_id!)" 
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
        <div v-if="forecasts.length === 0" class="text-center py-12">
          <div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-bar-chart-3" class="w-6 h-6 text-zinc-400" />
          </div>
          <h3 class="text-sm font-medium text-zinc-900 mb-1">No forecasts available</h3>
          <p class="text-sm text-zinc-500">Forecasts will be generated based on your sales data.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { forecasts, loading, error, fetchForecasts, deleteForecast } = useForecasts();

onMounted(() => {
  fetchForecasts();
});

const totalPredictedQuantity = computed(() => forecasts.value.reduce((sum, f) => sum + (f.predicted_quantity || 0), 0));

const avgConfidence = computed(() => {
  if (forecasts.value.length === 0) return 0;
  return forecasts.value.reduce((sum, f) => sum + ((f.confidence_level || 0.8) * 100), 0) / forecasts.value.length;
});

const uniqueProducts = computed(() => new Set(forecasts.value.map(f => f.product_id)).size);

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this forecast?')) {
    await deleteForecast(id);
  }
};
</script>
