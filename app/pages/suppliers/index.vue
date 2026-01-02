<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Suppliers</h1>
          <p class="mt-1 text-sm text-zinc-500">Manage your supplier relationships and contacts</p>
        </div>
        <NuxtLink 
          to="/suppliers/new" 
          class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 no-underline w-full sm:w-auto"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Add Supplier
        </NuxtLink>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-truck" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Total Suppliers</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">{{ suppliers.length }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-user" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Sale Agents</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">{{ uniqueSaleAgents }}</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-clock" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">Avg Lead Time</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-emerald-600">{{ avgLeadTime }} days</div>
        </div>
        
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5">
          <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-mail" class="w-4 h-4 text-amber-600" />
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">With Email</div>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-zinc-900">{{ suppliersWithEmail }}</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-amber-500 animate-spin" />
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <UIcon name="i-lucide-alert-circle" class="w-6 h-6 text-red-500" />
        </div>
        <p class="text-sm text-zinc-500">{{ error }}</p>
      </div>
      
      <!-- Suppliers Table -->
      <div v-else class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead>
            <tr class="bg-zinc-50 border-b border-zinc-200">
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Company</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Products</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Sale Agent</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Contact</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Phone</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Lead Time</th>
                <th class="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="supplier in suppliers" :key="supplier.supplier_id" class="hover:bg-zinc-50">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                      <UIcon name="i-lucide-building-2" class="w-4 h-4 text-amber-600" />
                    </div>
                    <span class="text-sm font-medium text-zinc-900">{{ supplier.company_name }}</span>
                  </div>
                </td>
                <td class="px-5 py-4 text-sm text-zinc-600">{{ supplier.products || '-' }}</td>
                <td class="px-5 py-4">
                  <span v-if="supplier.sale_agent" class="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                    <UIcon name="i-lucide-user" class="w-3 h-3" />
                    {{ supplier.sale_agent }}
                  </span>
                  <span v-else class="text-zinc-400">-</span>
                </td>
                <td class="px-5 py-4 text-sm text-zinc-600">{{ supplier.contact_person || '-' }}</td>
                <td class="px-5 py-4">
                  <div v-if="supplier.phone" class="flex items-center gap-1.5 text-sm text-zinc-600">
                    <UIcon name="i-lucide-phone" class="w-3.5 h-3.5 text-zinc-400" />
                    {{ supplier.phone }}
                  </div>
                  <span v-else class="text-zinc-400">-</span>
                </td>
                <td class="px-5 py-4">
                  <span v-if="supplier.lead_time_days" class="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs font-medium rounded">
                    <UIcon name="i-lucide-clock" class="w-3 h-3" />
                    {{ supplier.lead_time_days }} days
                  </span>
                  <span v-else class="text-zinc-400">-</span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-1">
                    <NuxtLink 
                      :to="`/suppliers/${supplier.supplier_id}/edit`" 
                      class="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded no-underline"
                      title="Edit"
                    >
                      <UIcon name="i-lucide-edit-2" class="w-4 h-4" />
                    </NuxtLink>
                    <button 
                      class="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                      @click="handleDelete(supplier.supplier_id!)" 
                    >
                      <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="suppliers.length === 0" class="text-center py-12">
          <div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-truck" class="w-6 h-6 text-zinc-400" />
          </div>
          <h3 class="text-sm font-medium text-zinc-900 mb-1">No suppliers yet</h3>
          <p class="text-sm text-zinc-500 mb-4">Get started by adding your first supplier.</p>
          <NuxtLink 
            to="/suppliers/new" 
            class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
          >
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
            Add Supplier
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { suppliers, loading, error, fetchSuppliers, deleteSupplier } = useSuppliers();

onMounted(() => {
  fetchSuppliers();
});

const uniqueSaleAgents = computed(() => {
  const agents = new Set(suppliers.value.filter(s => s.sale_agent).map(s => s.sale_agent));
  return agents.size;
});

const avgLeadTime = computed(() => {
  const withLeadTime = suppliers.value.filter(s => s.lead_time_days);
  if (withLeadTime.length === 0) return 0;
  const total = withLeadTime.reduce((sum, s) => sum + (s.lead_time_days || 0), 0);
  return Math.round(total / withLeadTime.length);
});

const suppliersWithEmail = computed(() => {
  return suppliers.value.filter(s => s.email).length;
});

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this supplier?')) {
    await deleteSupplier(id);
  }
};
</script>
