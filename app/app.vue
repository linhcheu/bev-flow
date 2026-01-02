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

// Hide loading screen when app is mounted
onMounted(() => {
  // Mark app as ready to show content
  const nuxtEl = document.getElementById('__nuxt');
  if (nuxtEl) {
    nuxtEl.classList.add('app-ready');
  }
  
  const loadingEl = document.getElementById('app-loading');
  if (loadingEl) {
    // Small delay to ensure smooth transition
    setTimeout(() => {
      loadingEl.classList.add('hide');
      // Remove from DOM after animation
      setTimeout(() => {
        loadingEl.remove();
      }, 300);
    }, 100);
  }
});
</script>