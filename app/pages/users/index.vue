<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-users" class="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">User Management</h1>
            <p class="text-xs sm:text-sm text-zinc-500">Manage staff and manager accounts</p>
          </div>
        </div>
        <button 
          @click="openCreateModal"
          class="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-600"
        >
          <UIcon name="i-lucide-user-plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Add User
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <div class="bg-white border border-zinc-200 rounded-lg p-2.5 sm:p-3 md:p-4">
          <div class="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-users" class="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-amber-600" />
            </div>
            <div class="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 leading-tight">Total Users</div>
          </div>
          <div class="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-zinc-900">{{ users.length }}</div>
        </div>
        <div class="bg-white border border-zinc-200 rounded-lg p-2.5 sm:p-3 md:p-4">
          <div class="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-shield" class="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-amber-600" />
            </div>
            <div class="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 leading-tight">Admins</div>
          </div>
          <div class="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-zinc-900">{{ adminCount }}</div>
        </div>
        <div class="bg-white border border-zinc-200 rounded-lg p-2.5 sm:p-3 md:p-4">
          <div class="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-briefcase" class="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-amber-600" />
            </div>
            <div class="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 leading-tight">Managers</div>
          </div>
          <div class="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-zinc-900">{{ managerCount }}</div>
        </div>
        <div class="bg-white border border-zinc-200 rounded-lg p-2.5 sm:p-3 md:p-4">
          <div class="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-user" class="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-amber-600" />
            </div>
            <div class="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 leading-tight">Staff</div>
          </div>
          <div class="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-zinc-900">{{ staffCount }}</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-amber-500 animate-spin" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-700 flex items-center gap-2">
          <UIcon name="i-lucide-alert-circle" class="w-4 h-4" />
          {{ error }}
        </p>
      </div>

      <!-- Users Table -->
      <div v-else class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-zinc-50 border-b border-zinc-200">
                <th class="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-zinc-600 uppercase tracking-wider">User</th>
                <th class="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-zinc-600 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th class="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-zinc-600 uppercase tracking-wider">Role</th>
                <th class="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-zinc-600 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th class="px-2 sm:px-4 py-2 sm:py-3 text-right text-[10px] sm:text-xs font-semibold text-zinc-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <tr v-for="user in users" :key="user.id" class="hover:bg-zinc-50 transition-colors">
                <td class="px-2 sm:px-4 py-2 sm:py-3">
                  <div class="flex items-center gap-2 sm:gap-3">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                      <UIcon 
                        :name="user.role === 'System Administrator' ? 'i-lucide-shield' : 
                               user.role === 'Manager' ? 'i-lucide-briefcase' : 'i-lucide-user'" 
                        class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-600"
                      />
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs sm:text-sm font-medium text-zinc-900 truncate">{{ user.name }}</p>
                      <p class="text-[10px] sm:text-xs text-zinc-500 sm:hidden truncate">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
                  <p class="text-xs sm:text-sm text-zinc-600">{{ user.email }}</p>
                </td>
                <td class="px-2 sm:px-4 py-2 sm:py-3">
                  <span :class="[
                    'inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-md',
                    user.role === 'System Administrator' ? 'bg-amber-50 text-amber-700' :
                    user.role === 'Manager' ? 'bg-blue-50 text-blue-700' :
                    'bg-zinc-100 text-zinc-700'
                  ]">
                    <span class="hidden sm:inline">{{ user.role }}</span>
                    <span class="sm:hidden">{{ user.role === 'System Administrator' ? 'Admin' : user.role }}</span>
                  </span>
                </td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                  <span :class="[
                    'inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-md',
                    user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  ]">
                    <span :class="['w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full', user.isActive ? 'bg-emerald-500' : 'bg-red-500']"></span>
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-2 sm:px-4 py-2 sm:py-3">
                  <div class="flex items-center justify-end gap-0.5 sm:gap-1">
                    <button 
                      @click="openEditModal(user)"
                      class="p-1.5 sm:p-2 text-zinc-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <UIcon name="i-lucide-edit-2" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button 
                      v-if="user.id !== 1"
                      @click="confirmDelete(user)"
                      class="p-1.5 sm:p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-zinc-100 px-5 py-4 rounded-t-xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                  <UIcon :name="editingUser ? 'i-lucide-user-pen' : 'i-lucide-user-plus'" class="w-5 h-5 text-amber-600" />
                </div>
                <h2 class="text-lg font-semibold text-zinc-900">
                  {{ editingUser ? 'Edit User' : 'Add New User' }}
                </h2>
              </div>
              <button @click="closeModal" class="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">
                <UIcon name="i-lucide-x" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-5">
            <form @submit.prevent="saveUser" class="space-y-4">
              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-zinc-700 mb-1.5">
                  <span class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-user" class="w-3.5 h-3.5 text-zinc-400" />
                    Full Name
                  </span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white transition-all"
                  placeholder="e.g. John Smith"
                />
              </div>

              <!-- Username (only for new users) -->
              <div v-if="!editingUser">
                <label class="block text-sm font-medium text-zinc-700 mb-1.5">
                  <span class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-at-sign" class="w-3.5 h-3.5 text-zinc-400" />
                    Username
                  </span>
                </label>
                <input
                  v-model="form.username"
                  type="text"
                  required
                  class="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white transition-all"
                  placeholder="e.g. johnsmith"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-zinc-700 mb-1.5">
                  <span class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-mail" class="w-3.5 h-3.5 text-zinc-400" />
                    Email Address
                  </span>
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white transition-all"
                  placeholder="e.g. john@company.com"
                />
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-zinc-700 mb-1.5">
                  <span class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-lock" class="w-3.5 h-3.5 text-zinc-400" />
                    {{ editingUser ? 'New Password' : 'Password' }}
                  </span>
                </label>
                <input
                  v-model="form.password"
                  type="password"
                  :required="!editingUser"
                  class="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white transition-all"
                  :placeholder="editingUser ? 'Leave blank to keep current' : 'Enter a secure password'"
                />
                <p v-if="!editingUser" class="mt-1 text-xs text-zinc-400">Min. 6 characters recommended</p>
              </div>

              <!-- Role -->
              <div>
                <label class="block text-sm font-medium text-zinc-700 mb-1.5">
                  <span class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-badge" class="w-3.5 h-3.5 text-zinc-400" />
                    Role
                  </span>
                </label>
                <div class="relative">
                  <select
                    v-model="form.role"
                    required
                    class="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white appearance-none cursor-pointer pr-10 transition-all"
                  >
                    <option value="System Administrator">🛡️ System Administrator</option>
                    <option value="Manager">💼 Manager</option>
                    <option value="Staff">👤 Staff</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-zinc-400" />
                  </div>
                </div>
                <p class="mt-1 text-xs text-zinc-400">Determines access permissions</p>
              </div>

              <!-- Two Column Layout for Phone & Location (stacks on mobile) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1 sm:mb-1.5">
                    <span class="flex items-center gap-1.5">
                      <UIcon name="i-lucide-phone" class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" />
                      Phone
                    </span>
                  </label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="w-full px-3 py-2 sm:py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white transition-all"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1 sm:mb-1.5">
                    <span class="flex items-center gap-1.5">
                      <UIcon name="i-lucide-map-pin" class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" />
                      Location
                    </span>
                  </label>
                  <input
                    v-model="form.location"
                    type="text"
                    class="w-full px-3 py-2 sm:py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 focus:bg-white transition-all"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <!-- Active Status (Edit only) -->
              <div v-if="editingUser" class="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                <input
                  type="checkbox"
                  v-model="form.isActive"
                  id="isActive"
                  class="w-4 h-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                />
                <label for="isActive" class="text-sm text-zinc-700 flex items-center gap-2">
                  <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-zinc-400" />
                  Account is Active
                </label>
              </div>

              <!-- Error Message -->
              <div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <UIcon name="i-lucide-alert-circle" class="w-4 h-4 text-red-500 shrink-0" />
                <p class="text-xs text-red-700">{{ formError }}</p>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="sticky bottom-0 bg-zinc-50 border-t border-zinc-100 px-5 py-4 rounded-b-xl flex items-center justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveUser"
              :disabled="saving"
              class="px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              <UIcon v-if="saving" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
              <UIcon v-else :name="editingUser ? 'i-lucide-save' : 'i-lucide-user-plus'" class="w-4 h-4" />
              {{ saving ? 'Saving...' : (editingUser ? 'Save Changes' : 'Create User') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showDeleteModal = false"></div>
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-5 sm:p-6">
          <div class="text-center">
            <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-lucide-alert-triangle" class="w-6 h-6 text-red-500" />
            </div>
            <h3 class="text-lg font-semibold text-zinc-900 mb-2">Delete User</h3>
            <p class="text-sm text-zinc-500 mb-6">
              Are you sure you want to delete <span class="font-medium text-zinc-700">{{ userToDelete?.name }}</span>? 
              This action cannot be undone.
            </p>
            <div class="flex items-center justify-center gap-3">
              <button
                @click="showDeleteModal = false"
                class="px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-200"
              >
                Cancel
              </button>
              <button
                @click="deleteUser"
                :disabled="deleting"
                class="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
              >
                <UIcon v-if="deleting" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
                {{ deleting ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['permission']
});

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  dbRole: string;
  phone: string;
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const users = ref<User[]>([]);
const loading = ref(true);
const error = ref('');
const showModal = ref(false);
const showDeleteModal = ref(false);
const editingUser = ref<User | null>(null);
const userToDelete = ref<User | null>(null);
const saving = ref(false);
const deleting = ref(false);
const formError = ref('');

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'Staff',
  phone: '',
  location: '',
  isActive: true,
});

