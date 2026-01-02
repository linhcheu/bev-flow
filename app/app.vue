<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Remove dark mode on client
if (import.meta.client) {
  document.documentElement.classList.remove('dark');
  localStorage.removeItem('theme');
}
</script>