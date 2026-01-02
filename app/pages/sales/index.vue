<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Sales</h1>
          <p class="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-500">Track customer sales at your karaoke</p>
        </div>
        <NuxtLink 
          to="/sales/new" 
          class="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 no-underline w-full sm:w-auto"
        >
          <UIcon name="i-lucide-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Add Sale
        </NuxtLink>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-receipt" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Total Sales</div>
          </div>
          <div :class="['text-base sm:text-lg md:text-xl font-semibold', getSalesColorClass(totalSales)]">
            ${{ totalSales.toFixed(2) }}
          </div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-file-text" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Transactions</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ sales.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-package" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Items Sold</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ totalQuantity }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-trending-up" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Avg. Sale</div>
          </div>
          <div :class="['text-base sm:text-lg md:text-xl font-semibold', getSalesColorClass(avgSale)]">
            ${{ avgSale.toFixed(2) }}
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <SearchBar
        v-model:search-query="searchQuery"
        search-placeholder="Search by invoice, customer, or product..."
      >
        <template #filters>
          <DateRangePicker v-model="dateRange" />
          <select 
            v-model="productFilter"
            class="px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
          >
            <option value="all">All Products</option>
            <option v-for="product in uniqueProducts" :key="product" :value="product">
              {{ product }}
            </option>
          </select>
          <select 
            v-model="sortBy"
            class="px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount High-Low</option>
            <option value="amount-asc">Amount Low-High</option>
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
      
      <!-- Sales - Mobile Cards View -->
      <div v-else class="block md:hidden">
        <div class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <div class="max-h-[50vh] overflow-y-auto space-y-3 p-3">
            <div 
              v-for="sale in paginatedItems" 
              :key="sale.sale_id"
              class="bg-zinc-50 border border-zinc-200 rounded-lg p-3 sm:p-4"
            >
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex-1 min-w-0">
                  <span class="inline-flex items-center px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] sm:text-xs font-medium rounded mb-1.5">
                    {{ sale.invoice_number }}
                  </span>
                  <h3 class="text-sm sm:text-base font-medium text-zinc-900 truncate">{{ sale.product?.product_name }}</h3>
                  <p class="text-xs text-zinc-500 mt-0.5">{{ sale.customer_name || 'Walk-in Customer' }}</p>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <button 
                    @click="handleDelete(sale.sale_id!)" 
                    class="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs text-zinc-500 mb-3">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-calendar" class="w-3 h-3" />
                  {{ formatDate(sale.sale_date) }}
                </span>
                <span>SKU: {{ sale.product?.sku }}</span>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Qty</p>
                  <p class="text-xs sm:text-sm font-medium text-zinc-900">{{ sale.quantity }}</p>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Unit</p>
                  <p class="text-xs sm:text-sm font-medium text-zinc-900">${{ Number(sale.unit_price).toFixed(2) }}</p>
                </div>
                <div class="bg-emerald-50 rounded-lg p-2">
                  <p class="text-[10px] text-emerald-600 mb-0.5">Total</p>
                  <p class="text-xs sm:text-sm font-semibold text-emerald-600">${{ Number(sale.total_amount).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State Mobile -->
          <div v-if="filteredSales.length === 0" class="text-center py-8 sm:py-12">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <UIcon name="i-lucide-receipt" class="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
            </div>
            <h3 class="text-sm font-medium text-zinc-900 mb-1">{{ hasFilters ? 'No sales found' : 'No sales recorded' }}</h3>
            <p class="text-xs sm:text-sm text-zinc-500 mb-3 sm:mb-4">
              {{ hasFilters ? 'Try adjusting your filters' : 'Start by recording your first sale.' }}
            </p>
            <NuxtLink 
              v-if="!hasFilters"
              to="/sales/new" 
              class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
            >
              <UIcon name="i-lucide-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Record Sale
            </NuxtLink>
          </div>
          
          <!-- Pagination Mobile -->
          <PaginationControls
            v-if="filteredSales.length > 0"
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
      
      <!-- Sales Table - Desktop View -->
      <div v-if="!loading && !error" class="hidden md:block bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div class="max-h-[50vh] overflow-y-auto">
          <table class="w-full">
            <thead class="sticky top-0 z-10">
              <tr class="bg-zinc-50 border-b border-zinc-200">
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Invoice</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Customer</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Date</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Product</th>
                <th class="px-4 lg:px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Qty</th>
                <th class="px-4 lg:px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Unit Price</th>
                <th class="px-4 lg:px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Total</th>
                <th class="px-4 lg:px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="sale in paginatedItems" :key="sale.sale_id" class="hover:bg-zinc-50 transition-colors">
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <span class="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                    {{ sale.invoice_number }}
                  </span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-900">{{ sale.customer_name || 'Walk-in' }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600">{{ formatDate(sale.sale_date) }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <div>
                    <p class="text-sm font-medium text-zinc-900">{{ sale.product?.product_name }}</p>
                    <p class="text-xs text-zinc-500">{{ sale.product?.sku }}</p>
                  </div>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600 text-right">{{ sale.quantity }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600 text-right">${{ Number(sale.unit_price).toFixed(2) }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-right">
                  <span class="text-sm font-medium text-emerald-600">${{ Number(sale.total_amount).toFixed(2) }}</span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <div class="flex items-center justify-end gap-1">
                    <button 
                      @click="handleDelete(sale.sale_id!)" 
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
        <div v-if="filteredSales.length === 0" class="text-center py-12">
          <div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-receipt" class="w-6 h-6 text-zinc-400" />
          </div>
          <h3 class="text-sm font-medium text-zinc-900 mb-1">{{ hasFilters ? 'No sales found' : 'No sales recorded' }}</h3>
          <p class="text-sm text-zinc-500 mb-4">
            {{ hasFilters ? 'Try adjusting your filters' : 'Start by recording your first sale.' }}
          </p>
          <NuxtLink 
            v-if="!hasFilters"
            to="/sales/new" 
            class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
          >
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
            Record Sale
          </NuxtLink>
        </div>
        
        <!-- Pagination Desktop -->
        <PaginationControls
          v-if="filteredSales.length > 0"
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
  </div>
</template>

<script setup lang="ts">
import type { Sale } from '~/types';

const { sales, loading, error, fetchSales, deleteSale } = useSales();

// Search and filters
const searchQuery = ref('');
const dateRange = ref<{ from: string | null; to: string | null }>({ from: null, to: null });
const productFilter = ref('all');
const sortBy = ref('date-desc');

// Get unique products for filter
const uniqueProducts = computed(() => {
  const products = new Set<string>();
  sales.value.forEach(s => {
    if (s.product?.product_name) products.add(s.product.product_name);
  });
  return Array.from(products).sort();
});

const hasFilters = computed(() => searchQuery.value || dateRange.value.from || dateRange.value.to || productFilter.value !== 'all');

// Filtered sales
const filteredSales = computed(() => {
  let result = [...sales.value];
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(s => 
      s.invoice_number?.toLowerCase().includes(query) ||
      s.customer_name?.toLowerCase().includes(query) ||
      s.product?.product_name?.toLowerCase().includes(query)
    );
  }
  
  // Date range filter
  if (dateRange.value.from || dateRange.value.to) {
    result = result.filter(s => {
      const saleDate = new Date(s.sale_date);
      if (dateRange.value.from && saleDate < new Date(dateRange.value.from)) return false;
      if (dateRange.value.to && saleDate > new Date(dateRange.value.to + 'T23:59:59')) return false;
      return true;
    });
  }
  
  // Product filter
  if (productFilter.value !== 'all') {
    result = result.filter(s => s.product?.product_name === productFilter.value);
  }
  
  // Sorting
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-asc': return new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime();
      case 'date-desc': return new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime();
      case 'amount-asc': return Number(a.total_amount) - Number(b.total_amount);
      case 'amount-desc': return Number(b.total_amount) - Number(a.total_amount);
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
} = usePagination<Sale>(filteredSales, 25);

onMounted(() => {
  fetchSales();
});

const totalSales = computed(() => {
  return sales.value.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
});

const totalQuantity = computed(() => {
  return sales.value.reduce((sum, s) => sum + (s.quantity || 0), 0);
});

const avgSale = computed(() => {
  return sales.value.length > 0 ? totalSales.value / sales.value.length : 0;
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getSalesColorClass = (amount: number) => {
  return amount > 0 ? 'text-emerald-600' : 'text-zinc-600';
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this sale?')) {
    await deleteSale(id);
  }
};
</script>
