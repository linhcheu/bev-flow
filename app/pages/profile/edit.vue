<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div>
          <NuxtLink to="/profile" class="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 hover:text-zinc-700 mb-3 no-underline">
            <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Back to Profile
          </NuxtLink>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-edit-2" class="w-5 h-5 text-zinc-600" />
            </div>
            <div>
              <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Edit Profile</h1>
              <p class="text-xs sm:text-sm text-zinc-500">Update your personal information</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="pageLoading" class="flex items-center justify-center py-12">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-amber-500 animate-spin" />
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-3 sm:space-y-4">
        <!-- Profile Picture -->
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 class="text-xs sm:text-sm font-medium text-zinc-900 mb-3 sm:mb-4">Profile Picture</h3>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 flex items-center justify-center shrink-0">
              <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar preview" class="w-full h-full object-cover" />
              <span v-else class="text-xl sm:text-2xl font-semibold text-zinc-400">{{ initials }}</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="triggerFileInput"
                  :disabled="uploadingAvatar"
                  class="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  <span v-if="uploadingAvatar" class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-loader-2" class="w-3.5 h-3.5 animate-spin" />
                    Uploading...
                  </span>
                  <span v-else>Change Photo</span>
                </button>
                <button
                  v-if="avatarPreview"
                  type="button"
                  @click="removeAvatar"
                  class="px-3 py-1.5 bg-red-50 text-red-600 text-xs sm:text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
              </div>
              <p class="mt-1.5 text-[10px] sm:text-xs text-zinc-400">JPG, PNG, GIF or WebP. Max 500KB.</p>
              <p v-if="avatarError" class="mt-1 text-[10px] sm:text-xs text-red-500">{{ avatarError }}</p>
            </div>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              class="hidden"
              @change="handleFileSelect"
            />
          </div>
        </div>

        <!-- Personal Information -->
        <div class="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 class="text-xs sm:text-sm font-medium text-zinc-900 mb-3 sm:mb-4">Personal Information</h3>
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5">Full Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2.5 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>

            <div>
              <label for="email" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5">Email Address</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                disabled
                class="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-500 cursor-not-allowed"
              />
              <p class="mt-1 text-[10px] sm:text-xs text-zinc-400">Email cannot be changed</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="phone" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5">Phone Number</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="+855 XX XXX XXXX"
                  class="w-full px-3 py-2.5 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label for="location" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5">Location</label>
                <input
                  id="location"
                  v-model="form.location"
                  type="text"
                  placeholder="City, Country"
                  class="w-full px-3 py-2.5 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <!-- Role -->
            <div>
              <label for="role" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5">
                Role
                <span v-if="!canChangeRole" class="text-[10px] sm:text-xs text-zinc-400 ml-1">(Read only)</span>
              </label>
              <select
                v-if="canChangeRole"
                id="role"
                v-model="form.role"
                class="w-full px-3 py-2.5 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              >
                <option value="System Administrator">System Administrator</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
              <div v-else class="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-500 cursor-not-allowed flex items-center gap-2">
                <UIcon name="i-lucide-shield" class="w-4 h-4" />
                {{ form.role }}
              </div>
              <p v-if="!canChangeRole" class="mt-1 text-[10px] sm:text-xs text-zinc-400">
                Only System Administrators can change roles
              </p>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div v-if="success" class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p class="text-xs sm:text-sm text-emerald-700 flex items-center gap-2">
            <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
            Profile updated successfully!
          </p>
        </div>
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-xs sm:text-sm text-red-700 flex items-center gap-2">
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4" />
            {{ error }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-2 sm:gap-3">
          <NuxtLink
            to="/profile"
            class="px-3 sm:px-4 py-2 bg-zinc-100 text-zinc-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-zinc-200 no-underline"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="loading"
            class="px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center gap-1.5"
          >
            <UIcon v-if="loading" name="i-lucide-loader-2" class="w-3.5 h-3.5 animate-spin" />
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const router = useRouter();
const { permissions, fetchUserRole } = usePermissions();

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

// Avatar state
const fileInputRef = ref<HTMLInputElement | null>(null);
const avatarPreview = ref<string | null>(null);
const uploadingAvatar = ref(false);
const avatarError = ref('');

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  profileImage?: string | null;
  joinDate?: string;
  lastLogin?: string;
  isActive?: boolean;
}

const initials = computed(() => {
  const name = form.value.name || '';
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

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
    avatarPreview.value = data.profileImage || null;
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

// ---- Avatar Upload ----
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  avatarError.value = '';

  // Validate type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    avatarError.value = 'Unsupported format. Use JPG, PNG, GIF or WebP.';
    return;
  }

  // Validate size (500KB)
  if (file.size > 500 * 1024) {
    avatarError.value = 'Image too large. Maximum size is 500KB.';
    return;
  }

  // Read as data URL and upload
  const reader = new FileReader();
  reader.onload = async () => {
    const dataUrl = reader.result as string;
    avatarPreview.value = dataUrl;

    uploadingAvatar.value = true;
    try {
      await $fetch('/api/profile/avatar', {
        method: 'POST',
        body: { image: dataUrl },
      });
    } catch (err: any) {
      avatarError.value = err?.data?.statusMessage || 'Failed to upload avatar';
      // Revert preview on error
      avatarPreview.value = null;
    } finally {
      uploadingAvatar.value = false;
    }
  };
  reader.readAsDataURL(file);

  // Reset file input so same file can be re-selected
  input.value = '';
};

const removeAvatar = async () => {
  uploadingAvatar.value = true;
  avatarError.value = '';
  try {
    await $fetch('/api/profile/avatar', {
      method: 'POST',
      body: { image: null },
    });
    avatarPreview.value = null;
  } catch (err: any) {
    avatarError.value = err?.data?.statusMessage || 'Failed to remove avatar';
  } finally {
    uploadingAvatar.value = false;
  }
};

// ---- Profile Submit ----
const handleSubmit = async () => {
  loading.value = true;
  success.value = false;
  error.value = '';

  try {
    const payload: Record<string, string> = {
      name: form.value.name,
      phone: form.value.phone,
      location: form.value.location,
    };

    if (canChangeRole.value) {
      payload.role = form.value.role;
    }

    await $fetch('/api/profile', {
      method: 'PUT',
      body: payload,
    });

    router.push('/profile');
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Failed to update profile';
  } finally {
    loading.value = false;
  }
};
</script>
