<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-4 sm:mb-6 md:mb-8">
        <NuxtLink to="/purchase-orders" class="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-600 hover:text-amber-600 no-underline mb-2 sm:mb-4">
          <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Purchase Orders
        </NuxtLink>
        <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Edit Purchase Order</h1>
        <p class="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-500">Update purchase order details</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="pageLoading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-amber-500 animate-spin" />
      </div>
      
      <form v-else @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
        <!-- PO Details Card -->
        <div class="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
          <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-clipboard-list" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
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
                @change="onSupplierChange"
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
              <DatePicker 
                v-model="form.order_date"
                placeholder="Select order date"
              />
            </div>
          </div>
          
          <!-- Supplier Information Display -->
          <div v-if="selectedSupplier" class="bg-teal-50 border border-teal-200 rounded-lg p-4 space-y-3">
            <h4 class="text-sm font-medium text-teal-800 flex items-center gap-2">
              <UIcon name="i-lucide-building-2" class="w-4 h-4" />
              Supplier Information
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span class="text-teal-600 text-xs block">Company Name</span>
                <span class="font-medium text-teal-900">{{ selectedSupplier.company_name }}</span>
              </div>
              <div>
                <span class="text-teal-600 text-xs block">Contact Person</span>
                <span class="font-medium text-teal-900">{{ selectedSupplier.contact_person || '-' }}</span>
              </div>
              <div>
                <span class="text-teal-600 text-xs block">Sale Agent</span>
                <span class="font-medium text-teal-900">{{ selectedSupplier.sale_agent || '-' }}</span>
              </div>
              <div>
                <span class="text-teal-600 text-xs block">Phone</span>
                <span class="font-medium text-teal-900">{{ selectedSupplier.phone || '-' }}</span>
              </div>
              <div>
                <span class="text-teal-600 text-xs block">Email</span>
                <span class="font-medium text-teal-900">{{ selectedSupplier.email || '-' }}</span>
              </div>
              <div class="sm:col-span-2 md:col-span-3">
                <span class="text-teal-600 text-xs block">Address</span>
                <span class="font-medium text-teal-900">{{ selectedSupplier.address || '-' }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 text-xs text-teal-600">
              <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
              Lead Time: {{ selectedSupplier.lead_time_days || 7 }} days
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div class="form-group">
              <label class="input-label">ETA (Expected Arrival)</label>
              <DatePicker 
                v-model="form.eta_date"
                placeholder="Select ETA date"
                :min-date="form.order_date"
              />
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
              Order Items
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
                      :disabled="!form.supplier_id"
                    >
                      <option :value="0">-- Select --</option>
                      <option v-for="product in filteredProducts" :key="product.product_id" :value="product.product_id">
                        {{ product.product_name }}
                      </option>
                    </select>
                  </td>
                  <td class="py-3 px-2">
                    <input 
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      class="input text-sm py-2 min-w-[5rem] w-full max-w-[8rem] text-right"
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
                        readonly
                        class="input text-sm py-2 min-w-[6rem] w-full max-w-[10rem] text-right pl-7 bg-zinc-50 cursor-not-allowed"
                        title="Unit cost is auto-populated from product"
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
                <button 
                  v-if="form.items.length > 1"
                  type="button"
                  @click="removeItem(index)"
                  class="icon-btn icon-btn-danger !p-1"
                >
                  <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div>
                <label class="text-xs text-zinc-500 mb-1 block">Product</label>
                <select 
                  v-model="item.product_id"
                  class="select text-sm py-2 w-full"
                  @change="onProductChange(index)"
                  :disabled="!form.supplier_id"
                >
                  <option :value="0">-- Select Product --</option>
                  <option v-for="product in filteredProducts" :key="product.product_id" :value="product.product_id">
                    {{ product.product_name }}
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
                  <label class="text-xs text-zinc-500 mb-1 block">Unit Cost</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">$</span>
                    <input 
                      v-model.number="item.unit_cost"
                      type="number"
                      step="0.01"
                      min="0"
                      readonly
                      class="input text-sm py-2 w-full text-right pl-7 bg-zinc-50 cursor-not-allowed"
                      title="Unit cost is auto-populated from product"
                    />
                  </div>
                </div>
              </div>
              
              <div class="flex items-center justify-between pt-2 border-t border-zinc-200">
                <span class="text-xs text-zinc-500">Amount:</span>
                <span class="text-sm font-semibold text-amber-600">
                  ${{ (item.quantity * item.unit_cost).toFixed(2) }}
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
            <div class="flex justify-between sm:justify-end items-center gap-4">
              <span class="text-sm text-zinc-500">Shipping (3%):</span>
              <span class="text-sm text-zinc-900 sm:w-32 text-right">${{ shippingCost.toFixed(2) }}</span>
            </div>
            <!-- Promotion Percentage -->
            <div class="flex justify-between sm:justify-end items-center gap-4">
              <span class="text-sm text-zinc-500">Promotion (%):</span>
              <div class="relative w-28 sm:w-32">
                <input 
                  v-model.number="form.promotion_percent"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  class="input text-sm py-1 text-right pr-7"
                  @input="onPromotionPercentChange"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">%</span>
              </div>
            </div>
            <!-- Promotion Amount (Dollar) -->
            <div class="flex justify-between sm:justify-end items-center gap-4">
              <span class="text-sm text-zinc-500">Promotion ($):</span>
              <div class="relative w-28 sm:w-32">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">-$</span>
                <input 
                  v-model.number="form.promotion_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  class="input text-sm py-1 text-right pl-8"
                  @input="onPromotionAmountChange"
                />
              </div>
            </div>
            <!-- Promotion Text/Description -->
            <div class="flex flex-col sm:flex-row justify-between sm:justify-end items-start sm:items-start gap-2 sm:gap-4">
              <span class="text-sm text-zinc-500 pt-2">Promotion Details:</span>
              <textarea 
                v-model="form.promotion_text"
                placeholder="e.g. Free 2 cases, discount on next order..."
                rows="1"
                class="input text-sm py-2 w-full sm:w-72 min-h-[2.5rem] max-h-32 resize-y"
                @keydown="handleTextareaKeydown"
              ></textarea>
            </div>
            <div class="flex justify-between sm:justify-end items-center gap-4 pt-2 border-t border-zinc-200">
              <span class="text-base font-medium text-zinc-900">Total:</span>
              <span class="text-lg sm:text-xl font-semibold text-amber-600 sm:w-32 text-right">${{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Remarks Card -->
        <div class="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
          <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-message-square" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            Notes & Remarks
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div class="form-group">
              <label class="input-label">Truck Remark</label>
              <textarea 
                v-model="form.truck_remark" 
                placeholder="e.g. give DO"
                rows="2"
                class="input min-h-[2.5rem] max-h-32 resize-y"
                @keydown="handleTextareaKeydown"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label class="input-label">Overall Remark</label>
              <textarea 
                v-model="form.overall_remark" 
                placeholder="e.g. give latest expiry"
                rows="2"
                class="input min-h-[2.5rem] max-h-32 resize-y"
                @keydown="handleTextareaKeydown"
              ></textarea>
            </div>
          </div>
        </div>
        
        <!-- Third Party Agent Card (Optional - for rare cases) -->
        <div class="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
              <div class="w-7 h-7 sm:w-8 sm:h-8 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-truck" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
              </div>
              <span class="flex flex-wrap items-center gap-1">
                Third Party Agent
                <span class="text-xs font-normal text-zinc-400">(Optional)</span>
              </span>
            </h3>
            <button 
              type="button"
              @click="showThirdPartyAgent = !showThirdPartyAgent"
              class="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 self-end sm:self-auto px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors"
            >
              <UIcon :name="showThirdPartyAgent ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="w-4 h-4" />
              {{ showThirdPartyAgent ? 'Hide' : 'Show' }}
            </button>
          </div>
          
          <div v-if="showThirdPartyAgent" class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div class="form-group">
              <label class="input-label">Agent / Co-Loader Name</label>
              <input 
                v-model="form.third_party_agent" 
                type="text"
                placeholder="e.g. ABC Logistics"
                class="input"
              />
            </div>
            
            <div class="form-group">
              <label class="input-label">Agent Phone</label>
              <input 
                v-model="form.agent_phone" 
                type="text"
                placeholder="e.g. 012 345 678"
                class="input"
              />
            </div>
            
            <div class="form-group">
              <label class="input-label">Agent Email</label>
              <input 
                v-model="form.agent_email" 
                type="email"
                placeholder="e.g. agent@company.com"
                class="input"
              />
            </div>
            
            <div class="form-group">
              <label class="input-label">Agent Address</label>
              <input 
                v-model="form.agent_address" 
                type="text"
                placeholder="e.g. 123 Street, City"
                class="input"
              />
            </div>
          </div>
          
          <p v-if="!showThirdPartyAgent" class="text-xs text-zinc-400 italic">
            Click "Show" to add third party agent / co-loader details for this order
          </p>
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
  promotion_percent: 0,
  promotion_amount: 0,
  promotion_text: '',
  truck_remark: '',
  overall_remark: '',
  third_party_agent: '',
  agent_phone: '',
  agent_email: '',
  agent_address: '',
});

// Toggle for third party agent section
const showThirdPartyAgent = ref(false);

// Get selected supplier details
const selectedSupplier = computed(() => {
  if (!form.value.supplier_id) return null;
  return suppliers.value.find(s => s.supplier_id === form.value.supplier_id) || null;
});

// Filter products by selected supplier
const filteredProducts = computed(() => {
  if (!form.value.supplier_id) return products.value;
  return products.value.filter(p => p.supplier_id === form.value.supplier_id);
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
  // Clear items when supplier changes since products are filtered by supplier
  form.value.items = [{ product_id: 0, quantity: 0, unit_cost: 0 }];
};

const onProductChange = (index: number) => {
  const item = form.value.items[index];
  if (item) {
    const product = filteredProducts.value.find(p => p.product_id === item.product_id);
    if (product) {
      item.unit_cost = product.cost_price;
    }
  }
};

// Promotion conversion handlers
const onPromotionPercentChange = () => {
  // Calculate dollar amount from percentage
  const percent = form.value.promotion_percent || 0;
  const baseAmount = subtotal.value + shippingCost.value;
  form.value.promotion_amount = Number((baseAmount * (percent / 100)).toFixed(2));
};

const onPromotionAmountChange = () => {
  // Calculate percentage from dollar amount
  const amount = form.value.promotion_amount || 0;
  const baseAmount = subtotal.value + shippingCost.value;
  if (baseAmount > 0) {
    form.value.promotion_percent = Number(((amount / baseAmount) * 100).toFixed(2));
  } else {
    form.value.promotion_percent = 0;
  }
};

// Handle Shift+Enter for new line in textarea
const handleTextareaKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    // Prevent form submission on Enter, allow new line on Shift+Enter
    // Do nothing - let default behavior create new line
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
      promotion_percent: po.promotion_percent || 0,
      promotion_amount: po.promotion_amount || 0,
      promotion_text: po.promotion_text || '',
      truck_remark: po.truck_remark || '',
      overall_remark: po.overall_remark || '',
      third_party_agent: po.third_party_agent || '',
      agent_phone: po.agent_phone || '',
      agent_email: po.agent_email || '',
      agent_address: po.agent_address || '',
    };
    
    // Auto-expand third party agent section if data exists
    if (po.third_party_agent || po.agent_phone || po.agent_email || po.agent_address) {
      showThirdPartyAgent.value = true;
    }
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
