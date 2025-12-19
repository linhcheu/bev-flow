<template>
  <div class="flex min-h-screen bg-zinc-50">
    <!-- Sidebar Component -->
    <AppSidebar />
    
    <!-- Main Content -->
    <main class="flex-1 ml-64 min-h-screen">
      <slot />
    </main>
  </div>
</template>
