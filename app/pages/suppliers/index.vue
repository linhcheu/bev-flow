<template>
  <div class="p-8 min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-200">
    <!-- Header -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
      class="flex justify-between items-start mb-8"
    >
      <div>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Suppliers</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Manage your supplier relationships</p>
      </div>
      <NuxtLink 
        to="/suppliers/new" 
        class="btn-primary no-underline"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4" />
        Add Supplier
      </NuxtLink>
    </div>
    
    <!-- Stats -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
      class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
    >
      <div class="stat-card">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-building-2" class="w-5 h-5 text-zinc-900" />
          </div>
          <div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Suppliers</p>
            <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ suppliers.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-user-check" class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Sale Agents</p>
            <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ uniqueSaleAgents }}</p>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-clock" class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Avg Lead Time</p>
            <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ avgLeadTime }} days</p>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-mail" class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">With Email</p>
            <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ suppliersWithEmail }}</p>
          </div>
        </div>
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
    <div 
      v-else 
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
      class="bg-zinc-50 dark:bg-zinc-900 border-2 border-amber-500 rounded-xl overflow-hidden shadow-2xl"
    >
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
            <tr 
              v-for="(supplier, index) in suppliers" 
              :key="supplier.supplier_id" 
              v-motion
              :initial="{ opacity: 0, x: -20 }"
              :enter="{ opacity: 1, x: 0, transition: { delay: 250 + index * 50 } }"
              class="hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
                    <UIcon name="i-lucide-building-2" class="w-4 h-4 text-zinc-900" />
                  </div>
                  <span class="text-sm font-semibold text-zinc-900 dark:text-white">{{ supplier.company_name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-zinc-600 dark:text-zinc-400 max-w-[200px] truncate block">
                  {{ supplier.products || '-' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span v-if="supplier.sale_agent" class="badge badge-info">
                  <UIcon name="i-lucide-user" class="w-3 h-3" />
                  {{ supplier.sale_agent }}
                </span>
                <span v-else class="text-zinc-400">-</span>
              </td>
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{{ supplier.contact_person || '-' }}</td>
              <td class="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{{ supplier.phone || '-' }}</td>
              <td class="px-6 py-4">
                <span class="badge badge-warning">
                  {{ supplier.lead_time_days || 7 }} days
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink 
                    :to="`/suppliers/${supplier.supplier_id}/edit`" 
                    class="icon-btn text-amber-600 dark:text-amber-500 hover:bg-amber-500/10 no-underline"
                    title="Edit"
                  >
                    <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    @click="handleDelete(supplier.supplier_id!)" 
                    class="icon-btn text-red-500 dark:text-red-400 hover:bg-red-500/10"
                    title="Delete"
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
      <div 
        v-if="suppliers.length === 0" 
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :enter="{ opacity: 1, scale: 1 }"
        class="text-center py-16"
      >
        <div class="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-lucide-building-2" class="w-8 h-8 text-zinc-500 dark:text-zinc-600" />
        </div>
        <h3 class="text-lg font-medium text-zinc-900 dark:text-white mb-1">No suppliers yet</h3>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Get started by adding your first supplier.</p>
        <NuxtLink 
          to="/suppliers/new" 
          class="btn-primary no-underline"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Add Supplier
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { suppliers, loading, error, fetchSuppliers, deleteSupplier } = useSuppliers();

const uniqueSaleAgents = computed(() => {
  const agents = suppliers.value.map(s => s.sale_agent).filter(Boolean);
  return new Set(agents).size;
});

const avgLeadTime = computed(() => {
  if (suppliers.value.length === 0) return 0;
  const total = suppliers.value.reduce((sum, s) => sum + (s.lead_time_days || 7), 0);
  return Math.round(total / suppliers.value.length);
});

const suppliersWithEmail = computed(() => {
  return suppliers.value.filter(s => s.email).length;
});

onMounted(() => {
  fetchSuppliers();
});

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this supplier?')) {
    await deleteSupplier(id);
  }
};
</script>
