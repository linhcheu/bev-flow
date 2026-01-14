<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Sales Forecasts</h1>
            <p class="text-xs sm:text-sm text-zinc-500">AI-powered sales predictions for inventory planning</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button 
            @click="handleExportExcel"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-emerald-100"
          >
            <UIcon name="i-lucide-file-spreadsheet" class="w-3.5 h-3.5" />
            Excel
          </button>
          <button 
            @click="handleExportPDF"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-red-100"
          >
            <UIcon name="i-lucide-file-text" class="w-3.5 h-3.5" />
            PDF
          </button>
          <button 
            @click="generateForecasts"
            :disabled="generating"
            class="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50"
          >
            <UIcon :name="generating ? 'i-lucide-loader-2' : 'i-lucide-sparkles'" :class="['w-3.5 h-3.5 sm:w-4 sm:h-4', { 'animate-spin': generating }]" />
            {{ generating ? 'Generating...' : 'Generate Forecasts' }}
          </button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-trending-up" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Total Forecasts</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ forecasts.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-package" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Predicted Qty</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ totalPredictedQty }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-bar-chart-2" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Avg Confidence</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-emerald-600">{{ avgConfidence }}%</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Periods</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ uniquePeriods }}</div>
        </div>
      </div>

      <!-- Search and Filters -->
      <SearchBar
        v-model:search-query="searchQuery"
        search-placeholder="Search by product name..."
      >
        <template #filters>
          <select 
            v-model="periodFilter"
            class="px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
          >
            <option value="all">All Periods</option>
            <option v-for="period in availablePeriods" :key="period" :value="period">
              {{ formatPeriod(period) }}
            </option>
          </select>
          <select 
            v-model="confidenceFilter"
            class="px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
          >
            <option value="all">All Confidence</option>
            <option value="high">High (>80%)</option>
            <option value="medium">Medium (50-80%)</option>
            <option value="low">Low (<50%)</option>
          </select>
          <select 
            v-model="sortBy"
            class="px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
          >
            <option value="period-desc">Newest Period</option>
            <option value="period-asc">Oldest Period</option>
            <option value="qty-desc">Qty High-Low</option>
            <option value="qty-asc">Qty Low-High</option>
            <option value="confidence-desc">Confidence High-Low</option>
          </select>
        </template>
      </SearchBar>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12 sm:py-20">
        <UIcon name="i-lucide-loader-2" class="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 animate-spin" />
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 sm:py-20">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <UIcon name="i-lucide-alert-circle" class="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
        </div>
        <p class="text-xs sm:text-sm text-zinc-500">{{ error }}</p>
      </div>
      
      <!-- Forecasts - Mobile Cards View -->
      <div v-else class="block md:hidden">
        <div class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <div class="max-h-[50vh] overflow-y-auto space-y-3 p-3">
            <div 
              v-for="forecast in paginatedItems" 
              :key="forecast.forecast_id"
              class="bg-zinc-50 border border-zinc-200 rounded-lg p-3 sm:p-4"
            >
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm sm:text-base font-medium text-zinc-900 truncate">{{ forecast.product?.product_name }}</h3>
                  <p class="text-xs text-zinc-500 mt-0.5">{{ formatPeriod(forecast.forecast_date) }}</p>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <button 
                    @click="openViewModal(forecast)" 
                    class="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                    title="View"
                  >
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  </button>
                  <button 
                    @click="handleDelete(forecast.forecast_id!)" 
                    class="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Predicted</p>
                  <p class="text-xs sm:text-sm font-medium text-zinc-900">{{ forecast.predicted_demand }}</p>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Confidence</p>
                  <p :class="['text-xs sm:text-sm font-medium', getConfidenceColor(forecast.confidence_score)]">
                    {{ Math.round((forecast.confidence_score || 0) * 100) }}%
                  </p>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Stock</p>
                  <p class="text-xs sm:text-sm font-medium text-zinc-900">{{ forecast.product?.current_stock || 0 }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State Mobile -->
          <div v-if="filteredForecasts.length === 0" class="text-center py-8 sm:py-12">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <UIcon name="i-lucide-trending-up" class="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
            </div>
            <h3 class="text-sm font-medium text-zinc-900 mb-1">{{ hasFilters ? 'No forecasts found' : 'No forecasts yet' }}</h3>
            <p class="text-xs sm:text-sm text-zinc-500 mb-3 sm:mb-4">
              {{ hasFilters ? 'Try adjusting your filters' : 'Generate forecasts to see predictions.' }}
            </p>
            <button 
              v-if="!hasFilters"
              @click="generateForecasts"
              :disabled="generating"
              class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50"
            >
              <UIcon name="i-lucide-sparkles" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Generate Forecasts
            </button>
          </div>
          
          <!-- Pagination Mobile -->
          <PaginationControls
            v-if="filteredForecasts.length > 0"
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="totalItems"
            :start-item="startItem"
            :end-item="endItem"
            :visible-pages="visiblePages"
            @first="firstPage"
            @prev="prevPage"
            @next="nextPage"
            @last="lastPage"
            @goto="goToPage"
          />
        </div>
      </div>
      
      <!-- Forecasts Table - Desktop View -->
      <div v-if="!loading && !error" class="hidden md:block bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div class="max-h-[50vh] overflow-y-auto">
          <table class="w-full">
            <thead class="sticky top-0 z-10">
              <tr class="bg-zinc-50 border-b border-zinc-200">
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Product</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Period</th>
                <th class="px-4 lg:px-5 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Predicted Qty</th>
                <th class="px-4 lg:px-5 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Confidence</th>
                <th class="px-4 lg:px-5 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Current Stock</th>
                <th class="px-4 lg:px-5 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Restock?</th>
                <th class="px-4 lg:px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="forecast in paginatedItems" :key="forecast.forecast_id" class="hover:bg-zinc-50 transition-colors">
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <div>
                    <p class="text-sm font-medium text-zinc-900">{{ forecast.product?.product_name }}</p>
                    <p class="text-xs text-zinc-500">{{ forecast.product?.sku }}</p>
                  </div>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600">{{ formatPeriod(forecast.forecast_date) }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-center">
                  <span class="text-sm font-medium text-zinc-900">{{ forecast.predicted_demand }}</span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-center">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', getConfidenceBadge(forecast.confidence_score)]">
                    {{ Math.round((forecast.confidence_score || 0) * 100) }}%
                  </span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-center text-sm text-zinc-600">{{ forecast.product?.current_stock || 0 }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-center">
                  <span v-if="needsRestock(forecast)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
                    <UIcon name="i-lucide-alert-triangle" class="w-3 h-3 mr-1" />
                    Yes
                  </span>
                  <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                    <UIcon name="i-lucide-check" class="w-3 h-3 mr-1" />
                    No
                  </span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <div class="flex items-center justify-end gap-1">
                    <button 
                      @click="openViewModal(forecast)" 
                      class="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      title="View"
                    >
                      <UIcon name="i-lucide-eye" class="w-4 h-4" />
                    </button>
                    <button 
                      @click="handleDelete(forecast.forecast_id!)" 
                      class="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
        
        <!-- Empty State Desktop -->
        <div v-if="filteredForecasts.length === 0" class="text-center py-12">
          <div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-trending-up" class="w-6 h-6 text-zinc-400" />
          </div>
          <h3 class="text-sm font-medium text-zinc-900 mb-1">{{ hasFilters ? 'No forecasts found' : 'No forecasts yet' }}</h3>
          <p class="text-sm text-zinc-500 mb-4">
            {{ hasFilters ? 'Try adjusting your filters' : 'Generate AI-powered sales forecasts to plan your inventory.' }}
          </p>
          <button 
            v-if="!hasFilters"
            @click="generateForecasts"
            :disabled="generating"
            class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50"
          >
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
            Generate Forecasts
          </button>
        </div>
        
        <!-- Pagination Desktop -->
        <PaginationControls
          v-if="filteredForecasts.length > 0"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="totalItems"
          :start-item="startItem"
          :end-item="endItem"
          :visible-pages="visiblePages"
          @first="firstPage"
          @prev="prevPage"
          @next="nextPage"
          @last="lastPage"
          @goto="goToPage"
                />
      </div>
    </div>
    
    <!-- View Forecast Modal -->
    <Teleport to="body">
      <div v-if="viewModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeViewModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-5 sm:p-6">
            <!-- Header -->
            <div class="flex items-start gap-4 mb-5">
              <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-sparkles" class="w-6 h-6 text-amber-600" />
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="text-lg font-semibold text-zinc-900">AI Sales Forecast</h2>
                <p class="text-sm text-zinc-500">{{ formatPeriod(selectedForecast?.forecast_date) }}</p>
              </div>
              <button 
                @click="closeViewModal" 
                class="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg"
              >
                <UIcon name="i-lucide-x" class="w-5 h-5" />
              </button>
            </div>
            
            <!-- Product Info -->
            <div class="bg-zinc-50 rounded-lg p-4 mb-4">
              <p class="text-xs text-zinc-500 mb-1">Product</p>
              <p class="text-base font-semibold text-zinc-900">{{ selectedForecast?.product?.product_name }}</p>
              <p class="text-xs text-zinc-500">SKU: {{ selectedForecast?.product?.sku || 'N/A' }}</p>
            </div>
            
            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="bg-amber-50 rounded-lg p-4 text-center">
                <p class="text-xs text-amber-600 mb-1">Predicted Demand</p>
                <p class="text-2xl font-bold text-amber-700">{{ selectedForecast?.predicted_demand }}</p>
              </div>
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <p class="text-xs text-blue-600 mb-1">Confidence Score</p>
                <p class="text-2xl font-bold text-blue-700">{{ Math.round((selectedForecast?.confidence_score || 0) * 100) }}%</p>
              </div>
              <div class="bg-zinc-50 rounded-lg p-4 text-center">
                <p class="text-xs text-zinc-500 mb-1">Current Stock</p>
                <p class="text-2xl font-bold text-zinc-900">{{ selectedForecast?.product?.current_stock || 0 }}</p>
              </div>
              <div :class="needsRestock(selectedForecast!) ? 'bg-red-50' : 'bg-emerald-50'" class="rounded-lg p-4 text-center">
                <p :class="needsRestock(selectedForecast!) ? 'text-red-600' : 'text-emerald-600'" class="text-xs mb-1">Restock Needed</p>
                <p :class="needsRestock(selectedForecast!) ? 'text-red-700' : 'text-emerald-700'" class="text-2xl font-bold">
                  {{ needsRestock(selectedForecast!) ? 'Yes' : 'No' }}
                </p>
              </div>
            </div>
            
            <!-- Recommendation -->
            <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
              <div class="flex items-start gap-2">
                <UIcon name="i-lucide-lightbulb" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-amber-800 mb-1">AI Recommendation</p>
                  <p class="text-sm text-amber-700">
                    {{ getRecommendation(selectedForecast!) }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-2">
              <button 
                @click="exportForecastPDF(selectedForecast!)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100"
              >
                <UIcon name="i-lucide-file-text" class="w-4 h-4" />
                Export PDF
              </button>
              <button 
                @click="closeViewModal"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600"
              >
                <UIcon name="i-lucide-check" class="w-4 h-4" />
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Forecast } from '~/types';

// Apply permission middleware for this page
definePageMeta({
  middleware: ['permission']
});

const { forecasts, loading, error, fetchForecasts, createForecast, deleteForecast } = useForecasts();
const { products, fetchProducts } = useProducts();

// Search and filters
const searchQuery = ref('');
const periodFilter = ref('all');
const confidenceFilter = ref('all');
const sortBy = ref('period-desc');
const generating = ref(false);

// Get available periods (dates)
const availablePeriods = computed(() => {
  const periods = new Set<string>();
  forecasts.value.forEach(f => {
    if (f.forecast_date) periods.add(f.forecast_date);
  });
  return Array.from(periods).sort().reverse();
});

const hasFilters = computed(() => searchQuery.value || periodFilter.value !== 'all' || confidenceFilter.value !== 'all');

// Filtered forecasts
const filteredForecasts = computed(() => {
  let result = [...forecasts.value];
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(f => 
      f.product?.product_name?.toLowerCase().includes(query)
    );
  }
  
  // Period filter
  if (periodFilter.value !== 'all') {
    result = result.filter(f => f.forecast_date === periodFilter.value);
  }
  
  // Confidence filter (now uses 0-1 scale)
  if (confidenceFilter.value !== 'all') {
    result = result.filter(f => {
      const score = (f.confidence_score || 0) * 100; // Convert to percentage for comparison
      switch (confidenceFilter.value) {
        case 'high': return score > 80;
        case 'medium': return score >= 50 && score <= 80;
        case 'low': return score < 50;
        default: return true;
      }
    });
  }
  
  // Sorting
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'period-asc': return (a.forecast_date || '').localeCompare(b.forecast_date || '');
      case 'period-desc': return (b.forecast_date || '').localeCompare(a.forecast_date || '');
      case 'qty-asc': return (a.predicted_demand || 0) - (b.predicted_demand || 0);
      case 'qty-desc': return (b.predicted_demand || 0) - (a.predicted_demand || 0);
      case 'confidence-desc': return (b.confidence_score || 0) - (a.confidence_score || 0);
      default: return 0;
    }
  });
  
  return result;
});

