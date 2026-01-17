<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-6xl mx-auto">
      <div class="mb-4 sm:mb-6">
        <NuxtLink to="/sales" class="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 hover:text-zinc-700 no-underline mb-2 sm:mb-3">
          <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Sales
        </NuxtLink>
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Edit Sale</h1>
        <p class="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-500">Update sale information</p>
      </div>
      
      <div v-if="loading" class="flex items-center justify-center py-12 sm:py-20">
        <UIcon name="i-lucide-loader-2" class="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 animate-spin" />
      </div>
      
      <form v-else-if="sale" @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
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
              <input 
                v-model="form.sale_number" 
                type="text" 
                required
                class="input bg-zinc-50"
                readonly
              />
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
          
          <div class="form-group">
            <label class="input-label">Customer</label>
            <input 
              :value="sale?.customer?.customer_name || 'Walk-in Customer'" 
              type="text"
              class="input bg-zinc-50"
              readonly
            />
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
                      class="input text-sm py-2 min-w-[5rem] w-full max-w-[8rem] text-right"
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
              class="bg-zinc-50 rounded-lg p-3 space-y-3 border border-zinc-200"
            >
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
        
        <!-- Error Message -->
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
            :disabled="submitting || !isFormValid"
          >
            <UIcon v-if="submitting" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            <UIcon v-else name="i-lucide-check" class="w-4 h-4" />
            {{ submitting ? 'Saving...' : 'Save Changes' }}
          </button>
          <NuxtLink 
            to="/sales" 
            class="btn-secondary no-underline"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
      
      <div v-else class="text-center py-12 sm:py-20">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <UIcon name="i-lucide-alert-circle" class="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
        </div>
        <p class="text-xs sm:text-sm text-zinc-500">Sale not found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sale, SaleFormData, SaleItemFormData } from '~/types';

const route = useRoute();
const router = useRouter();
const { getSale, updateSale, loading, error } = useSales();
const { products, fetchProducts } = useProducts();

const sale = ref<Sale | null>(null);
const submitting = ref(false);
const id = Number(route.params.id);

const form = ref<SaleFormData>({
  sale_number: '',
  customer_id: undefined,
  sale_date: '',
  items: [{ product_id: 0, quantity: 1, unit_price: 0 }],
  notes: '',
});

const subtotal = computed(() => {
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

// Handle Shift+Enter for new line in textarea
const handleTextareaKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    // Prevent form submission on Enter, allow new line on Shift+Enter
    // Do nothing - let default behavior create new line
  }
};

onMounted(async () => {
  await fetchProducts();
  sale.value = await getSale(id);
  if (sale.value) {
    // Convert sale items to form items
    const saleItems: SaleItemFormData[] = sale.value.items?.map(item => ({
      product_id: item.product_id ?? 0,
      quantity: item.quantity ?? 1,
      unit_price: item.unit_price ?? 0
    })) || [{
      product_id: 0,
      quantity: 1,
      unit_price: 0
    }];
    
    form.value = {
      sale_number: sale.value.sale_number,
      customer_id: sale.value.customer_id,
      sale_date: sale.value.sale_date?.split('T')[0] || '',
      items: saleItems,
      notes: sale.value.notes || '',
    };
  }
});

const handleSubmit = async () => {
  // Filter out empty items
  const validItems = form.value.items.filter(item => item.product_id > 0 && item.quantity > 0 && item.unit_price > 0);
  
  if (validItems.length === 0) {
    return;
  }
  
  submitting.value = true;
  const result = await updateSale(id, {
    ...form.value,
    items: validItems,
  });
  submitting.value = false;
  if (result) {
    router.push('/sales');
  }
};
</script>
