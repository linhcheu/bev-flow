<template>
  <div class="flex flex-col sm:flex-row gap-3 mb-4">
    <!-- Search input -->
    <div class="relative flex-1">
      <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
      <input
        :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="searchPlaceholder"
        class="w-full pl-10 pr-10 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-colors"
      />
      <button 
        v-if="searchQuery"
        @click="$emit('update:searchQuery', '')"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
      >
        <UIcon name="i-lucide-x" class="w-4 h-4" />
      </button>
    </div>
    
    <!-- Filter dropdowns -->
    <div class="flex flex-wrap gap-2">
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