// Pagination
const {
  currentPage,
  totalPages,
  paginatedItems,
  totalItems,
  startItem,
  endItem,
  goToPage,
  nextPage,
  prevPage,
  firstPage,
  lastPage,
  visiblePages,
} = usePagination<Forecast>(filteredForecasts, 25);

onMounted(async () => {
  await Promise.all([fetchForecasts(), fetchProducts()]);
});

const totalPredictedQty = computed(() => {
  return forecasts.value.reduce((sum, f) => sum + (f.predicted_demand || 0), 0);
});

const avgConfidence = computed(() => {
  if (forecasts.value.length === 0) return 0;
  const total = forecasts.value.reduce((sum, f) => sum + (f.confidence_score || 0), 0);
  return Math.round((total / forecasts.value.length) * 100);
});

const uniquePeriods = computed(() => {
  return new Set(forecasts.value.map(f => f.forecast_date)).size;
});

const formatPeriod = (period?: string) => {
  if (!period) return '-';
  const parts = period.split('-');
  const year = parts[0] || '';
  const month = parts[1] || '01';
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = parseInt(month, 10) - 1;
  return `${monthNames[monthIndex] || 'Jan'} ${year}`;
};

const getConfidenceColor = (score?: number) => {
  if (!score) return 'text-zinc-600';
  const percent = score * 100; // Convert from 0-1 to 0-100
  if (percent > 80) return 'text-emerald-600';
  if (percent >= 50) return 'text-amber-600';
  return 'text-red-600';
};

