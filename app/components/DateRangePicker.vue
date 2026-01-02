<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 text-sm border border-zinc-200 rounded-lg hover:bg-zinc-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-colors"
    >
      <UIcon name="i-lucide-calendar" class="w-4 h-4 text-zinc-400" />
      <span v-if="displayText" class="text-zinc-700">{{ displayText }}</span>
      <span v-else class="text-zinc-400">Select dates</span>
      <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-zinc-400" />
    </button>
    
    <!-- Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div 
        v-if="isOpen"
        class="absolute z-50 top-full left-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-xl p-4 min-w-[320px]"
      >
        <!-- Quick Select -->
        <div class="flex flex-wrap gap-2 mb-4 pb-4 border-b border-zinc-100">
          <button 
            v-for="preset in presets" 
            :key="preset.label"
            @click="applyPreset(preset)"
            class="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-colors"
          >
            {{ preset.label }}
          </button>
        </div>
        
        <!-- Custom Date Range -->
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-zinc-600 mb-1">From</label>
            <input 
              type="date" 
              v-model="fromDate"
              :max="toDate || undefined"
              class="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-zinc-600 mb-1">To</label>
            <input 
              type="date" 
              v-model="toDate"
              :min="fromDate || undefined"
              :max="today"
              class="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            />
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-zinc-100">
          <button 
            @click="clearDates"
            class="text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            Clear
          </button>
          <div class="flex gap-2">
            <button 
              @click="isOpen = false"
              class="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="applyDates"
              class="px-3 py-1.5 text-xs font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Backdrop -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-40" 
      @click="isOpen = false"
    ></div>
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
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This year', days: -1 },
  { label: 'All time', days: -2 },
];

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
