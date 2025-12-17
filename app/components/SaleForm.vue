<template>
  <div class="max-w-3xl mx-auto px-12 py-10">
    <div class="mb-12">
      <h2 class="text-4xl font-light text-neutral-800 tracking-wide mb-2">Record Sale</h2>
      <p class="text-sm text-neutral-500 tracking-wider uppercase">Sales Transaction</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <div>
        <label for="sale_date" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Sale Date *</label>
        <input 
          id="sale_date"
          v-model="form.sale_date" 
          type="date" 
          required
          class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800"
        />
      </div>
      
      <div>
        <label for="product_id" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Product *</label>
        <select 
          id="product_id"
          v-model="form.product_id"
          required
          class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800 bg-white"
          @change="updateTotalAmount"
        >
          <option :value="undefined">-- Select Product --</option>
          <option v-for="product in products" :key="product.product_id" :value="product.product_id">
            {{ product.product_name }} - ${{ product.selling_price.toFixed(2) }}
          </option>
        </select>
      </div>
      
      <div>
        <label for="quantity_sold" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Quantity Sold *</label>
        <input 
          id="quantity_sold"
          v-model.number="form.quantity_sold" 
          type="number"
          min="1"
          required
          class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800"
          @input="updateTotalAmount"
        />
      </div>
      
      <div>
        <label for="total_amount" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Total Amount *</label>
        <input 
          id="total_amount"
          v-model.number="form.total_amount" 
          type="number"
          step="0.01"
          min="0"
          required
          class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800"
        />
      </div>
      
      <div class="flex gap-4 pt-6">
        <button 
          type="submit" 
          class="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : 'Record Sale' }}
        </button>
        <NuxtLink 
          to="/sales" 
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
import type { Sale } from '~/types';

const emit = defineEmits<{
  submit: [sale: Sale];
}>();

const { loading, error } = useSales();
const { products, fetchProducts } = useProducts();

const form = ref<Sale>({
  sale_date: new Date().toISOString().split('T')[0],
  product_id: undefined,
  quantity_sold: 1,
  total_amount: 0,
});

onMounted(() => {
  fetchProducts();
});

const updateTotalAmount = () => {
  if (form.value.product_id && form.value.quantity_sold) {
    const product = products.value.find(p => p.product_id === form.value.product_id);
    if (product) {
      form.value.total_amount = product.selling_price * form.value.quantity_sold;
    }
  }
};

const handleSubmit = () => {
  emit('submit', form.value);
};
</script>

