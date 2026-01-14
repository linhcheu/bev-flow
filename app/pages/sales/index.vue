<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-receipt" class="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Sales</h1>
            <p class="text-xs sm:text-sm text-zinc-500">Track customer sales at your karaoke</p>
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
          <NuxtLink 
            to="/sales/new" 
            class="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
          >
            <UIcon name="i-lucide-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Add Sale
          </NuxtLink>
        </div>
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
                    {{ sale.sale_number }}
                  </span>
                  <h3 v-if="sale.items && sale.items.length > 1" class="text-sm sm:text-base font-medium text-zinc-900 truncate">{{ sale.items.length }} items</h3>
                  <h3 v-else class="text-sm sm:text-base font-medium text-zinc-900 truncate">{{ sale.items?.[0]?.product?.product_name || '-' }}</h3>
                  <p class="text-xs text-zinc-500 mt-0.5">{{ sale.customer?.customer_name || 'Walk-in Customer' }}</p>
                </div>
                <div class="flex items-center gap-0.5 sm:gap-1 shrink-0">
                  <button 
                    @click="openViewModal(sale)" 
                    class="p-2 sm:p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all active:scale-95"
                    title="View"
                  >
                    <UIcon name="i-lucide-eye" class="w-4 h-4 sm:w-4 sm:h-4" />
                  </button>
                  <NuxtLink 
                    :to="`/sales/${sale.sale_id}/edit`" 
                    class="p-2 sm:p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95 no-underline"
                    title="Edit"
                  >
                    <UIcon name="i-lucide-pencil" class="w-4 h-4 sm:w-4 sm:h-4" />
                  </NuxtLink>
                  <button 
                    @click="handleDelete(sale.sale_id!)" 
                    class="p-2 sm:p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                    title="Delete"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-4 h-4 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs text-zinc-500 mb-3">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-calendar" class="w-3 h-3" />
                  {{ formatDate(sale.sale_date) }}
                </span>
                <span v-if="sale.items?.[0]?.product?.sku">SKU: {{ sale.items[0].product.sku }}</span>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Qty</p>
                  <p class="text-xs sm:text-sm font-medium text-zinc-900">{{ getTotalQuantity(sale) }}</p>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Items</p>
                  <p class="text-xs sm:text-sm font-medium text-zinc-900">{{ sale.items?.length || 1 }}</p>
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
                    {{ sale.sale_number }}
                  </span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-900">{{ sale.customer?.customer_name || 'Walk-in' }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600">{{ formatDate(sale.sale_date) }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <div v-if="sale.items && sale.items.length > 1">
                    <p class="text-sm font-medium text-zinc-900">{{ sale.items.length }} items</p>
                    <p class="text-xs text-zinc-500">{{ sale.items.map(i => i.product?.product_name).slice(0, 2).join(', ') }}{{ sale.items.length > 2 ? '...' : '' }}</p>
                  </div>
                  <div v-else-if="sale.items?.[0]">
                    <p class="text-sm font-medium text-zinc-900">{{ sale.items[0].product?.product_name }}</p>
                    <p class="text-xs text-zinc-500">{{ sale.items[0].product?.sku }}</p>
                  </div>
                  <div v-else>
                    <p class="text-sm font-medium text-zinc-900">No items</p>
                  </div>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600 text-right">{{ getTotalQuantity(sale) }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600 text-right">${{ getAverageUnitPrice(sale).toFixed(2) }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-right">
                  <span class="text-sm font-medium text-emerald-600">${{ Number(sale.total_amount).toFixed(2) }}</span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <div class="flex items-center justify-end gap-1">
                    <button 
                      @click="openViewModal(sale)" 
                      class="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all hover:-translate-y-0.5"
                      title="View"
                    >
                      <UIcon name="i-lucide-eye" class="w-4 h-4" />
                    </button>
                    <NuxtLink 
                      :to="`/sales/${sale.sale_id}/edit`" 
                      class="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:-translate-y-0.5 no-underline"
                      title="Edit"
                    >
                      <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                    </NuxtLink>
                    <button 
                      @click="handleDelete(sale.sale_id!)" 
                      class="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all hover:-translate-y-0.5"
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
    
    <!-- View Sale Modal -->
    <Teleport to="body">
      <div v-if="viewModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeViewModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-5 sm:p-6">
            <!-- Receipt Header -->
            <div class="text-center border-b border-dashed border-zinc-300 pb-4 mb-4">
              <h2 class="text-lg font-bold text-zinc-900">BEV FLOW</h2>
              <p class="text-xs text-zinc-500">Karaoke Inventory System</p>
            </div>
            
            <!-- Sale Info -->
            <div class="text-center mb-4">
              <span class="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full">
                {{ selectedSale?.sale_number }}
              </span>
            </div>
            
            <div class="space-y-2 text-sm border-b border-dashed border-zinc-300 pb-4 mb-4">
              <div class="flex justify-between">
                <span class="text-zinc-500">Date:</span>
                <span class="font-medium">{{ selectedSale ? formatDate(selectedSale.sale_date) : '' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-zinc-500">Customer:</span>
                <span class="font-medium">{{ selectedSale?.customer?.customer_name || 'Walk-in Customer' }}</span>
              </div>
            </div>
            
            <!-- Item Details -->
            <div class="border-b border-dashed border-zinc-300 pb-4 mb-4">
              <!-- Multi-item display -->
              <div v-if="selectedSale?.items && selectedSale.items.length > 0" class="space-y-3">
                <div v-for="(item, idx) in selectedSale.items" :key="idx" class="flex justify-between items-start">
                  <div class="flex-1">
                    <p class="font-medium text-zinc-900">{{ item.product?.product_name }}</p>
                    <p class="text-xs text-zinc-500">SKU: {{ item.product?.sku }}</p>
                    <p class="text-xs text-zinc-500">{{ item.quantity }} × ${{ Number(item.unit_price || 0).toFixed(2) }}</p>
                  </div>
                  <span class="font-medium text-sm">${{ Number(item.amount || item.quantity * item.unit_price).toFixed(2) }}</span>
                </div>
              </div>
              <!-- Single item fallback -->
              <div v-else-if="selectedSale?.items?.[0]">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex-1">
                    <p class="font-medium text-zinc-900">{{ selectedSale.items[0].product?.product_name }}</p>
                    <p class="text-xs text-zinc-500">SKU: {{ selectedSale.items[0].product?.sku }}</p>
                  </div>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-zinc-500">{{ selectedSale.items[0].quantity }} × ${{ Number(selectedSale.items[0].unit_price || 0).toFixed(2) }}</span>
                  <span class="font-medium">${{ Number(selectedSale?.total_amount || 0).toFixed(2) }}</span>
                </div>
              </div>
              <!-- No items fallback -->
              <div v-else class="text-center py-4 text-zinc-500">
                <p>No items in this sale</p>
              </div>
            </div>
            
            <!-- Total -->
            <div class="flex justify-between items-center text-lg font-bold mb-4">
              <span>TOTAL</span>
              <span class="text-amber-600">${{ Number(selectedSale?.total_amount || 0).toFixed(2) }}</span>
            </div>
            
            <!-- Notes -->
            <div v-if="selectedSale?.notes" class="bg-zinc-50 rounded-lg p-3 mb-4">
              <p class="text-xs text-zinc-500 mb-1">Notes:</p>
              <p class="text-sm text-zinc-700">{{ selectedSale.notes }}</p>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-2">
              <button 
                @click="exportReceiptPDF(selectedSale!)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100"
              >
                <UIcon name="i-lucide-file-text" class="w-4 h-4" />
                PDF
              </button>
              <button 
                @click="exportReceiptExcel(selectedSale!)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100"
              >
                <UIcon name="i-lucide-file-spreadsheet" class="w-4 h-4" />
                Excel
              </button>
              <NuxtLink 
                :to="`/sales/${selectedSale?.sale_id}/edit`"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
              >
                <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                Edit
              </NuxtLink>
            </div>
            
            <!-- Close button -->
            <button 
              @click="closeViewModal" 
              class="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
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
    s.items?.forEach(item => {
      if (item.product?.product_name) products.add(item.product.product_name);
    });
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
      s.sale_number?.toLowerCase().includes(query) ||
      s.customer?.customer_name?.toLowerCase().includes(query) ||
      s.items?.some(item => item.product?.product_name?.toLowerCase().includes(query))
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
    result = result.filter(s => s.items?.some(item => item.product?.product_name === productFilter.value));
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
  return sales.value.reduce((sum, s) => sum + getTotalQuantity(s), 0);
});

// Helper to get total quantity from sale (handles multi-item)
const getTotalQuantity = (sale: Sale) => {
  if (sale.items && sale.items.length > 0) {
    return sale.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }
  return 0;
};

// Helper to get average unit price
const getAverageUnitPrice = (sale: Sale) => {
  if (sale.items && sale.items.length > 0) {
    const totalQty = getTotalQuantity(sale);
    if (totalQty === 0) return 0;
    const totalValue = sale.items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0), 0);
    return totalValue / totalQty;
  }
  return 0;
};

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

