<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-4 sm:mb-6 md:mb-8">
        <NuxtLink to="/sales" class="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-600 hover:text-amber-600 no-underline mb-2 sm:mb-4">
          <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Sales
        </NuxtLink>
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Record Sale</h1>
        <p class="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-500">Record a sale with multiple products</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Sale Details Card -->
        <div class="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
          <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-receipt" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            Sale Details
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div class="form-group">
              <label class="input-label">
                Sale No. <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input 
                  v-model="form.sale_number" 
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
              <p class="text-[10px] sm:text-xs text-zinc-400 mt-1">Auto-generated sequential number</p>
            </div>
            
            <div class="form-group">
              <label class="input-label">
                Sale Date <span class="text-red-500">*</span>
              </label>
              <DatePicker 
                v-model="form.sale_date"
                placeholder="Select sale date"
                :max-date="new Date().toISOString().split('T')[0]"
              />
            </div>
          </div>
        </div>
        
        <!-- Customer Card -->
        <div class="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
          <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-user" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            Customer Information
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div class="form-group md:col-span-2">
              <label class="input-label">Select Customer (Optional)</label>
              <select 
                v-model="form.customer_id"
                class="select"
              >
                <option :value="undefined">-- Walk-in Customer --</option>
                <option v-for="customer in customers" :key="customer.customer_id" :value="customer.customer_id">
                  {{ customer.customer_name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Items Card -->
        <div class="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
              <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <UIcon name="i-lucide-package" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              </div>
              Sale Items
            </h3>
            <button 
              type="button" 
              @click="addItem"
              class="btn-secondary text-xs px-2.5 py-1.5 sm:px-3 sm:py-2"
            >
              <UIcon name="i-lucide-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span class="hidden sm:inline">Add Item</span>
              <span class="sm:hidden">Add</span>
            </button>
          </div>
          
          <!-- Desktop Table (hidden on mobile) -->
          <div class="hidden md:block overflow-x-auto">
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
                  :class="[
                    'border-b border-zinc-100',
                    (isOutOfStock(item.product_id) || exceedsStock(item.product_id, item.quantity)) ? 'bg-red-50' : ''
                  ]"
                >
                  <td class="py-3 text-sm text-zinc-500">{{ index + 1 }}</td>
                  <td class="py-3">
                    <div class="flex items-center gap-2">
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
                      <UIcon 
                        v-if="item.product_id > 0 && (isOutOfStock(item.product_id) || exceedsStock(item.product_id, item.quantity))"
                        name="i-lucide-alert-triangle" 
                        class="w-4 h-4 text-red-500 flex-shrink-0" 
                        :title="isOutOfStock(item.product_id) ? 'Out of stock' : 'Exceeds available stock'"
                      />
                    </div>
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
                      :class="[
                        'input text-sm py-2 min-w-[5rem] w-full max-w-[8rem] text-right',
                        exceedsStock(item.product_id, item.quantity) ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''
                      ]"
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
                        class="input text-sm py-2 min-w-[6rem] w-full max-w-[10rem] text-right pl-7"
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
          
          <!-- Mobile Card Layout -->
          <div class="md:hidden space-y-3">
            <div 
              v-for="(item, index) in form.items" 
              :key="index"
              :class="[
                'rounded-lg p-3 space-y-3 border',
                isOutOfStock(item.product_id) || exceedsStock(item.product_id, item.quantity)
                  ? 'bg-red-50 border-red-300'
                  : 'bg-zinc-50 border-zinc-200'
              ]"
            >
              <!-- Stock Warning Banner -->
              <div 
                v-if="item.product_id > 0 && (isOutOfStock(item.product_id) || exceedsStock(item.product_id, item.quantity))"
                class="flex items-center gap-2 px-2 py-1.5 bg-red-100 rounded-md"
              >
                <UIcon name="i-lucide-alert-triangle" class="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                <span class="text-xs font-medium text-red-700">
                  {{ isOutOfStock(item.product_id) ? 'Out of stock!' : `Only ${getProductStock(item.product_id)} available!` }}
                </span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-zinc-500 bg-zinc-200 px-2 py-0.5 rounded">Item {{ index + 1 }}</span>
                <div class="flex items-center gap-2">
                  <span 
                    :class="[
                      'text-xs px-2 py-0.5 rounded-full',
                      getProductStock(item.product_id) > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    ]"
                  >
                    Stock: {{ getProductStock(item.product_id) }}
                  </span>
                  <button 
                    v-if="form.items.length > 1"
                    type="button"
                    @click="removeItem(index)"
                    class="icon-btn icon-btn-danger !p-1"
                  >
                    <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <div>
                <label class="text-xs text-zinc-500 mb-1 block">Product</label>
                <select 
                  v-model="item.product_id"
                  class="select text-sm py-2 w-full"
                  @change="onProductChange(index)"
                >
                  <option :value="0">-- Select Product --</option>
                  <option v-for="product in products" :key="product.product_id" :value="product.product_id">
                    {{ product.product_name }} ({{ product.sku }})
                  </option>
                </select>
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-zinc-500 mb-1 block">Quantity</label>
                  <input 
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    :max="getProductStock(item.product_id)"
                    class="input text-sm py-2 w-full text-center"
                  />
                </div>
                <div>
                  <label class="text-xs text-zinc-500 mb-1 block">Unit Price</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">$</span>
                    <input 
                      v-model.number="item.unit_price"
                      type="number"
                      step="0.01"
                      min="0"
                      class="input text-sm py-2 w-full text-right pl-7"
                    />
                  </div>
                </div>
              </div>
              
              <div class="flex items-center justify-between pt-2 border-t border-zinc-200">
                <span class="text-xs text-zinc-500">Amount:</span>
                <span class="text-sm font-semibold text-amber-600">
                  ${{ (item.quantity * item.unit_price).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Totals -->
          <div class="border-t border-zinc-200 pt-4 space-y-2">
            <div class="flex justify-between sm:justify-end items-center gap-4">
              <span class="text-sm text-zinc-500">Subtotal:</span>
              <span class="text-sm font-medium text-zinc-900 sm:w-32 text-right">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between sm:justify-end items-center gap-4 pt-2 border-t border-zinc-200">
              <span class="text-base font-medium text-zinc-900">Total:</span>
              <span class="text-lg sm:text-xl font-semibold text-amber-600 sm:w-32 text-right">${{ subtotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Notes Card -->
        <div class="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
          <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-file-text" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            Notes
          </h3>
          
          <div class="form-group">
            <label class="input-label">Additional Notes</label>
            <textarea 
              v-model="form.notes" 
              rows="3"
              placeholder="Any additional notes... (Press Shift+Enter for new line)"
              class="input min-h-[4rem] max-h-40 resize-y"
              @keydown="handleTextareaKeydown"
            ></textarea>
          </div>
        </div>
        
        <!-- Stock Error Message -->
        <div 
          v-if="hasStockIssues" 
          class="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 space-y-3"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-red-800">Stock Issues Detected</h4>
              <p class="text-xs sm:text-sm text-red-600">The following items have stock issues that must be resolved before recording this sale:</p>
            </div>
          </div>
          <ul class="space-y-2 pl-3 sm:pl-4">
            <li 
              v-for="issue in itemsWithStockIssues" 
              :key="issue.index"
              class="flex items-start gap-2 text-xs sm:text-sm text-red-700"
            >
              <UIcon name="i-lucide-x-circle" class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>{{ issue.productName }}</strong>: 
                <span v-if="issue.isOutOfStock">Out of stock (Available: 0)</span>
                <span v-else>Requested {{ issue.requested }} but only {{ issue.available }} available</span>
              </span>
            </li>
          </ul>
        </div>
        
        <!-- General Error Message -->
        <div 
          v-if="error" 
          class="flex items-center gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <UIcon name="i-lucide-alert-circle" class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
          <p class="text-xs sm:text-sm text-red-700">{{ error }}</p>
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

const { createSale, loading, error, generateSaleNumber, fetchSales } = useSales();
const { products, fetchProducts } = useProducts();
const { customers, fetchCustomers } = useCustomers();
const router = useRouter();

const form = ref<SaleFormData>({
  sale_number: '',
  customer_id: undefined,
  sale_date: new Date().toISOString().split('T')[0] ?? '',
  items: [{ product_id: 0, quantity: 1, unit_price: 0 }],
  notes: '',
});

// Stock validation error message
const stockError = ref<string | null>(null);

const subtotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
});

// Check if any item has out-of-stock product or quantity exceeds stock
const hasStockIssues = computed(() => {
  return form.value.items.some(item => {
    if (item.product_id === 0) return false;
    const stock = getProductStock(item.product_id);
    return stock === 0 || item.quantity > stock;
  });
});

// Get items with stock issues
interface StockIssue {
  index: number;
  productName: string;
  isOutOfStock: boolean;
  requested: number;
  available: number;
}

const itemsWithStockIssues = computed<StockIssue[]>(() => {
  return form.value.items
    .map((item, index) => {
      if (item.product_id === 0) return null;
      const stock = getProductStock(item.product_id);
      const product = products.value.find(p => p.product_id === item.product_id);
      if (stock === 0) {
        return { 
          index, 
          productName: product?.product_name || 'Unknown', 
          isOutOfStock: true,
          requested: item.quantity,
          available: 0
        };
      }
      if (item.quantity > stock) {
        return { 
          index, 
          productName: product?.product_name || 'Unknown', 
          isOutOfStock: false,
          requested: item.quantity,
          available: stock
        };
      }
      return null;
    })
    .filter((item): item is StockIssue => item !== null);
});

const isFormValid = computed(() => {
  return form.value.sale_number && 
         form.value.items.some(item => item.product_id > 0 && item.quantity > 0 && item.unit_price > 0) &&
         !hasStockIssues.value;
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
    const product = products.value.find(p => p.product_id === item.product_id);
    if (product) {
      item.unit_price = product.selling_price;
      // Check stock when product changes
      if (product.current_stock === 0) {
        stockError.value = `"${product.product_name}" is out of stock. Please select a different product.`;
      } else {
        stockError.value = null;
      }
    }
  }
};

const getProductStock = (productId: number) => {
  const product = products.value.find(p => p.product_id === productId);
  return product?.current_stock ?? 0;
};

// Check if product is out of stock
const isOutOfStock = (productId: number) => {
  return getProductStock(productId) === 0;
};

// Check if quantity exceeds stock
const exceedsStock = (productId: number, quantity: number) => {
  const stock = getProductStock(productId);
  return quantity > stock;
};

// Handle Shift+Enter for new line in textarea
const handleTextareaKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    // Prevent form submission on Enter, allow new line on Shift+Enter
    // Do nothing - let default behavior create new line
  }
};

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCustomers(), fetchSales()]);
  form.value.sale_number = await generateSaleNumber();
});

const handleSubmit = async () => {
  // Validate stock before submission
  if (hasStockIssues.value) {
    stockError.value = 'Some items have stock issues. Please fix them before submitting.';
    return;
  }
  
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
