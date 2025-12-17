<template>
  <div class="max-w-3xl mx-auto px-12 py-10">
    <div class="mb-12">
      <h2 class="text-4xl font-light text-neutral-800 tracking-wide mb-2">{{ isEdit ? 'Edit Product' : 'Add Product' }}</h2>
      <p class="text-sm text-neutral-500 tracking-wider uppercase">Product Information</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <div>
        <label for="sku" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">SKU</label>
        <input 
          id="sku"
          v-model="form.sku" 
          type="text"
          class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800"
        />
      </div>
      
      <div>
        <label for="product_name" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Product Name *</label>
        <input 
          id="product_name"
          v-model="form.product_name" 
          type="text" 
          required
          class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800"
        />
      </div>
      
      <div>
        <label for="description" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Description</label>
        <textarea 
          id="description"
          v-model="form.description" 
          rows="4"
          class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800 resize-vertical"
        ></textarea>
      </div>
      
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label for="cost_price" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Cost Price *</label>
          <input 
            id="cost_price"
            v-model.number="form.cost_price" 
            type="number"
            step="0.01"
            min="0"
            required
            class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800"
          />
        </div>
        
        <div>
          <label for="selling_price" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Selling Price *</label>
          <input 
            id="selling_price"
            v-model.number="form.selling_price" 
            type="number"
            step="0.01"
            min="0"
            required
            class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800"
          />
        </div>
      </div>
      
      <div>
        <label for="supplier_id" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Supplier</label>
        <select 
          id="supplier_id"
          v-model="form.supplier_id"
          class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800 bg-white"
        >
          <option :value="undefined">-- Select Supplier --</option>
          <option v-for="supplier in suppliers" :key="supplier.supplier_id" :value="supplier.supplier_id">
            {{ supplier.company_name }}
          </option>
        </select>
      </div>
      
      <div v-if="form.cost_price && form.selling_price" class="px-6 py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm">
        <span class="text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em] mr-3">Profit:</span>
        <span class="text-2xl font-light text-[#D4AF37]">${{ (form.selling_price - form.cost_price).toFixed(2) }}</span>
      </div>
      
      <div class="flex gap-4 pt-6">
        <button 
          type="submit" 
          class="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : 'Save Product' }}
        </button>
        <NuxtLink 
          to="/products" 
          class="px-8 py-4 bg-neutral-200 text-neutral-700 text-sm font-light tracking-wider uppercase rounded-sm hover:bg-neutral-300 transition-colors no-underline"
        >
          Cancel
        </NuxtLink>
      </div>
      
      <div v-if="error" class="px-6 py-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm">{{ error }}</div>
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