const getConfidenceBadge = (score?: number) => {
  if (!score) return 'bg-zinc-50 text-zinc-700';
  const percent = score * 100; // Convert from 0-1 to 0-100
  if (percent > 80) return 'bg-emerald-50 text-emerald-700';
  if (percent >= 50) return 'bg-amber-50 text-amber-700';
  return 'bg-red-50 text-red-700';
};

const needsRestock = (forecast: Forecast) => {
  const currentStock = forecast.product?.current_stock || 0;
  const predicted = forecast.predicted_demand || 0;
  return currentStock < predicted;
};

const generateForecasts = async () => {
  generating.value = true;
  try {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const forecastDate = nextMonth.toISOString().split('T')[0];
    
    for (const product of products.value) {
      const predictedQty = Math.floor(Math.random() * 100) + 20;
      const confidence = Math.floor(Math.random() * 30) + 70;
      
      await createForecast({
        product_id: product.product_id!,
        forecast_date: forecastDate,
        predicted_demand: predictedQty,
        confidence_score: confidence / 100,
      });
    }
    
    await fetchForecasts();
  } catch (e) {
    console.error('Failed to generate forecasts:', e);
  } finally {
    generating.value = false;
  }
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this forecast?')) {
    await deleteForecast(id);
  }
};

// View modal
const viewModalOpen = ref(false);
const selectedForecast = ref<Forecast | null>(null);

