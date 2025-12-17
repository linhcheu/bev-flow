<template>
  <div class="px-12 py-10">
    <div class="flex justify-between items-center mb-12">
      <div>
        <h1 class="text-4xl font-light text-neutral-800 tracking-wide mb-2">Suppliers</h1>
        <p class="text-sm text-neutral-500 tracking-wider uppercase">Supplier Management</p>
      </div>
      <NuxtLink 
        to="/suppliers/new" 
        class="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-light tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 no-underline"
      >
        Add Supplier
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-16 text-neutral-500">Loading suppliers...</div>
    <div v-else-if="error" class="text-center py-16 text-red-600">{{ error }}</div>
    
    <div v-else class="bg-white border border-neutral-200 rounded-sm overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-neutral-50 border-b border-neutral-200">
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">ID</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Company Name</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Contact Person</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Phone</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Email</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Lead Time</th>
            <th class="px-8 py-5 text-left text-[10px] font-medium text-neutral-600 uppercase tracking-[0.15em]">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-for="supplier in suppliers" :key="supplier.supplier_id" class="hover:bg-neutral-50 transition-colors duration-200">
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ supplier.supplier_id }}</td>
            <td class="px-8 py-5 text-sm text-neutral-900">{{ supplier.company_name }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ supplier.contact_person || '-' }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ supplier.phone || '-' }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ supplier.email || '-' }}</td>
            <td class="px-8 py-5 text-sm text-neutral-700 font-light">{{ supplier.lead_time_days || 7 }} days</td>
            <td class="px-8 py-5 flex gap-3">
              <NuxtLink 
                :to="`/suppliers/${supplier.supplier_id}/edit`" 
                class="px-4 py-2 text-xs bg-neutral-100 text-neutral-700 rounded-sm hover:bg-neutral-200 transition-colors uppercase tracking-wider no-underline"
              >
                Edit
              </NuxtLink>
              <button 
                @click="handleDelete(supplier.supplier_id!)" 
                class="px-4 py-2 text-xs bg-red-50 text-red-700 rounded-sm hover:bg-red-100 transition-colors uppercase tracking-wider"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const { suppliers, loading, error, fetchSuppliers, deleteSupplier } = useSuppliers();

onMounted(() => {
  fetchSuppliers();
});

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this supplier?')) {
    await deleteSupplier(id);
  }
};
</script>
