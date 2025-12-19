import { ref, computed } from 'vue';

export interface Profile {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  bio: string;
  imagePreview: string;
}

const profile = ref<Profile>({
  name: 'Diet Lam',
  email: 'diet.lam@bevflow.com',
  phone: '+1 (555) 123-4567',
  role: 'Administrator',
  department: 'Operations',
  bio: 'Passionate about beverage supply chain management and optimization.',
  imagePreview: '',
});

export const useProfile = () => {
  const initials = computed(() => {
    if (!profile.value.name) return 'U';
    const names = profile.value.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  });

  const updateProfile = (data: Partial<Profile>) => {
    profile.value = { ...profile.value, ...data };
  };

  const resetProfile = (originalData: Profile) => {
    profile.value = { ...originalData };
  };

  return {
    profile,
    initials,
    updateProfile,
    resetProfile,
  };
};
