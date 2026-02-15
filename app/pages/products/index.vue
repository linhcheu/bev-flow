<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white overflow-x-hidden">
    <div class="max-w-7xl mx-auto w-full">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-8 h-8 sm:w-9 sm:h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-package" class="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Products</h1>
            <p class="text-xs sm:text-sm text-zinc-500">Manage your product inventory</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Export Buttons -->
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
            to="/products/new" 
            class="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
          >
            <UIcon name="i-lucide-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Add Product
          </NuxtLink>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-package" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Total Products</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ products.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-dollar-sign" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Total Cost</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">${{ totalCostValue.toFixed(2) }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-tag" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Total Sell</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">${{ totalSellValue.toFixed(2) }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-trending-up" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Total Profit</div>
          </div>
          <div :class="['text-base sm:text-lg md:text-xl font-semibold', getProfitColorClass(totalProfit)]">
            {{ totalProfit >= 0 ? '+' : '' }}${{ totalProfit.toFixed(2) }}
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <SearchBar
        v-model:search-query="searchQuery"
        search-placeholder="Search by name, SKU, or supplier..."
      >
        <template #filters>
          <select 
            v-model="stockFilter"
            class="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
          >
            <option value="all">All Stock Levels</option>
            <option value="in-stock">In Stock (>10)</option>
            <option value="low-stock">Low Stock (1-10)</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <select 
            v-model="supplierFilter"
            class="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
          >
            <option value="all">All Suppliers</option>
            <option v-for="supplier in uniqueSuppliers" :key="supplier" :value="supplier">
              {{ supplier }}
            </option>
          </select>
          <select 
            v-model="sortBy"
            class="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="stock-asc">Stock Low-High</option>
            <option value="stock-desc">Stock High-Low</option>
            <option value="price-asc">Price Low-High</option>
            <option value="price-desc">Price High-Low</option>
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
      
      <!-- Products - Mobile Cards View -->
      <div v-else class="block md:hidden">
        <div class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <div class="max-h-[50vh] overflow-y-auto space-y-3 p-3">
            <div 
              v-for="product in paginatedItems" 
              :key="product.product_id"
              class="bg-zinc-50 border border-zinc-200 rounded-lg p-3 sm:p-4"
            >
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex items-start gap-3 flex-1 min-w-0">
                  <!-- Product Image -->
                  <div class="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      v-if="product.image_url" 
                      :src="product.image_url" 
                      :alt="product.product_name"
                      class="w-full h-full object-contain"
                    />
                    <UIcon v-else name="i-lucide-package" class="w-6 h-6 text-zinc-400" />
                  </div>
                  <div class="min-w-0">
                    <span class="inline-flex items-center px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] sm:text-xs font-medium rounded mb-1.5">
                      {{ product.sku }}
                    </span>
                    <h3 class="text-sm sm:text-base font-medium text-zinc-900 truncate">{{ product.product_name }}</h3>
                    <p class="text-xs text-zinc-500 mt-0.5">{{ product.supplier?.company_name || 'No supplier' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <button 
                    @click="openViewModal(product)" 
                    class="p-2 sm:p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all active:scale-95"
                    title="View"
                  >
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  </button>
                  <NuxtLink 
                    :to="`/products/${product.product_id}/edit`" 
                    class="p-2 sm:p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95 no-underline"
                    title="Edit"
                  >
                    <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    @click="handleDelete(product.product_id!)" 
                    class="p-2 sm:p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                    title="Delete"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center mb-2">
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Stock</p>
                  <p :class="['text-xs sm:text-sm font-medium', getStockColorClass(product.current_stock || 0)]">{{ product.current_stock || 0 }}</p>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-emerald-600 mb-0.5">Safety</p>
                  <p class="text-xs sm:text-sm font-medium text-emerald-600">{{ product.safety_stock || 0 }}</p>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-emerald-600 mb-0.5">EOQ</p>
                  <p class="text-xs sm:text-sm font-medium text-emerald-600">{{ product.reorder_quantity || 0 }}</p>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Cost</p>
                  <p class="text-xs sm:text-sm font-medium text-zinc-900">${{ product.cost_price.toFixed(2) }}</p>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Sell</p>
                  <p class="text-xs sm:text-sm font-medium text-zinc-900">${{ product.selling_price.toFixed(2) }}</p>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Profit</p>
                  <p :class="['text-xs sm:text-sm font-medium', getProfitColorClass(product.profit || 0)]">
                    {{ (product.profit || 0) >= 0 ? '+' : '' }}${{ (product.profit || 0).toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State Mobile -->
          <div v-if="filteredProducts.length === 0" class="text-center py-8 sm:py-12">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <UIcon name="i-lucide-package" class="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
            </div>
            <h3 class="text-sm font-medium text-zinc-900 mb-1">{{ searchQuery || stockFilter !== 'all' || supplierFilter !== 'all' ? 'No products found' : 'No products yet' }}</h3>
            <p class="text-xs sm:text-sm text-zinc-500 mb-3 sm:mb-4">
              {{ searchQuery || stockFilter !== 'all' || supplierFilter !== 'all' ? 'Try adjusting your filters' : 'Get started by adding your first product.' }}
            </p>
            <NuxtLink 
              v-if="!searchQuery && stockFilter === 'all' && supplierFilter === 'all'"
              to="/products/new" 
              class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
            >
              <UIcon name="i-lucide-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Add Product
            </NuxtLink>
          </div>
          
          <!-- Pagination Mobile -->
          <PaginationControls
            v-if="filteredProducts.length > 0"
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
      
      <!-- Products Table - Desktop View -->
      <div v-if="!loading && !error" class="hidden md:block bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div class="max-h-[50vh] overflow-y-auto">
          <table class="w-full min-w-[640px]">
            <thead class="sticky top-0 z-10">
              <tr class="bg-zinc-50 border-b border-zinc-200">
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Image</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">SKU</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Product Name</th>
                <th class="px-4 lg:px-5 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Stock</th>
                <th class="px-4 lg:px-5 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50 text-emerald-600">Safety Stock</th>
                <th class="px-4 lg:px-5 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50 text-emerald-600">EOQ</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Cost Price</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Selling Price</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Profit</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Supplier</th>
                <th class="px-4 lg:px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="product in paginatedItems" :key="product.product_id" class="hover:bg-zinc-50 transition-colors">
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <div class="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      v-if="product.image_url" 
                      :src="product.image_url" 
                      :alt="product.product_name"
                      class="w-full h-full object-contain"
                    />
                    <UIcon v-else name="i-lucide-package" class="w-5 h-5 text-zinc-400" />
                  </div>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <span class="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                    {{ product.sku }}
                  </span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm font-medium text-zinc-900">{{ product.product_name }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-center">
                  <span :class="['text-sm font-medium px-2 py-0.5 rounded', getStockBadgeClass(product.current_stock || 0)]">
                    {{ product.current_stock || 0 }}
                  </span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-center">
                  <span class="text-sm font-medium text-emerald-600">{{ product.safety_stock || 0 }}</span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-center">
                  <span class="text-sm font-medium text-emerald-600">{{ product.reorder_quantity || 0 }}</span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600">${{ product.cost_price.toFixed(2) }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600">${{ product.selling_price.toFixed(2) }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <span :class="['text-sm font-medium', getProfitColorClass(product.profit || 0)]">
                    {{ (product.profit || 0) >= 0 ? '+' : '' }}${{ (product.profit || 0).toFixed(2) }}
                  </span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600">{{ product.supplier?.company_name || '-' }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <div class="flex items-center justify-end gap-1">
                    <button 
                      @click="openViewModal(product)" 
                      class="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      title="View"
                    >
                      <UIcon name="i-lucide-eye" class="w-4 h-4" />
                    </button>
                    <NuxtLink 
                      :to="`/products/${product.product_id}/edit`" 
                      class="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors no-underline"
                      title="Edit"
                    >
                      <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                    </NuxtLink>
                    <button 
                      @click="handleDelete(product.product_id!)" 
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
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-package" class="w-6 h-6 text-zinc-400" />
          </div>
          <h3 class="text-sm font-medium text-zinc-900 mb-1">{{ searchQuery || stockFilter !== 'all' || supplierFilter !== 'all' ? 'No products found' : 'No products yet' }}</h3>
          <p class="text-sm text-zinc-500 mb-4">
            {{ searchQuery || stockFilter !== 'all' || supplierFilter !== 'all' ? 'Try adjusting your filters' : 'Get started by adding your first product.' }}
          </p>
          <NuxtLink 
            v-if="!searchQuery && stockFilter === 'all' && supplierFilter === 'all'"
            to="/products/new" 
            class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
          >
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
            Add Product
          </NuxtLink>
        </div>
        
        <!-- Pagination Desktop -->
        <PaginationControls
          v-if="filteredProducts.length > 0"
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
    
    <!-- View Product Modal -->
    <Teleport to="body">
      <div v-if="viewModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeViewModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-4 sm:p-5 md:p-6">
            <!-- Header -->
            <div class="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-package" class="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="text-base sm:text-lg font-semibold text-zinc-900">{{ selectedProduct?.product_name }}</h2>
                <p class="text-xs sm:text-sm text-zinc-500">SKU: {{ selectedProduct?.sku || 'N/A' }}</p>
              </div>
              <button 
                @click="closeViewModal" 
                class="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg"
              >
                <UIcon name="i-lucide-x" class="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <!-- Details -->
            <div class="space-y-3 sm:space-y-4 mb-4 sm:mb-5">
              <!-- Product Image -->
              <div v-if="selectedProduct?.image_url" class="flex justify-center">
                <div class="w-24 h-24 sm:w-32 sm:h-32 bg-zinc-100 rounded-xl overflow-hidden">
                  <img :src="selectedProduct.image_url" :alt="selectedProduct.product_name" class="w-full h-full object-contain" />
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-2 sm:gap-4">
                <div class="bg-zinc-50 rounded-lg p-2.5 sm:p-3">
                  <p class="text-[10px] sm:text-xs text-zinc-500 mb-0.5 sm:mb-1">Cost Price</p>
                  <p class="text-base sm:text-lg font-semibold text-zinc-900">${{ Number(selectedProduct?.cost_price || 0).toFixed(2) }}</p>
                </div>
                <div class="bg-zinc-50 rounded-lg p-2.5 sm:p-3">
                  <p class="text-[10px] sm:text-xs text-zinc-500 mb-0.5 sm:mb-1">Selling Price</p>
                  <p class="text-base sm:text-lg font-semibold text-zinc-900">${{ Number(selectedProduct?.selling_price || 0).toFixed(2) }}</p>
                </div>
                <div class="bg-zinc-50 rounded-lg p-2.5 sm:p-3">
                  <p class="text-[10px] sm:text-xs text-zinc-500 mb-0.5 sm:mb-1">Current Stock</p>
                  <p :class="['text-base sm:text-lg font-semibold', getStockColorClass(selectedProduct?.current_stock || 0)]">{{ selectedProduct?.current_stock || 0 }}</p>
                </div>
                <div class="bg-zinc-50 rounded-lg p-2.5 sm:p-3">
                  <p class="text-[10px] sm:text-xs text-zinc-500 mb-0.5 sm:mb-1">Profit Margin</p>
                  <p :class="['text-base sm:text-lg font-semibold', getProfitColorClass(selectedProduct?.profit || 0)]">
                    {{ (selectedProduct?.profit || 0) >= 0 ? '+' : '' }}${{ (selectedProduct?.profit || 0).toFixed(2) }}
                  </p>
                </div>
              </div>
              
              <!-- Safety Stock & EOQ -->
              <div class="grid grid-cols-2 gap-2 sm:gap-4">
                <div class="bg-emerald-50 rounded-lg p-2.5 sm:p-3">
                  <p class="text-[10px] sm:text-xs text-emerald-600 mb-0.5 sm:mb-1">Safety Stock</p>
                  <p class="text-base sm:text-lg font-semibold text-emerald-700">{{ selectedProduct?.safety_stock || 0 }}</p>
                </div>
                <div class="bg-emerald-50 rounded-lg p-2.5 sm:p-3">
                  <p class="text-[10px] sm:text-xs text-emerald-600 mb-0.5 sm:mb-1">Re-order Qty (EOQ)</p>
                  <p class="text-base sm:text-lg font-semibold text-emerald-700">{{ selectedProduct?.reorder_quantity || 0 }}</p>
                </div>
              </div>
              
              <div class="bg-zinc-50 rounded-lg p-2.5 sm:p-3">
                <p class="text-[10px] sm:text-xs text-zinc-500 mb-0.5 sm:mb-1">Supplier</p>
                <p class="text-xs sm:text-sm font-medium text-zinc-900">{{ selectedProduct?.supplier?.company_name || 'No supplier assigned' }}</p>
              </div>
              
              <div v-if="selectedProduct?.description" class="bg-zinc-50 rounded-lg p-2.5 sm:p-3">
                <p class="text-[10px] sm:text-xs text-zinc-500 mb-0.5 sm:mb-1">Description</p>
                <p class="text-xs sm:text-sm text-zinc-700">{{ selectedProduct.description }}</p>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-2">
              <button 
                @click="exportProductPDF(selectedProduct!)"
                class="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-50 text-red-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-red-100"
              >
                <UIcon name="i-lucide-file-text" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Export PDF
              </button>
              <NuxtLink 
                :to="`/products/${selectedProduct?.product_id}/edit`"
                class="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
              >
                <UIcon name="i-lucide-pencil" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Edit
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types';

const { products, loading, error, fetchProducts, deleteProduct } = useProducts();

// Search and filters
const searchQuery = ref('');
const stockFilter = ref('all');
const supplierFilter = ref('all');
const sortBy = ref('name-asc');

// Get unique suppliers for filter
const uniqueSuppliers = computed(() => {
  const suppliers = new Set<string>();
  products.value.forEach(p => {
    if (p.supplier?.company_name) suppliers.add(p.supplier.company_name);
  });
  return Array.from(suppliers).sort();
});

// Filtered products
const filteredProducts = computed(() => {
  let result = [...products.value];
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(p => 
      p.product_name.toLowerCase().includes(query) ||
      (p.sku || '').toLowerCase().includes(query) ||
      p.supplier?.company_name?.toLowerCase().includes(query)
    );
  }
  
  // Stock filter
  if (stockFilter.value !== 'all') {
    result = result.filter(p => {
      const stock = p.current_stock || 0;
      switch (stockFilter.value) {
        case 'in-stock': return stock >= 50;
        case 'low-stock': return stock >= 1 && stock < 50;
        case 'out-of-stock': return stock === 0;
        default: return true;
      }
    });
  }
  
  // Supplier filter
  if (supplierFilter.value !== 'all') {
    result = result.filter(p => p.supplier?.company_name === supplierFilter.value);
  }
  
  // Sorting
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'name-asc': return a.product_name.localeCompare(b.product_name);
      case 'name-desc': return b.product_name.localeCompare(a.product_name);
      case 'stock-asc': return (a.current_stock || 0) - (b.current_stock || 0);
      case 'stock-desc': return (b.current_stock || 0) - (a.current_stock || 0);
      case 'price-asc': return a.selling_price - b.selling_price;
      case 'price-desc': return b.selling_price - a.selling_price;
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
} = usePagination<Product>(filteredProducts, 25);

onMounted(() => {
  fetchProducts();
});

const totalCostValue = computed(() => {
  return products.value.reduce((sum, p) => sum + Number(p.cost_price || 0), 0);
});

const totalSellValue = computed(() => {
  return products.value.reduce((sum, p) => sum + Number(p.selling_price || 0), 0);
});

const totalProfit = computed(() => {
  return products.value.reduce((sum, p) => sum + Number(p.profit || 0), 0);
});

const getProfitColorClass = (profit: number) => {
  if (profit > 0) return 'text-emerald-600';
  if (profit < 0) return 'text-red-600';
  return 'text-zinc-600';
};

const getStockColorClass = (stock: number) => {
  if (stock <= 0) return 'text-red-600';
  if (stock < 50) return 'text-amber-600';
  return 'text-emerald-600';
};

const getStockBadgeClass = (stock: number) => {
  if (stock <= 0) return 'bg-red-50 text-red-700';
  if (stock < 50) return 'bg-amber-50 text-amber-700';
  return 'bg-emerald-50 text-emerald-700';
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await deleteProduct(id);
  }
};

// View modal
const viewModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);

const openViewModal = (product: Product) => {
  selectedProduct.value = product;
  viewModalOpen.value = true;
};

const closeViewModal = () => {
  viewModalOpen.value = false;
  selectedProduct.value = null;
};

const exportProductPDF = (product: Product) => {
  const { exportProductDetail } = useReceiptExport();
  exportProductDetail(product);
};

// Export functions
const handleExportExcel = () => {
  const { exportToExcel } = useExport();
  const columns = [
    { header: 'SKU', key: 'sku', width: 10 },
    { header: 'Product Name', key: 'product_name', width: 25 },
    { header: 'Description', key: 'description', width: 20 },
    { header: 'Supplier', key: 'supplier_name', width: 20 },
    { header: 'Cost Price', key: 'cost_price', width: 12 },
    { header: 'Selling Price', key: 'selling_price', width: 12 },
    { header: 'Profit', key: 'profit', width: 12 },
    { header: 'Current Stock', key: 'current_stock', width: 12 },
    { header: 'Safety Stock', key: 'safety_stock', width: 12 },
    { header: 'EOQ', key: 'reorder_quantity', width: 10 },
  ];
  
  const data = filteredProducts.value.map(p => ({
    ...p,
    supplier_name: p.supplier?.company_name || 'N/A',
  }));
  
  exportToExcel(data, columns, 'products');
};

const handleExportPDF = () => {
  const { exportToPDF } = useExport();
  const columns = [
    { header: 'SKU', key: 'sku' },
    { header: 'Product', key: 'product_name' },
    { header: 'Supplier', key: 'supplier_name' },
    { header: 'Cost', key: 'cost_price' },
    { header: 'Price', key: 'selling_price' },
    { header: 'Stock', key: 'current_stock' },
    { header: 'Safety', key: 'safety_stock' },
    { header: 'EOQ', key: 'reorder_quantity' },
  ];
  
  const data = filteredProducts.value.map(p => ({
    ...p,
    supplier_name: p.supplier?.company_name || 'N/A',
  }));
  
  exportToPDF(data, columns, 'Products Report', 'products');
};
</script>
