<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <NuxtLink to="/purchase-orders" class="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-amber-600 no-underline mb-4">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Purchase Orders
        </NuxtLink>
        <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Edit Purchase Order</h1>
        <p class="mt-1 text-sm text-zinc-500">Update purchase order details</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="pageLoading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-amber-500 animate-spin" />
      </div>
      
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- PO Details Card -->
        <div class="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 space-y-5">
          <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-clipboard-list" class="w-4 h-4 text-amber-600" />
            </div>
            Order Details
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-group">
              <label class="input-label">
                PO Number <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.po_number" 
                type="text"
                required
                class="input bg-zinc-50"
                readonly
              />
            </div>
            
            <div class="form-group">
              <label class="input-label">
                Status <span class="text-red-500">*</span>
              </label>
              <select v-model="form.status" class="select">
                <option value="Pending">Pending</option>
                <option value="Ordered">Ordered</option>
                <option value="Shipped">Shipped</option>
                <option value="Received">Received</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-group">
              <label class="input-label">
                Supplier <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.supplier_id"
                required
                class="select"
              >
                <option :value="undefined">-- Select Supplier --</option>
                <option v-for="supplier in suppliers" :key="supplier.supplier_id" :value="supplier.supplier_id">
                  {{ supplier.company_name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="input-label">
                Order Date <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <UIcon name="i-lucide-calendar" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input 
                  v-model="form.order_date" 
                  type="date"
                  required
                  class="input pl-11"
                />
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="input-label">ETA (Expected Arrival)</label>
            <div class="relative max-w-xs">
              <UIcon name="i-lucide-truck" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input 
                v-model="form.eta_date" 
                type="date"
                class="input pl-11"
              />
            </div>
          </div>
        </div>
        
        <!-- Items Card -->
        <div class="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 space-y-5">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
              <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <UIcon name="i-lucide-package" class="w-4 h-4 text-amber-600" />
              </div>
              Order Items
            </h3>
            <button 
              type="button" 
              @click="addItem"
              class="btn-secondary text-xs"
            >
              <UIcon name="i-lucide-plus" class="w-4 h-4" />
              Add Item
            </button>
          </div>
          
          <!-- Items Table -->
          <div class="overflow-x-auto -mx-4 sm:mx-0">
            <table class="w-full min-w-[600px]">
              <thead>
                <tr class="border-b border-zinc-200">
                  <th class="text-left py-3 px-2 text-xs font-medium text-zinc-500 uppercase">No.</th>
                  <th class="text-left py-3 px-2 text-xs font-medium text-zinc-500 uppercase">Product</th>
                  <th class="text-right py-3 px-2 text-xs font-medium text-zinc-500 uppercase">Qty</th>
                  <th class="text-right py-3 px-2 text-xs font-medium text-zinc-500 uppercase">Unit Cost</th>
                  <th class="text-right py-3 px-2 text-xs font-medium text-zinc-500 uppercase">Amount</th>
                  <th class="w-10"></th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, index) in form.items" 
                  :key="index" 
                  class="border-b border-zinc-100"
                >
                  <td class="py-3 px-2 text-sm text-zinc-500">{{ index + 1 }}</td>
                  <td class="py-3 px-2">
                    <select 
                      v-model="item.product_id"
                      class="select text-sm py-2"
                      @change="onProductChange(index)"
                    >
                      <option :value="0">-- Select --</option>
                      <option v-for="product in products" :key="product.product_id" :value="product.product_id">
                        {{ product.product_name }}
                      </option>
                    </select>
                  </td>
                  <td class="py-3 px-2">
                    <input 
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      class="input text-sm py-2 w-20 text-right"
                    />
                  </td>
                  <td class="py-3 px-2">
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">$</span>
                      <input 
                        v-model.number="item.unit_cost"
                        type="number"
                        step="0.01"
                        min="0"
                        class="input text-sm py-2 w-24 text-right pl-7"
                      />
                    </div>
                  </td>
                  <td class="py-3 px-2 text-right">
                    <span class="text-sm font-medium text-zinc-900">
                      ${{ (item.quantity * item.unit_cost).toFixed(2) }}
                    </span>
                  </td>
                  <td class="py-3 px-2">
                    <button 
                      v-if="form.items.length > 1"
                      type="button"
                      @click="removeItem(index)"
                      class="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <UIcon name="i-lucide-x" class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Totals -->
          <div class="border-t border-zinc-200 pt-4 space-y-2">
            <div class="flex justify-end items-center gap-4">
              <span class="text-sm text-zinc-500">Subtotal:</span>
              <span class="text-sm font-medium text-zinc-900 w-28 text-right">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-end items-center gap-4">
              <span class="text-sm text-zinc-500">Shipping (3%):</span>
              <span class="text-sm text-zinc-900 w-28 text-right">${{ shippingCost.toFixed(2) }}</span>
            </div>
            <div class="flex justify-end items-center gap-4">
              <span class="text-sm text-zinc-500">Promotion:</span>
              <div class="relative w-28">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">-$</span>
                <input 
                  v-model.number="form.promotion_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  class="input text-sm py-1 text-right pl-8"
                />
              </div>
            </div>
            <div class="flex justify-end items-center gap-4 pt-2 border-t border-zinc-200">
              <span class="text-base font-medium text-zinc-900">Total:</span>
              <span class="text-xl font-semibold text-amber-600 w-28 text-right">${{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Remarks Card -->
        <div class="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 space-y-5">
          <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-message-square" class="w-4 h-4 text-amber-600" />
            </div>
            Notes & Remarks
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-group">
              <label class="input-label">Truck Remark</label>
              <input 
                v-model="form.truck_remark" 
                type="text"
                placeholder="e.g. give DO"
                class="input"
              />
            </div>
            
            <div class="form-group">
              <label class="input-label">Overall Remark</label>
              <input 
                v-model="form.overall_remark" 
                type="text"
                placeholder="e.g. give latest expiry"
                class="input"
              />
            </div>
          </div>
        </div>
        
        <!-- Error Message -->
        <div 
          v-if="error" 
          class="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <UIcon name="i-lucide-alert-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
        
        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
          <button 
            type="submit" 
            class="btn-primary justify-center" 
            :disabled="loading || !isFormValid"
          >
            <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            <UIcon v-else name="i-lucide-save" class="w-4 h-4" />
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
          <NuxtLink 
            to="/purchase-orders" 
            class="btn-secondary no-underline justify-center"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PurchaseOrderFormData } from '~/types';

const route = useRoute();
const router = useRouter();
const poId = Number(route.params.id);

const { getPurchaseOrder, updatePurchaseOrder, loading, error } = usePurchaseOrders();
const { suppliers, fetchSuppliers } = useSuppliers();
const { products, fetchProducts } = useProducts();

const pageLoading = ref(true);

const form = ref<PurchaseOrderFormData & { status?: string }>({
  po_number: '',
  supplier_id: 0,
  order_date: '',
  eta_date: '',
  status: 'Pending',
  items: [{ product_id: 0, quantity: 0, unit_cost: 0 }],
  promotion_amount: 0,
  truck_remark: '',
  overall_remark: '',
});

// Computed values
const subtotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);
});

