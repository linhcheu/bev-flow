<template>
  <div class="p-8">
    <div class="max-w-3xl">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink to="/purchase-orders" class="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors no-underline mb-4">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Purchase Orders
        </NuxtLink>
        <h1 class="text-3xl font-bold text-zinc-900 tracking-tight">Create Purchase Order</h1>
        <p class="mt-1 text-zinc-500">Create a new purchase order for your suppliers</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- PO Details -->
        <div class="bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
          <h3 class="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <UIcon name="i-lucide-clipboard-list" class="w-4 h-4 text-zinc-500" />
            Order Details
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label for="po_number" class="block text-sm font-medium text-zinc-700 mb-2">
                PO Number <span class="text-red-500">*</span>
              </label>
              <input 
                id="po_number"
                v-model="form.po_number" 
                type="text"
                required
                placeholder="e.g. PO-2024-001"
                class="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            
            <div>
              <label for="supplier_id" class="block text-sm font-medium text-zinc-700 mb-2">
                Supplier <span class="text-red-500">*</span>
              </label>
              <select 
                id="supplier_id"
                v-model="form.supplier_id"
                required
                class="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none cursor-pointer"
              >
                <option :value="undefined">-- Select Supplier --</option>
                <option v-for="supplier in suppliers" :key="supplier.supplier_id" :value="supplier.supplier_id">
                  {{ supplier.company_name }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label for="order_date" class="block text-sm font-medium text-zinc-700 mb-2">
                Order Date <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <UIcon name="i-lucide-calendar" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  id="order_date"
                  v-model="form.order_date" 
                  type="date"
                  required
                  class="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>
            
            <div>
              <label for="eta_date" class="block text-sm font-medium text-zinc-700 mb-2">Expected Arrival</label>
              <div class="relative">
                <UIcon name="i-lucide-truck" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  id="eta_date"
                  v-model="form.eta_date" 
                  type="date"
                  class="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Status & Promotion -->
        <div class="bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
          <h3 class="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <UIcon name="i-lucide-settings" class="w-4 h-4 text-zinc-500" />
            Status & Promotion
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label for="status" class="block text-sm font-medium text-zinc-700 mb-2">Status</label>
              <select 
                id="status"
                v-model="form.status"
                class="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Received">Received</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label for="promotion_amount" class="block text-sm font-medium text-zinc-700 mb-2">Promotion Amount</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                <input 
                  id="promotion_amount"
                  v-model.number="form.promotion_amount" 
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full pl-8 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Remarks -->
        <div class="bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
          <h3 class="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <UIcon name="i-lucide-message-square" class="w-4 h-4 text-zinc-500" />
            Notes & Remarks
          </h3>
          
          <div>
            <label for="truck_remark" class="block text-sm font-medium text-zinc-700 mb-2">Truck Remark</label>
            <input 
              id="truck_remark"
              v-model="form.truck_remark" 
              type="text"
              placeholder="Truck or delivery notes"
              class="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
          
          <div>
            <label for="overall_remark" class="block text-sm font-medium text-zinc-700 mb-2">Overall Remark</label>
            <textarea 
              id="overall_remark"
              v-model="form.overall_remark" 
              rows="3"
              placeholder="Additional notes or comments"
              class="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
            ></textarea>
          </div>
        </div>
        
        <!-- Error Message -->
        <div v-if="error" class="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <UIcon name="i-lucide-alert-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center gap-3 pt-4">
          <button 
            type="submit" 
            class="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            :disabled="loading"
          >
            <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            <UIcon v-else name="i-lucide-check" class="w-4 h-4" />
            {{ loading ? 'Creating...' : 'Create PO' }}
          </button>
          <NuxtLink 
            to="/purchase-orders" 
            class="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-xl hover:bg-zinc-200 transition-colors no-underline"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PurchaseOrder } from '~/types';

const { createPurchaseOrder, loading, error } = usePurchaseOrders();
const { suppliers, fetchSuppliers } = useSuppliers();
const router = useRouter();

const form = ref<PurchaseOrder>({
  po_number: '',
  supplier_id: undefined,
  order_date: new Date().toISOString().split('T')[0],
  eta_date: '',
  status: 'Pending',
  truck_remark: '',
  overall_remark: '',
  promotion_amount: 0,
});

onMounted(() => {
  fetchSuppliers();
});

const handleSubmit = async () => {
  const result = await createPurchaseOrder(form.value);
  if (result) {
    router.push('/purchase-orders');
  }
};
</script>
