<template>
  <div class="px-12 py-10">
    <div class="flex justify-between items-center mb-12">
      <div>
        <h1 class="text-4xl font-light text-neutral-800 tracking-wide mb-2">Purchase Orders</h1>
        <p class="text-sm text-neutral-500 tracking-wider uppercase">Order Management</p>
      </div>
      <NuxtLink 
        to="/purchase-orders/new" 
        class="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 no-underline"
      >
        Create PO
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-16 text-neutral-500">Loading purchase orders...</div>
    <div v-else-if="error" class="text-center py-16 text-red-600">{{ error }}</div>
    
    <div v-else class="bg-white border border-neutral-200 rounded-sm overflow-x-auto">
      <table class="w-full">
        <thead> 
          <tr class="bg-neutral-50 border-b border-neutral-200">
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">PO Number</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Supplier</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Order Date</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">ETA Date</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Status</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Promotion</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-for="po in purchaseOrders" :key="po.po_id" class="hover:bg-neutral-50 transition-colors duration-200">
            <td class="px-8 py-5 text-sm text-neutral-900">{{ po.po_number }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ po.supplier?.company_name || '-' }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ formatDate(po.order_date) }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ formatDate(po.eta_date) }}</td>
            <td class="px-8 py-5">
              <span :class="[
                'px-3 py-1.5 rounded-sm text-[10px] font-medium uppercase tracking-wider',
                po.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : '',
                po.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' : '',
                po.status === 'Received' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : '',
                po.status === 'Cancelled' ? 'bg-red-50 text-red-700 border border-red-200' : ''
              ]">
                {{ po.status }}
              </span>
            </td>
            <td class="px-8 py-5 text-sm font-medium text-[#D4AF37]">${{ (po.promotion_amount || 0).toFixed(2) }}</td>
            <td class="px-8 py-5 flex gap-3">
              <NuxtLink 
                :to="`/purchase-orders/${po.po_id}`" 
                class="px-4 py-2 text-xs bg-neutral-100 text-neutral-700 rounded-sm hover:bg-neutral-200 transition-colors uppercase tracking-wider no-underline"
              >
                View
              </NuxtLink>
              <NuxtLink 
                :to="`/purchase-orders/${po.po_id}/edit`" 
                class="px-4 py-2 text-xs bg-neutral-100 text-neutral-700 rounded-sm hover:bg-neutral-200 transition-colors uppercase tracking-wider no-underline"
              >
                Edit
              </NuxtLink>
              <button 
                @click="handleDelete(po.po_id!)" 
                class="px-4 py-2 text-xs bg-red-50 text-red-700 rounded-sm hover:bg-red-100 transition-colors uppercase tracking-wider"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this purchase order?')) {
    await deletePurchaseOrder(id);
  }
};
</script>