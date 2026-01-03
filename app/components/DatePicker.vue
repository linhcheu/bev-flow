<template>
  <div class="relative">
    <button 
      type="button"
      @click="isOpen = !isOpen"
      :class="[
        'flex items-center gap-2 w-full px-3 py-2.5 text-sm border rounded-lg transition-all duration-200',
        'focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none',
        isOpen 
          ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20' 
          : 'border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300',
        hasError ? 'border-red-400' : ''
      ]"
    >
      <div class="w-7 h-7 sm:w-8 sm:h-8 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-600" />
      </div>
      <span :class="[
        'text-xs sm:text-sm truncate',
        modelValue ? 'text-zinc-900 font-medium' : 'text-zinc-400'
      ]">
        {{ displayText }}
      </span>
      <UIcon 
        :name="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" 
        class="w-4 h-4 text-zinc-400 ml-auto transition-transform duration-200 shrink-0" 
      />
    </button>
    
    <!-- Dropdown - Mobile bottom sheet / Desktop dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2 sm:translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 sm:translate-y-1 scale-95"
    >
      <div 
        v-if="isOpen"
        :class="[
          'fixed sm:absolute z-50 bg-white border border-zinc-200 rounded-xl sm:rounded-lg shadow-xl p-4',
          'inset-x-3 sm:inset-x-auto bottom-3 sm:bottom-auto',
          'sm:left-0 sm:right-auto sm:min-w-[280px] sm:mt-2',
          dropdownPosition === 'top' ? 'sm:bottom-full sm:mb-2' : 'sm:top-full'
        ]"
      >
        <!-- Mobile Header -->
        <div class="flex items-center justify-between mb-3 pb-3 border-b border-zinc-100 sm:hidden">
          <span class="text-sm font-semibold text-zinc-800">Select Date</span>
          <button type="button" @click="isOpen = false" class="p-1 hover:bg-zinc-100 rounded-lg">
            <UIcon name="i-lucide-x" class="w-4 h-4 text-zinc-500" />
          </button>
        </div>
        
        <!-- Calendar Input -->
        <div class="space-y-2">
          <label class="hidden sm:block text-xs font-medium text-zinc-500 uppercase tracking-wider">Select Date</label>
          <input 
            ref="dateInput"
            type="date" 
            v-model="tempDate"
            :min="minDate"
            :max="maxDate"
            class="w-full px-4 py-3 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-zinc-50 hover:bg-white transition-colors"
          />
        </div>
        
        <!-- Actions -->
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-zinc-100">
          <button 
            type="button"
            @click="clearDate"
            class="text-xs text-zinc-500 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
            Clear
          </button>
          <div class="flex gap-2">
            <button 
              type="button"
              @click="isOpen = false"
              class="px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              @click="applyDate"
              class="px-3 py-2 text-xs font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Backdrop -->
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
const props = withDefaults(defineProps<{
  modelValue?: string | null;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  hasError?: boolean;
  dropdownPosition?: 'top' | 'bottom';
}>(), {
  placeholder: 'Select date',
  dropdownPosition: 'bottom'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
}>();

const isOpen = ref(false);
const tempDate = ref<string | null>(props.modelValue || null);
const dateInput = ref<HTMLInputElement | null>(null);

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  tempDate.value = newVal || null;
});

const displayText = computed(() => {
  if (!props.modelValue) return props.placeholder;
  const date = new Date(props.modelValue);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
});

const applyDate = () => {
  emit('update:modelValue', tempDate.value);
  isOpen.value = false;
};

const clearDate = () => {
  tempDate.value = null;
  emit('update:modelValue', null);
  isOpen.value = false;
};
</script>
