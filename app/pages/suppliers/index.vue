<template>
  <div class="p-8 min-h-screen bg-white dark:bg-zinc-950 animate-fade-in transition-colors duration-200">
    <!-- Header -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Suppliers</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Manage your supplier relationships and contacts</p>
      </div>
      <NuxtLink 
        to="/suppliers/new" 
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/40"
      >
        <UIcon name="i-lucide-plus" class="w-5 h-5" />
        <span>Add Supplier</span>
      </NuxtLink>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-truck" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Total Suppliers</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">{{ suppliers.length }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-user" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Sale Agents</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">{{ uniqueSaleAgents }}</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-clock" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">Avg Lead Time</div>
        </div>
        <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ avgLeadTime }} days</div>
      </div>
      
      <div class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-mail" class="w-5 h-5 text-zinc-900" />
          </div>
          <div class="text-sm text-zinc-600 dark:text-zinc-400">With Email</div>
        </div>
        <div class="text-2xl font-bold text-zinc-900 dark:text-white">{{ suppliersWithEmail }}</div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="w-16 h-16 bg-red-500/20 border border-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-red-400" />
      </div>
      <p class="text-zinc-600 dark:text-zinc-400">{{ error }}</p>
    </div>
    
    <!-- Suppliers Table -->
    <div v-else class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-zinc-200 dark:bg-zinc-800 border-b border-amber-500/50">
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Company</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Products</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Sale Agent</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Phone</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Lead Time</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            <tr v-for="supplier in suppliers" :key="supplier.supplier_id" class="hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
                    <UIcon name="i-lucide-building-2" class="w-4 h-4 text-zinc-900" />
                  </div>
                  <span class="text-sm font-semibold text-zinc-900 dark:text-white">{{ supplier.company_name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-zinc-700 dark:text-zinc-300">{{ supplier.products || '-' }}</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="supplier.sale_agent" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500 text-amber-600 dark:text-amber-400 text-sm rounded-lg">
                  <UIcon name="i-lucide-user" class="w-3.5 h-3.5" />
                  {{ supplier.sale_agent }}
                </span>
                <span v-else class="text-zinc-500 dark:text-zinc-600">-</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-zinc-700 dark:text-zinc-300">{{ supplier.contact_person || '-' }}</span>
              </td>
              <td class="px-6 py-4">
                <div v-if="supplier.phone" class="flex items-center gap-2">
                  <UIcon name="i-lucide-phone" class="w-4 h-4 text-amber-600 dark:text-amber-500" />
                  <span class="text-sm text-zinc-700 dark:text-zinc-300">{{ supplier.phone }}</span>
                </div>
                <span v-else class="text-zinc-500 dark:text-zinc-600">-</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="supplier.lead_time_days" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm rounded-lg">
                  <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
                  {{ supplier.lead_time_days }} days
                </span>
                <span v-else class="text-zinc-500 dark:text-zinc-600">-</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-1">
                  <NuxtLink 
                    :to="`/suppliers/${supplier.supplier_id}/edit`" 
                    class="p-2 text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <UIcon name="i-lucide-edit-2" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    class="p-2 text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
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
      <div v-if="suppliers.length === 0" class="text-center py-16">
        <div class="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-lucide-truck" class="w-8 h-8 text-zinc-500 dark:text-zinc-600" />
        </div>
        <h3 class="text-lg font-medium text-zinc-900 dark:text-white mb-1">No suppliers yet</h3>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Get started by adding your first supplier.</p>
        <NuxtLink 
          to="/suppliers/new" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold rounded-lg transition-all duration-300"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          <span>Add Supplier</span>
        </NuxtLink>
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
