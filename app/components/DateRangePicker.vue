<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      :class="[
        'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-lg transition-all duration-200',
        'focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none',
        isOpen 
          ? 'border-amber-500 bg-amber-50/50' 
          : 'border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300'
      ]"
    >
      <div class="w-6 h-6 sm:w-7 sm:h-7 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-calendar-range" class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-600" />
      </div>
      <span v-if="displayText" class="text-zinc-700 font-medium truncate max-w-[80px] sm:max-w-[140px]">{{ displayText }}</span>
      <span v-else class="text-zinc-400">Dates</span>
      <UIcon name="i-lucide-chevron-down" :class="['w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 transition-transform duration-200 shrink-0', isOpen && 'rotate-180']" />
    </button>
    
    <!-- Dropdown - Mobile optimized (full width on mobile) -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div 
        v-if="isOpen"
        class="fixed sm:absolute inset-x-3 sm:inset-x-auto bottom-3 sm:bottom-auto sm:top-full sm:right-0 sm:mt-2 bg-white border border-zinc-200 rounded-lg shadow-xl p-4 sm:p-4 sm:w-[300px] z-50"
      >
        <!-- Mobile Header -->
        <div class="flex items-center justify-between mb-3 pb-3 border-b border-zinc-100 sm:hidden">
          <span class="text-sm font-semibold text-zinc-800">Select Date Range</span>
          <button type="button" @click="isOpen = false" class="p-1 hover:bg-zinc-100 rounded-lg">
            <UIcon name="i-lucide-x" class="w-4 h-4 text-zinc-500" />
          </button>
        </div>
        
        <!-- Quick Select - compact grid for mobile -->
        <div class="grid grid-cols-3 gap-1.5 mb-3 pb-3 border-b border-zinc-100">
          <button 
            v-for="preset in presets" 
            :key="preset.label"
            @click="applyPreset(preset)"
            :class="[
              'px-2 py-1.5 text-[10px] sm:text-xs font-medium rounded-lg transition-all duration-200 text-center',
              isPresetActive(preset)
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-amber-50 hover:text-amber-700'
            ]"
          >
            {{ preset.label }}
          </button>
        </div>
        
        <!-- Custom Date Range - stacked on mobile -->
        <div class="space-y-2.5">
          <div>
            <label class="block text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">From</label>
            <input 
              type="date" 
              v-model="fromDate"
              :max="toDate || undefined"
              class="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-zinc-50 hover:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">To</label>
            <input 
              type="date" 
              v-model="toDate"
              :min="fromDate || undefined"
              :max="today"
              class="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-zinc-50 hover:bg-white transition-colors"
            />
          </div>
        </div>
        
        <!-- Actions - compact for mobile -->
        <div class="flex justify-between items-center mt-3 pt-3 border-t border-zinc-100">
          <button 
            @click="clearDates"
            class="text-[10px] sm:text-xs text-zinc-500 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <UIcon name="i-lucide-x" class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Clear
          </button>
          <div class="flex gap-1.5 sm:gap-2">
            <button 
              @click="isOpen = false"
              class="px-3 sm:px-3 py-2 sm:py-2 text-xs sm:text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="applyDates"
              class="px-3 sm:px-3 py-2 sm:py-2 text-xs sm:text-xs font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Backdrop (visible on mobile for full-screen picker) -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black/30 sm:bg-transparent z-40" 
        @click="isOpen = false"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: { from: string | null; to: string | null };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: { from: string | null; to: string | null }): void;
}>();

const isOpen = ref(false);
const fromDate = ref<string | null>(props.modelValue?.from || null);
const toDate = ref<string | null>(props.modelValue?.to || null);

const today = computed(() => new Date().toISOString().split('T')[0]);

const displayText = computed(() => {
  if (!props.modelValue?.from && !props.modelValue?.to) return '';
  if (props.modelValue?.from && props.modelValue?.to) {
    const from = new Date(props.modelValue.from);
    const to = new Date(props.modelValue.to);
    return `${formatDate(from)} - ${formatDate(to)}`;
  }
  if (props.modelValue?.from) {
    return `From ${formatDate(new Date(props.modelValue.from))}`;
  }
  return `Until ${formatDate(new Date(props.modelValue.to!))}`;
});

const presets = [
  { label: 'Today', days: 0 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: 'This year', days: -1 },
  { label: 'All', days: -2 },
];

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isPresetActive = (preset: { label: string; days: number }) => {
  if (!props.modelValue?.from && !props.modelValue?.to) {
    return preset.days === -2; // All time
  }
  return false; // Simplified - just highlight "All" when no dates selected
};

const applyPreset = (preset: { label: string; days: number }) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  toDate.value = todayStr ?? null;
  
  if (preset.days === -2) {
    fromDate.value = null;
    toDate.value = null;
  } else if (preset.days === -1) {
    fromDate.value = `${now.getFullYear()}-01-01`;
  } else if (preset.days === 0) {
    fromDate.value = todayStr ?? null;
  } else {
    const from = new Date(now);
    from.setDate(from.getDate() - preset.days);
    const fromStr = from.toISOString().split('T')[0];
    fromDate.value = fromStr ?? null;
  }
  
  applyDates();
};

const applyDates = () => {
  emit('update:modelValue', { from: fromDate.value, to: toDate.value });
  isOpen.value = false;
};

const clearDates = () => {
  fromDate.value = null;
  toDate.value = null;
  emit('update:modelValue', { from: null, to: null });
  isOpen.value = false;
};

watch(() => props.modelValue, (newVal) => {
  fromDate.value = newVal?.from || null;
  toDate.value = newVal?.to || null;
}, { deep: true });
</script>
