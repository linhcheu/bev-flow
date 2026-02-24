<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-clipboard-check" class="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Beer Stock</h1>
            <p class="text-xs sm:text-sm text-zinc-500">Daily inventory: Big Stock &amp; Small Stock</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            v-if="!hasData"
            @click="handleSeedData"
            :disabled="seeding"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-100 disabled:opacity-50"
          >
            <UIcon :name="seeding ? 'i-lucide-loader-2' : 'i-lucide-database'" :class="['w-3.5 h-3.5', seeding && 'animate-spin']" />
            {{ seeding ? 'Seeding...' : 'Load Sample Data' }}
          </button>
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
          <div class="flex items-center gap-2">
            <button @click="prevMonth" class="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors" title="Previous month">
              <UIcon name="i-lucide-chevrons-left" class="w-4 h-4 text-zinc-600" />
            </button>
            <button @click="prevDay" class="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors" title="Previous day">
              <UIcon name="i-lucide-chevron-left" class="w-4 h-4 text-zinc-600" />
            </button>
            <input type="date" v-model="selectedDate" class="px-4 py-2 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
            <button @click="nextDay" class="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors" title="Next day">
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-zinc-600" />
            </button>
            <button @click="nextMonth" class="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors" title="Next month">
              <UIcon name="i-lucide-chevrons-right" class="w-4 h-4 text-zinc-600" />
            </button>
          </div>
          <div class="flex-1 text-center sm:text-left">
            <h2 class="text-base sm:text-lg font-semibold text-zinc-900">{{ formattedDate }}</h2>
            <p class="text-xs text-zinc-500">{{ monthLabel }} — Day {{ currentDay }} of {{ daysInMonth }}</p>
          </div>
          <div class="flex flex-wrap gap-1">
            <button v-for="day in quickDays" :key="day" @click="goToDay(day)"
              :class="['w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-medium transition-all',
                currentDay === day ? 'bg-amber-500 text-white shadow-sm' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200']"
            >{{ day }}</button>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div v-if="reportSummary" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div class="bg-white rounded-xl p-3 border border-blue-200">
          <p class="text-[10px] sm:text-xs text-blue-500 mb-1">Big Opening</p>
          <p class="text-base sm:text-lg font-semibold text-blue-700">{{ reportSummary.totalBigOpening }}</p>
        </div>
        <div class="bg-white rounded-xl p-3 border border-emerald-200">
          <p class="text-[10px] sm:text-xs text-emerald-500 mb-1">Purchase In</p>
          <p class="text-base sm:text-lg font-semibold text-emerald-700">+{{ reportSummary.totalBigPurchaseIn }}</p>
        </div>
        <div class="bg-white rounded-xl p-3 border border-orange-200">
          <p class="text-[10px] sm:text-xs text-orange-500 mb-1">Move Out</p>
          <p class="text-base sm:text-lg font-semibold text-orange-700">-{{ reportSummary.totalBigMoveOut }}</p>
        </div>
        <div class="bg-white rounded-xl p-3 border border-violet-200">
          <p class="text-[10px] sm:text-xs text-violet-500 mb-1">Big Remaining</p>
          <p class="text-base sm:text-lg font-semibold text-violet-700">{{ reportSummary.totalBigRemaining }}</p>
        </div>
        <div class="bg-white rounded-xl p-3 border border-sky-200">
          <p class="text-[10px] sm:text-xs text-sky-500 mb-1">Small Opening</p>
          <p class="text-base sm:text-lg font-semibold text-sky-700">{{ reportSummary.totalSmallOpening }}</p>
        </div>
        <div class="bg-white rounded-xl p-3 border border-teal-200">
          <p class="text-[10px] sm:text-xs text-teal-500 mb-1">Move In</p>
          <p class="text-base sm:text-lg font-semibold text-teal-700">+{{ reportSummary.totalSmallMoveIn }}</p>
        </div>
        <div class="bg-white rounded-xl p-3 border border-red-200">
          <p class="text-[10px] sm:text-xs text-red-500 mb-1">Sell Out</p>
          <p class="text-base sm:text-lg font-semibold text-red-700">-{{ reportSummary.totalSmallSellOut }}</p>
        </div>
        <div class="bg-white rounded-xl p-3 border border-amber-200">
          <p class="text-[10px] sm:text-xs text-amber-500 mb-1">Small Closing</p>
          <p class="text-base sm:text-lg font-semibold text-amber-700">{{ reportSummary.totalSmallClosing }}</p>
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
        <button @click="handleSeedData" :disabled="seeding"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          <UIcon :name="seeding ? 'i-lucide-loader-2' : 'i-lucide-database'" :class="['w-4 h-4', seeding && 'animate-spin']" />
          {{ seeding ? 'Generating data...' : 'Generate Stock Data' }}
        </button>
      </div>

      <!-- Mobile Cards -->
      <div v-else class="block lg:hidden space-y-3">
        <div v-for="(report, index) in stockReports" :key="report.report_id" class="bg-white border border-zinc-200 rounded-lg p-3">
          <div class="flex items-start justify-between gap-2 mb-2.5">
            <div class="min-w-0">
              <span class="text-[10px] text-zinc-400 font-medium">{{ index + 1 }}.</span>
              <h4 class="text-sm font-medium text-zinc-900 truncate">{{ report.product_name }}</h4>
              <p class="text-[10px] text-zinc-500">{{ report.description }}</p>
            </div>
          </div>
          <p class="text-[10px] font-semibold text-blue-600 uppercase mb-1">Big Stock Inventory</p>
          <div class="grid grid-cols-4 gap-1 text-center mb-2">
            <div class="bg-blue-50 rounded p-1.5">
              <p class="text-[9px] text-blue-500 mb-0.5">Opening</p>
              <p class="text-xs font-semibold text-blue-700">{{ report.big_opening }}</p>
            </div>
            <div class="bg-emerald-50 rounded p-1.5">
              <p class="text-[9px] text-emerald-500 mb-0.5">Purchase In</p>
              <p class="text-xs font-semibold text-emerald-700">{{ report.big_purchase_in || '—' }}</p>
            </div>
            <div class="bg-orange-50 rounded p-1.5">
              <p class="text-[9px] text-orange-500 mb-0.5">Move Out</p>
              <p class="text-xs font-semibold text-orange-700">{{ report.big_move_out || '—' }}</p>
            </div>
            <div class="bg-violet-50 rounded p-1.5">
              <p class="text-[9px] text-violet-500 mb-0.5">Remaining</p>
              <p class="text-xs font-bold text-violet-700">{{ report.big_remaining }}</p>
            </div>
          </div>
          <p class="text-[10px] font-semibold text-sky-600 uppercase mb-1">Small Stock Inventory</p>
          <div class="grid grid-cols-4 gap-1 text-center">
            <div class="bg-sky-50 rounded p-1.5">
              <p class="text-[9px] text-sky-500 mb-0.5">Opening</p>
              <p class="text-xs font-semibold text-sky-700">{{ report.small_opening }}</p>
            </div>
            <div class="bg-teal-50 rounded p-1.5">
              <p class="text-[9px] text-teal-500 mb-0.5">Move In</p>
              <p class="text-xs font-semibold text-teal-700">{{ report.small_move_in || '—' }}</p>
            </div>
            <div class="bg-red-50 rounded p-1.5">
              <p class="text-[9px] text-red-500 mb-0.5">Sell Out</p>
              <p class="text-xs font-semibold text-red-700">{{ report.small_sell_out || '—' }}</p>
            </div>
            <div class="bg-amber-50 rounded p-1.5">
              <p class="text-[9px] text-amber-500 mb-0.5">Closing</p>
              <p :class="['text-xs font-bold', report.small_closing <= 0 ? 'text-red-700' : report.small_closing <= 3 ? 'text-amber-700' : 'text-amber-600']">{{ report.small_closing }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Table (Two-section layout) -->
      <div v-if="stockReports.length > 0" class="hidden lg:block bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-zinc-200">
                <th rowspan="2" class="text-center px-3 py-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider w-10 bg-zinc-50 border-r border-zinc-200">No</th>
                <th rowspan="2" class="text-left px-3 py-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider bg-zinc-50 border-r border-zinc-200 min-w-[180px]">Item Name</th>
                <th rowspan="2" class="text-left px-3 py-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider bg-zinc-50 border-r border-zinc-200 min-w-[100px]">Description</th>
                <th colspan="4" class="text-center px-3 py-2 text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50/60 border-r border-zinc-200">Big Stock Inventory</th>
                <th colspan="4" class="text-center px-3 py-2 text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50/60">Small Stock Inventory</th>
              </tr>
              <tr class="bg-zinc-50 border-b border-zinc-300">
                <th class="text-center px-3 py-2 text-[10px] font-semibold text-blue-600 uppercase bg-blue-50/40 border-r border-zinc-100 w-20">Opening</th>
                <th class="text-center px-3 py-2 text-[10px] font-semibold text-emerald-600 uppercase bg-emerald-50/40 border-r border-zinc-100 w-20">Purchase in</th>
                <th class="text-center px-3 py-2 text-[10px] font-semibold text-orange-600 uppercase bg-orange-50/40 border-r border-zinc-100 w-24">Move out<br><span class="text-[8px] normal-case text-orange-400">to Small Stock</span></th>
                <th class="text-center px-3 py-2 text-[10px] font-semibold text-violet-600 uppercase bg-violet-50/40 border-r border-zinc-200 w-24">Remaining<br><span class="text-[8px] normal-case text-violet-400">stock</span></th>
                <th class="text-center px-3 py-2 text-[10px] font-semibold text-sky-600 uppercase bg-sky-50/40 border-r border-zinc-100 w-20">Opening</th>
                <th class="text-center px-3 py-2 text-[10px] font-semibold text-teal-600 uppercase bg-teal-50/40 border-r border-zinc-100 w-20">Move in</th>
                <th class="text-center px-3 py-2 text-[10px] font-semibold text-red-600 uppercase bg-red-50/40 border-r border-zinc-100 w-20">Sell out</th>
                <th class="text-center px-3 py-2 text-[10px] font-semibold text-amber-700 uppercase bg-amber-50/40 w-24">Closing<br><span class="text-[8px] normal-case text-amber-500">stock</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(report, index) in stockReports" :key="report.report_id"
                :class="['border-b border-zinc-100 transition-colors hover:bg-zinc-50/50',
                  report.small_closing <= 0 && 'bg-red-50/20',
                  report.small_closing > 0 && report.small_closing <= 3 && 'bg-amber-50/20']"
              >
                <td class="px-3 py-2.5 text-center text-xs font-medium text-zinc-500 border-r border-zinc-100">{{ index + 1 }}</td>
                <td class="px-3 py-2.5 text-sm font-medium text-zinc-900 border-r border-zinc-100">{{ report.product_name }}</td>
                <td class="px-3 py-2.5 text-xs text-zinc-500 border-r border-zinc-100">{{ report.description }}</td>
                <td class="px-3 py-2.5 text-center border-r border-zinc-100"><span class="text-sm font-semibold text-blue-700">{{ report.big_opening }}</span></td>
                <td class="px-3 py-2.5 text-center border-r border-zinc-100">
                  <span v-if="report.big_purchase_in > 0" class="text-sm font-semibold text-emerald-700">{{ report.big_purchase_in }}</span>
                  <span v-else class="text-zinc-300">—</span>
                </td>
                <td class="px-3 py-2.5 text-center border-r border-zinc-100">
                  <span v-if="report.big_move_out > 0" class="text-sm font-semibold text-orange-700">{{ report.big_move_out }}</span>
                  <span v-else class="text-zinc-300">—</span>
                </td>
                <td class="px-3 py-2.5 text-center border-r border-zinc-200 bg-violet-50/20"><span class="text-sm font-bold text-violet-700">{{ report.big_remaining }}</span></td>
                <td class="px-3 py-2.5 text-center border-r border-zinc-100"><span class="text-sm font-semibold text-sky-700">{{ report.small_opening }}</span></td>
                <td class="px-3 py-2.5 text-center border-r border-zinc-100">
                  <span v-if="report.small_move_in > 0" class="text-sm font-semibold text-teal-700">{{ report.small_move_in }}</span>
                  <span v-else class="text-zinc-300">—</span>
                </td>
                <td class="px-3 py-2.5 text-center border-r border-zinc-100">
                  <span v-if="report.small_sell_out > 0" class="text-sm font-semibold text-red-700">{{ report.small_sell_out }}</span>
                  <span v-else class="text-zinc-300">—</span>
                </td>
                <td class="px-3 py-2.5 text-center bg-amber-50/20">
                  <span :class="['text-sm font-bold', report.small_closing <= 0 ? 'text-red-700' : report.small_closing <= 3 ? 'text-amber-700' : 'text-zinc-900']">{{ report.small_closing }}</span>
                </td>
              </tr>
            </tbody>
            <tfoot v-if="reportSummary">
              <tr class="bg-zinc-50 border-t-2 border-zinc-300 font-bold">
                <td class="px-3 py-3 text-xs text-zinc-900 border-r border-zinc-200" colspan="3">Total</td>
                <td class="px-3 py-3 text-center text-sm text-blue-700 border-r border-zinc-100">{{ reportSummary.totalBigOpening }}</td>
                <td class="px-3 py-3 text-center text-sm text-emerald-700 border-r border-zinc-100">{{ reportSummary.totalBigPurchaseIn }}</td>
                <td class="px-3 py-3 text-center text-sm text-orange-700 border-r border-zinc-100">{{ reportSummary.totalBigMoveOut }}</td>
                <td class="px-3 py-3 text-center text-sm text-violet-700 bg-violet-50/20 border-r border-zinc-200">{{ reportSummary.totalBigRemaining }}</td>
                <td class="px-3 py-3 text-center text-sm text-sky-700 border-r border-zinc-100">{{ reportSummary.totalSmallOpening }}</td>
                <td class="px-3 py-3 text-center text-sm text-teal-700 border-r border-zinc-100">{{ reportSummary.totalSmallMoveIn }}</td>
                <td class="px-3 py-3 text-center text-sm text-red-700 border-r border-zinc-100">{{ reportSummary.totalSmallSellOut }}</td>
                <td class="px-3 py-3 text-center text-sm text-amber-700 bg-amber-50/20">{{ reportSummary.totalSmallClosing }}</td>
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

          <!-- BoH Mobile -->
          <div class="block md:hidden">
            <div class="max-h-[50vh] overflow-y-auto space-y-2 sm:space-y-3 p-3">
              <div v-for="(item, index) in bohData" :key="'m-boh-' + item.product_id"
                :class="['bg-zinc-50 border border-zinc-200 rounded-lg p-3', item.needs_reorder && 'border-red-200 bg-red-50/20']"
              >
                <div class="flex items-start justify-between gap-2 mb-2">
                  <div class="min-w-0">
                    <span class="text-[10px] text-zinc-400 font-medium">{{ index + 1 }}.</span>
                    <h4 class="text-sm font-medium text-zinc-900 truncate">{{ item.product_name }}</h4>
                    <p class="text-[10px] text-zinc-500 truncate">{{ item.description }}</p>
                  </div>
                  <span :class="['text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                    item.needs_reorder ? 'text-red-700 bg-red-100' : 'text-emerald-700 bg-emerald-100']">
                    {{ item.needs_reorder ? 'Reorder' : 'OK' }}
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-1.5 text-center mb-1.5">
                  <div class="bg-white rounded-lg p-1.5">
                    <p class="text-[9px] text-amber-600 mb-0.5">BoH</p>
                    <p :class="['text-xs font-bold',
                      item.current_stock <= 0 ? 'text-red-700' :
                      item.current_stock <= item.safety_stock ? 'text-amber-700' : 'text-emerald-700']">{{ item.current_stock }}</p>
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

          <!-- BoH Desktop -->
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
                <tr v-for="(item, index) in bohData" :key="item.product_id"
                  :class="['border-b border-zinc-100 transition-colors hover:bg-zinc-50', item.needs_reorder && 'bg-red-50/20']"
                >
                  <td class="px-4 py-3 text-sm font-medium text-zinc-500">{{ index + 1 }}</td>
                  <td class="px-4 py-3 text-sm font-medium text-zinc-900">{{ item.product_name }}</td>
                  <td class="px-4 py-3 text-sm text-zinc-500 hidden sm:table-cell">{{ item.description }}</td>
                  <td class="px-4 py-3 text-center text-sm font-medium text-emerald-700">{{ item.total_purchased }}</td>
                  <td class="px-4 py-3 text-center text-sm font-medium text-red-700">{{ item.total_sold }}</td>
                  <td class="px-4 py-3 text-center">
                    <span :class="['text-sm font-bold px-2.5 py-1 rounded-lg',
                      item.current_stock <= 0 ? 'text-red-700 bg-red-100' :
                      item.current_stock <= item.safety_stock ? 'text-amber-700 bg-amber-100' : 'text-emerald-700 bg-emerald-50']">
                      {{ item.current_stock }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center text-sm text-zinc-600">{{ item.safety_stock }}</td>
                  <td class="px-4 py-3 text-center">
                    <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full',
                      item.needs_reorder ? 'text-red-700 bg-red-100' : 'text-emerald-700 bg-emerald-100']">
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

