<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-user-circle" class="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Profile</h1>
            <p class="text-xs sm:text-sm text-zinc-500">Your account information</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/profile/edit"
            class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
          >
            <UIcon name="i-lucide-edit-2" class="w-3.5 h-3.5" />
            Edit Profile
          </NuxtLink>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-amber-500 animate-spin" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-700 flex items-center gap-2">
          <UIcon name="i-lucide-alert-circle" class="w-4 h-4" />
          {{ error }}
        </p>
      </div>

      <div v-else class="space-y-3 sm:space-y-4">
        <!-- Profile Card -->
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-6">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-5 text-center sm:text-left">
            <!-- Avatar -->
            <div class="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 shrink-0 flex items-center justify-center">
              <img v-if="profile.profileImage" :src="profile.profileImage" alt="Profile" class="w-full h-full object-cover" />
              <span v-else class="text-xl sm:text-2xl font-semibold text-zinc-400">{{ initials }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-base sm:text-lg font-semibold text-zinc-900">{{ profile.name }}</h2>
              <p class="text-xs sm:text-sm text-zinc-500 mb-2">{{ profile.email }}</p>
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span :class="[
                  'inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-md',
                  profile.role === 'System Administrator' ? 'bg-amber-100 text-amber-700' :
                  profile.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                  'bg-zinc-100 text-zinc-700'
                ]">
                  <UIcon :name="profile.role === 'System Administrator' ? 'i-lucide-shield' : profile.role === 'Manager' ? 'i-lucide-briefcase' : 'i-lucide-user'" class="w-3 h-3" />
                  {{ profile.role }}
                </span>
                <span class="inline-flex items-center gap-1 text-[10px] sm:text-xs text-zinc-400">
                  <UIcon name="i-lucide-shield-check" class="w-3 h-3 text-emerald-500" />
                  Active
                </span>
                <span class="text-[10px] sm:text-xs text-zinc-400">Member since {{ profile.joinDate }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 class="text-xs sm:text-sm font-medium text-zinc-900 mb-3 sm:mb-4">Contact Information</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-mail" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] sm:text-xs text-zinc-500">Email</p>
                <p class="text-xs sm:text-sm text-zinc-900 truncate">{{ profile.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-phone" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] sm:text-xs text-zinc-500">Phone</p>
                <p class="text-xs sm:text-sm text-zinc-900">{{ profile.phone }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 sm:gap-3 sm:col-span-2">
              <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-map-pin" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] sm:text-xs text-zinc-500">Location</p>
                <p class="text-xs sm:text-sm text-zinc-900">{{ profile.location }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Session & Quick Actions -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <!-- Session Info -->
          <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 class="text-xs sm:text-sm font-medium text-zinc-900 mb-3">Session</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] sm:text-xs text-zinc-500">Duration</span>
                <span class="text-[10px] sm:text-xs font-medium text-zinc-700">7 days</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[10px] sm:text-xs text-zinc-500">Expires</span>
                <span class="text-[10px] sm:text-xs font-medium text-amber-600">{{ sessionExpiry }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[10px] sm:text-xs text-zinc-500">Last Login</span>
                <span class="text-[10px] sm:text-xs font-medium text-zinc-700">{{ profile.lastLogin }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 class="text-xs sm:text-sm font-medium text-zinc-900 mb-3">Quick Actions</h3>
            <div class="space-y-2">
              <NuxtLink
                to="/profile/password"
                class="flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-lg hover:bg-zinc-100 no-underline transition-colors group"
              >
                <UIcon name="i-lucide-key" class="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-700" />
                <span class="text-xs sm:text-sm text-zinc-700">Change Password</span>
              </NuxtLink>
              <NuxtLink
                to="/profile/settings"
                class="flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-lg hover:bg-zinc-100 no-underline transition-colors group"
              >
                <UIcon name="i-lucide-settings" class="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-700" />
                <span class="text-xs sm:text-sm text-zinc-700">Account Settings</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const profile = ref({
  name: '',
  role: '',
  email: '',
  phone: '',
  location: '',
  joinDate: '',
  lastLogin: '',
  profileImage: null as string | null,
});

const loading = ref(true);
const error = ref('');

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  joinDate: string;
  lastLogin: string;
  profileImage?: string | null;
  isActive?: boolean;
}

const initials = computed(() => {
  const name = profile.value.name || '';
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const fetchProfile = async () => {
  loading.value = true;
  error.value = '';

  try {
    const data = await $fetch<ProfileData>('/api/profile');
    profile.value = {
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone,
      location: data.location,
      joinDate: data.joinDate,
      lastLogin: data.lastLogin,
      profileImage: data.profileImage || null,
    };
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Failed to load profile';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});

const sessionExpiry = computed(() => {
  if (process.client) {
    const expiry = localStorage.getItem('tokenExpiry');
    if (expiry) {
      const expiryDate = new Date(parseInt(expiry));
      return expiryDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }
  return 'N/A';
});
</script>
