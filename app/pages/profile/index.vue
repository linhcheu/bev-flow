<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-6 lg:mb-8">
        <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Profile</h1>
        <p class="mt-1 text-sm text-zinc-500">Manage your account settings and preferences</p>
      </div>

      <!-- Profile Content -->
      <div class="space-y-4 sm:space-y-6">
        <!-- Profile Card -->
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
            <div class="w-20 h-20 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 shrink-0">
              <img src="/images/logo-2.png" alt="Profile" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-zinc-900">{{ profile.name }}</h2>
              <p class="text-sm text-zinc-500 mb-3">{{ profile.role }}</p>
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
                <span class="inline-flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-md">
                  <UIcon name="i-lucide-shield-check" class="w-3.5 h-3.5 text-emerald-500" />
                  Active
                </span>
                <span class="text-xs text-zinc-400">Member since {{ profile.joinDate }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-6">
          <h3 class="text-sm font-medium text-zinc-900 mb-4">Contact Information</h3>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-mail" class="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p class="text-xs text-zinc-500">Email</p>
                <p class="text-sm text-zinc-900">{{ profile.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-phone" class="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p class="text-xs text-zinc-500">Phone</p>
                <p class="text-sm text-zinc-900">{{ profile.phone }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p class="text-xs text-zinc-500">Location</p>
                <p class="text-sm text-zinc-900">{{ profile.location }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- System Information -->
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-6">
          <h3 class="text-sm font-medium text-zinc-900 mb-4">System Information</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between py-2 border-b border-zinc-100">
              <span class="text-sm text-zinc-500">System Name</span>
              <span class="text-sm font-medium text-zinc-900">BEV Flow</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-zinc-100">
              <span class="text-sm text-zinc-500">Version</span>
              <span class="text-sm font-medium text-zinc-900">1.0.0</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-zinc-100">
              <span class="text-sm text-zinc-500">Last Login</span>
              <span class="text-sm font-medium text-zinc-900">{{ profile.lastLogin }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-zinc-100">
              <span class="text-sm text-zinc-500">Session Expires</span>
              <span class="text-sm font-medium text-amber-600">{{ sessionExpiry }}</span>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-sm text-zinc-500">Account Type</span>
              <span class="text-sm font-medium text-amber-600">Administrator</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-6">
          <h3 class="text-sm font-medium text-zinc-900 mb-4">Account Actions</h3>
          <div class="flex flex-col sm:flex-row flex-wrap gap-3">
            <NuxtLink 
              to="/profile/edit" 
              class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 no-underline"
            >
              <UIcon name="i-lucide-edit-2" class="w-4 h-4" />
              Edit Profile
            </NuxtLink>
            <NuxtLink 
              to="/profile/password" 
              class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-200 no-underline"
            >
              <UIcon name="i-lucide-key" class="w-4 h-4" />
              Change Password
            </NuxtLink>
            <NuxtLink 
              to="/profile/settings" 
              class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-200 no-underline"
            >
              <UIcon name="i-lucide-settings" class="w-4 h-4" />
              Settings
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const profile = ref({
  name: 'Admin User',
  role: 'System Administrator',
  email: 'admin@bevflow.com',
  phone: '+855 23 456 7890',
  location: 'Phnom Penh, Cambodia',
  joinDate: 'January 2024',
  lastLogin: 'Today at 9:30 AM',
});

const sessionExpiry = computed(() => {
  if (process.client) {
    const expiry = localStorage.getItem('tokenExpiry');
    if (expiry) {
      const expiryDate = new Date(parseInt(expiry));
      return expiryDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  }
  return 'N/A';
});
</script>
