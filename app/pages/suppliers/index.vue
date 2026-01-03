<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-building-2" class="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Suppliers</h1>
            <p class="text-xs sm:text-sm text-zinc-500">Manage your supplier relationships</p>
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
            to="/suppliers/new" 
            class="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
          >
            <UIcon name="i-lucide-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Add Supplier
          </NuxtLink>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-building-2" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Total Suppliers</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ suppliers.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-mail" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">With Email</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ suppliersWithEmail }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-phone" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">With Phone</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ suppliersWithPhone }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-map-pin" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">With Address</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ suppliersWithAddress }}</div>
        </div>
      </div>

      <!-- Search and Filters -->
      <SearchBar
        v-model:search-query="searchQuery"
        search-placeholder="Search by company name, contact, or email..."
      >
        <template #filters>
          <select 
            v-model="sortBy"
            class="px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
          >
            <option value="name-asc">Company A-Z</option>
            <option value="name-desc">Company Z-A</option>
            <option value="contact-asc">Contact A-Z</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
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
      
      <!-- Suppliers - Mobile Cards View -->
      <div v-else class="block md:hidden">
        <div class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <div class="max-h-[50vh] overflow-y-auto space-y-3 p-3">
            <div 
              v-for="supplier in paginatedItems" 
              :key="supplier.supplier_id"
              class="bg-zinc-50 border border-zinc-200 rounded-lg p-3 sm:p-4"
            >
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex-1 min-w-0">
                  <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center mb-2">
                    <UIcon name="i-lucide-building-2" class="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 class="text-sm sm:text-base font-medium text-zinc-900 truncate">{{ supplier.company_name }}</h3>
                  <p class="text-xs text-zinc-500 mt-0.5">{{ supplier.contact_person || 'No contact person' }}</p>
                </div>
                <div class="flex items-center gap-0.5 sm:gap-1 shrink-0">
                  <button 
                    @click="openViewModal(supplier)" 
                    class="p-2 sm:p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all active:scale-95"
                    title="View"
                  >
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  </button>
                  <NuxtLink 
                    :to="`/suppliers/${supplier.supplier_id}/edit`" 
                    class="p-2 sm:p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95 no-underline"
                    title="Edit"
                  >
                    <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    @click="handleDelete(supplier.supplier_id!)" 
                    class="p-2 sm:p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                    title="Delete"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="space-y-2 text-xs">
                <div v-if="supplier.email" class="flex items-center gap-2 text-zinc-600">
                  <UIcon name="i-lucide-mail" class="w-3.5 h-3.5" />
                  <span class="truncate">{{ supplier.email }}</span>
                </div>
                <div v-if="supplier.phone" class="flex items-center gap-2 text-zinc-600">
                  <UIcon name="i-lucide-phone" class="w-3.5 h-3.5" />
                  <span>{{ supplier.phone }}</span>
                </div>
                <div v-if="supplier.address" class="flex items-center gap-2 text-zinc-600">
                  <UIcon name="i-lucide-map-pin" class="w-3.5 h-3.5" />
                  <span class="truncate">{{ supplier.address }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State Mobile -->
          <div v-if="filteredSuppliers.length === 0" class="text-center py-8 sm:py-12">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <UIcon name="i-lucide-building-2" class="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
            </div>
            <h3 class="text-sm font-medium text-zinc-900 mb-1">{{ searchQuery ? 'No suppliers found' : 'No suppliers yet' }}</h3>
            <p class="text-xs sm:text-sm text-zinc-500 mb-3 sm:mb-4">
              {{ searchQuery ? 'Try adjusting your search' : 'Get started by adding your first supplier.' }}
            </p>
            <NuxtLink 
              v-if="!searchQuery"
              to="/suppliers/new" 
              class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
            >
              <UIcon name="i-lucide-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Add Supplier
            </NuxtLink>
          </div>
          
          <!-- Pagination Mobile -->
          <PaginationControls
            v-if="filteredSuppliers.length > 0"
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
      
      <!-- Suppliers Table - Desktop View -->
      <div v-if="!loading && !error" class="hidden md:block bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div class="max-h-[50vh] overflow-y-auto">
          <table class="w-full">
            <thead class="sticky top-0 z-10">
              <tr class="bg-zinc-50 border-b border-zinc-200">
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Company</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Contact Person</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Email</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Phone</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Address</th>
                <th class="px-4 lg:px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="supplier in paginatedItems" :key="supplier.supplier_id" class="hover:bg-zinc-50 transition-colors">
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                      <UIcon name="i-lucide-building-2" class="w-4 h-4 text-amber-600" />
                    </div>
                    <span class="text-sm font-medium text-zinc-900">{{ supplier.company_name }}</span>
                  </div>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600">{{ supplier.contact_person || '-' }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600">{{ supplier.email || '-' }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600">{{ supplier.phone || '-' }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600 max-w-[200px] truncate">{{ supplier.address || '-' }}</td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <div class="flex items-center justify-end gap-1">
                    <button 
                      @click="openViewModal(supplier)" 
                      class="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      title="View"
                    >
                      <UIcon name="i-lucide-eye" class="w-4 h-4" />
                    </button>
                    <NuxtLink 
                      :to="`/suppliers/${supplier.supplier_id}/edit`" 
                      class="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors no-underline"
                      title="Edit"
                    >
                      <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                    </NuxtLink>
                    <button 
                      @click="handleDelete(supplier.supplier_id!)" 
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
        <div v-if="filteredSuppliers.length === 0" class="text-center py-12">
          <div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-building-2" class="w-6 h-6 text-zinc-400" />
          </div>
          <h3 class="text-sm font-medium text-zinc-900 mb-1">{{ searchQuery ? 'No suppliers found' : 'No suppliers yet' }}</h3>
          <p class="text-sm text-zinc-500 mb-4">
            {{ searchQuery ? 'Try adjusting your search' : 'Get started by adding your first supplier.' }}
          </p>
          <NuxtLink 
            v-if="!searchQuery"
            to="/suppliers/new" 
            class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
          >
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
            Add Supplier
          </NuxtLink>
        </div>
        
        <!-- Pagination Desktop -->
        <PaginationControls
          v-if="filteredSuppliers.length > 0"
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
    
    <!-- View Supplier Modal -->
    <Teleport to="body">
      <div v-if="viewModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeViewModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-5 sm:p-6">
            <!-- Header -->
            <div class="flex items-start gap-4 mb-5">
              <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-building-2" class="w-6 h-6 text-amber-600" />
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="text-lg font-semibold text-zinc-900">{{ selectedSupplier?.company_name }}</h2>
                <p class="text-sm text-zinc-500">Supplier Profile</p>
              </div>
              <button 
                @click="closeViewModal" 
                class="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg"
              >
                <UIcon name="i-lucide-x" class="w-5 h-5" />
              </button>
            </div>
            
            <!-- Details -->
            <div class="space-y-3 mb-5">
              <div v-if="selectedSupplier?.contact_person" class="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                <UIcon name="i-lucide-user" class="w-4 h-4 text-zinc-400" />
                <div>
                  <p class="text-xs text-zinc-500">Contact Person</p>
                  <p class="text-sm font-medium text-zinc-900">{{ selectedSupplier.contact_person }}</p>
                </div>
              </div>
              
              <div v-if="selectedSupplier?.sale_agent" class="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                <UIcon name="i-lucide-user-check" class="w-4 h-4 text-zinc-400" />
                <div>
                  <p class="text-xs text-zinc-500">Sales Agent</p>
                  <p class="text-sm font-medium text-zinc-900">{{ selectedSupplier.sale_agent }}</p>
                </div>
              </div>
              
              <div v-if="selectedSupplier?.email" class="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                <UIcon name="i-lucide-mail" class="w-4 h-4 text-zinc-400" />
                <div>
                  <p class="text-xs text-zinc-500">Email</p>
                  <p class="text-sm font-medium text-zinc-900">{{ selectedSupplier.email }}</p>
                </div>
              </div>
              
              <div v-if="selectedSupplier?.phone" class="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                <UIcon name="i-lucide-phone" class="w-4 h-4 text-zinc-400" />
                <div>
                  <p class="text-xs text-zinc-500">Phone</p>
                  <p class="text-sm font-medium text-zinc-900">{{ selectedSupplier.phone }}</p>
                </div>
              </div>
              
              <div v-if="selectedSupplier?.address" class="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-zinc-400" />
                <div>
                  <p class="text-xs text-zinc-500">Address</p>
                  <p class="text-sm font-medium text-zinc-900">{{ selectedSupplier.address }}</p>
                </div>
              </div>
              
              <div v-if="selectedSupplier?.lead_time_days" class="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                <UIcon name="i-lucide-clock" class="w-4 h-4 text-zinc-400" />
                <div>
                  <p class="text-xs text-zinc-500">Lead Time</p>
                  <p class="text-sm font-medium text-zinc-900">{{ selectedSupplier.lead_time_days }} days</p>
                </div>
              </div>
              
              <div v-if="selectedSupplier?.products" class="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg">
                <UIcon name="i-lucide-package" class="w-4 h-4 text-zinc-400 mt-0.5" />
                <div>
                  <p class="text-xs text-zinc-500">Products Supplied</p>
                  <p class="text-sm font-medium text-zinc-900">{{ selectedSupplier.products }}</p>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-2">
              <button 
                @click="exportSupplierPDF(selectedSupplier!)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100"
              >
                <UIcon name="i-lucide-file-text" class="w-4 h-4" />
                Export PDF
              </button>
              <NuxtLink 
                :to="`/suppliers/${selectedSupplier?.supplier_id}/edit`"
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
import type { Supplier } from '~/types';

const { suppliers, loading, error, fetchSuppliers, deleteSupplier } = useSuppliers();

// Search and filters
const searchQuery = ref('');
const sortBy = ref('name-asc');

// Filtered suppliers
const filteredSuppliers = computed(() => {
  let result = [...suppliers.value];
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(s => 
      s.company_name?.toLowerCase().includes(query) ||
      s.contact_person?.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query)
    );
  }
  
  // Sorting
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'name-asc': return (a.company_name || '').localeCompare(b.company_name || '');
      case 'name-desc': return (b.company_name || '').localeCompare(a.company_name || '');
      case 'contact-asc': return (a.contact_person || '').localeCompare(b.contact_person || '');
      case 'newest': return (b.supplier_id || 0) - (a.supplier_id || 0);
      case 'oldest': return (a.supplier_id || 0) - (b.supplier_id || 0);
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
} = usePagination<Supplier>(filteredSuppliers, 25);

onMounted(() => {
  fetchSuppliers();
});

const suppliersWithEmail = computed(() => suppliers.value.filter(s => s.email).length);
const suppliersWithPhone = computed(() => suppliers.value.filter(s => s.phone).length);
const suppliersWithAddress = computed(() => suppliers.value.filter(s => s.address).length);

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this supplier?')) {
    await deleteSupplier(id);
  }
};

