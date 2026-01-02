<template>
  <div class="max-w-3xl mx-auto">    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Company Info -->
      <div class="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 space-y-5">
        <h3 class="text-sm font-semibold text-zinc-900 flex items-center gap-3">
          <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-building-2" class="w-4 h-4 text-white" />
          </div>
          Company Information
        </h3>
        
        <div class="form-group">
          <label class="input-label">
            Company Name <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="form.company_name" 
            type="text" 
            required
            placeholder="Enter company name"
            class="input"
          />
        </div>
        
        <div class="form-group">
          <label class="input-label">Products</label>
          <input 
            v-model="form.products" 
            type="text"
            placeholder="e.g. Beer, Wine, Soft Drinks"
            class="input"
          />
          <p class="mt-1.5 text-xs text-zinc-500">Products supplied by this company</p>
        </div>
        
        <div class="form-group">
          <label class="input-label">Address</label>
          <textarea 
            v-model="form.address" 
            rows="3"
            placeholder="Enter company address"
            class="input resize-none"
          ></textarea>
        </div>
      </div>
      
      <!-- Contact Info -->
      <div class="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 space-y-5">
        <h3 class="text-sm font-semibold text-zinc-900 flex items-center gap-3">
          <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-user" class="w-4 h-4 text-white" />
          </div>
          Contact Information
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="form-group">
            <label class="input-label">Sale Agent</label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                <UIcon name="i-lucide-user-check" class="w-4 h-4 text-zinc-400" />
              </div>
              <input 
                v-model="form.sale_agent" 
                type="text"
                placeholder="e.g. Mr. Song"
                class="w-full py-3 pl-10 pr-4 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label class="input-label">Contact Person</label>
            <input 
              v-model="form.contact_person" 
              type="text"
              placeholder="Enter contact person name"
              class="input"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="form-group">
            <label class="input-label">Phone</label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                <UIcon name="i-lucide-phone" class="w-4 h-4 text-zinc-400" />
              </div>
              <input 
                v-model="form.phone" 
                type="tel"
                placeholder="(000) 000-0000"
                class="w-full py-3 pl-10 pr-4 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label class="input-label">Email</label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                <UIcon name="i-lucide-mail" class="w-4 h-4 text-zinc-400" />
              </div>
              <input 
                v-model="form.email" 
                type="email"
                placeholder="email@example.com"
                class="w-full py-3 pl-10 pr-4 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delivery Info -->
      <div class="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 space-y-5">
        <h3 class="text-sm font-semibold text-zinc-900 flex items-center gap-3">
          <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-truck" class="w-4 h-4 text-white" />
          </div>
          Delivery Settings
        </h3>
        
        <div class="form-group">
          <label class="input-label">Lead Time (days)</label>
          <input 
            v-model.number="form.lead_time_days" 
            type="number"
            min="1"
            placeholder="7"
            class="input"
          />
          <p class="mt-1.5 text-xs text-zinc-500">Average time for delivery after placing an order</p>
        </div>
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
      <div class="flex flex-col sm:flex-row items-center gap-3 pt-4">
        <button 
          type="submit" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="loading"
        >
          <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
          <UIcon v-else name="i-lucide-check" class="w-4 h-4" />
          {{ loading ? 'Saving...' : 'Save Supplier' }}
        </button>
        <NuxtLink 
          to="/suppliers" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-xl hover:bg-zinc-200 no-underline"
        >
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Supplier } from '~/types';

const props = defineProps<{
  supplier?: Supplier;
  isEdit?: boolean;
}>();

const emit = defineEmits<{
  submit: [supplier: Supplier];
}>();

const { loading, error } = useSuppliers();

const form = ref<Supplier>({
  company_name: '',
  products: '',
  sale_agent: '',
  contact_person: '',
  phone: '',
  email: '',
  address: '',
  lead_time_days: 7,
});

// Initialize form with supplier data if editing
if (props.supplier) {
  form.value = {
    ...props.supplier
  };
}

const handleSubmit = () => {
  emit('submit', form.value);
};
</script>
