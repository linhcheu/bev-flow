<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Purchase Orders</h1>
          <p class="mt-1 text-sm text-zinc-500">Manage your supplier orders</p>
        </div>
        <NuxtLink 
          to="/purchase-orders/new" 
          class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 no-underline w-full sm:w-auto"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Create PO
        </NuxtLink>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-clipboard-list" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Total POs</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">{{ purchaseOrders.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-clock" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Pending</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-amber-600">{{ pendingCount }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-truck" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Shipped</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-purple-600">{{ shippedCount }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Received</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-emerald-600">{{ receivedCount }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-dollar-sign" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Total Value</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">${{ totalValue.toFixed(2) }}</div>
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
      
      <!-- Purchase Orders Table -->
      <div v-else class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-zinc-50 border-b border-zinc-200">
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">PO Number</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Supplier</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Order Date</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">ETA</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Items</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Total</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
              <th class="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr v-for="po in purchaseOrders" :key="po.po_id" class="hover:bg-zinc-50 transition-colors">
              <td class="px-5 py-4">
                <span class="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                  {{ po.po_number }}
                </span>
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 bg-zinc-100 rounded flex items-center justify-center">
                    <UIcon name="i-lucide-building-2" class="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <span class="text-sm text-zinc-900">{{ po.supplier?.company_name || '-' }}</span>
                </div>
                </td>
                <td class="px-5 py-4 text-sm text-zinc-600">{{ formatDate(po.order_date) }}</td>
                <td class="px-5 py-4 text-sm text-zinc-600">{{ formatDate(po.eta_date) }}</td>
                <td class="px-5 py-4 text-sm text-zinc-500">{{ po.items?.length || 0 }} items</td>
                <td class="px-5 py-4">
                  <span class="text-sm font-medium text-zinc-900">${{ (po.total_amount || 0).toFixed(2) }}</span>
                </td>
                <td class="px-5 py-4">
                  <span :class="getStatusClasses(po.status)" class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full">
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(po.status)" />
                    {{ po.status }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-1">
                    <NuxtLink 
                      :to="`/purchase-orders/${po.po_id}`" 
                      class="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors no-underline"
                      title="View"
                    >
                      <UIcon name="i-lucide-eye" class="w-4 h-4" />
                    </NuxtLink>
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
        
        <!-- Empty State -->
        <div v-if="purchaseOrders.length === 0" class="text-center py-12">
          <div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-clipboard-list" class="w-6 h-6 text-zinc-400" />
          </div>
          <h3 class="text-sm font-medium text-zinc-900 mb-1">No purchase orders</h3>
          <p class="text-sm text-zinc-500 mb-4">Get started by creating your first purchase order.</p>
          <NuxtLink 
            to="/purchase-orders/new" 
            class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors no-underline"
          >
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
            Create PO
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { purchaseOrders, loading, error, fetchPurchaseOrders, deletePurchaseOrder } = usePurchaseOrders();

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
    default: return 'bg-zinc-100 text-zinc-600';
  }
};

const getStatusDotClass = (status?: string) => {
  switch (status) {
    case 'Pending': return 'bg-amber-500';
    case 'Shipped': return 'bg-purple-500';
    case 'Received': return 'bg-emerald-500';
    default: return 'bg-zinc-400';
  }
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this purchase order?')) {
    await deletePurchaseOrder(id);
  }
};
</script>
