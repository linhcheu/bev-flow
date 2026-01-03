<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-6 lg:mb-8">
        <NuxtLink to="/profile" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 mb-4 no-underline">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Profile
        </NuxtLink>
        <h1 class="text-xl sm:text-2xl font-semibold text-zinc-900">Edit Profile</h1>
        <p class="mt-1 text-sm text-zinc-500">Update your personal information</p>
      </div>

      <!-- Edit Form -->
      <div v-if="pageLoading" class="flex items-center justify-center py-12">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-amber-500 animate-spin" />
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div class="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6">
          <!-- Profile Picture -->
          <div class="mb-6 pb-6 border-b border-zinc-100">
            <label class="block text-sm font-medium text-zinc-700 mb-3">Profile Picture</label>
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-zinc-200 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <UIcon name="i-lucide-user" class="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
              </div>
              <div>
                <button type="button" class="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors">
                  Change Photo
                </button>
                <p class="mt-1 text-[10px] sm:text-xs text-zinc-500">JPG, PNG or GIF. Max 2MB</p>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="space-y-4 sm:space-y-5">
            <div>
              <label for="name" class="block text-sm font-medium text-zinc-700 mb-2">Full Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 sm:px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-zinc-700 mb-2">Email Address</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                disabled
                class="w-full px-3 sm:px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-500 cursor-not-allowed"
              />
              <p class="mt-1 text-[10px] sm:text-xs text-zinc-400">Email cannot be changed</p>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-zinc-700 mb-2">Phone Number</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="+855 XX XXX XXXX"
                class="w-full px-3 sm:px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>

            <div>
              <label for="location" class="block text-sm font-medium text-zinc-700 mb-2">Location</label>
              <input
                id="location"
                v-model="form.location"
                type="text"
                placeholder="City, Country"
                class="w-full px-3 sm:px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>

            <!-- Role Selection - Only visible to System Administrators -->
            <div>
              <label for="role" class="block text-sm font-medium text-zinc-700 mb-2">
                Role
                <span v-if="!canChangeRole" class="text-xs text-zinc-400 ml-1">(Read only)</span>
              </label>
              <select
                v-if="canChangeRole"
                id="role"
                v-model="form.role"
                class="w-full px-3 sm:px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              >
                <option value="System Administrator">System Administrator</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
              <div v-else class="w-full px-3 sm:px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-500 cursor-not-allowed flex items-center gap-2">
                <UIcon name="i-lucide-shield" class="w-4 h-4" />
                {{ form.role }}
              </div>
              <p v-if="!canChangeRole" class="mt-1 text-[10px] sm:text-xs text-zinc-400">
                Only System Administrators can change roles
              </p>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p class="text-xs sm:text-sm text-emerald-700 flex items-center gap-2">
            <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
            Profile updated successfully!
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700 flex items-center gap-2">
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4" />
            {{ error }}
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
            :disabled="loading"
            class="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2"
          >
            <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const { permissions, fetchUserRole } = usePermissions();

// Check if current user can change roles (only System Admin)
const canChangeRole = computed(() => permissions.value.canChangeRoles);

const form = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  role: 'Staff',
});

const loading = ref(false);
const pageLoading = ref(true);
const success = ref(false);
const error = ref('');

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  joinDate?: string;
  lastLogin?: string;
  isActive?: boolean;
}

// Fetch current profile data
const fetchProfile = async () => {
  pageLoading.value = true;
  try {
    const data = await $fetch<ProfileData>('/api/profile');
    form.value = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      role: data.role,
    };
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Failed to load profile';
  } finally {
    pageLoading.value = false;
  }
};

onMounted(async () => {
  await fetchUserRole();
  await fetchProfile();
});

const handleSubmit = async () => {
  loading.value = true;
  success.value = false;
  error.value = '';
  
  try {
    // Build the update payload - only include role if user can change it
    const payload: Record<string, string> = {
      name: form.value.name,
      phone: form.value.phone,
      location: form.value.location,
    };
    
    // Only System Administrators can change roles
    if (canChangeRole.value) {
      payload.role = form.value.role;
    }
    
    await $fetch('/api/profile', {
      method: 'PUT',
      body: payload,
    });
    
    // Redirect to profile page after successful save
    router.push('/profile');
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Failed to update profile';
  } finally {
    loading.value = false;
  }
};
</script>
