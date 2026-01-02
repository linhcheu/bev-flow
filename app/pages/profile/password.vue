<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-6 lg:mb-8">
        <NuxtLink to="/profile" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 mb-4 no-underline">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Profile
        </NuxtLink>
        <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Change Password</h1>
        <p class="mt-1 text-sm text-zinc-500">Update your password to keep your account secure</p>
      </div>

      <!-- Password Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-6">
          <div class="space-y-5">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-zinc-700 mb-2">Current Password</label>
              <div class="relative">
                <input
                  id="currentPassword"
                  v-model="form.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  required
                  placeholder="Enter current password"
                  class="w-full px-4 py-2.5 pr-12 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600"
                >
                  <UIcon :name="showCurrentPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label for="newPassword" class="block text-sm font-medium text-zinc-700 mb-2">New Password</label>
              <div class="relative">
                <input
                  id="newPassword"
                  v-model="form.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  required
                  minlength="8"
                  placeholder="Enter new password"
                  class="w-full px-4 py-2.5 pr-12 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600"
                >
                  <UIcon :name="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" />
                </button>
              </div>
              <p class="mt-1.5 text-xs text-zinc-500">Must be at least 8 characters</p>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-zinc-700 mb-2">Confirm New Password</label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  placeholder="Confirm new password"
                  class="w-full px-4 py-2.5 pr-12 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600"
                >
                  <UIcon :name="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Password Requirements -->
          <div class="mt-6 pt-6 border-t border-zinc-100">
            <p class="text-sm font-medium text-zinc-700 mb-3">Password Requirements:</p>
            <ul class="space-y-2">
              <li :class="['flex items-center gap-2 text-sm', form.newPassword.length >= 8 ? 'text-emerald-600' : 'text-zinc-500']">
                <UIcon :name="form.newPassword.length >= 8 ? 'i-lucide-check-circle' : 'i-lucide-circle'" class="w-4 h-4" />
                At least 8 characters
              </li>
              <li :class="['flex items-center gap-2 text-sm', /[A-Z]/.test(form.newPassword) ? 'text-emerald-600' : 'text-zinc-500']">
                <UIcon :name="/[A-Z]/.test(form.newPassword) ? 'i-lucide-check-circle' : 'i-lucide-circle'" class="w-4 h-4" />
                One uppercase letter
              </li>
              <li :class="['flex items-center gap-2 text-sm', /[0-9]/.test(form.newPassword) ? 'text-emerald-600' : 'text-zinc-500']">
                <UIcon :name="/[0-9]/.test(form.newPassword) ? 'i-lucide-check-circle' : 'i-lucide-circle'" class="w-4 h-4" />
                One number
              </li>
              <li :class="['flex items-center gap-2 text-sm', passwordsMatch ? 'text-emerald-600' : 'text-zinc-500']">
                <UIcon :name="passwordsMatch ? 'i-lucide-check-circle' : 'i-lucide-circle'" class="w-4 h-4" />
                Passwords match
              </li>
            </ul>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700 flex items-center gap-2">
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4" />
            {{ error }}
          </p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p class="text-sm text-emerald-700 flex items-center gap-2">
            <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
            Password updated successfully!
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
            type="submit"
            :disabled="loading || !isFormValid"
            class="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const router = useRouter();

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref(false);

const passwordsMatch = computed(() => {
  return form.value.newPassword && form.value.confirmPassword && form.value.newPassword === form.value.confirmPassword;
});

const isFormValid = computed(() => {
  return form.value.currentPassword &&
    form.value.newPassword.length >= 8 &&
    /[A-Z]/.test(form.value.newPassword) &&
    /[0-9]/.test(form.value.newPassword) &&
    passwordsMatch.value;
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;
  
  loading.value = true;
  error.value = '';
  success.value = false;
  
  try {
    await $fetch('/api/profile/password', {
      method: 'PUT',
      body: {
        currentPassword: form.value.currentPassword,
        newPassword: form.value.newPassword,
      },
    });
    
    // Redirect to profile page after successful password change
    router.push('/profile');
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Failed to update password';
  } finally {
    loading.value = false;
  }
};
</script>
