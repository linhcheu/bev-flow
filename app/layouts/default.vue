<template>
  <div class="flex min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-200">
    <!-- Sidebar Component -->
    <AppSidebar />
    
    <!-- Main Content -->
    <main class="flex-1 ml-64 min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-200">
      <slot />
    </main>
  </div>
</template>
