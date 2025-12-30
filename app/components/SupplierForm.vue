<template>
  <div class="max-w-3xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink to="/suppliers" class="btn-ghost no-underline mb-4 -ml-3">
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Back to Suppliers
      </NuxtLink>
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{{ isEdit ? 'Edit Supplier' : 'Add Supplier' }}</h1>
      <p class="mt-1 text-zinc-600 dark:text-zinc-400">{{ isEdit ? 'Update supplier information' : 'Add a new supplier to your network' }}</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Company Info -->
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500/50 rounded-xl p-6 space-y-5">
        <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-building-2" class="w-4 h-4 text-zinc-900" />
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
          <p class="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">Products supplied by this company</p>
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
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500/50 rounded-xl p-6 space-y-5">
        <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-user" class="w-4 h-4 text-zinc-900" />
          </div>
          Contact Information
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="form-group">
            <label class="input-label">Sale Agent</label>
            <div class="relative">
              <UIcon name="i-lucide-user-check" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input 
                v-model="form.sale_agent" 
                type="text"
                placeholder="e.g. Mr. Song"
                class="input pl-11"
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
              <UIcon name="i-lucide-phone" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input 
                v-model="form.phone" 
                type="tel"
                placeholder="(000) 000-0000"
                class="input pl-11"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label class="input-label">Email</label>
            <div class="relative">
              <UIcon name="i-lucide-mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input 
                v-model="form.email" 
                type="email"
                placeholder="email@example.com"
                class="input pl-11"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delivery Info -->
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500/50 rounded-xl p-6 space-y-5">
        <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-truck" class="w-4 h-4 text-zinc-900" />
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
          <p class="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">Average time for delivery after placing an order</p>
        </div>
      </div>
      
      <!-- Error Message -->
      <div 
        v-if="error" 
        class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl"
      >
        <UIcon name="i-lucide-alert-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
        <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-3 pt-4">
        <button 
          type="submit" 
          class="btn-primary" 
          :disabled="loading"
        >
          <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
          <UIcon v-else name="i-lucide-check" class="w-4 h-4" />
          {{ loading ? 'Saving...' : 'Save Supplier' }}
        </button>
        <NuxtLink 
          to="/suppliers" 
          class="btn-secondary no-underline"
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
