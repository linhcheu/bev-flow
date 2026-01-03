<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-database" class="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Backup & Restore</h1>
            <p class="text-xs sm:text-sm text-zinc-500">Manage system data backup and recovery</p>
          </div>
        </div>
      </div>

      <!-- Under Maintenance Card -->
      <div class="bg-white border border-zinc-200 rounded-lg p-4 sm:p-6 md:p-8 text-center">
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <UIcon name="i-lucide-construction" class="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
        </div>
        
        <h2 class="text-lg sm:text-xl font-semibold text-zinc-900 mb-2 sm:mb-3">Under Maintenance</h2>
        <p class="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto mb-4 sm:mb-6">
          The backup and restore feature is currently under development. 
          This feature will allow System Administrators to backup and restore system data securely.
        </p>
        
        <!-- Feature Preview -->
        <div class="grid grid-cols-2 gap-2 sm:gap-4 max-w-lg mx-auto mt-4 sm:mt-6">
          <div class="bg-zinc-50 rounded-lg p-3 sm:p-4 border border-zinc-200">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <UIcon name="i-lucide-download-cloud" class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <h3 class="text-xs sm:text-sm font-medium text-zinc-900 mb-0.5 sm:mb-1">Backup Data</h3>
            <p class="text-[10px] sm:text-xs text-zinc-500">Export database securely</p>
          </div>
          
          <div class="bg-zinc-50 rounded-lg p-3 sm:p-4 border border-zinc-200">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <UIcon name="i-lucide-upload-cloud" class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <h3 class="text-xs sm:text-sm font-medium text-zinc-900 mb-0.5 sm:mb-1">Restore Data</h3>
            <p class="text-[10px] sm:text-xs text-zinc-500">Recover from backup</p>
          </div>
        </div>
        
        <!-- Coming Soon Badge -->
        <div class="mt-4 sm:mt-6">
          <span class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-500 text-white text-xs sm:text-sm font-medium rounded-lg">
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Coming Soon
          </span>
        </div>
      </div>

      <!-- Permission Notice -->
      <div class="mt-4 sm:mt-6 p-3 sm:p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
        <div class="flex items-start gap-2 sm:gap-3">
          <UIcon name="i-lucide-shield-check" class="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 mt-0.5 shrink-0" />
          <div>
            <h4 class="text-xs sm:text-sm font-medium text-zinc-900">System Administrator Only</h4>
            <p class="text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1">
              Only System Administrators have access to backup and restore features.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Apply permission middleware - only System Administrators can access
definePageMeta({
  layout: 'default',
  middleware: ['permission']
});
</script>