const shippingCost = computed(() => {
  return subtotal.value * 0.03;
});

const total = computed(() => {
  return subtotal.value + shippingCost.value - (form.value.promotion_amount || 0);
});

const isFormValid = computed(() => {
  return form.value.po_number && 
         form.value.supplier_id && 
         form.value.items.some(item => item.product_id > 0 && item.quantity > 0);
});

// Methods
const addItem = () => {
  form.value.items.push({ product_id: 0, quantity: 0, unit_cost: 0 });
};

const removeItem = (index: number) => {
  form.value.items.splice(index, 1);
};

const onProductChange = (index: number) => {
  const item = form.value.items[index];
  if (item) {
    const product = products.value.find(p => p.product_id === item.product_id);
    if (product) {
      item.unit_cost = product.cost_price;
    }
  }
};

onMounted(async () => {
  await Promise.all([fetchSuppliers(), fetchProducts()]);
  
  const po = await getPurchaseOrder(poId);
  if (po) {
    form.value = {
      po_number: po.po_number || '',
      supplier_id: po.supplier_id || 0,
      order_date: po.order_date?.split('T')[0] || '',
      eta_date: po.eta_date?.split('T')[0] || '',
      status: po.status || 'Pending',
      items: po.items && po.items.length > 0 
        ? po.items.map(item => ({
            product_id: item.product_id || 0,
            quantity: item.quantity || 0,
            unit_cost: item.unit_cost || 0,
          }))
        : [{ product_id: 0, quantity: 0, unit_cost: 0 }],
      promotion_amount: po.promotion_amount || 0,
      truck_remark: po.truck_remark || '',
      overall_remark: po.overall_remark || '',
    };
  }
  
  pageLoading.value = false;
});

const handleSubmit = async () => {
  const validItems = form.value.items.filter(item => item.product_id > 0 && item.quantity > 0);
  
  if (validItems.length === 0) {
    return;
  }
  
  const result = await updatePurchaseOrder(poId, {
    ...form.value,
    items: validItems,
  });
  
  if (result) {
    router.push('/purchase-orders');
  }
};
</script>
