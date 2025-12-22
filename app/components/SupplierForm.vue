<template>
  <div class="max-w-2xl">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink to="/suppliers" class="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors no-underline mb-4">
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Back to Suppliers
      </NuxtLink>
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{{ isEdit ? 'Edit Supplier' : 'Add Supplier' }}</h1>
      <p class="mt-1 text-zinc-600 dark:text-zinc-500">{{ isEdit ? 'Update supplier information' : 'Add a new supplier to your network' }}</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Company Info -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-amber-500/30 rounded-xl p-6 space-y-5">
        <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-lucide-building-2" class="w-4 h-4 text-zinc-600 dark:text-zinc-500" />
          Company Information
        </h3>
        
        <div>
          <label for="company_name" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Company Name <span class="text-red-500">*</span>
          </label>
          <input 
            id="company_name"
            v-model="form.company_name" 
            type="text" 
            required
            placeholder="Enter company name"
            class="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
        
        <div>
          <label for="address" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Address</label>
          <textarea 
            id="address"
            v-model="form.address" 
            rows="3"
            placeholder="Enter company address"
            class="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
          ></textarea>
        </div>
      </div>
      
      <!-- Contact Info -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-amber-500/30 rounded-xl p-6 space-y-5">
        <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-lucide-user" class="w-4 h-4 text-zinc-600 dark:text-zinc-500" />
          Contact Information
        </h3>
        
        <div>
          <label for="contact_person" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Contact Person</label>
          <input 
            id="contact_person"
            v-model="form.contact_person" 
            type="text"
            placeholder="Enter contact person name"
            class="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label for="phone" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Phone</label>
            <div class="relative">
              <UIcon name="i-lucide-phone" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                id="phone"
                v-model="form.phone" 
                type="tel"
                placeholder="(000) 000-0000"
                class="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
            <div class="relative">
              <UIcon name="i-lucide-mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                id="email"
                v-model="form.email" 
                type="email"
                placeholder="email@example.com"
                class="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delivery Info -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-amber-500/30 rounded-xl p-6 space-y-5">
        <h3 class="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-lucide-truck" class="w-4 h-4 text-zinc-600 dark:text-zinc-500" />
          Delivery Settings
        </h3>
        
        <div>
          <label for="lead_time_days" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Lead Time (days)</label>
          <input 
            id="lead_time_days"
            v-model.number="form.lead_time_days" 
            type="number"
            min="1"
            placeholder="7"
            class="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          <p class="mt-2 text-xs text-zinc-600 dark:text-zinc-500">Average time for delivery after placing an order</p>
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
          {{ loading ? 'Saving...' : 'Save Supplier' }}
        </button>
        <NuxtLink 
          to="/suppliers" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors no-underline"
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
