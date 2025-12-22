<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-lg transition-colors duration-200 hover:bg-zinc-200 dark:hover:bg-zinc-800"
    :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <UIcon 
      v-if="theme === 'dark'" 
      name="i-lucide-sun" 
      class="w-5 h-5 text-amber-500"
    />
    <UIcon 
      v-else 
      name="i-lucide-moon" 
      class="w-5 h-5 text-zinc-700"
    />
  </button>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const { theme, toggleTheme } = useTheme();

// Debug: Log theme changes
watch(() => theme.value, (newTheme) => {
  console.log('Theme changed to:', newTheme);
});
</script>