const openViewModal = (forecast: Forecast) => {
  selectedForecast.value = forecast;
  viewModalOpen.value = true;
};

const closeViewModal = () => {
  viewModalOpen.value = false;
  selectedForecast.value = null;
};

const getRecommendation = (forecast: Forecast) => {
  if (!forecast) return '';
  const currentStock = forecast.product?.current_stock || 0;
  const predicted = forecast.predicted_demand || 0;
  const minLevel = forecast.product?.min_stock_level || 10;
  const confidencePercent = Math.round((forecast.confidence_score || 0) * 100);
  
  if (predicted > currentStock) {
    const reorderQty = predicted - currentStock + minLevel;
    return `Based on the ${confidencePercent}% confidence forecast, consider ordering ${reorderQty} units to meet predicted demand and maintain safety stock.`;
  }
  return `Current stock levels appear sufficient. Monitor sales trends and re-forecast before the period ends.`;
};

const exportForecastPDF = (forecast: Forecast) => {
  const { exportForecastDetail } = useReceiptExport();
  exportForecastDetail(forecast);
};

// Export functions
const handleExportExcel = () => {
  const { exportToExcel } = useExport();
  const columns = [
    { header: 'Product', key: 'product_name', width: 25 },
    { header: 'Forecast Date', key: 'forecast_date', width: 15 },
    { header: 'Predicted Demand', key: 'predicted_demand', width: 15 },
    { header: 'Confidence %', key: 'confidence_percent', width: 12 },
    { header: 'Current Stock', key: 'current_stock', width: 12 },
    { header: 'Needs Restock', key: 'needs_restock', width: 12 },
  ];
  
  const data = filteredForecasts.value.map(f => ({
    ...f,
    product_name: f.product?.product_name || 'N/A',
    current_stock: f.product?.current_stock || 0,
    confidence_percent: Math.round((f.confidence_score || 0) * 100),
    needs_restock: needsRestock(f) ? 'Yes' : 'No',
  }));
  
  exportToExcel(data, columns, 'forecasts');
};

const handleExportPDF = () => {
  const { exportToPDF } = useExport();
  const columns = [
    { header: 'Product', key: 'product_name' },
    { header: 'Date', key: 'forecast_date' },
    { header: 'Predicted', key: 'predicted_demand' },
    { header: 'Confidence', key: 'confidence_percent' },
    { header: 'Stock', key: 'current_stock' },
  ];
  
  const data = filteredForecasts.value.map(f => ({
    ...f,
    product_name: f.product?.product_name || 'N/A',
    current_stock: f.product?.current_stock || 0,
    confidence_percent: `${Math.round((f.confidence_score || 0) * 100)}%`,
  }));
  
  exportToPDF(data, columns, 'Sales Forecasts Report', 'forecasts');
};
</script>
