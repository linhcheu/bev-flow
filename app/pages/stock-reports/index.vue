<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-clipboard-check" class="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Daily Stock Report</h1>
            <p class="text-xs sm:text-sm text-zinc-500">Track daily inventory movements</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <!-- Seed Data Button -->
          <button
            v-if="!hasData"
            @click="handleSeedData"
            :disabled="seeding"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-100 disabled:opacity-50"
          >
            <UIcon :name="seeding ? 'i-lucide-loader-2' : 'i-lucide-database'" :class="['w-3.5 h-3.5', seeding && 'animate-spin']" />
            {{ seeding ? 'Seeding...' : 'Load Sample Data' }}
          </button>

          <!-- Export -->
          <button
            @click="handleExportExcel"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-emerald-100"
          >
            <UIcon name="i-lucide-file-spreadsheet" class="w-3.5 h-3.5" />
            Excel
          </button>
        </div>
      </div>

      <!-- Date Navigation -->
      <div class="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-zinc-200 mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <!-- Month Navigation -->
          <div class="flex items-center gap-2">
            <button
              @click="prevMonth"
              class="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
              title="Previous month"
            >
              <UIcon name="i-lucide-chevrons-left" class="w-4 h-4 text-zinc-600" />
            </button>
            <button
              @click="prevDay"
              class="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
              title="Previous day"
            >
              <UIcon name="i-lucide-chevron-left" class="w-4 h-4 text-zinc-600" />
            </button>

            <div class="relative">
              <input
                type="date"
                v-model="selectedDate"
                class="px-4 py-2 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <button
              @click="nextDay"
              class="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
              title="Next day"
            >
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-zinc-600" />
            </button>
            <button
              @click="nextMonth"
              class="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
              title="Next month"
            >
              <UIcon name="i-lucide-chevrons-right" class="w-4 h-4 text-zinc-600" />
            </button>
          </div>

          <div class="flex-1 text-center sm:text-left">
            <h2 class="text-base sm:text-lg font-semibold text-zinc-900">
              {{ formattedDate }}
            </h2>
            <p class="text-xs text-zinc-500">{{ monthLabel }} — Day {{ currentDay }} of {{ daysInMonth }}</p>
          </div>

          <!-- Quick Day Selector -->
          <div class="flex flex-wrap gap-1">
            <button
              v-for="day in quickDays"
              :key="day"
              @click="goToDay(day)"
              :class="[
                'w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-medium transition-all',
                currentDay === day
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              ]"
            >
              {{ day }}
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div v-if="reportSummary" class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div class="bg-white rounded-xl p-3 sm:p-4 border border-zinc-200">
          <div class="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-package-open" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>
          </div>
          <p class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ reportSummary.totalOpening }}</p>
          <p class="text-[10px] sm:text-xs text-zinc-500">Opening Stock</p>
        </div>
        <div class="bg-white rounded-xl p-3 sm:p-4 border border-zinc-200">
          <div class="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-truck" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            </div>
          </div>
          <p class="text-base sm:text-lg md:text-xl font-semibold text-emerald-600">+{{ reportSummary.totalPurchased }}</p>
          <p class="text-[10px] sm:text-xs text-zinc-500">Purchased</p>
        </div>
        <div class="bg-white rounded-xl p-3 sm:p-4 border border-zinc-200">
          <div class="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-shopping-cart" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
            </div>
          </div>
          <p class="text-base sm:text-lg md:text-xl font-semibold text-red-600">-{{ reportSummary.totalSold }}</p>
          <p class="text-[10px] sm:text-xs text-zinc-500">Sold</p>
        </div>
        <div class="bg-white rounded-xl p-3 sm:p-4 border border-zinc-200">
          <div class="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-warehouse" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
          </div>
          <p class="text-base sm:text-lg md:text-xl font-semibold text-zinc-900">{{ reportSummary.totalClosing }}</p>
          <p class="text-[10px] sm:text-xs text-zinc-500">Closing Stock</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-12 sm:py-20">
        <div class="flex flex-col items-center gap-3">
          <UIcon name="i-lucide-loader-2" class="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 animate-spin" />
          <p class="text-xs sm:text-sm text-zinc-600">Loading stock report...</p>
        </div>
      </div>

      <!-- No Data State -->
      <div v-else-if="stockReports.length === 0" class="text-center py-12 sm:py-20">
        <div class="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <UIcon name="i-lucide-database" class="w-6 h-6 sm:w-8 sm:h-8 text-zinc-400" />
        </div>
        <h3 class="text-base sm:text-lg font-semibold text-zinc-900 mb-1 sm:mb-2">No Stock Report Data</h3>
        <p class="text-xs sm:text-sm text-zinc-500 mb-3 sm:mb-4">No data for this date. Click "Load Sample Data" to populate stock reports.</p>
        <button
          @click="handleSeedData"
          :disabled="seeding"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          <UIcon :name="seeding ? 'i-lucide-loader-2' : 'i-lucide-database'" :class="['w-4 h-4', seeding && 'animate-spin']" />
          {{ seeding ? 'Generating data...' : 'Generate Stock Data' }}
        </button>
      </div>

      <!-- Stock Report - Mobile Cards -->
      <div v-else class="block md:hidden">
        <div class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <!-- Summary totals bar -->
          <div v-if="reportSummary" class="bg-zinc-50 border-b border-zinc-200 px-3 py-2 flex items-center justify-between">
            <span class="text-[10px] font-semibold text-zinc-500 uppercase">Totals</span>
            <div class="flex items-center gap-3">
              <span class="text-[10px] font-bold text-blue-700">O: {{ reportSummary.totalOpening }}</span>
              <span class="text-[10px] font-bold text-emerald-700">+{{ reportSummary.totalPurchased }}</span>
              <span class="text-[10px] font-bold text-red-700">-{{ reportSummary.totalSold }}</span>
              <span class="text-[10px] font-bold text-amber-700">C: {{ reportSummary.totalClosing }}</span>
            </div>
          </div>
          <div class="max-h-[50vh] overflow-y-auto space-y-2 sm:space-y-3 p-3">
            <div 
              v-for="(report, index) in stockReports" 
              :key="report.report_id"
              :class="[
                'bg-zinc-50 border border-zinc-200 rounded-lg p-3',
                report.closing_stock <= 0 && 'border-red-200 bg-red-50/30',
                report.closing_stock > 0 && report.closing_stock <= 5 && 'border-amber-200 bg-amber-50/30'
              ]"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 mb-0.5">
                    <span class="text-[10px] text-zinc-400 font-medium">{{ index + 1 }}.</span>
                  </div>
                  <h4 class="text-sm font-medium text-zinc-900 truncate">{{ report.product_name }}</h4>
                  <p class="text-[10px] text-zinc-500 truncate">{{ report.description }}</p>
                </div>
                <span :class="[
                  'text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap',
                  getStockStatusClass(report.closing_stock)
                ]">
                  {{ getStockStatus(report.closing_stock) }}
                </span>
              </div>
              <div class="grid grid-cols-4 gap-1.5 text-center">
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[9px] text-blue-600 mb-0.5">Opening</p>
                  <p class="text-xs font-semibold text-blue-700">{{ report.opening_stock }}</p>
                </div>
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[9px] text-emerald-600 mb-0.5">Purchased</p>
                  <p class="text-xs font-semibold text-emerald-700">{{ report.purchased_qty > 0 ? '+' + report.purchased_qty : '—' }}</p>
                </div>
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[9px] text-red-600 mb-0.5">Sold</p>
                  <p class="text-xs font-semibold text-red-700">{{ report.sold_qty > 0 ? '-' + report.sold_qty : '—' }}</p>
                </div>
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[9px] text-amber-600 mb-0.5">Closing</p>
                  <p :class="[
                    'text-xs font-bold',
                    report.closing_stock <= 0 ? 'text-red-700' :
                    report.closing_stock <= 5 ? 'text-amber-700' :
                    'text-zinc-900'
                  ]">{{ report.closing_stock }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Report Table - Desktop -->
      <div v-if="stockReports.length > 0" class="hidden md:block bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-zinc-50 border-b border-zinc-200">
                <th class="text-left px-4 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider w-12">No.</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Product Name</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider hidden sm:table-cell">Description</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50/50">Opening</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50/50">Purchasing</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-red-600 uppercase tracking-wider bg-red-50/50">Selling</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-amber-700 uppercase tracking-wider bg-amber-50/50">Closing</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(report, index) in stockReports"
                :key="report.report_id"
                :class="[
                  'border-b border-zinc-100 transition-colors hover:bg-zinc-50',
                  report.closing_stock <= 0 && 'bg-red-50/30',
                  report.closing_stock > 0 && report.closing_stock <= 5 && 'bg-amber-50/30'
                ]"
              >
                <td class="px-4 py-3 text-sm font-medium text-zinc-500">{{ index + 1 }}</td>
                <td class="px-4 py-3">
                  <span class="text-sm font-medium text-zinc-900">{{ report.product_name }}</span>
                </td>
                <td class="px-4 py-3 text-sm text-zinc-500 hidden sm:table-cell">{{ report.description }}</td>
                <td class="px-4 py-3 text-center">
                  <span class="text-sm font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">{{ report.opening_stock }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span v-if="report.purchased_qty > 0" class="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    +{{ report.purchased_qty }}
                  </span>
                  <span v-else class="text-sm text-zinc-300">—</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span v-if="report.sold_qty > 0" class="text-sm font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg">
                    -{{ report.sold_qty }}
                  </span>
                  <span v-else class="text-sm text-zinc-300">—</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="[
                    'text-sm font-bold px-2.5 py-1 rounded-lg',
                    report.closing_stock <= 0 ? 'text-red-700 bg-red-100' :
                    report.closing_stock <= 5 ? 'text-amber-700 bg-amber-100' :
                    'text-zinc-900 bg-zinc-100'
                  ]">
                    {{ report.closing_stock }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="[
                    'text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap',
                    getStockStatusClass(report.closing_stock)
                  ]">
                    {{ getStockStatus(report.closing_stock) }}
                  </span>
                </td>
              </tr>
            </tbody>
            <!-- Footer Totals -->
            <tfoot v-if="reportSummary">
              <tr class="bg-zinc-50 border-t-2 border-zinc-200">
                <td class="px-4 py-3 text-sm font-bold text-zinc-900" colspan="3">Total</td>
                <td class="px-4 py-3 text-center text-sm font-bold text-blue-700">{{ reportSummary.totalOpening }}</td>
                <td class="px-4 py-3 text-center text-sm font-bold text-emerald-700">+{{ reportSummary.totalPurchased }}</td>
                <td class="px-4 py-3 text-center text-sm font-bold text-red-700">-{{ reportSummary.totalSold }}</td>
                <td class="px-4 py-3 text-center text-sm font-bold text-amber-700">{{ reportSummary.totalClosing }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- BoH Section -->
      <div v-if="bohData.length > 0" class="mt-4 sm:mt-6">
        <div class="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div class="px-3 sm:px-4 py-3 sm:py-4 border-b border-zinc-100 flex items-center gap-2 sm:gap-3">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-warehouse" class="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <div>
              <h3 class="text-xs sm:text-sm md:text-base font-semibold text-zinc-900">Balance on Hand (BoH)</h3>
              <p class="text-[10px] sm:text-xs text-zinc-500">Current stock status with reorder indicators</p>
            </div>
          </div>

          <!-- BoH Mobile Cards -->
          <div class="block md:hidden">
            <div class="max-h-[50vh] overflow-y-auto space-y-2 sm:space-y-3 p-3">
              <div 
                v-for="(item, index) in bohData" 
                :key="'m-boh-' + item.product_id"
                :class="['bg-zinc-50 border border-zinc-200 rounded-lg p-3', item.needs_reorder && 'border-red-200 bg-red-50/20']"
              >
                <div class="flex items-start justify-between gap-2 mb-2">
                  <div class="min-w-0">
                    <span class="text-[10px] text-zinc-400 font-medium">{{ index + 1 }}.</span>
                    <h4 class="text-sm font-medium text-zinc-900 truncate">{{ item.product_name }}</h4>
                    <p class="text-[10px] text-zinc-500 truncate">{{ item.description }}</p>
                  </div>
                  <span :class="[
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                    item.needs_reorder ? 'text-red-700 bg-red-100' : 'text-emerald-700 bg-emerald-100'
                  ]">
                    {{ item.needs_reorder ? 'Reorder' : 'OK' }}
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-1.5 text-center mb-1.5">
                  <div class="bg-white rounded-lg p-1.5">
                    <p class="text-[9px] text-amber-600 mb-0.5">BoH</p>
                    <p :class="[
                      'text-xs font-bold',
                      item.current_stock <= 0 ? 'text-red-700' :
                      item.current_stock <= item.safety_stock ? 'text-amber-700' :
                      'text-emerald-700'
                    ]">{{ item.current_stock }}</p>
                  </div>
                  <div class="bg-white rounded-lg p-1.5">
                    <p class="text-[9px] text-emerald-600 mb-0.5">Purchased</p>
                    <p class="text-xs font-medium text-emerald-700">{{ item.total_purchased }}</p>
                  </div>
                  <div class="bg-white rounded-lg p-1.5">
                    <p class="text-[9px] text-red-600 mb-0.5">Sold</p>
                    <p class="text-xs font-medium text-red-700">{{ item.total_sold }}</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-1.5 text-center">
                  <div class="bg-white rounded-lg p-1.5">
                    <p class="text-[9px] text-zinc-500 mb-0.5">Safety Stock</p>
                    <p class="text-[10px] font-medium text-zinc-700">{{ item.safety_stock }}</p>
                  </div>
                  <div class="bg-white rounded-lg p-1.5">
                    <p class="text-[9px] text-zinc-500 mb-0.5">EOQ</p>
                    <p class="text-[10px] font-semibold text-zinc-700">{{ item.eoq }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- BoH Desktop Table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-zinc-50 border-b border-zinc-200">
                  <th class="text-left px-4 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider w-12">No.</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Product</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider hidden sm:table-cell">Description</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-emerald-600 uppercase tracking-wider">Purchased</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-red-600 uppercase tracking-wider">Sold</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold bg-amber-50 text-amber-700 uppercase tracking-wider">BoH</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Safety Stock</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Re-order?</th>
                  <th class="text-center px-4 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">EOQ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in bohData"
                  :key="item.product_id"
                  :class="[
                    'border-b border-zinc-100 transition-colors hover:bg-zinc-50',
                    item.needs_reorder && 'bg-red-50/20'
                  ]"
                >
                  <td class="px-4 py-3 text-sm font-medium text-zinc-500">{{ index + 1 }}</td>
                  <td class="px-4 py-3 text-sm font-medium text-zinc-900">{{ item.product_name }}</td>
                  <td class="px-4 py-3 text-sm text-zinc-500 hidden sm:table-cell">{{ item.description }}</td>
                  <td class="px-4 py-3 text-center text-sm font-medium text-emerald-700">{{ item.total_purchased }}</td>
                  <td class="px-4 py-3 text-center text-sm font-medium text-red-700">{{ item.total_sold }}</td>
                  <td class="px-4 py-3 text-center">
                    <span :class="[
                      'text-sm font-bold px-2.5 py-1 rounded-lg',
                      item.current_stock <= 0 ? 'text-red-700 bg-red-100' :
                      item.current_stock <= item.safety_stock ? 'text-amber-700 bg-amber-100' :
                      'text-emerald-700 bg-emerald-50'
                    ]">
                      {{ item.current_stock }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center text-sm text-zinc-600">{{ item.safety_stock }}</td>
                  <td class="px-4 py-3 text-center">
                    <span :class="[
                      'text-xs font-semibold px-2.5 py-1 rounded-full',
                      item.needs_reorder ? 'text-red-700 bg-red-100' : 'text-emerald-700 bg-emerald-100'
                    ]">
                      {{ item.needs_reorder ? 'Yes' : 'No' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center text-sm font-semibold text-zinc-700">{{ item.eoq }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  stockReports,
  bohData,
  reportSummary,
  isLoading,
  fetchDailyReport,
  fetchBoH,
  seedData,
} = useStockReports();

// Default to Feb 1 2026 (where seed data exists)
const selectedDate = ref('2026-02-01');
const seeding = ref(false);
const hasData = ref(false);

// Computed date helpers
const selectedDateObj = computed(() => new Date(selectedDate.value + 'T00:00:00'));

const currentDay = computed(() => selectedDateObj.value.getDate());

const currentMonth = computed(() => selectedDateObj.value.getMonth());

const currentYear = computed(() => selectedDateObj.value.getFullYear());

const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate());

