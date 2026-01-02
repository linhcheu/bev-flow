<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Ensure light mode (remove dark class if present)
if (process.client) {
  document.documentElement.classList.remove('dark');
  localStorage.removeItem('theme');
}
</script>

