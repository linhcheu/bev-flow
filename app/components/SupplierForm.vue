<template>
  <div class="max-w-3xl mx-auto px-12 py-10">
    <div class="mb-12">
      <h2 class="text-4xl font-light text-neutral-800 tracking-wide mb-2">{{ isEdit ? 'Edit Supplier' : 'Add Supplier' }}</h2>
      <p class="text-sm text-neutral-500 tracking-wider uppercase">Supplier Information</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <div>
        <label for="company_name" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Company Name *</label>
        <input 
          id="company_name"
          v-model="form.company_name" 
          type="text" 
          required
          class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800"
        />
      </div>
      
      <div>
        <label for="contact_person" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Contact Person</label>
        <input 
          id="contact_person"
          v-model="form.contact_person" 
          type="text"
          class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800"
        />
      </div>
      
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label for="phone" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Phone</label>
          <input 
            id="phone"
            v-model="form.phone" 
            type="tel"
            class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800"
          />
        </div>
        
        <div>
          <label for="email" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Email</label>
          <input 
            id="email"
            v-model="form.email" 
            type="email"
            class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800"
          />
        </div>
      </div>
      
      <div>
        <label for="address" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Address</label>
        <textarea 
          id="address"
          v-model="form.address" 
          rows="4"
          class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800 resize-vertical"
        ></textarea>
      </div>
      
      <div>
        <label for="lead_time_days" class="block mb-2 text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Lead Time (days)</label>
        <input 
          id="lead_time_days"
          v-model.number="form.lead_time_days" 
          type="number"
          min="1"
          class="w-full px-6 py-4 border border-neutral-300 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 text-neutral-800"
        />
      </div>
      
      <div class="flex gap-4 pt-6">
        <button 
          type="submit" 
          class="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : 'Save Supplier' }}
        </button>
        <NuxtLink 
          to="/suppliers" 
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
