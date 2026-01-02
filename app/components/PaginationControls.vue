<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 px-4 border-t border-zinc-200 bg-zinc-50/50">
    <!-- Items count info -->
    <div class="text-xs sm:text-sm text-zinc-500">
      Showing <span class="font-medium text-zinc-700">{{ startItem }}</span> to 
      <span class="font-medium text-zinc-700">{{ endItem }}</span> of 
      <span class="font-medium text-zinc-700">{{ totalItems }}</span> results
    </div>
    
    <!-- Pagination controls -->
    <div class="flex items-center gap-1">
      <!-- First page (hold for fast) -->
      <button 
        @click="$emit('first')"
        @mousedown="startHold('first')"
        @mouseup="stopHold"
        @mouseleave="stopHold"
        @touchstart.prevent="startHold('first')"
        @touchend="stopHold"
        :disabled="currentPage === 1"
        class="p-1.5 sm:p-2 rounded-lg border border-zinc-200 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="First page (hold for fast scroll)"
      >
        <UIcon name="i-lucide-chevrons-left" class="w-4 h-4 text-zinc-600" />
      </button>
      
      <!-- Previous page (hold for fast) -->
      <button 
        @click="$emit('prev')"
        @mousedown="startHold('prev')"
        @mouseup="stopHold"
        @mouseleave="stopHold"
        @touchstart.prevent="startHold('prev')"
        @touchend="stopHold"
        :disabled="currentPage === 1"
        class="p-1.5 sm:p-2 rounded-lg border border-zinc-200 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Previous page (hold for fast scroll)"
      >
        <UIcon name="i-lucide-chevron-left" class="w-4 h-4 text-zinc-600" />
      </button>
      
      <!-- Page numbers - Desktop -->
      <div class="hidden sm:flex items-center gap-1">
        <template v-for="page in visiblePages" :key="page">
          <span v-if="page === -1" class="px-2 text-zinc-400">...</span>
          <button 
            v-else
            @click="$emit('goto', page)"
            :class="[
              'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors',
              page === currentPage 
                ? 'bg-amber-500 text-white shadow-sm' 
                : 'border border-zinc-200 hover:bg-zinc-100 text-zinc-700'
            ]"
          >
            {{ page }}
          </button>
        </template>
      </div>
      
      <!-- Page numbers - Mobile (horizontal scroll) -->
      <div class="sm:hidden flex items-center">
        <div 
          class="flex items-center gap-1 overflow-x-auto max-w-[180px] px-1 scrollbar-thin"
          ref="mobileScrollRef"
        >
          <template v-for="page in allPages" :key="page">
            <button 
              @click="$emit('goto', page)"
              :ref="el => { if (page === currentPage) currentPageRef = el as HTMLElement }"
              :class="[
                'min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0',
                page === currentPage 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'border border-zinc-200 hover:bg-zinc-100 text-zinc-700'
              ]"
            >
              {{ page }}
            </button>
          </template>
        </div>
      </div>
      
      <!-- Next page (hold for fast) -->
      <button 
        @click="$emit('next')"
        @mousedown="startHold('next')"
        @mouseup="stopHold"
        @mouseleave="stopHold"
        @touchstart.prevent="startHold('next')"
        @touchend="stopHold"
        :disabled="currentPage === totalPages"
        class="p-1.5 sm:p-2 rounded-lg border border-zinc-200 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Next page (hold for fast scroll)"
      >
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-zinc-600" />
      </button>
      
      <!-- Last page (hold for fast) -->
      <button 
        @click="$emit('last')"
        @mousedown="startHold('last')"
        @mouseup="stopHold"
        @mouseleave="stopHold"
        @touchstart.prevent="startHold('last')"
        @touchend="stopHold"
        :disabled="currentPage === totalPages"
        class="p-1.5 sm:p-2 rounded-lg border border-zinc-200 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Last page (hold for fast scroll)"
      >
        <UIcon name="i-lucide-chevrons-right" class="w-4 h-4 text-zinc-600" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  visiblePages: number[];
}>();

const emit = defineEmits(['first', 'prev', 'next', 'last', 'goto']);

// Generate all page numbers for mobile scroll
const allPages = computed(() => {
  return Array.from({ length: props.totalPages }, (_, i) => i + 1);
});

// Hold for fast scroll
const holdInterval = ref<ReturnType<typeof setInterval> | null>(null);
const holdTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const mobileScrollRef = ref<HTMLElement | null>(null);
const currentPageRef = ref<HTMLElement | null>(null);

const startHold = (action: 'first' | 'prev' | 'next' | 'last') => {
  // Wait 300ms before starting rapid fire
  holdTimeout.value = setTimeout(() => {
    holdInterval.value = setInterval(() => {
      if (action === 'first' || action === 'prev') {
        emit('prev');
      } else {
        emit('next');
      }
    }, 80); // Fast scroll every 80ms
  }, 300);
};

const stopHold = () => {
  if (holdTimeout.value) {
    clearTimeout(holdTimeout.value);
    holdTimeout.value = null;
  }
  if (holdInterval.value) {
    clearInterval(holdInterval.value);
    holdInterval.value = null;
  }
};

// Scroll current page into view on mobile
watch(() => props.currentPage, () => {
  nextTick(() => {
    if (currentPageRef.value && mobileScrollRef.value) {
      currentPageRef.value.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest', 
        inline: 'center' 
      });
    }
  });
});

onUnmounted(() => {
  stopHold();
});
</script>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #d4d4d8 transparent;
}
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d4d4d8;
  border-radius: 2px;
}
</style>