const monthLabel = computed(() => {
  return selectedDateObj.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const formattedDate = computed(() => {
  return selectedDateObj.value.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Dynamic quick day buttons based on current month
const quickDays = computed(() => {
  const dim = daysInMonth.value;
  const days: number[] = [1];
  // Add evenly spaced days
  for (let d = 5; d < dim; d += 5) {
    days.push(d);
  }
  // Always include last day
  if (!days.includes(dim)) {
    days.push(dim);
  }
  return days;
});

const formatDateStr = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const goToDay = (day: number) => {
  const d = new Date(currentYear.value, currentMonth.value, day);
  selectedDate.value = formatDateStr(d);
};

const prevDay = () => {
  const d = new Date(selectedDateObj.value);
  d.setDate(d.getDate() - 1);
  selectedDate.value = formatDateStr(d);
};

const nextDay = () => {
  const d = new Date(selectedDateObj.value);
  d.setDate(d.getDate() + 1);
  selectedDate.value = formatDateStr(d);
};

const prevMonth = () => {
  const d = new Date(selectedDateObj.value);
  d.setMonth(d.getMonth() - 1);
  // Clamp day to new month's max
  const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  if (d.getDate() > dim) d.setDate(dim);
  selectedDate.value = formatDateStr(d);
};

const nextMonth = () => {
  const d = new Date(selectedDateObj.value);
  d.setMonth(d.getMonth() + 1);
  const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  if (d.getDate() > dim) d.setDate(dim);
  selectedDate.value = formatDateStr(d);
};

const getStockStatus = (stock: number) => {
  if (stock <= 0) return 'Out of Stock';
  if (stock <= 3) return 'Critical';
  if (stock <= 10) return 'Low';
  return 'OK';
};

const getStockStatusClass = (stock: number) => {
  if (stock <= 0) return 'bg-red-100 text-red-700';
  if (stock <= 3) return 'bg-orange-100 text-orange-700';
  if (stock <= 10) return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
};

const handleSeedData = async () => {
  seeding.value = true;
  try {
    await seedData();
    hasData.value = true;
    await loadData();
  } catch (err) {
    console.error('Failed to seed:', err);
  } finally {
    seeding.value = false;
  }
};

const loadData = async () => {
  const monthStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}`;
  await Promise.all([
    fetchDailyReport(selectedDate.value),
    fetchBoH(monthStr),
  ]);
  hasData.value = stockReports.value.length > 0;
};

// Watch date changes
watch(selectedDate, async () => {
  await fetchDailyReport(selectedDate.value);
});

// Export
const handleExportExcel = () => {
  const { exportToExcel } = useExport();
  const data = stockReports.value.map((r, i) => ({
    no: i + 1,
    product_name: r.product_name,
    description: r.description,
    opening: r.opening_stock,
    purchasing: r.purchased_qty,
    selling: r.sold_qty,
    closing: r.closing_stock,
  }));
  const columns = [
    { header: 'No.', key: 'no', width: 6 },
    { header: 'Product Name', key: 'product_name', width: 30 },
    { header: 'Description', key: 'description', width: 15 },
    { header: 'Opening', key: 'opening', width: 10 },
    { header: 'Purchasing', key: 'purchasing', width: 12 },
    { header: 'Selling', key: 'selling', width: 10 },
    { header: 'Closing', key: 'closing', width: 10 },
  ];
  exportToExcel(data, columns, `stock_report_${selectedDate.value}`);
};

onMounted(loadData);
</script>
