<template>
  <div class="p-8 min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-200">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
        class="mb-8"
      >
        <NuxtLink to="/purchase-orders" class="btn-ghost no-underline mb-4 -ml-3">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Purchase Orders
        </NuxtLink>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Create Purchase Order</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Create a new purchase order with multiple items</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- PO Details Card -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
          class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500/50 rounded-xl p-6 space-y-5"
        >
          <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-clipboard-list" class="w-4 h-4 text-zinc-900" />
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
                placeholder="e.g. PO-001-001"
                class="input"
              />
            </div>
            
            <div class="form-group">
              <label class="input-label">
                Supplier <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.supplier_id"
                required
                class="select"
                @change="onSupplierChange"
              >
                <option :value="undefined">-- Select Supplier --</option>
                <option v-for="supplier in suppliers" :key="supplier.supplier_id" :value="supplier.supplier_id">
                  {{ supplier.company_name }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-group">
              <label class="input-label">
                Order Date <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <UIcon name="i-lucide-calendar" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  v-model="form.order_date" 
                  type="date"
                  required
                  class="input pl-11"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label class="input-label">ETA (Expected Arrival)</label>
              <div class="relative">
                <UIcon name="i-lucide-truck" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  v-model="form.eta_date" 
                  type="date"
                  class="input pl-11"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Items Card -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
          class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500/50 rounded-xl p-6 space-y-5"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <UIcon name="i-lucide-package" class="w-4 h-4 text-zinc-900" />
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
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-zinc-200 dark:border-zinc-700">
                  <th class="text-left py-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">No.</th>
                  <th class="text-left py-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Product</th>
                  <th class="text-left py-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Description</th>
                  <th class="text-right py-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Qty</th>
                  <th class="text-right py-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Unit Cost</th>
                  <th class="text-right py-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">Amount</th>
                  <th class="w-10"></th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, index) in form.items" 
                  :key="index" 
                  class="border-b border-zinc-100 dark:border-zinc-800"
                >
                  <td class="py-3 text-sm text-zinc-600 dark:text-zinc-400">{{ index + 1 }}</td>
                  <td class="py-3">
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
                  <td class="py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {{ getProductDescription(item.product_id) }}
                  </td>
                  <td class="py-3">
                    <input 
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      class="input text-sm py-2 w-20 text-right"
                      @input="calculateTotals"
                    />
                  </td>
                  <td class="py-3">
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                      <input 
                        v-model.number="item.unit_cost"
                        type="number"
                        step="0.01"
                        min="0"
                        class="input text-sm py-2 w-24 text-right pl-7"
                        @input="calculateTotals"
                      />
                    </div>
                  </td>
                  <td class="py-3 text-right">
                    <span class="text-sm font-semibold text-zinc-900 dark:text-white">
                      ${{ (item.quantity * item.unit_cost).toFixed(2) }}
                    </span>
                  </td>
                  <td class="py-3">
                    <button 
                      v-if="form.items.length > 1"
                      type="button"
                      @click="removeItem(index)"
                      class="icon-btn icon-btn-danger"
                    >
                      <UIcon name="i-lucide-x" class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Totals -->
          <div class="border-t border-zinc-200 dark:border-zinc-700 pt-4 space-y-2">
            <div class="flex justify-end items-center gap-4">
              <span class="text-sm text-zinc-600 dark:text-zinc-400">Subtotal:</span>
              <span class="text-sm font-semibold text-zinc-900 dark:text-white w-28 text-right">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-end items-center gap-4">
              <span class="text-sm text-zinc-600 dark:text-zinc-400">Shipping (3%):</span>
              <span class="text-sm text-zinc-900 dark:text-white w-28 text-right">${{ shippingCost.toFixed(2) }}</span>
            </div>
            <div class="flex justify-end items-center gap-4">
              <span class="text-sm text-zinc-600 dark:text-zinc-400">Promotion:</span>
              <div class="relative w-28">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">-$</span>
                <input 
                  v-model.number="form.promotion_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  class="input text-sm py-1 text-right pl-8"
                />
              </div>
            </div>
            <div class="flex justify-end items-center gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-700">
              <span class="text-base font-semibold text-zinc-900 dark:text-white">Total:</span>
              <span class="text-xl font-bold text-amber-600 dark:text-amber-500 w-28 text-right">${{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Remarks Card -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
          class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500/50 rounded-xl p-6 space-y-5"
        >
          <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-message-square" class="w-4 h-4 text-zinc-900" />
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
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :enter="{ opacity: 1, scale: 1 }"
          class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl"
        >
          <UIcon name="i-lucide-alert-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
          <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
        </div>
        
        <!-- Actions -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }"
          class="flex items-center gap-3 pt-4"
        >
          <button 
            type="submit" 
            class="btn-primary" 
            :disabled="loading || !isFormValid"
          >
            <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            <UIcon v-else name="i-lucide-check" class="w-4 h-4" />
            {{ loading ? 'Creating...' : 'Create Purchase Order' }}
          </button>
          <NuxtLink 
            to="/purchase-orders" 
            class="btn-secondary no-underline"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PurchaseOrderFormData, PurchaseOrderItemFormData } from '~/types';

const { createPurchaseOrder, loading, error, generatePONumber, fetchPurchaseOrders } = usePurchaseOrders();
const { suppliers, fetchSuppliers } = useSuppliers();
const { products, fetchProducts } = useProducts();
const router = useRouter();

const form = ref<PurchaseOrderFormData>({
  po_number: '',
  supplier_id: 0,
  order_date: new Date().toISOString().split('T')[0] ?? '',
  eta_date: '',
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

const onSupplierChange = () => {
  // Could filter products by supplier here
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

const getProductDescription = (productId: number) => {
  const product = products.value.find(p => p.product_id === productId);
  return product?.description || '-';
};

const calculateTotals = () => {
  // Computed properties handle this
};

onMounted(async () => {
  await Promise.all([fetchSuppliers(), fetchProducts(), fetchPurchaseOrders()]);
  form.value.po_number = generatePONumber();
});

const handleSubmit = async () => {
  // Filter out empty items
  const validItems = form.value.items.filter(item => item.product_id > 0 && item.quantity > 0);
  
  if (validItems.length === 0) {
    return;
  }
  
  const result = await createPurchaseOrder({
    ...form.value,
    items: validItems,
  });
  
  if (result) {
    router.push('/purchase-orders');
  }
};
</script>
