<template>
  <div class="p-8 min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-200">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
        class="mb-8"
      >
        <NuxtLink to="/sales" class="btn-ghost no-underline mb-4 -ml-3">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Sales
        </NuxtLink>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Record Sale</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Create a new sale entry</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Sale Details Card -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
          class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500/50 rounded-xl p-6 space-y-5"
        >
          <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-receipt" class="w-4 h-4 text-zinc-900" />
            </div>
            Sale Details
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-group">
              <label class="input-label">
                Invoice No. <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.invoice_number" 
                type="text"
                required
                placeholder="e.g. 1001"
                class="input"
              />
            </div>
            
            <div class="form-group">
              <label class="input-label">
                Sale Date <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <UIcon name="i-lucide-calendar" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
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
        <div 
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 150 } }"
          class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500/50 rounded-xl p-6 space-y-5"
        >
          <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-user" class="w-4 h-4 text-zinc-900" />
            </div>
            Customer Information
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-group">
              <label class="input-label">Select Customer</label>
              <select 
                v-model="form.customer_id"
                class="select"
                @change="onCustomerChange"
              >
                <option :value="undefined">-- Select or enter name --</option>
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
                placeholder="Customer name"
                class="input"
              />
            </div>
          </div>
        </div>
        
        <!-- Product Card -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
          class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500/50 rounded-xl p-6 space-y-5"
        >
          <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-package" class="w-4 h-4 text-zinc-900" />
            </div>
            Product Details
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-group md:col-span-2">
              <label class="input-label">
                Product <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.product_id"
                required
                class="select"
                @change="onProductChange"
              >
                <option :value="0">-- Select Product --</option>
                <option v-for="product in products" :key="product.product_id" :value="product.product_id">
                  {{ product.product_name }} ({{ product.sku }})
                </option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="form-group">
              <label class="input-label">
                Unit Price <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                <input 
                  v-model.number="form.unit_price" 
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="input pl-8"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label class="input-label">
                Quantity <span class="text-red-500">*</span>
              </label>
              <input 
                v-model.number="form.quantity" 
                type="number"
                min="1"
                required
                class="input"
              />
            </div>
            
            <div class="form-group">
              <label class="input-label">Total Amount</label>
              <div class="flex items-center h-12 px-4 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                <span class="text-xl font-bold text-amber-600 dark:text-amber-500">
                  ${{ totalAmount.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notes Card -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 250 } }"
          class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500/50 rounded-xl p-6 space-y-5"
        >
          <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-file-text" class="w-4 h-4 text-zinc-900" />
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
          :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
          class="flex items-center gap-3 pt-4"
        >
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
import type { SaleFormData } from '~/types';

const { createSale, loading, error, generateInvoiceNumber, fetchSales } = useSales();
const { products, fetchProducts } = useProducts();
const { customers, fetchCustomers } = useCustomers();
const router = useRouter();

const form = ref<SaleFormData>({
  invoice_number: '',
  customer_id: undefined,
  customer_name: '',
  sale_date: new Date().toISOString().split('T')[0] ?? '',
  product_id: 0,
  unit_price: 0,
  quantity: 1,
  notes: '',
});

const totalAmount = computed(() => {
  return form.value.unit_price * form.value.quantity;
});

const isFormValid = computed(() => {
  return form.value.invoice_number && 
         form.value.product_id > 0 && 
         form.value.quantity > 0 &&
         form.value.unit_price > 0;
});

const onCustomerChange = () => {
  if (form.value.customer_id) {
    const customer = customers.value.find(c => c.customer_id === form.value.customer_id);
    if (customer) {
      form.value.customer_name = customer.customer_name;
    }
  }
};

const onProductChange = () => {
  const product = products.value.find(p => p.product_id === form.value.product_id);
  if (product) {
    form.value.unit_price = product.selling_price;
  }
};

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCustomers(), fetchSales()]);
  form.value.invoice_number = generateInvoiceNumber();
});

const handleSubmit = async () => {
  const result = await createSale(form.value);
  if (result) {
    router.push('/sales');
  }
};
</script>
