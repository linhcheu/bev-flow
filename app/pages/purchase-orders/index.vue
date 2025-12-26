<template>
  <div class="p-8 min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-200">
    <!-- Header -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
      class="flex justify-between items-start mb-8"
    >
      <div>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Purchase Orders</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Manage your supplier orders</p>
      </div>
      <NuxtLink 
        to="/purchase-orders/new" 
        class="btn-primary no-underline"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4" />
        Create PO
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-3">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
        <p class="text-sm text-zinc-500">Loading purchase orders...</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div 
        v-motion
        :initial="{ scale: 0.8, opacity: 0 }"
        :enter="{ scale: 1, opacity: 1 }"
        class="w-16 h-16 bg-red-500/20 border border-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-red-400" />
      </div>
      <p class="text-zinc-600 dark:text-zinc-400">{{ error }}</p>
    </div>
    
    <!-- Purchase Orders Table -->
    <div 
      v-else
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
      class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl overflow-hidden shadow-2xl"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-zinc-200 dark:bg-zinc-800 border-b border-amber-500/50">
              <th class="table-header">PO Number</th>
              <th class="table-header">Supplier</th>
              <th class="table-header">Order Date</th>
              <th class="table-header">ETA</th>
              <th class="table-header">Items</th>
              <th class="table-header">Total</th>
              <th class="table-header">Status</th>
              <th class="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            <tr 
              v-for="(po, index) in purchaseOrders" 
              :key="po.po_id" 
              v-motion
              :initial="{ opacity: 0, x: -20 }"
              :enter="{ opacity: 1, x: 0, transition: { delay: index * 50 } }"
              class="hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <td class="table-cell">
                <span class="badge badge-warning font-semibold">
                  {{ po.po_number }}
                </span>
              </td>
              <td class="table-cell">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-lucide-building-2" class="w-4 h-4 text-zinc-900" />
                  </div>
                  <span class="font-medium text-zinc-900 dark:text-white">{{ po.supplier?.company_name || '-' }}</span>
                </div>
              </td>
              <td class="table-cell">{{ formatDate(po.order_date) }}</td>
              <td class="table-cell">{{ formatDate(po.eta_date) }}</td>
              <td class="table-cell">
                <span class="text-zinc-600 dark:text-zinc-400">{{ po.items?.length || 0 }} items</span>
              </td>
              <td class="table-cell">
                <span class="font-semibold text-zinc-900 dark:text-white">${{ (po.total_amount || 0).toFixed(2) }}</span>
                <span v-if="po.promotion_amount" class="block text-xs text-emerald-500">
                  -${{ po.promotion_amount.toFixed(2) }} promo
                </span>
              </td>
              <td class="table-cell">
                <span :class="getStatusClasses(po.status)">
                  <span class="status-dot" :class="getStatusDotClass(po.status)"></span>
                  {{ po.status }}
                </span>
              </td>
              <td class="table-cell">
                <div class="flex items-center justify-end gap-1">
                  <NuxtLink 
                    :to="`/purchase-orders/${po.po_id}`" 
                    class="icon-btn icon-btn-primary no-underline"
                    title="View"
                  >
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    @click="handleDelete(po.po_id!)" 
                    class="icon-btn icon-btn-danger"
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
      
      <!-- Empty State -->
      <div v-if="purchaseOrders.length === 0" class="text-center py-16">
        <div 
          v-motion
          :initial="{ scale: 0.8, opacity: 0 }"
          :enter="{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200 } }"
          class="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <UIcon name="i-lucide-clipboard-list" class="w-8 h-8 text-zinc-500 dark:text-zinc-600" />
        </div>
        <h3 class="text-lg font-medium text-zinc-900 dark:text-white mb-1">No purchase orders</h3>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Get started by creating your first purchase order.</p>
        <NuxtLink 
          to="/purchase-orders/new" 
          class="btn-primary no-underline"
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

const formatDate = (date?: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getStatusClasses = (status: string) => {
  const base = 'status-badge';
  switch (status) {
    case 'Pending':
      return `${base} bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30`;
    case 'Ordered':
      return `${base} bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30`;
    case 'Shipped':
      return `${base} bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30`;
    case 'Received':
      return `${base} bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30`;
    case 'Cancelled':
      return `${base} bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30`;
    default:
      return `${base} bg-zinc-500/20 text-zinc-600 dark:text-zinc-400 border border-zinc-500/30`;
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