// Computed stats
const adminCount = computed(() => users.value.filter(u => u.role === 'System Administrator').length);
const managerCount = computed(() => users.value.filter(u => u.role === 'Manager').length);
const staffCount = computed(() => users.value.filter(u => u.role === 'Staff').length);

// Fetch users
const fetchUsers = async () => {
  loading.value = true;
  error.value = '';
  try {
    const data = await $fetch<User[]>('/api/users');
    users.value = data;
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Failed to fetch users';
  } finally {
    loading.value = false;
  }
};

// Open create modal
const openCreateModal = () => {
  editingUser.value = null;
  form.value = {
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'Staff',
    phone: '',
    location: '',
    isActive: true,
  };
  formError.value = '';
  showModal.value = true;
};

// Open edit modal
const openEditModal = (user: User) => {
  editingUser.value = user;
  form.value = {
    name: user.name,
    username: user.username,
    email: user.email,
    password: '',
    role: user.role,
    phone: user.phone,
    location: user.location,
    isActive: user.isActive,
  };
  formError.value = '';
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  editingUser.value = null;
};

// Save user
const saveUser = async () => {
  saving.value = true;
  formError.value = '';
  
  try {
    if (editingUser.value) {
      // Update existing user
      await $fetch(`/api/users/${editingUser.value.id}`, {
        method: 'PUT',
        body: {
          name: form.value.name,
          email: form.value.email,
          role: form.value.role,
          phone: form.value.phone,
          location: form.value.location,
          isActive: form.value.isActive,
          ...(form.value.password && { password: form.value.password }),
        },
      });
    } else {
      // Create new user
      await $fetch('/api/users', {
        method: 'POST',
        body: {
          username: form.value.username,
          email: form.value.email,
          password: form.value.password,
          name: form.value.name,
          role: form.value.role,
          phone: form.value.phone,
          location: form.value.location,
        },
      });
    }
    
    closeModal();
    await fetchUsers();
  } catch (err: any) {
    formError.value = err?.data?.statusMessage || 'Failed to save user';
  } finally {
    saving.value = false;
  }
};

// Confirm delete
const confirmDelete = (user: User) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

// Delete user
const deleteUser = async () => {
  if (!userToDelete.value) return;
  
  deleting.value = true;
  try {
    await $fetch(`/api/users/${userToDelete.value.id}`, {
      method: 'DELETE',
    });
    showDeleteModal.value = false;
    userToDelete.value = null;
    await fetchUsers();
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Failed to delete user';
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
