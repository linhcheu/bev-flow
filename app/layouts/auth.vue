<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Initialize theme on auth layout mount
onMounted(() => {
  const { theme } = useTheme();
  // This ensures the theme is applied immediately
});
</script>
