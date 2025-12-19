<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Top Header Bar -->
    <header class="bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-neutral-900 rounded-md flex items-center justify-center">
            <span class="text-[#D4AF37] font-light text-lg">B</span>
          </div>
          <div class="relative flex-1 max-w-md hidden sm:block">
            <input
              type="search"
              placeholder="Search..."
              class="w-full px-4 py-2 pl-10 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button class="p-2 text-neutral-600 hover:text-neutral-900 relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <NuxtLink
            to="/profile"
            class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity no-underline"
          >
            <div
              v-if="profile.imagePreview"
              class="w-8 h-8 rounded-full overflow-hidden border-2 border-[#D4AF37]"
            >
              <img :src="profile.imagePreview" alt="Profile" class="w-full h-full object-cover" />
            </div>
            <div
              v-else
              class="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center"
            >
              <span class="text-white text-sm font-medium">{{ initials }}</span>
            </div>
            <div class="hidden sm:block">
              <p class="text-sm font-medium text-neutral-800">{{ profile.name }}</p>
              <p class="text-xs text-neutral-500">{{ profile.role }}</p>
            </div>
          </NuxtLink>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="isDarkMode" class="sr-only peer">
            <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
          </label>
          <span class="text-xs text-neutral-600 hidden lg:inline">Light</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="px-4 sm:px-6 lg:px-12 py-6 lg:py-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <!-- Left Column - Add New Product Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
            <!-- Card Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-neutral-900 rounded-md flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 class="text-lg font-medium text-neutral-800">Add New Product</h2>
              </div>
              <div class="flex items-center gap-2">
                <button class="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Draft
                </button>
                <button class="px-4 py-2 bg-neutral-900 text-white text-sm rounded-md hover:bg-neutral-800 transition-colors">
                  Add Product
                </button>
              </div>
            </div>

            <!-- Form Content -->
            <div class="p-6 space-y-6">
              <!-- Your Brand Section -->
              <div>
                <h3 class="text-base font-medium text-neutral-800 mb-1">Your Brand</h3>
                <p class="text-sm text-neutral-500 mb-4">Preview your brands product.</p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-xs font-medium text-neutral-700 mb-2">Brand name</label>
                    <input
                      v-model="form.brandName"
                      type="text"
                      placeholder="Typing"
                      class="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-neutral-700 mb-2">Font · Family</label>
                    <select
                      v-model="form.fontFamily"
                      class="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    >
                      <option>Typing</option>
                      <option>Handwriting</option>
                      <option>Serif</option>
                      <option>Sans Serif</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-xs font-medium text-neutral-700 mb-2">Distributor City</label>
                    <input
                      v-model="form.distributorCity"
                      type="text"
                      placeholder="Typing"
                      class="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-neutral-700 mb-2">Destructor Zip</label>
                    <input
                      v-model="form.destructorZip"
                      type="text"
                      placeholder="Typing"
                      class="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-medium text-neutral-700 mb-2">Distributor City</label>
                  <div class="border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center hover:border-[#D4AF37] transition-colors cursor-pointer">
                    <div class="flex flex-col items-center justify-center">
                      <div class="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mb-3">
                        <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p class="text-sm text-neutral-600">
                        <span class="font-medium">Upload your logo</span>, or browse
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-3 mt-6 pt-6 border-t border-neutral-200">
                  <button class="flex-1 px-6 py-2.5 text-sm text-neutral-600 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors">
                    Cancel
                  </button>
                  <button class="flex-1 px-6 py-2.5 text-sm text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>

              <!-- Second Form Section -->
              <div class="pt-6 border-t border-neutral-200">
                <h3 class="text-base font-medium text-neutral-800 mb-1">Your Brand</h3>
                <p class="text-sm text-neutral-500 mb-4">Preview your brands product.</p>

                <div class="mb-4">
                  <label class="block text-xs font-medium text-neutral-700 mb-2">Brand name</label>
                  <input
                    v-model="form.brandName2"
                    type="text"
                    placeholder="Brand name"
                    class="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-neutral-700 mb-2">Distributor City</label>
                    <input
                      v-model="form.distributorCity2"
                      type="text"
                      placeholder="Typing"
                      class="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-neutral-700 mb-2">Destructor Zip</label>
                    <input
                      v-model="form.destructorZip2"
                      type="text"
                      placeholder="Typing"
                      class="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Preview -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 sticky top-6">
            <h3 class="text-base font-medium text-neutral-800 mb-4">Your Brand</h3>

            <!-- Product Preview -->
            <div class="bg-neutral-100 rounded-lg p-8 mb-6 aspect-square flex items-center justify-center">
              <div class="text-center">
                <div class="inline-block bg-white rounded-lg shadow-lg p-6">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-20 bg-neutral-900 rounded-sm"></div>
                    <div class="w-16 h-20 bg-neutral-200 rounded-sm"></div>
                    <div class="w-16 h-20 bg-neutral-100 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product Thumbnails -->
            <div class="flex items-center gap-3 mb-6">
              <button class="w-16 h-16 bg-neutral-100 rounded-lg border-2 border-neutral-900 flex items-center justify-center">
                <div class="w-10 h-12 bg-neutral-300 rounded-sm"></div>
              </button>
              <button class="w-16 h-16 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center hover:border-neutral-900 transition-colors">
                <div class="w-10 h-12 bg-neutral-300 rounded-sm"></div>
              </button>
              <button class="w-16 h-16 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center hover:border-neutral-900 transition-colors">
                <div class="w-10 h-12 bg-neutral-300 rounded-sm"></div>
              </button>
              <button class="w-16 h-16 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center hover:border-neutral-900 transition-colors">
                <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <!-- Help Center Card -->
            <div class="bg-neutral-900 rounded-lg p-6 text-white relative overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div class="relative">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 class="text-lg font-medium mb-2">Help center</h4>
                <p class="text-sm text-white/80 mb-4">Have a problem?<br>Send us a message!</p>
                <button class="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
                  Find out more
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useProfile } from '~/composables/useProfile';

const { profile, initials } = useProfile();
const isDarkMode = ref(false);

const form = ref({
  brandName: '',
  fontFamily: 'Typing',
  distributorCity: '',
  destructorZip: '',
  brandName2: '',
  distributorCity2: '',
  destructorZip2: '',
});
</script>