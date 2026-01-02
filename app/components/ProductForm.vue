<template>
  <div class="w-full">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- SKU & Product Name -->
      <div class="bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
        <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
          <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-package" class="w-4 h-4 text-amber-600" />
          </div>
          Basic Information
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label for="sku" class="block text-sm font-medium text-zinc-700 mb-2">SKU</label>
            <input 
              id="sku"
              v-model="form.sku" 
              type="text"
              placeholder="e.g. BEV001"
              class="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          
          <div>
            <label for="product_name" class="block text-sm font-medium text-zinc-700 mb-2">
              Product Name <span class="text-red-500">*</span>
            </label>
            <input 
              id="product_name"
              v-model="form.product_name" 
              type="text" 
              required
              placeholder="Enter product name"
              class="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium text-zinc-700 mb-2">Description</label>
          <textarea 
            id="description"
            v-model="form.description" 
            rows="3"
            placeholder="Enter product description"
            class="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
          ></textarea>
        </div>
      </div>
      
      <!-- Pricing -->
      <div class="bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
        <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
          <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-banknote" class="w-4 h-4 text-amber-600" />
          </div>
          Pricing
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label for="cost_price" class="block text-sm font-medium text-zinc-700 mb-2">
              Cost Price <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
              <input 
                id="cost_price"
                v-model.number="form.cost_price" 
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                class="w-full pl-8 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
          
          <div>
            <label for="selling_price" class="block text-sm font-medium text-zinc-700 mb-2">
              Selling Price <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
              <input 
                id="selling_price"
                v-model.number="form.selling_price" 
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                class="w-full pl-8 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
        </div>
        
        <!-- Profit Preview -->
        <div v-if="form.cost_price && form.selling_price" class="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span class="text-sm font-medium text-emerald-700">Profit Margin</span>
          <span class="text-xl font-semibold text-emerald-600">${{ (form.selling_price - form.cost_price).toFixed(2) }}</span>
        </div>
      </div>
      
      <!-- Supplier -->
      <div class="bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
        <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2">
          <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-building-2" class="w-4 h-4 text-amber-600" />
          </div>
          Supplier
        </h3>
        
        <div>
          <label for="supplier_id" class="block text-sm font-medium text-zinc-700 mb-2">Select Supplier</label>
          <select 
            id="supplier_id"
            v-model="form.supplier_id"
            class="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 appearance-none cursor-pointer"
          >
            <option :value="undefined">-- Select Supplier --</option>
            <option v-for="supplier in suppliers" :key="supplier.supplier_id" :value="supplier.supplier_id">
              {{ supplier.company_name }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <UIcon name="i-lucide-alert-circle" class="w-5 h-5 text-red-500 shrink-0" />
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>
      
      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center gap-3 pt-4">
        <button 
          type="submit" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="loading"
        >
          <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
          <UIcon v-else name="i-lucide-check" class="w-4 h-4" />
          {{ loading ? 'Saving...' : 'Save Product' }}
        </button>
        <NuxtLink 
          to="/products" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-xl hover:bg-zinc-200 no-underline"
        >
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types';

const props = defineProps<{
  product?: Product;
  isEdit?: boolean;
}>();

const emit = defineEmits<{
  submit: [product: Product];
}>();

const { loading, error } = useProducts();
const { suppliers, fetchSuppliers } = useSuppliers();

const form = ref<Product>({
  sku: props.product?.sku || '',
  product_name: props.product?.product_name || '',
  description: props.product?.description || '',
  cost_price: props.product?.cost_price || 0,
  selling_price: props.product?.selling_price || 0,
  supplier_id: props.product?.supplier_id,
});

onMounted(() => {
  fetchSuppliers();
});

const handleSubmit = () => {
  emit('submit', form.value);
};
</script>

