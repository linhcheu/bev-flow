<template>
  <div class="flex flex-col gap-3 mb-4">
    <!-- Search input row -->
    <div class="relative flex-1">
      <UIcon name="i-lucide-search" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
      <input
        :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="searchPlaceholder"
        class="w-full pl-10 pr-10 py-2.5 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all duration-200 hover:border-zinc-300 bg-white"
      />
      <button 
        v-if="searchQuery"
        @click="$emit('update:searchQuery', '')"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
      >
        <UIcon name="i-lucide-x" class="w-4 h-4" />
      </button>
    </div>
    
    <!-- Filter dropdowns row - responsive grid -->
    <div class="flex flex-wrap gap-2 sm:gap-2.5">
      <slot name="filters" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searchQuery: string;
  searchPlaceholder?: string;
}>();

defineEmits<{
  (e: 'update:searchQuery', value: string): void;
}>();
</script>

<style scoped>
/* Ensure slot content (select dropdowns) have consistent styling */
:deep(select) {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s;
  background-color: white;
  min-width: 0;
  flex-shrink: 1;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.25em 1.25em;
}

:deep(select:hover) {
  border-color: #d4d4d8;
}

:deep(select:focus) {
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

@media (min-width: 640px) {
  :deep(select) {
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}
</style>
