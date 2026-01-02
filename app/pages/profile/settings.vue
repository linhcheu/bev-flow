<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-6 lg:mb-8">
        <NuxtLink to="/profile" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 mb-4 no-underline">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Profile
        </NuxtLink>
        <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Settings</h1>
        <p class="mt-1 text-sm text-zinc-500">Manage your preferences and account settings</p>
      </div>

      <!-- Settings Sections -->
      <div class="space-y-6">
        <!-- Notifications -->
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-6">
          <h3 class="text-sm font-medium text-zinc-900 mb-4">Notifications</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-zinc-900">Email Notifications</p>
                <p class="text-xs text-zinc-500">Receive email updates about your account</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="settings.emailNotifications" class="sr-only peer">
                <div class="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-zinc-900">Low Stock Alerts</p>
                <p class="text-xs text-zinc-500">Get notified when products are running low</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="settings.lowStockAlerts" class="sr-only peer">
                <div class="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-zinc-900">Order Updates</p>
                <p class="text-xs text-zinc-500">Receive notifications for purchase order status changes</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="settings.orderUpdates" class="sr-only peer">
                <div class="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Display -->
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-6">
          <h3 class="text-sm font-medium text-zinc-900 mb-4">Display</h3>
          <div class="space-y-4">
            <div>
              <label for="language" class="block text-sm text-zinc-900 mb-2">Language</label>
              <select
                id="language"
                v-model="settings.language"
                class="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              >
                <option value="en">English</option>
                <option value="km">ភាសាខ្មែរ (Khmer)</option>
                <option value="zh">中文 (Chinese)</option>
              </select>
            </div>
            
            <div>
              <label for="currency" class="block text-sm text-zinc-900 mb-2">Currency</label>
              <select
                id="currency"
                v-model="settings.currency"
                class="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              >
                <option value="USD">USD ($)</option>
                <option value="KHR">KHR (៛)</option>
              </select>
            </div>
            
            <div>
              <label for="dateFormat" class="block text-sm text-zinc-900 mb-2">Date Format</label>
              <select
                id="dateFormat"
                v-model="settings.dateFormat"
                class="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-6">
          <h3 class="text-sm font-medium text-zinc-900 mb-4">Security</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-zinc-900">Two-Factor Authentication</p>
                <p class="text-xs text-zinc-500">Add an extra layer of security to your account</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="settings.twoFactorAuth" class="sr-only peer">
                <div class="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-zinc-900">Session Timeout</p>
                <p class="text-xs text-zinc-500">Automatically log out after inactivity</p>
              </div>
              <select
                v-model="settings.sessionTimeout"
                class="px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="180">3 hours</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-white border border-red-200 rounded-lg p-4 sm:p-6">
          <h3 class="text-sm font-medium text-red-600 mb-4">Danger Zone</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p class="text-sm text-zinc-900">Delete Account</p>
                <p class="text-xs text-zinc-500">Permanently delete your account and all data</p>
              </div>
              <button 
                @click="showDeleteConfirm = true"
                class="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 w-full sm:w-auto"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p class="text-sm text-emerald-700 flex items-center gap-2">
            <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
            Settings saved successfully!
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3">
          <NuxtLink 
            to="/profile" 
            class="px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-200 no-underline"
          >
            Cancel
          </NuxtLink>
          <button
            @click="handleSave"
            :disabled="loading"
            class="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2"
          >
            <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            {{ loading ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-600" />
            </div>
            <h3 class="text-lg font-semibold text-zinc-900">Delete Account</h3>
          </div>
          <p class="text-sm text-zinc-500 mb-6">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
          </p>
          <div class="flex items-center justify-end gap-3">
            <button 
              @click="showDeleteConfirm = false"
              class="px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-200"
            >
              Cancel
            </button>
            <button 
              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const settings = ref({
  emailNotifications: true,
  lowStockAlerts: true,
  orderUpdates: true,
  language: 'en',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  twoFactorAuth: false,
  sessionTimeout: '60',
});

const loading = ref(false);
const success = ref(false);
const showDeleteConfirm = ref(false);

const handleSave = async () => {
  loading.value = true;
  success.value = false;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    success.value = true;
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      success.value = false;
    }, 3000);
  } finally {
    loading.value = false;
  }
};
</script>
