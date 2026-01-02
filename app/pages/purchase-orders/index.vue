<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Purchase Orders</h1>
          <p class="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-500">Manage your supplier orders</p>
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
            to="/purchase-orders/new" 
            class="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
          >
            <UIcon name="i-lucide-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Create PO
          </NuxtLink>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-clipboard-list" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Total POs</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ purchaseOrders.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Pending</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-amber-600">{{ pendingCount }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-truck" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Shipped</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-purple-600">{{ shippedCount }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-check-circle" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Received</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-emerald-600">{{ receivedCount }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5 col-span-2 sm:col-span-1">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-dollar-sign" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Total Value</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">${{ totalValue.toFixed(2) }}</div>
        </div>
      </div>

      <!-- Search and Filters -->
      <SearchBar
        v-model:search-query="searchQuery"
        search-placeholder="Search by PO number or supplier..."
      >
        <template #filters>
          <DateRangePicker v-model="dateRange" />
          <select 
            v-model="statusFilter"
            class="px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Received">Received</option>
          </select>
          <select 
            v-model="supplierFilter"
            class="px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
          >
            <option value="all">All Suppliers</option>
            <option v-for="supplier in uniqueSuppliers" :key="supplier" :value="supplier">
              {{ supplier }}
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
            <option value="po-asc">PO# Ascending</option>
            <option value="po-desc">PO# Descending</option>
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
      
      <!-- Mobile Cards View -->
      <div v-else class="block md:hidden">
        <div class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <div class="max-h-[50vh] overflow-y-auto space-y-3 p-3">
            <div 
              v-for="po in paginatedItems" 
              :key="po.po_id"
              class="bg-zinc-50 border border-zinc-200 rounded-lg p-3 sm:p-4"
            >
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex-1 min-w-0">
                  <span class="inline-flex items-center px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] sm:text-xs font-medium rounded mb-1.5">
                    {{ po.po_number }}
                  </span>
                  <h3 class="text-sm font-medium text-zinc-900 truncate">{{ po.supplier?.company_name || 'Unknown Supplier' }}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span :class="getStatusClasses(po.status)" class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full">
                      <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(po.status)" />
                      {{ po.status }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <button 
                    @click="openViewModal(po)" 
                    class="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                    title="View"
                  >
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  </button>
                  <NuxtLink 
                    :to="`/purchase-orders/${po.po_id}/edit`" 
                    class="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors no-underline"
                    title="Edit"
                  >
                    <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    @click="updateStatus(po, 'Received')"
                    v-if="po.status !== 'Received'"
                    class="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                    title="Mark Complete"
                  >
                    <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
                  </button>
                  <button 
                    @click="handleDelete(po.po_id!)" 
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
                  {{ formatDate(po.order_date) }}
                </span>
                <span>ETA: {{ formatDate(po.eta_date) }}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-center">
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Items</p>
                  <p class="text-xs sm:text-sm font-medium text-zinc-900">{{ po.items?.length || 0 }}</p>
                </div>
                <div class="bg-emerald-50 rounded-lg p-2">
                  <p class="text-[10px] text-emerald-600 mb-0.5">Total</p>
                  <p class="text-xs sm:text-sm font-semibold text-emerald-600">${{ (po.total_amount || 0).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State Mobile -->
          <div v-if="filteredPOs.length === 0" class="text-center py-8 sm:py-12">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <UIcon name="i-lucide-clipboard-list" class="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
            </div>
            <h3 class="text-sm font-medium text-zinc-900 mb-1">{{ hasFilters ? 'No POs found' : 'No purchase orders' }}</h3>
            <p class="text-xs sm:text-sm text-zinc-500 mb-3 sm:mb-4">
              {{ hasFilters ? 'Try adjusting your filters' : 'Get started by creating your first PO.' }}
            </p>
            <NuxtLink 
              v-if="!hasFilters"
              to="/purchase-orders/new" 
              class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
            >
              <UIcon name="i-lucide-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Create PO
            </NuxtLink>
          </div>
          
          <!-- Pagination Mobile -->
          <PaginationControls
            v-if="filteredPOs.length > 0"
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
      
      <!-- Purchase Orders Table - Desktop -->
      <div v-if="!loading && !error" class="hidden md:block bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div class="max-h-[50vh] overflow-y-auto">
          <table class="w-full">
            <thead class="sticky top-0 z-10">
              <tr class="bg-zinc-50 border-b border-zinc-200">
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">PO Number</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Supplier</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Order Date</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">ETA</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Items</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Total</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Status</th>
                <th class="px-4 lg:px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="po in paginatedItems" :key="po.po_id" class="hover:bg-zinc-50 transition-colors">
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <span class="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                    {{ po.po_number }}
                  </span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 lg:w-7 lg:h-7 bg-zinc-100 rounded flex items-center justify-center">
                      <UIcon name="i-lucide-building-2" class="w-3 h-3 lg:w-3.5 lg:h-3.5 text-zinc-500" />
                    </div>
                    <span class="text-sm text-zinc-900">{{ po.supplier?.company_name || '-' }}</span>
                  </div>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600">{{ formatDate(po.order_date) }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600">{{ formatDate(po.eta_date) }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-500">{{ po.items?.length || 0 }} items</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <span class="text-sm font-medium text-zinc-900">${{ (po.total_amount || 0).toFixed(2) }}</span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <span :class="getStatusClasses(po.status)" class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full">
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(po.status)" />
                    {{ po.status }}
                  </span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <div class="flex items-center justify-end gap-1">
                    <button 
                      @click="openViewModal(po)" 
                      class="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      title="View"
                    >
                      <UIcon name="i-lucide-eye" class="w-4 h-4" />
                    </button>
                    <NuxtLink 
                      :to="`/purchase-orders/${po.po_id}/edit`" 
                      class="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors no-underline"
                      title="Edit"
                    >
                      <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                    </NuxtLink>
                    <button 
                      @click="updateStatus(po, 'Received')"
                      v-if="po.status !== 'Received'"
                      class="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                      title="Mark Complete"
                    >
                      <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
                    </button>
                    <button 
                      class="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                      @click="handleDelete(po.po_id!)" 
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
        <div v-if="filteredPOs.length === 0" class="text-center py-12">
          <div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-clipboard-list" class="w-6 h-6 text-zinc-400" />
          </div>
          <h3 class="text-sm font-medium text-zinc-900 mb-1">{{ hasFilters ? 'No POs found' : 'No purchase orders' }}</h3>
          <p class="text-sm text-zinc-500 mb-4">
            {{ hasFilters ? 'Try adjusting your filters' : 'Get started by creating your first purchase order.' }}
          </p>
          <NuxtLink 
            v-if="!hasFilters"
            to="/purchase-orders/new" 
            class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors no-underline"
          >
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
            Create PO
          </NuxtLink>
        </div>
        
        <!-- Pagination Desktop -->
        <PaginationControls
          v-if="filteredPOs.length > 0"
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
    
    <!-- View PO Modal -->
    <Teleport to="body">
      <div v-if="viewModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeViewModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="flex items-start justify-between mb-5">
              <div>
                <h2 class="text-lg font-semibold text-zinc-900">Purchase Order</h2>
                <p class="text-sm text-zinc-500">{{ selectedPO?.po_number }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span :class="getStatusClasses(selectedPO?.status)" class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(selectedPO?.status)" />
                  {{ selectedPO?.status }}
                </span>
                <button 
                  @click="closeViewModal" 
                  class="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg"
                >
                  <UIcon name="i-lucide-x" class="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <!-- Supplier & Dates -->
            <div class="grid grid-cols-2 gap-4 mb-5">
              <div class="bg-zinc-50 rounded-lg p-3">
                <p class="text-xs text-zinc-500 mb-1">Supplier</p>
                <p class="text-sm font-medium text-zinc-900">{{ selectedPO?.supplier?.company_name || 'N/A' }}</p>
              </div>
              <div class="bg-zinc-50 rounded-lg p-3">
                <p class="text-xs text-zinc-500 mb-1">Order Date</p>
                <p class="text-sm font-medium text-zinc-900">{{ formatDate(selectedPO?.order_date) }}</p>
              </div>
              <div class="bg-zinc-50 rounded-lg p-3">
                <p class="text-xs text-zinc-500 mb-1">ETA Date</p>
                <p class="text-sm font-medium text-zinc-900">{{ formatDate(selectedPO?.eta_date) }}</p>
              </div>
              <div v-if="selectedPO?.third_party_agent" class="bg-zinc-50 rounded-lg p-3">
                <p class="text-xs text-zinc-500 mb-1">Agent</p>
                <p class="text-sm font-medium text-zinc-900">{{ selectedPO.third_party_agent }}</p>
              </div>
            </div>
            
            <!-- Items -->
            <div v-if="selectedPO?.items?.length" class="mb-5">
              <h3 class="text-sm font-medium text-zinc-700 mb-3">Order Items</h3>
              <div class="border border-zinc-200 rounded-lg overflow-hidden">
                <table class="w-full text-sm">
                  <thead class="bg-zinc-50">
                    <tr>
                      <th class="px-3 py-2 text-left text-xs font-medium text-zinc-500">Product</th>
                      <th class="px-3 py-2 text-right text-xs font-medium text-zinc-500">Qty</th>
                      <th class="px-3 py-2 text-right text-xs font-medium text-zinc-500">Unit Cost</th>
                      <th class="px-3 py-2 text-right text-xs font-medium text-zinc-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-zinc-100">
                    <tr v-for="item in selectedPO.items" :key="item.item_id">
                      <td class="px-3 py-2 text-zinc-900">{{ item.product?.product_name || 'N/A' }}</td>
                      <td class="px-3 py-2 text-right text-zinc-600">{{ item.quantity }}</td>
                      <td class="px-3 py-2 text-right text-zinc-600">${{ Number(item.unit_cost).toFixed(2) }}</td>
                      <td class="px-3 py-2 text-right font-medium text-zinc-900">${{ Number(item.amount).toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Totals -->
            <div class="bg-zinc-50 rounded-lg p-4 mb-5">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-zinc-500">Subtotal</span>
                  <span class="text-zinc-900">${{ Number(selectedPO?.subtotal || 0).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-zinc-500">Shipping</span>
                  <span class="text-zinc-900">${{ Number(selectedPO?.shipping_cost || 0).toFixed(2) }}</span>
                </div>
                <div v-if="selectedPO?.promotion_amount" class="flex justify-between text-sm">
                  <span class="text-zinc-500">Promotion</span>
                  <span class="text-emerald-600">-${{ Number(selectedPO.promotion_amount).toFixed(2) }}</span>
                </div>
                <div class="border-t border-zinc-200 pt-2 flex justify-between">
                  <span class="font-medium text-zinc-900">Total</span>
                  <span class="font-bold text-lg text-amber-600">${{ Number(selectedPO?.total_amount || 0).toFixed(2) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Remarks -->
            <div v-if="selectedPO?.overall_remark || selectedPO?.truck_remark" class="bg-zinc-50 rounded-lg p-3 mb-5">
              <p class="text-xs text-zinc-500 mb-1">Remarks</p>
              <p class="text-sm text-zinc-700">{{ selectedPO.overall_remark || selectedPO.truck_remark }}</p>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-2">
              <button 
                @click="exportPODetail(selectedPO!)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100"
              >
                <UIcon name="i-lucide-file-text" class="w-4 h-4" />
                Export PDF
              </button>
              <NuxtLink 
                :to="`/purchase-orders/${selectedPO?.po_id}/edit`"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
              >
                <UIcon name="i-lucide-pencil" class="w-4 h-4" />
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
import type { PurchaseOrder } from '~/types';

const { purchaseOrders, loading, error, fetchPurchaseOrders, deletePurchaseOrder, updatePurchaseOrder } = usePurchaseOrders();

// Search and filters
const searchQuery = ref('');
const dateRange = ref<{ from: string | null; to: string | null }>({ from: null, to: null });
const statusFilter = ref('all');
const supplierFilter = ref('all');
const sortBy = ref('date-desc');

// Get unique suppliers for filter
const uniqueSuppliers = computed(() => {
  const suppliers = new Set<string>();
  purchaseOrders.value.forEach(po => {
    if (po.supplier?.company_name) suppliers.add(po.supplier.company_name);
  });
  return Array.from(suppliers).sort();
});

const hasFilters = computed(() => searchQuery.value || dateRange.value.from || dateRange.value.to || statusFilter.value !== 'all' || supplierFilter.value !== 'all');

// Filtered POs
const filteredPOs = computed(() => {
  let result = [...purchaseOrders.value];
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(po => 
      po.po_number?.toLowerCase().includes(query) ||
      po.supplier?.company_name?.toLowerCase().includes(query)
    );
  }
  
  // Date range filter
  if (dateRange.value.from || dateRange.value.to) {
    result = result.filter(po => {
      const orderDate = new Date(po.order_date);
      if (dateRange.value.from && orderDate < new Date(dateRange.value.from)) return false;
      if (dateRange.value.to && orderDate > new Date(dateRange.value.to + 'T23:59:59')) return false;
      return true;
    });
  }
  
  // Status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(po => po.status === statusFilter.value);
  }
  
  // Supplier filter
  if (supplierFilter.value !== 'all') {
    result = result.filter(po => po.supplier?.company_name === supplierFilter.value);
  }
  
  // Sorting
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-asc': return new Date(a.order_date).getTime() - new Date(b.order_date).getTime();
      case 'date-desc': return new Date(b.order_date).getTime() - new Date(a.order_date).getTime();
      case 'amount-asc': return Number(a.total_amount || 0) - Number(b.total_amount || 0);
      case 'amount-desc': return Number(b.total_amount || 0) - Number(a.total_amount || 0);
      case 'po-asc': return (a.po_number || '').localeCompare(b.po_number || '');
      case 'po-desc': return (b.po_number || '').localeCompare(a.po_number || '');
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
} = usePagination<PurchaseOrder>(filteredPOs, 25);

onMounted(() => {
  fetchPurchaseOrders();
});

const pendingCount = computed(() => purchaseOrders.value.filter(po => po.status === 'Pending').length);
const shippedCount = computed(() => purchaseOrders.value.filter(po => po.status === 'Shipped').length);
const receivedCount = computed(() => purchaseOrders.value.filter(po => po.status === 'Received').length);
const totalValue = computed(() => purchaseOrders.value.reduce((sum, po) => sum + Number(po.total_amount || 0), 0));

const formatDate = (date?: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getStatusClasses = (status?: string) => {
  switch (status) {
    case 'Pending': return 'bg-amber-50 text-amber-700';
    case 'Shipped': return 'bg-purple-50 text-purple-700';
    case 'Received': return 'bg-emerald-50 text-emerald-700';
    default: return 'bg-zinc-50 text-zinc-700';
  }
};

const getStatusDotClass = (status?: string) => {
  switch (status) {
    case 'Pending': return 'bg-amber-500';
    case 'Shipped': return 'bg-purple-500';
    case 'Received': return 'bg-emerald-500';
    default: return 'bg-zinc-500';
  }
};

const updateStatus = async (po: PurchaseOrder, newStatus: string) => {
  if (confirm(`Mark this PO as ${newStatus}?`)) {
    await updatePurchaseOrder(po.po_id!, { status: newStatus });
  }
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this purchase order?')) {
    await deletePurchaseOrder(id);
  }
};

// View modal
const viewModalOpen = ref(false);
const selectedPO = ref<PurchaseOrder | null>(null);

const openViewModal = (po: PurchaseOrder) => {
  selectedPO.value = po;
  viewModalOpen.value = true;
};

const closeViewModal = () => {
  viewModalOpen.value = false;
  selectedPO.value = null;
};

const exportPODetail = (po: PurchaseOrder) => {
  const { exportPurchaseOrderDetail } = useReceiptExport();
  exportPurchaseOrderDetail(po);
};

// Export functions
const handleExportExcel = () => {
  const { exportToExcel } = useExport();
  const columns = [
    { header: 'PO Number', key: 'po_number', width: 15 },
    { header: 'Supplier', key: 'supplier_name', width: 25 },
    { header: 'Order Date', key: 'order_date', width: 12 },
    { header: 'ETA Date', key: 'eta_date', width: 12 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Subtotal', key: 'subtotal', width: 12 },
    { header: 'Shipping', key: 'shipping_cost', width: 12 },
    { header: 'Total', key: 'total_amount', width: 12 },
  ];
  
  const data = filteredPOs.value.map(po => ({
    ...po,
    supplier_name: po.supplier?.company_name || 'N/A',
  }));
  
  exportToExcel(data, columns, 'purchase_orders');
};

const handleExportPDF = () => {
  const { exportToPDF } = useExport();
  const columns = [
    { header: 'PO #', key: 'po_number' },
    { header: 'Supplier', key: 'supplier_name' },
    { header: 'Date', key: 'order_date' },
    { header: 'ETA', key: 'eta_date' },
    { header: 'Status', key: 'status' },
    { header: 'Total', key: 'total_amount' },
  ];
  
  const data = filteredPOs.value.map(po => ({
    ...po,
    supplier_name: po.supplier?.company_name || 'N/A',
  }));
  
  exportToPDF(data, columns, 'Purchase Orders Report', 'purchase_orders');
};
</script>