// View modal
const viewModalOpen = ref(false);
const selectedSale = ref<Sale | null>(null);

const openViewModal = (sale: Sale) => {
  selectedSale.value = sale;
  viewModalOpen.value = true;
};

const closeViewModal = () => {
  viewModalOpen.value = false;
  selectedSale.value = null;
};

const exportReceiptPDF = (sale: Sale) => {
  const { exportSaleReceipt } = useReceiptExport();
  exportSaleReceipt(sale);
};

const exportReceiptExcel = (sale: Sale) => {
  const { exportSaleReceiptExcel } = useReceiptExport();
  exportSaleReceiptExcel(sale);
};

// Export functions
const handleExportExcel = () => {
  const { exportToExcel } = useExport();
  const columns = [
    { header: 'Sale #', key: 'sale_number', width: 15 },
    { header: 'Date', key: 'sale_date', width: 12 },
    { header: 'Customer', key: 'customer_name', width: 20 },
    { header: 'Items', key: 'item_count', width: 10 },
    { header: 'Subtotal', key: 'subtotal', width: 12 },
    { header: 'Discount', key: 'discount_amount', width: 12 },
    { header: 'Total', key: 'total_amount', width: 12 },
  ];
  
  const data = filteredSales.value.map(s => ({
    ...s,
    customer_name: s.customer?.customer_name || 'Walk-in',
    item_count: s.items?.length || 0,
  }));
  
  exportToExcel(data, columns, 'sales');
};

const handleExportPDF = () => {
  const { exportToPDF } = useExport();
  const columns = [
    { header: 'Sale #', key: 'sale_number' },
    { header: 'Date', key: 'sale_date' },
    { header: 'Customer', key: 'customer_name' },
    { header: 'Items', key: 'item_count' },
    { header: 'Total', key: 'total_amount' },
  ];
  
  const data = filteredSales.value.map(s => ({
    ...s,
    customer_name: s.customer?.customer_name || 'Walk-in',
    item_count: s.items?.length || 0,
  }));
  
  exportToPDF(data, columns, 'Sales Report', 'sales');
};
</script>
