<template>
  <div class="flex min-h-screen bg-zinc-50">
    <!-- Mobile Overlay -->
    <div 
      v-if="isMobileOpen" 
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="closeMobileSidebar"
    ></div>
    
    <!-- Sidebar Component -->
    <AppSidebar />
    
    <!-- Main Content -->
    <main 
      :class="[
        'flex-1 min-h-screen bg-zinc-50 transition-all duration-300',
        isExpanded ? 'lg:ml-64' : 'lg:ml-20',
        'ml-0'
      ]"
    >
      <!-- Mobile Header -->
      <header class="lg:hidden sticky top-0 z-30 bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
        <button 
          @click="toggleMobileSidebar"
          class="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
        >
          <UIcon name="i-lucide-menu" class="w-5 h-5" />
        </button>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg overflow-hidden border border-zinc-200">
            <img src="/images/logo-2.png" alt="BEV Flow" class="w-full h-full object-cover" />
          </div>
          <span class="font-semibold text-zinc-900">BEV Flow</span>
        </div>
        <div class="w-9"></div>
      </header>
      
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { isExpanded, isMobileOpen, toggleMobileSidebar, closeMobileSidebar } = useSidebar();
</script>