// View modal
const viewModalOpen = ref(false);
const selectedSupplier = ref<Supplier | null>(null);

const openViewModal = (supplier: Supplier) => {
  selectedSupplier.value = supplier;
  viewModalOpen.value = true;
};

const closeViewModal = () => {
  viewModalOpen.value = false;
  selectedSupplier.value = null;
};

const exportSupplierPDF = (supplier: Supplier) => {
  const { exportSupplierDetail } = useReceiptExport();
  exportSupplierDetail(supplier);
};

// Export functions
const handleExportExcel = () => {
  const { exportToExcel } = useExport();
  const columns = [
    { header: 'Company Name', key: 'company_name', width: 25 },
    { header: 'Contact Person', key: 'contact_person', width: 20 },
    { header: 'Sale Agent', key: 'sale_agent', width: 20 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Address', key: 'address', width: 30 },
    { header: 'Lead Time (Days)', key: 'lead_time_days', width: 15 },
  ];
  exportToExcel(filteredSuppliers.value, columns, 'suppliers');
};

const handleExportPDF = () => {
  const { exportToPDF } = useExport();
  const columns = [
    { header: 'Company', key: 'company_name' },
    { header: 'Contact', key: 'contact_person' },
    { header: 'Phone', key: 'phone' },
    { header: 'Email', key: 'email' },
    { header: 'Lead Time', key: 'lead_time_days' },
  ];
  exportToPDF(filteredSuppliers.value, columns, 'Suppliers Report', 'suppliers');
};
</script>
