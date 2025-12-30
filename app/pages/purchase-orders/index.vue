<template>
  <div class="p-8 min-h-screen bg-white dark:bg-zinc-950 animate-fade-in transition-colors duration-200">
    <!-- Header -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Purchase Orders</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Manage your supplier orders</p>
      </div>
      <NuxtLink 
        to="/purchase-orders/new" 
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors no-underline shadow-lg shadow-amber-500/30"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4" />
        Create PO
      </NuxtLink>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-clipboard-list" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Total POs</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">{{ purchaseOrders.length }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-clock" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Pending</div>
        </div>
        <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ pendingCount }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-truck" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Shipped</div>
        </div>
        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ shippedCount }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Received</div>
        </div>
        <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ receivedCount }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-dollar-sign" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Total Value</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">${{ totalValue.toFixed(2) }}</div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="w-16 h-16 bg-red-500/20 border border-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-red-400" />
      </div>
      <p class="text-zinc-600 dark:text-zinc-400">{{ error }}</p>
    </div>
    
    <!-- Purchase Orders Table -->
    <div v-else class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-zinc-200 dark:bg-zinc-800 border-b border-amber-500/50">
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">PO Number</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Supplier</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Order Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">ETA</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Items</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Total</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            <tr v-for="po in purchaseOrders" :key="po.po_id" class="hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 bg-amber-500/20 border border-amber-500 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-md">
                  {{ po.po_number }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
                    <UIcon name="i-lucide-building-2" class="w-4 h-4 text-zinc-900" />
                  </div>
                  <span class="text-sm font-medium text-zinc-900 dark:text-white">{{ po.supplier?.company_name || '-' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{{ formatDate(po.order_date) }}</td>
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{{ formatDate(po.eta_date) }}</td>
              <td class="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{{ po.items?.length || 0 }} items</td>
              <td class="px-6 py-4">
                <span class="text-sm font-semibold text-zinc-900 dark:text-white">${{ (po.total_amount || 0).toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClasses(po.status)" class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(po.status)" />
                  {{ po.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink 
                    :to="`/purchase-orders/${po.po_id}`" 
                    class="p-2 text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors no-underline"
                    title="View"
                  >
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    class="p-2 text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
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
      <div v-if="purchaseOrders.length === 0" class="text-center py-16">
        <div class="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-lucide-clipboard-list" class="w-8 h-8 text-zinc-500 dark:text-zinc-600" />
        </div>
        <h3 class="text-lg font-medium text-zinc-900 dark:text-white mb-1">No purchase orders</h3>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Get started by creating your first purchase order.</p>
        <NuxtLink 
          to="/purchase-orders/new" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors no-underline"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Create PO
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { purchaseOrders, loading, error, fetchPurchaseOrders, deletePurchaseOrder } = usePurchaseOrders();

onMounted(() => {
  fetchPurchaseOrders();
});

const pendingCount = computed(() => {
  return purchaseOrders.value.filter(po => po.status === 'Pending').length;
});

const shippedCount = computed(() => {
  return purchaseOrders.value.filter(po => po.status === 'Shipped').length;
});

const receivedCount = computed(() => {
  return purchaseOrders.value.filter(po => po.status === 'Received').length;
});

const totalValue = computed(() => {
  return purchaseOrders.value.reduce((sum, po) => sum + Number(po.total_amount || 0), 0);
});

const formatDate = (date?: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30';
    case 'Ordered':
      return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30';
    case 'Shipped':
      return 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30';
    case 'Received':
      return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
    case 'Cancelled':
      return 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30';
    default:
      return 'bg-zinc-500/20 text-zinc-600 dark:text-zinc-400 border border-zinc-500/30';
  }
};

const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-amber-500';
    case 'Ordered': return 'bg-blue-500';
    case 'Shipped': return 'bg-purple-500';
    case 'Received': return 'bg-emerald-500';
    case 'Cancelled': return 'bg-red-500';
    default: return 'bg-zinc-500';
  }
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this purchase order?')) {
    await deletePurchaseOrder(id);
  }
};
</script>
