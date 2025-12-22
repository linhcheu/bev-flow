import { ref, computed } from 'vue';

export type Theme = 'light' | 'dark';

const theme = ref<Theme>('dark');
const isInitialized = ref(false);

// Apply theme to HTML element
const applyTheme = (newTheme: Theme) => {
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
};

// Initialize theme on first import
if (typeof window !== 'undefined' && !isInitialized.value) {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  theme.value = savedTheme || 'dark';
  applyTheme(theme.value);
  isInitialized.value = true;
}

export const useTheme = () => {
  const toggleTheme = () => {
    const newTheme = theme.value === 'dark' ? 'light' : 'dark';
    theme.value = newTheme;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    }
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    }
  };

  return {
    theme: computed(() => theme.value),
    toggleTheme,
    setTheme,
  };
};

