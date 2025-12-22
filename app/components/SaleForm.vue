<template>
  <div class="max-w-2xl">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink to="/sales" class="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors no-underline mb-4">
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Back to Sales
      </NuxtLink>
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Record Sale</h1>
      <p class="mt-1 text-zinc-600 dark:text-zinc-500">Record a new sales transaction</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Sale Details -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-amber-500/30 rounded-xl p-6 space-y-5">
        <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-lucide-receipt" class="w-4 h-4 text-zinc-600 dark:text-zinc-500" />
          Sale Details
        </h3>
        
        <div>
          <label for="sale_date" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Sale Date <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <UIcon name="i-lucide-calendar" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              id="sale_date"
              v-model="form.sale_date" 
              type="date" 
              required
              class="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
        </div>
        
        <div>
          <label for="product_id" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Product <span class="text-red-500">*</span>
          </label>
          <select 
            id="product_id"
            v-model="form.product_id"
            required
            class="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none cursor-pointer"
            @change="updateTotalAmount"
          >
            <option :value="undefined">-- Select Product --</option>
            <option v-for="product in products" :key="product.product_id" :value="product.product_id">
              {{ product.product_name }} - ${{ product.selling_price.toFixed(2) }}
            </option>
          </select>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label for="quantity_sold" class="block text-sm font-medium text-zinc-700 mb-2">
              Quantity <span class="text-red-500">*</span>
            </label>
            <input 
              id="quantity_sold"
              v-model.number="form.quantity_sold" 
              type="number"
              min="1"
              required
              placeholder="1"
              class="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              @input="updateTotalAmount"
            />
          </div>
          
          <div>
            <label for="total_amount" class="block text-sm font-medium text-zinc-700 mb-2">
              Total Amount <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
              <input 
                id="total_amount"
                v-model.number="form.total_amount" 
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                class="w-full pl-8 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Summary -->
      <div v-if="selectedProduct" class="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <h3 class="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
          Sale Summary
        </h3>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-emerald-700">Product:</span>
            <span class="font-medium text-emerald-900">{{ selectedProduct.product_name }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-emerald-700">Unit Price:</span>
            <span class="font-medium text-emerald-900">${{ selectedProduct.selling_price.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-emerald-700">Quantity:</span>
            <span class="font-medium text-emerald-900">{{ form.quantity_sold }}</span>
          </div>
          <div class="pt-2 mt-2 border-t border-emerald-200 flex justify-between">
            <span class="font-semibold text-emerald-800">Total:</span>
            <span class="text-xl font-bold text-emerald-600">${{ form.total_amount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
        <UIcon name="i-lucide-alert-circle" class="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
        <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-3 pt-4">
        <button 
          type="submit" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="loading"
        >
          <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
          <UIcon v-else name="i-lucide-check" class="w-4 h-4" />
          {{ loading ? 'Recording...' : 'Record Sale' }}
        </button>
        <NuxtLink 
          to="/sales" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors no-underline"
        >
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Sale, Product } from '~/types';

const emit = defineEmits<{
  submit: [sale: Sale];
}>();

const { loading, error } = useSales();
const { products, fetchProducts } = useProducts();

const form = ref<Sale>({
  sale_date: new Date().toISOString().split('T')[0] || '',
  product_id: undefined,
  quantity_sold: 1,
  total_amount: 0,
});

const selectedProduct = computed(() => {
  if (!form.value.product_id) return null;
  return products.value.find((p: Product) => p.product_id === form.value.product_id);
});

onMounted(() => {
  fetchProducts();
});

const updateTotalAmount = () => {
  if (form.value.product_id && form.value.quantity_sold) {
    const product = products.value.find((p: Product) => p.product_id === form.value.product_id);
    if (product) {
      form.value.total_amount = product.selling_price * form.value.quantity_sold;
    }
  }
};

const handleSubmit = () => {
  emit('submit', form.value);
};
</script>

