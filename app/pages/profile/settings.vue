<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-4 sm:mb-6 lg:mb-8">
        <NuxtLink to="/profile" class="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 hover:text-zinc-700 mb-3 sm:mb-4 no-underline transition-colors">
          <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Profile
        </NuxtLink>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-settings" class="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Settings</h1>
            <p class="text-xs sm:text-sm text-zinc-500">Account security and session information</p>
          </div>
        </div>
      </div>

      <div class="space-y-4 sm:space-y-6">

        <!-- ===================== SECURITY / SESSION ===================== -->
        <section class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-6">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-shield" class="w-4 h-4 text-zinc-500" />
            <h3 class="text-sm font-medium text-zinc-900">Security</h3>
          </div>
          <div class="space-y-4">
            <!-- Session Policy (Read-only) -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div class="min-w-0">
                <p class="text-sm text-zinc-900">Session Duration</p>
                <p class="text-xs text-zinc-500">Sessions last 7 days and automatically expire at midnight before every Monday</p>
              </div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-lg shrink-0">
                <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
                {{ sessionPolicy }}
              </span>
            </div>

            <!-- Current Session Expiry -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 pt-2 border-t border-zinc-100">
              <div class="min-w-0">
                <p class="text-sm text-zinc-900">Current Session Expires</p>
                <p class="text-xs text-zinc-500">You will be automatically logged out at this time</p>
              </div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg shrink-0">
                <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                {{ sessionExpiryDisplay }}
              </span>
            </div>

            <!-- Change Password -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 pt-2 border-t border-zinc-100">
              <div class="min-w-0">
                <p class="text-sm text-zinc-900">Password</p>
                <p class="text-xs text-zinc-500">Update your password regularly for better security</p>
              </div>
              <NuxtLink
                to="/profile/password"
                class="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-200 no-underline transition-colors sm:w-auto w-full"
              >
                <UIcon name="i-lucide-key" class="w-3.5 h-3.5" />
                Change Password
              </NuxtLink>
            </div>

            <!-- Sign Out All Sessions -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 pt-2 border-t border-zinc-100">
              <div class="min-w-0">
                <p class="text-sm text-zinc-900">Active Sessions</p>
                <p class="text-xs text-zinc-500">Sign out of all browser sessions including this one</p>
              </div>
              <button
                @click="handleLogoutAllSessions"
                :disabled="isLoggingOut"
                class="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 sm:w-auto w-full"
              >
                <UIcon v-if="isLoggingOut" name="i-lucide-loader-2" class="w-3.5 h-3.5 animate-spin" />
                <UIcon v-else name="i-lucide-log-out" class="w-3.5 h-3.5" />
                {{ isLoggingOut ? 'Signing out...' : 'Sign Out All' }}
              </button>
            </div>
          </div>
        </section>

        <!-- ===================== DANGER ZONE ===================== -->
        <section class="bg-white border border-red-200 rounded-lg p-4 sm:p-6">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 text-red-500" />
            <h3 class="text-sm font-medium text-red-600">Danger Zone</h3>
          </div>
          <div class="space-y-4">
            <!-- Delete Account -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div class="min-w-0">
                <p class="text-sm text-zinc-900">Delete Account</p>
                <p class="text-xs text-zinc-500">Permanently deactivate your account and all associated data</p>
              </div>
              <button
                @click="showDeleteConfirm = true"
                class="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors sm:w-auto w-full"
              >
                <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" />
                Delete Account
              </button>
            </div>
          </div>
        </section>

        <!-- Back button -->
        <div class="flex items-center justify-end pb-4">
          <NuxtLink
            to="/profile"
            class="inline-flex items-center justify-center px-4 py-2.5 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-200 no-underline transition-colors"
          >
            Back to Profile
          </NuxtLink>
        </div>
      </div>

      <!-- ===================== DELETE CONFIRM MODAL ===================== -->
      <Teleport to="body">
        <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showDeleteConfirm = false">
          <div class="bg-white rounded-xl p-5 sm:p-6 max-w-md w-full shadow-xl" @click.stop>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold text-zinc-900">Delete Account</h3>
                <p class="text-xs text-red-500">This action is irreversible</p>
              </div>
            </div>
            <p class="text-sm text-zinc-600 mb-4">
              Are you sure you want to permanently delete your account? All your data, settings, and history will be removed and cannot be recovered.
            </p>

            <!-- Confirmation Input -->
            <div class="mb-6">
              <label class="block text-xs font-medium text-zinc-700 mb-2">
                Type <span class="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-red-600">DELETE</span> to confirm
              </label>
              <input
                v-model="deleteConfirmText"
                type="text"
                placeholder="Type DELETE to confirm"
                class="w-full px-3 py-2.5 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                autocomplete="off"
                spellcheck="false"
              />
            </div>
            <div class="flex items-center justify-end gap-3">
              <button
                @click="closeDeleteModal"
                class="px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleDeleteAccount"
                :disabled="deleteConfirmText !== 'DELETE' || isDeleting"
                class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <UIcon v-if="isDeleting" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
                {{ isDeleting ? 'Deleting...' : 'Delete Account' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'default',
});

const router = useRouter();
const { sessionPolicy, getSessionExpiryDisplay } = useSettings();

const showDeleteConfirm = ref(false);
const deleteConfirmText = ref('');
const isDeleting = ref(false);
const isLoggingOut = ref(false);
const sessionExpiryDisplay = ref('N/A');

onMounted(() => {
  sessionExpiryDisplay.value = getSessionExpiryDisplay();
});

// Logout all sessions
const handleLogoutAllSessions = async () => {
  isLoggingOut.value = true;
  try {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');

    const authCookie = useCookie('isAuthenticated');
    const expiryCookie = useCookie('tokenExpiry');
    const userIdCookie = useCookie('userId');
    const userRoleCookie = useCookie('userRole');
    authCookie.value = null;
    expiryCookie.value = null;
    userIdCookie.value = null;
    userRoleCookie.value = null;

    await router.push('/login');
  } catch (err) {
    console.error('Failed to sign out:', err);
  } finally {
    isLoggingOut.value = false;
  }
};

// Delete account
const handleDeleteAccount = async () => {
  if (deleteConfirmText.value !== 'DELETE') return;

  isDeleting.value = true;
  try {
    await $fetch('/api/settings/delete-account', { method: 'DELETE' });

    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');

    const authCookie = useCookie('isAuthenticated');
    const expiryCookie = useCookie('tokenExpiry');
    const userIdCookie = useCookie('userId');
    const userRoleCookie = useCookie('userRole');
    authCookie.value = null;
    expiryCookie.value = null;
    userIdCookie.value = null;
    userRoleCookie.value = null;

    await router.push('/login');
  } catch (err: any) {
    closeDeleteModal();
    alert(err?.data?.statusMessage || 'Failed to delete account. Administrators cannot delete their own account.');
  } finally {
    isDeleting.value = false;
  }
};

const closeDeleteModal = () => {
  showDeleteConfirm.value = false;
  deleteConfirmText.value = '';
};
</script>
