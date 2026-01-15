<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-package-check" class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Purchase Entries</h1>
            <p class="text-xs sm:text-sm text-zinc-500">Record and manage PO receiving status</p>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Pending</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-amber-600">{{ pendingOrders.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-send" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Ordered</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-blue-600">{{ orderedOrders.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-truck" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Shipped</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-purple-600">{{ shippedOrders.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-check-circle" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            </div>
            <div class="text-[10px] sm:text-xs md:text-sm text-zinc-500 leading-tight">Received</div>
          </div>
          <div class="text-base sm:text-lg md:text-xl font-semibold text-emerald-600">{{ receivedOrders.length }}</div>
        </div>
      </div>

      <!-- Search and Filters -->
      <SearchBar
        v-model:search-query="searchQuery"
        search-placeholder="Search by PO number or supplier..."
      >
        <template #filters>
          <select 
            v-model="statusFilter"
            class="px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Ordered">Ordered</option>
            <option value="Shipped">Shipped</option>
            <option value="Received">Received</option>
          </select>
          <select 
            v-model="supplierFilter"
            class="px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
          >
            <option value="all">All Suppliers</option>
            <option v-for="supplier in uniqueSuppliers" :key="supplier" :value="supplier">
              {{ supplier }}
            </option>
          </select>
        </template>
      </SearchBar>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12 sm:py-20">
        <UIcon name="i-lucide-loader-2" class="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 animate-spin" />
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
          <div class="max-h-[60vh] overflow-y-auto space-y-3 p-3">
            <div 
              v-for="po in paginatedItems" 
              :key="po.po_id"
              class="bg-zinc-50 border border-zinc-200 rounded-lg p-3 sm:p-4"
            >
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex-1 min-w-0">
                  <span class="inline-flex items-center px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-medium rounded mb-1.5">
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
                <button 
                  @click="openEntryModal(po)"
                  class="px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Update
                </button>
              </div>
              <div class="flex items-center justify-between text-xs text-zinc-500 mb-3">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-calendar" class="w-3 h-3" />
                  {{ formatDate(po.order_date) }}
                </span>
                <span>ETA: {{ formatDate(po.eta_date) }}</span>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Items</p>
                  <p class="text-xs sm:text-sm font-medium text-zinc-900">{{ po.items?.length || 0 }}</p>
                </div>
                <div class="bg-white rounded-lg p-2">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Lead Time</p>
                  <p class="text-xs sm:text-sm font-medium text-zinc-900">{{ po.supplier?.lead_time_days || '-' }} days</p>
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
              <UIcon name="i-lucide-package-check" class="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
            </div>
            <h3 class="text-sm font-medium text-zinc-900 mb-1">No purchase orders found</h3>
            <p class="text-xs sm:text-sm text-zinc-500 mb-3 sm:mb-4">
              Try adjusting your filters or create a new PO.
            </p>
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
        <div class="max-h-[60vh] overflow-y-auto">
          <table class="w-full">
            <thead class="sticky top-0 z-10">
              <tr class="bg-zinc-50 border-b border-zinc-200">
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">PO Number</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Supplier</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Order Date</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">ETA</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Lead Time</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Total</th>
                <th class="px-4 lg:px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Status</th>
                <th class="px-4 lg:px-5 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="po in paginatedItems" :key="po.po_id" class="hover:bg-zinc-50 transition-colors">
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <span class="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">
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
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-sm text-zinc-600">
                  <span class="inline-flex items-center gap-1">
                    <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 text-zinc-400" />
                    {{ po.supplier?.lead_time_days || 7 }} days
                  </span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <span class="text-sm font-medium text-zinc-900">${{ (po.total_amount || 0).toFixed(2) }}</span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4">
                  <span :class="getStatusClasses(po.status)" class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full">
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(po.status)" />
                    {{ po.status }}
                  </span>
                </td>
                <td class="px-4 lg:px-5 py-3 lg:py-4 text-center">
                  <button 
                    @click="openEntryModal(po)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    <UIcon name="i-lucide-edit-3" class="w-3.5 h-3.5" />
                    Update Status
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State Desktop -->
        <div v-if="filteredPOs.length === 0" class="text-center py-12">
          <div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-package-check" class="w-6 h-6 text-zinc-400" />
          </div>
          <h3 class="text-sm font-medium text-zinc-900 mb-1">No purchase orders found</h3>
          <p class="text-sm text-zinc-500 mb-4">
            Try adjusting your filters or create a new purchase order.
          </p>
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
    
    <!-- Update Status Modal -->
    <Teleport to="body">
      <div v-if="entryModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeEntryModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-5 sm:p-6">
            <!-- Header -->
            <div class="flex items-start justify-between mb-5">
              <div>
                <h2 class="text-lg font-semibold text-zinc-900">Update Purchase Entry</h2>
                <p class="text-sm text-zinc-500">{{ selectedPO?.po_number }} - {{ selectedPO?.supplier?.company_name }}</p>
              </div>
              <button 
                @click="closeEntryModal" 
                class="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg"
              >
                <UIcon name="i-lucide-x" class="w-5 h-5" />
              </button>
            </div>
            
            <!-- Current Status -->
            <div class="bg-zinc-50 rounded-lg p-4 mb-5">
              <div class="flex items-center justify-between">
                <span class="text-sm text-zinc-600">Current Status</span>
                <span :class="getStatusClasses(selectedPO?.status)" class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(selectedPO?.status)" />
                  {{ selectedPO?.status }}
                </span>
              </div>
            </div>
            
            <!-- Form -->
            <form @submit.prevent="handleUpdateStatus" class="space-y-4">
              <div class="form-group">
                <label class="input-label">New Status <span class="text-red-500">*</span></label>
                <select v-model="entryForm.status" class="select" required>
                  <option value="Pending">Pending</option>
                  <option value="Ordered">Ordered</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Received">Received</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <!-- Show received fields when status is Received -->
              <template v-if="entryForm.status === 'Received'">
                <div class="form-group">
                  <label class="input-label">Received Date</label>
                  <DatePicker 
                    v-model="entryForm.received_date"
                    placeholder="Select received date"
                  />
                </div>
                
                <div class="form-group">
                  <label class="input-label">Received By</label>
                  <input 
                    v-model="entryForm.received_by"
                    type="text"
                    placeholder="Name of person receiving"
                    class="input"
                  />
                </div>
              </template>
              
              <div class="form-group">
                <label class="input-label">Notes</label>
                <textarea 
                  v-model="entryForm.received_notes"
                  rows="3"
                  placeholder="Add any notes about this status update..."
                  class="input resize-none"
                ></textarea>
              </div>
              
              <!-- Actions -->
              <div class="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  class="flex-1 btn-primary justify-center bg-emerald-500 hover:bg-emerald-600"
                  :disabled="updating"
                >
                  <UIcon v-if="updating" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
                  <UIcon v-else name="i-lucide-check" class="w-4 h-4" />
                  {{ updating ? 'Updating...' : 'Update Status' }}
                </button>
                <button 
                  type="button"
                  @click="closeEntryModal"
                  class="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { PurchaseOrder } from '~/types';

