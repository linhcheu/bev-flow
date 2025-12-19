<template>
  <div class="p-8">
    <!-- Header -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-bold text-zinc-900 tracking-tight">Purchase Orders</h1>
        <p class="mt-1 text-zinc-500">Manage your supplier orders</p>
      </div>
      <NuxtLink 
        to="/purchase-orders/new" 
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors no-underline"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4" />
        Create PO
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-zinc-400 animate-spin" />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-red-500" />
      </div>
      <p class="text-zinc-600">{{ error }}</p>
    </div>
    
    <!-- Purchase Orders Table -->
    <div v-else class="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-zinc-50 border-b border-zinc-200">
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">PO Number</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Supplier</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Order Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">ETA</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Promotion</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-zinc-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr v-for="po in purchaseOrders" :key="po.po_id" class="hover:bg-zinc-50/50 transition-colors">
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 bg-zinc-100 text-zinc-800 text-sm font-semibold rounded-md">
                  {{ po.po_number }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <UIcon name="i-lucide-building-2" class="w-4 h-4 text-purple-600" />
                  </div>
                  <span class="text-sm text-zinc-700">{{ po.supplier?.company_name || '-' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-zinc-600">{{ formatDate(po.order_date) }}</td>
              <td class="px-6 py-4 text-sm text-zinc-600">{{ formatDate(po.eta_date) }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClasses(po.status)">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(po.status)"></span>
                  {{ po.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span v-if="po.promotion_amount" class="text-sm font-semibold text-amber-600">
                  ${{ (po.promotion_amount || 0).toFixed(2) }}
                </span>
                <span v-else class="text-sm text-zinc-400">-</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-1">
                  <NuxtLink 
                    :to="`/purchase-orders/${po.po_id}`" 
                    class="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors no-underline"
                    title="View"
                  >
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  </NuxtLink>
                  <NuxtLink 
                    :to="`/purchase-orders/${po.po_id}/edit`" 
                    class="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors no-underline"
                    title="Edit"
                  >
                    <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    @click="handleDelete(po.po_id!)" 
                    class="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <div class="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-lucide-clipboard-list" class="w-8 h-8 text-zinc-400" />
        </div>
        <h3 class="text-lg font-medium text-zinc-900 mb-1">No purchase orders</h3>
        <p class="text-sm text-zinc-500 mb-4">Get started by creating your first purchase order.</p>
        <NuxtLink 
          to="/purchase-orders/new" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors no-underline"
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
  return new Date(date).toLocaleDateString();
};

const getStatusClasses = (status: string) => {
  const base = 'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full';
  switch (status) {
    case 'Pending':
      return `${base} bg-amber-50 text-amber-700 border border-amber-200`;
    case 'Shipped':
      return `${base} bg-blue-50 text-blue-700 border border-blue-200`;
    case 'Received':
      return `${base} bg-emerald-50 text-emerald-700 border border-emerald-200`;
    case 'Cancelled':
      return `${base} bg-red-50 text-red-700 border border-red-200`;
    default:
      return `${base} bg-zinc-50 text-zinc-700 border border-zinc-200`;
  }
};

const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-amber-500';
    case 'Shipped': return 'bg-blue-500';
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