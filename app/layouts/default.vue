<template>
  <div class="flex min-h-screen bg-zinc-50">
    <!-- Mobile Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isMobileOpen" 
        class="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        @click="closeMobileSidebar"
      ></div>
    </Transition>
    
    <!-- Sidebar Component -->
    <AppSidebar />
    
    <!-- Main Content -->
    <main 
      :class="[
        'flex-1 min-h-screen min-w-0 bg-zinc-50 overflow-x-hidden',
        'transition-[margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
        isExpanded ? 'lg:ml-64' : 'lg:ml-20',
        'ml-0'
      ]"
    >
      <!-- Mobile Header -->
      <header class="lg:hidden sticky top-0 z-30 bg-white border-b border-zinc-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
        <button 
          @click="toggleMobileSidebar"
          class="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
        >
          <UIcon name="i-lucide-menu" class="w-5 h-5" />
        </button>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
            <img src="/images/logo-1.png" alt="BEV Flow" class="w-full h-full object-cover" />
          </div>
          <span class="font-semibold text-zinc-900 text-sm sm:text-base">BEV Flow</span>
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
