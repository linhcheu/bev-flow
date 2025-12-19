<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Top Header Bar -->
    <header class="bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            class="p-2 text-neutral-600 hover:text-neutral-900 transition-colors no-underline"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-light text-neutral-800 tracking-wide">Profile</h1>
            <p class="text-sm text-neutral-500 mt-1">Manage your account information</p>
          </div>
        </div>
        <button
          @click="handleSave"
          class="px-6 py-2.5 bg-[#6B7A67] text-white text-sm rounded-md hover:bg-[#5a6757] transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Save Changes
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 lg:px-12 py-6 lg:py-10">
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          <!-- Left Column - Profile Image -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 sticky top-6">
              <h3 class="text-base font-medium text-neutral-800 mb-6">Profile Picture</h3>

              <!-- Profile Image -->
              <div class="flex flex-col items-center">
                <div class="relative mb-6">
                  <div
                    v-if="profile.imagePreview"
                    class="w-40 h-40 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-lg"
                  >
                    <img
                      :src="profile.imagePreview"
                      alt="Profile"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="w-40 h-40 rounded-full bg-[#D4AF37] flex items-center justify-center border-4 border-neutral-200 shadow-lg"
                  >
                    <span class="text-5xl font-light text-white">{{ initials }}</span>
                  </div>

                  <!-- Edit Button -->
                  <button
                    @click="triggerFileInput"
                    class="absolute bottom-2 right-2 w-10 h-10 bg-[#6B7A67] rounded-full flex items-center justify-center text-white hover:bg-[#5a6757] transition-colors shadow-lg"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="hidden"
                  />
                </div>

                <div class="text-center mb-6">
                  <p class="text-lg font-medium text-neutral-800">{{ profile.name || 'Your Name' }}</p>
                  <p class="text-sm text-neutral-500">{{ profile.role || 'Administrator' }}</p>
                </div>

                <button
                  v-if="profile.imagePreview"
                  @click="removeImage"
                  class="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Remove Photo
                </button>
              </div>

              <!-- Account Info Card -->
              <div class="mt-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <h4 class="text-xs font-medium text-neutral-700 uppercase tracking-wider mb-3">Account Status</h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-neutral-600">Status</span>
                    <span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Active</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-neutral-600">Member Since</span>
                    <span class="text-neutral-800">Jan 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Profile Form -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
              <!-- Card Header -->
              <div class="px-6 py-4 border-b border-neutral-200">
                <h2 class="text-lg font-medium text-neutral-800">Personal Information</h2>
                <p class="text-sm text-neutral-500 mt-1">Update your personal details and contact information</p>
              </div>

              <!-- Form Content -->
              <div class="p-6 space-y-6">

                <!-- Name Section -->
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="profile.name"
                    type="text"
                    placeholder="Enter your full name"
                    class="w-full px-4 py-3 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  />
                </div>

                <!-- Email Section -->
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      v-model="profile.email"
                      type="email"
                      placeholder="your.email@example.com"
                      class="w-full pl-12 pr-4 py-3 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    />
                  </div>
                  <p class="text-xs text-neutral-500 mt-1">We'll never share your email with anyone else.</p>
                </div>

                <!-- Phone Number Section -->
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      v-model="profile.phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      class="w-full pl-12 pr-4 py-3 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <!-- Additional Fields Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-200">
                  <!-- Role -->
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Role</label>
                    <select
                      v-model="profile.role"
                      class="w-full px-4 py-3 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Manager">Manager</option>
                      <option value="User">User</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>

                  <!-- Department -->
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Department</label>
                    <input
                      v-model="profile.department"
                      type="text"
                      placeholder="e.g., Sales, Operations"
                      class="w-full px-4 py-3 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <!-- Bio Section -->
                <div class="pt-6 border-t border-neutral-200">
                  <label class="block text-sm font-medium text-neutral-700 mb-2">Bio</label>
                  <textarea
                    v-model="profile.bio"
                    rows="4"
                    placeholder="Tell us a bit about yourself..."
                    class="w-full px-4 py-3 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all resize-none"
                  ></textarea>
                  <p class="text-xs text-neutral-500 mt-1">Brief description for your profile.</p>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-neutral-200">
                  <button
                    @click="handleReset"
                    class="w-full sm:w-auto px-8 py-3 text-sm text-neutral-600 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    @click="handleSave"
                    class="w-full sm:w-auto px-8 py-3 text-sm text-white bg-[#6B7A67] rounded-md hover:bg-[#5a6757] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            <!-- Security Settings Card -->
            <div class="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden mt-6">
              <div class="px-6 py-4 border-b border-neutral-200">
                <h2 class="text-lg font-medium text-neutral-800">Security Settings</h2>
                <p class="text-sm text-neutral-500 mt-1">Manage your password and security preferences</p>
              </div>

              <div class="p-6 space-y-4">
                <button class="w-full sm:w-auto px-6 py-3 text-sm text-neutral-700 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast (Optional) -->
    <transition name="fade">
      <div
        v-if="showSuccessToast"
        class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Profile updated successfully!</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { profile, initials } = useProfile();

const fileInput = ref<HTMLInputElement | null>(null);
const showSuccessToast = ref(false);

const originalProfile = ref({ ...profile.value });

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profile.value.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  profile.value.imagePreview = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const handleSave = () => {
  // TODO: Implement API call to save profile
  console.log('Saving profile:', profile.value);

  // Update original profile
  originalProfile.value = { ...profile.value };

  // Show success toast
  showSuccessToast.value = true;
  setTimeout(() => {
    showSuccessToast.value = false;
  }, 3000);
};

const handleReset = () => {
  profile.value = { ...originalProfile.value };
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