const { purchaseOrders, loading, error, fetchPurchaseOrders, updatePurchaseOrder } = usePurchaseOrders();

// Search and filters
const searchQuery = ref('');
const statusFilter = ref('all');
const supplierFilter = ref('all');

// Get unique suppliers for filter
const uniqueSuppliers = computed(() => {
  const suppliers = new Set<string>();
  purchaseOrders.value.forEach(po => {
    if (po.supplier?.company_name) suppliers.add(po.supplier.company_name);
  });
  return Array.from(suppliers).sort();
});

// Status counts
const pendingOrders = computed(() => purchaseOrders.value.filter(po => po.status === 'Pending'));
const orderedOrders = computed(() => purchaseOrders.value.filter(po => po.status === 'Ordered'));
const shippedOrders = computed(() => purchaseOrders.value.filter(po => po.status === 'Shipped'));
const receivedOrders = computed(() => purchaseOrders.value.filter(po => po.status === 'Received'));

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
  
  // Status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(po => po.status === statusFilter.value);
  }
  
  // Supplier filter
  if (supplierFilter.value !== 'all') {
    result = result.filter(po => po.supplier?.company_name === supplierFilter.value);
  }
  
  // Sort by order date desc
  result.sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());
  
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

const formatDate = (date?: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getStatusClasses = (status?: string) => {
  switch (status) {
    case 'Pending': return 'bg-amber-50 text-amber-700';
    case 'Ordered': return 'bg-blue-50 text-blue-700';
    case 'Shipped': return 'bg-purple-50 text-purple-700';
    case 'Received': return 'bg-emerald-50 text-emerald-700';
    case 'Cancelled': return 'bg-red-50 text-red-700';
    default: return 'bg-zinc-50 text-zinc-700';
  }
};

const getStatusDotClass = (status?: string) => {
  switch (status) {
    case 'Pending': return 'bg-amber-500';
    case 'Ordered': return 'bg-blue-500';
    case 'Shipped': return 'bg-purple-500';
    case 'Received': return 'bg-emerald-500';
    case 'Cancelled': return 'bg-red-500';
    default: return 'bg-zinc-500';
  }
};

// Entry Modal
const entryModalOpen = ref(false);
const selectedPO = ref<PurchaseOrder | null>(null);
const updating = ref(false);

const entryForm = ref({
  status: 'Pending' as string,
  received_date: '',
  received_by: '',
  received_notes: '',
});

const openEntryModal = (po: PurchaseOrder) => {
  selectedPO.value = po;
  entryForm.value = {
    status: po.status || 'Pending',
    received_date: new Date().toISOString().split('T')[0] || '',
    received_by: '',
    received_notes: '',
  };
  entryModalOpen.value = true;
};

const closeEntryModal = () => {
  entryModalOpen.value = false;
  selectedPO.value = null;
};

const handleUpdateStatus = async () => {
  if (!selectedPO.value?.po_id) return;
  
  updating.value = true;
  try {
    await updatePurchaseOrder(selectedPO.value.po_id, {
      status: entryForm.value.status,
      // Additional fields can be added to the API later
    });
    closeEntryModal();
    await fetchPurchaseOrders();
  } catch (e) {
    console.error('Failed to update status:', e);
  } finally {
    updating.value = false;
  }
};
</script>
