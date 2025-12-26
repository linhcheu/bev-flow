<template>
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
      <p class="mt-1 text-zinc-600 dark:text-zinc-400">Record a new sales transaction</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Sale Details -->
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
        
        <div class="form-group">
          <label class="input-label">
            Customer Name
          </label>
          <input 
            v-model="form.customer_name" 
            type="text"
            placeholder="Enter customer name"
            class="input"
          />
        </div>
        
        <div class="form-group">
          <label class="input-label">
            Product <span class="text-red-500">*</span>
          </label>
          <select 
            v-model="form.product_id"
            required
            class="select"
            @change="updateTotalAmount"
          >
            <option :value="0">-- Select Product --</option>
            <option v-for="product in products" :key="product.product_id" :value="product.product_id">
              {{ product.product_name }} - ${{ product.selling_price.toFixed(2) }}
            </option>
          </select>
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
              placeholder="1"
              class="input"
              @input="updateTotalAmount"
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
        :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
        class="flex items-center gap-3 pt-4"
      >
        <button 
          type="submit" 
          class="btn-primary" 
          :disabled="loading"
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
</template>

<script setup lang="ts">
import type { SaleFormData, Product } from '~/types';

const emit = defineEmits<{
  submit: [sale: SaleFormData];
}>();

const { loading, error } = useSales();
const { products, fetchProducts } = useProducts();

const form = ref<SaleFormData>({
  invoice_number: '',
  customer_name: '',
  sale_date: new Date().toISOString().split('T')[0] || '',
  product_id: 0,
  unit_price: 0,
  quantity: 1,
  notes: '',
});

const totalAmount = computed(() => {
  return form.value.unit_price * form.value.quantity;
});

onMounted(() => {
  fetchProducts();
});

const updateTotalAmount = () => {
  if (form.value.product_id > 0) {
    const product = products.value.find((p: Product) => p.product_id === form.value.product_id);
    if (product) {
      form.value.unit_price = product.selling_price;
    }
  }
};

const handleSubmit = () => {
  emit('submit', form.value);
};
</script>

