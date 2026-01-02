<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <NuxtLink to="/sales" class="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-amber-600 no-underline mb-4">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Sales
        </NuxtLink>
        <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Record Sale</h1>
        <p class="mt-1 text-sm text-zinc-500">Record a sale with multiple products</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Sale Details Card -->
        <div class="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 space-y-5">
          <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-receipt" class="w-4 h-4 text-amber-600" />
            </div>
            Sale Details
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-group">
              <label class="input-label">
                Invoice No. <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input 
                  v-model="form.invoice_number" 
                  type="text"
                  required
                  placeholder="Auto-generated"
                  class="input bg-zinc-50 pr-12"
                  readonly
                />
                <div class="absolute right-3 top-1/2 -translate-y-1/2">
                  <span class="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">Auto</span>
                </div>
              </div>
              <p class="text-xs text-zinc-400 mt-1">Auto-generated sequential number</p>
            </div>
            
            <div class="form-group">
              <label class="input-label">
                Sale Date <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <UIcon name="i-lucide-calendar" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input 
                  v-model="form.sale_date" 
                  type="date"
                  required
                  class="input pl-11"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Customer Card -->
        <div class="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 space-y-5">
          <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-user" class="w-4 h-4 text-amber-600" />
            </div>
            Customer Information
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-group">
              <label class="input-label">Select Customer (Optional)</label>
              <select 
                v-model="form.customer_id"
                class="select"
                @change="onCustomerChange"
              >
                <option :value="undefined">-- Walk-in Customer --</option>
                <option v-for="customer in customers" :key="customer.customer_id" :value="customer.customer_id">
                  {{ customer.customer_name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="input-label">Or Enter Customer Name</label>
              <input 
                v-model="form.customer_name" 
                type="text"
                placeholder="Walk-in customer name (optional)"
                class="input"
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
                  <th class="text-center py-3 text-xs font-medium text-zinc-500 uppercase">Stock</th>
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
                  <td class="py-3 text-center">
                    <span 
                      :class="[
                        'text-xs px-2 py-0.5 rounded-full',
                        getProductStock(item.product_id) > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      ]"
                    >
                      {{ getProductStock(item.product_id) }}
                    </span>
                  </td>
                  <td class="py-3">
                    <input 
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      :max="getProductStock(item.product_id)"
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
            <div class="flex justify-end items-center gap-4">
              <span class="text-sm text-zinc-500">Subtotal:</span>
              <span class="text-sm font-medium text-zinc-900 w-28 text-right">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-end items-center gap-4 pt-2 border-t border-zinc-200">
              <span class="text-base font-medium text-zinc-900">Total:</span>
              <span class="text-xl font-semibold text-amber-600 w-28 text-right">${{ subtotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Notes Card -->
        <div class="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 space-y-5">
          <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-file-text" class="w-4 h-4 text-amber-600" />
            </div>
            Notes
          </h3>
          
          <div class="form-group">
            <label class="input-label">Additional Notes</label>
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
          <UIcon name="i-lucide-alert-circle" class="w-5 h-5 text-red-500 shrink-0" />
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center gap-3 pt-4">
          <button 
            type="submit" 
            class="btn-primary" 
            :disabled="loading || !isFormValid"
          >
            <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            <UIcon v-else name="i-lucide-check" class="w-4 h-4" />
            {{ loading ? 'Recording...' : 'Record Sale' }}
          </button>
          <NuxtLink 
            to="/sales" 
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
import type { SaleFormData, SaleItemFormData } from '~/types';

const { createSale, loading, error, generateInvoiceNumber, fetchSales } = useSales();
const { products, fetchProducts } = useProducts();
const { customers, fetchCustomers } = useCustomers();
const router = useRouter();

const form = ref<SaleFormData>({
  invoice_number: '',
  customer_id: undefined,
  customer_name: '',
  sale_date: new Date().toISOString().split('T')[0] ?? '',
  items: [{ product_id: 0, quantity: 1, unit_price: 0 }],
  notes: '',
});

const subtotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
});

const isFormValid = computed(() => {
  return form.value.invoice_number && 
         form.value.items.some(item => item.product_id > 0 && item.quantity > 0 && item.unit_price > 0);
});

const addItem = () => {
  form.value.items.push({ product_id: 0, quantity: 1, unit_price: 0 });
};

const removeItem = (index: number) => {
  form.value.items.splice(index, 1);
};

const onCustomerChange = () => {
  if (form.value.customer_id) {
    const customer = customers.value.find(c => c.customer_id === form.value.customer_id);
    if (customer) {
      form.value.customer_name = customer.customer_name;
    }
  }
};

const onProductChange = (index: number) => {
  const item = form.value.items[index];
  if (item) {
    const product = products.value.find(p => p.product_id === item.product_id);
    if (product) {
      item.unit_price = product.selling_price;
    }
  }
};

const getProductStock = (productId: number) => {
  const product = products.value.find(p => p.product_id === productId);
  return product?.current_stock ?? 0;
};

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCustomers(), fetchSales()]);
  form.value.invoice_number = generateInvoiceNumber();
});

const handleSubmit = async () => {
  // Filter out empty items
  const validItems = form.value.items.filter(item => item.product_id > 0 && item.quantity > 0 && item.unit_price > 0);
  
  if (validItems.length === 0) {
    return;
  }
  
  const result = await createSale({
    ...form.value,
    items: validItems,
  });
  
  if (result) {
    router.push('/sales');
  }
};
</script>