// Default to Feb 20 2026 (where seed data exists)
const selectedDate = ref('2026-02-20');
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

const quickDays = computed(() => {
  const dim = daysInMonth.value;
  const days: number[] = [1];
  for (let d = 5; d < dim; d += 5) days.push(d);
  if (!days.includes(dim)) days.push(dim);
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

// Export with new Big/Small columns
const handleExportExcel = () => {
  const { exportToExcel } = useExport();
  const data = stockReports.value.map((r: any, i: number) => ({
    no: i + 1,
    product_name: r.product_name,
    description: r.description,
    big_opening: r.big_opening,
    big_purchase_in: r.big_purchase_in,
    big_move_out: r.big_move_out,
    big_remaining: r.big_remaining,
    small_opening: r.small_opening,
    small_move_in: r.small_move_in,
    small_sell_out: r.small_sell_out,
    small_closing: r.small_closing,
  }));
  const columns = [
    { header: 'No.', key: 'no', width: 6 },
    { header: 'Product Name', key: 'product_name', width: 30 },
    { header: 'Description', key: 'description', width: 15 },
    { header: 'Big Opening', key: 'big_opening', width: 12 },
    { header: 'Purchase In', key: 'big_purchase_in', width: 12 },
    { header: 'Move Out', key: 'big_move_out', width: 10 },
    { header: 'Big Remaining', key: 'big_remaining', width: 14 },
    { header: 'Small Opening', key: 'small_opening', width: 14 },
    { header: 'Move In', key: 'small_move_in', width: 10 },
    { header: 'Sell Out', key: 'small_sell_out', width: 10 },
    { header: 'Small Closing', key: 'small_closing', width: 14 },
  ];
  exportToExcel(data, columns, `beer_stock_${selectedDate.value}`);
};

onMounted(loadData);
</script>
