<template>
  <div class="max-w-4xl mx-auto">    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Sale Details -->
      <div class="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 space-y-5">
        <h3 class="text-sm font-semibold text-zinc-900 flex items-center gap-3">
          <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-receipt" class="w-4 h-4 text-white" />
          </div>
          Sale Details
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="form-group">
            <label class="input-label">
              Sale No. <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.sale_number" 
              type="text" 
              required
              placeholder="e.g. SALE-0001"
              class="input"
            />
          </div>
          
          <div class="form-group">
            <label class="input-label">
              Sale Date <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                <UIcon name="i-lucide-calendar" class="w-4 h-4 text-zinc-400" />
              </div>
              <input 
                v-model="form.sale_date" 
                type="date" 
                required
                class="w-full py-3 pl-10 pr-4 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="input-label">Customer</label>
          <select 
            v-model="form.customer_id" 
            class="input"
          >
            <option :value="undefined">Select customer (optional)</option>
            <option v-for="customer in customers" :key="customer.customer_id" :value="customer.customer_id">
              {{ customer.customer_name }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Items Card -->
      <div class="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 space-y-5">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-zinc-900 flex items-center gap-3">
            <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-package" class="w-4 h-4 text-white" />
            </div>
            Sale Items
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
              <tr class="border-b border-zinc-200">
                <th class="text-left py-3 text-xs font-medium text-zinc-500 uppercase">No.</th>
                <th class="text-left py-3 text-xs font-medium text-zinc-500 uppercase">Product</th>
                <th class="text-right py-3 text-xs font-medium text-zinc-500 uppercase">Qty</th>
                <th class="text-right py-3 text-xs font-medium text-zinc-500 uppercase">Unit Price</th>
                <th class="text-right py-3 text-xs font-medium text-zinc-500 uppercase">Amount</th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(item, index) in form.items" 
                :key="index" 
                class="border-b border-zinc-100"
              >
                <td class="py-3 text-sm text-zinc-500">{{ index + 1 }}</td>
                <td class="py-3">
                  <select 
                    v-model="item.product_id"
                    class="select text-sm py-2"
                    @change="onProductChange(index)"
                  >
                    <option :value="0">-- Select --</option>
                    <option v-for="product in products" :key="product.product_id" :value="product.product_id">
                      {{ product.product_name }} ({{ product.sku }})
                    </option>
                  </select>
                </td>
                <td class="py-3">
                  <input 
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    class="input text-sm py-2 w-20 text-right"
                  />
                </td>
                <td class="py-3">
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">$</span>
                    <input 
                      v-model.number="item.unit_price"
                      type="number"
                      step="0.01"
                      min="0"
                      class="input text-sm py-2 w-24 text-right pl-7"
                    />
                  </div>
                </td>
                <td class="py-3 text-right">
                  <span class="text-sm font-medium text-zinc-900">
                    ${{ (item.quantity * item.unit_price).toFixed(2) }}
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
        <div class="border-t border-zinc-200 pt-4 space-y-2">
          <div class="flex justify-end items-center gap-4 pt-2 border-t border-zinc-200">
            <span class="text-base font-medium text-zinc-900">Total:</span>
            <span class="text-xl font-semibold text-amber-600 w-28 text-right">${{ totalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Notes -->
      <div class="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 space-y-5">
        <div class="form-group">
          <label class="input-label">Notes</label>
          <textarea 
            v-model="form.notes" 
            rows="3"
            placeholder="Any additional notes..."
            class="input resize-none"
          ></textarea>
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
      <div class="flex flex-col sm:flex-row items-center gap-3 pt-4">
        <button 
          type="submit" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="loading || !isFormValid"
        >
          <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
          <UIcon v-else name="i-lucide-check" class="w-4 h-4" />
          {{ loading ? 'Recording...' : 'Record Sale' }}
        </button>
        <NuxtLink 
          to="/sales" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-xl hover:bg-zinc-200 no-underline"
        >
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { SaleFormData, Product, Customer } from '~/types';

const emit = defineEmits<{
  submit: [sale: SaleFormData];
}>();

const { loading, error } = useSales();
const { products, fetchProducts } = useProducts();
const { customers, fetchCustomers } = useCustomers();

const form = ref<SaleFormData>({
  sale_number: '',
  customer_id: undefined,
  sale_date: new Date().toISOString().split('T')[0] || '',
  items: [{ product_id: 0, quantity: 1, unit_price: 0 }],
  notes: '',
});

const totalAmount = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
});

const isFormValid = computed(() => {
  return form.value.sale_number && 
         form.value.items.some(item => item.product_id > 0 && item.quantity > 0 && item.unit_price > 0);
});

const addItem = () => {
  form.value.items.push({ product_id: 0, quantity: 1, unit_price: 0 });
};

const removeItem = (index: number) => {
  form.value.items.splice(index, 1);
};

const onProductChange = (index: number) => {
  const item = form.value.items[index];
  if (item) {
    const product = products.value.find((p: Product) => p.product_id === item.product_id);
    if (product) {
      item.unit_price = product.selling_price;
    }
  }
};

onMounted(() => {
  fetchProducts();
  fetchCustomers();
});

const handleSubmit = () => {
  const validItems = form.value.items.filter(item => item.product_id > 0 && item.quantity > 0 && item.unit_price > 0);
  emit('submit', { ...form.value, items: validItems });
};
</script>

