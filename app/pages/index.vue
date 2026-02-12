<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-layout-dashboard" class="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Dashboard</h1>
            <p class="text-xs sm:text-sm text-zinc-500">{{ todayFormatted }}</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button 
            @click="handleExportExcel"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-emerald-100"
          >
            <UIcon name="i-lucide-file-spreadsheet" class="w-3.5 h-3.5" />
            Excel
          </button>
          <button 
            @click="handleExportPDF"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-red-100"
          >
            <UIcon name="i-lucide-file-text" class="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
      </div>
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div class="bg-white rounded-lg p-3 sm:p-4 border border-zinc-200 hover:border-zinc-300 transition-colors">
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-package" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
          </div>
          <p class="text-sm sm:text-lg md:text-xl font-semibold text-zinc-900">{{ stats.totalProducts }}</p>
          <p class="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 mt-0.5 sm:mt-1">Total Products</p>
        </div>
        
        <div class="bg-white rounded-lg p-3 sm:p-4 border border-zinc-200 hover:border-zinc-300 transition-colors">
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-building-2" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>
          </div>
          <p class="text-sm sm:text-lg md:text-xl font-semibold text-zinc-900">{{ stats.totalSuppliers }}</p>
          <p class="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 mt-0.5 sm:mt-1">Total Suppliers</p>
        </div>
        
        <div class="bg-white rounded-lg p-3 sm:p-4 border border-zinc-200 hover:border-zinc-300 transition-colors">
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-clipboard-list" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
            </div>
            <span class="text-[9px] sm:text-[10px] md:text-xs font-medium text-amber-600 bg-amber-50 px-1 sm:px-1.5 py-0.5 rounded-full">Active</span>
          </div>
          <p class="text-sm sm:text-lg md:text-xl font-semibold text-zinc-900">{{ stats.activePOs }}</p>
          <p class="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 mt-0.5 sm:mt-1">Pending POs</p>
        </div>
        
        <div class="bg-white rounded-lg p-3 sm:p-4 border border-zinc-200 hover:border-zinc-300 transition-colors">
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-shopping-bag" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600" />
            </div>
            <span class="text-[9px] sm:text-[10px] md:text-xs font-medium text-zinc-500 bg-zinc-100 px-1 sm:px-1.5 py-0.5 rounded-full">Today</span>
          </div>
          <p class="text-sm sm:text-lg md:text-xl font-semibold text-zinc-900">{{ stats.todayOrders || 0 }}</p>
          <p class="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 mt-0.5 sm:mt-1">Today's Orders</p>
        </div>
        
        <div class="bg-white rounded-lg p-3 sm:p-4 border border-zinc-200 hover:border-zinc-300 transition-colors">
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-trending-up" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            </div>
            <span class="text-[9px] sm:text-[10px] md:text-xs font-medium text-zinc-500 bg-zinc-100 px-1 sm:px-1.5 py-0.5 rounded-full">Today</span>
          </div>
          <p :class="['text-sm sm:text-lg md:text-xl font-semibold', getSalesColorClass(stats.todaySales)]">
            ${{ formatNumber(stats.todaySales) }}
          </p>
          <p class="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 mt-0.5 sm:mt-1">Today's Sales</p>
        </div>
        
        <div class="bg-white rounded-lg p-3 sm:p-4 border border-zinc-200 hover:border-zinc-300 transition-colors col-span-2 sm:col-span-1">
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-wallet" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            </div>
            <span :class="['text-[9px] sm:text-[10px] md:text-xs font-medium px-1 sm:px-1.5 py-0.5 rounded-full', getProfitBadgeClass(stats.todayProfit)]">
              Today
            </span>
          </div>
          <p :class="['text-sm sm:text-lg md:text-xl font-semibold', getProfitColorClass(stats.todayProfit)]">
            {{ stats.todayProfit >= 0 ? '+' : '' }}${{ formatNumber(stats.todayProfit) }}
          </p>
          <p class="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 mt-0.5 sm:mt-1">Today's Profit</p>
        </div>
      </div>

      <!-- Sales Trend Chart -->
      <div class="bg-white rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 lg:mb-8 border border-zinc-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-line-chart" class="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-medium text-zinc-900">Today's Hourly Sales</h3>
              <p class="text-xs text-zinc-500">Sales activity throughout today</p>
            </div>
          </div>
          <div class="flex gap-4 text-xs">
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></span>
              Hourly Revenue
            </span>
          </div>
        </div>
        
        <!-- Sales Trend SVG Chart -->
        <div class="relative overflow-x-auto">
          <svg class="w-full min-w-[400px] h-48 sm:h-56" viewBox="0 0 800 220" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="trendAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.02" />
              </linearGradient>
              <linearGradient id="trendLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#34d399" />
                <stop offset="100%" style="stop-color:#059669" />
              </linearGradient>
            </defs>
            
            <!-- Grid lines -->
            <g stroke="#e4e4e7" stroke-width="1" stroke-dasharray="4,4">
              <line x1="60" y1="30" x2="780" y2="30" />
              <line x1="60" y1="70" x2="780" y2="70" />
              <line x1="60" y1="110" x2="780" y2="110" />
              <line x1="60" y1="150" x2="780" y2="150" />
              <line x1="60" y1="190" x2="780" y2="190" />
            </g>
            
            <!-- Y-axis labels -->
            <g fill="#71717a" font-size="10" font-weight="500">
              <text x="50" y="34" text-anchor="end">${{ formatChartValue(maxHourlyValue) }}</text>
              <text x="50" y="74" text-anchor="end">${{ formatChartValue(maxHourlyValue * 0.75) }}</text>
              <text x="50" y="114" text-anchor="end">${{ formatChartValue(maxHourlyValue * 0.5) }}</text>
              <text x="50" y="154" text-anchor="end">${{ formatChartValue(maxHourlyValue * 0.25) }}</text>
              <text x="50" y="194" text-anchor="end">$0</text>
            </g>
            
            <!-- Area fill -->
            <path :d="trendAreaPath" fill="url(#trendAreaGradient)" />
            
            <!-- Line -->
            <path :d="trendLinePath" fill="none" stroke="url(#trendLineGradient)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            
            <!-- Data points -->
            <g v-for="(point, index) in hourlyChartData" :key="index">
              <circle 
                :cx="point.x" 
                :cy="point.y" 
                r="6" 
                fill="white" 
                stroke="#10b981" 
                stroke-width="3" 
                class="cursor-pointer hover:r-8 transition-all"
                @mouseenter="showTooltip($event, `${point.label}: $${formatNumber(point.value)}`)"
                @mouseleave="hideTooltip"
              />
              <text :x="point.x" y="210" text-anchor="middle" fill="#71717a" font-size="10" font-weight="500">{{ point.label }}</text>
            </g>
            
            <!-- No data message -->
            <g v-if="hourlyChartData.length === 0">
              <text x="420" y="110" text-anchor="middle" fill="#a1a1aa" font-size="14">No sales data for today yet</text>
            </g>
          </svg>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <!-- Sales by Category Chart -->
        <div class="lg:col-span-2 bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-zinc-200">
          <div class="flex items-center gap-3 mb-3 sm:mb-4 md:mb-6">
            <div class="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-pie-chart" class="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 class="text-sm font-medium text-zinc-900">Today's Sales by Product</h3>
              <p class="text-xs text-zinc-500">Revenue distribution</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
            <!-- Donut Chart -->
            <div class="flex items-center justify-center">
              <svg width="180" height="180" viewBox="0 0 200 200" class="transform -rotate-90 w-32 h-32 sm:w-40 sm:h-40 md:w-[180px] md:h-[180px]">
                <circle cx="100" cy="100" r="70" fill="none" class="stroke-zinc-100" stroke-width="30" />
                <circle
                  v-for="segment in chartSegments"
                  :key="segment.category"
                  cx="100" cy="100" r="70" fill="none"
                  :stroke="segment.color"
                  stroke-width="30"
                  :stroke-dasharray="`${segment.percentage * 4.4} 440`"
                  :stroke-dashoffset="segment.offset"
                  class="cursor-pointer hover:opacity-80 transition-opacity"
                  @mouseenter="showTooltip($event, `${segment.category}: ${segment.percentage}%`)"
                  @mouseleave="hideTooltip"
                />
                <circle cx="100" cy="100" r="50" class="fill-white" />
              </svg>
            </div>
            
            <!-- Legend with scrollable container -->
            <div class="max-h-[180px] overflow-y-auto space-y-1.5 sm:space-y-2 pr-2">
              <div 
                v-for="category in analytics.categories" 
                :key="category.name"
                class="flex items-center justify-between py-1 sm:py-1.5 px-2 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <div class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" :style="{backgroundColor: category.color}" />
                  <span class="text-[10px] sm:text-xs md:text-sm text-zinc-600 truncate">{{ category.name }}</span>
                </div>
                <span class="text-[10px] sm:text-xs md:text-sm font-medium text-zinc-900 ml-2">{{ category.percentage }}%</span>
              </div>
              <div v-if="analytics.categories.length === 0" class="text-center py-4">
                <p class="text-xs text-zinc-400">No sales data today</p>
              </div>
            </div>
          </div>
          
          <!-- Summary -->
          <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-zinc-100 grid grid-cols-2 gap-3 sm:gap-4">
            <div class="bg-emerald-50 rounded-lg p-3 sm:p-4">
              <p class="text-[10px] sm:text-xs text-emerald-600 mb-0.5 sm:mb-1">Today's Revenue</p>
              <p class="text-sm sm:text-base md:text-lg font-semibold text-emerald-700">${{ analytics.totalRevenue.toLocaleString() }}</p>
            </div>
            <div class="bg-amber-50 rounded-lg p-3 sm:p-4">
              <p class="text-[10px] sm:text-xs text-amber-600 mb-0.5 sm:mb-1">Top Product</p>
              <p class="text-sm sm:text-base md:text-lg font-semibold text-amber-700 truncate">{{ analytics.categories[0]?.name || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Top Products & Stock Alerts -->
        <div class="space-y-3 sm:space-y-4 md:space-y-6">
          <!-- Top Products -->
          <div class="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-zinc-200">
            <div class="flex items-center gap-3 mb-3 sm:mb-4">
              <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <UIcon name="i-lucide-trophy" class="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 class="text-sm font-medium text-zinc-900">Top Selling Today</h3>
                <p class="text-xs text-zinc-500">Best performers</p>
              </div>
            </div>
            
            <div class="max-h-[200px] overflow-y-auto space-y-2 sm:space-y-3">
              <div 
                v-for="(product, index) in displayTopProducts" 
                :key="product.name"
                class="flex items-center gap-2 sm:gap-3 p-2 bg-zinc-50 rounded-lg"
              >
                <div class="w-6 h-6 sm:w-7 sm:h-7 bg-amber-100 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-semibold text-amber-700 shrink-0">
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[10px] sm:text-xs font-medium text-zinc-900 truncate">{{ product.name }}</p>
                </div>
                <span class="text-[10px] sm:text-xs font-semibold text-amber-600 shrink-0">{{ product.sold }} sold</span>
              </div>
            </div>
          </div>

          <!-- Low Stock Alerts -->
          <div class="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-zinc-200">
            <div class="flex items-center gap-3 mb-3 sm:mb-4">
              <div class="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 class="text-sm font-medium text-zinc-900">Low Stock Alerts</h3>
                <p class="text-xs text-zinc-500">Needs attention</p>
              </div>
            </div>
            
            <div v-if="stats.lowStockProducts && stats.lowStockProducts.length > 0" class="max-h-[150px] overflow-y-auto space-y-2">
              <div 
                v-for="product in stats.lowStockProducts" 
                :key="product.product_id"
                class="flex items-center justify-between p-2 bg-red-50 rounded-lg"
              >
                <span class="text-[10px] sm:text-xs text-red-700 font-medium truncate">{{ product.product_name }}</span>
                <span class="text-[10px] sm:text-xs font-semibold text-red-600 shrink-0 bg-red-100 px-2 py-0.5 rounded-full">{{ product.current_stock }} left</span>
              </div>
            </div>
            <div v-else class="text-center py-4">
              <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-500" />
              </div>
              <p class="text-xs text-zinc-500">All stock levels are healthy!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Balance on Hand (BoH) Section -->
      <div class="bg-white rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 lg:mb-8 border border-zinc-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-warehouse" class="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-semibold text-zinc-900">Balance on Hand (BoH)</h3>
              <p class="text-xs text-zinc-500">Current stock levels &amp; reorder status</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div v-if="bohSummary" class="flex items-center gap-2">
              <span class="text-xs text-zinc-500">Need Reorder:</span>
              <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', bohSummary.needsReorderCount > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700']">
                {{ bohSummary.needsReorderCount }} / {{ bohSummary.totalProducts }}
              </span>
            </div>
            <NuxtLink to="/stock-reports" class="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 no-underline">
              View Reports <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
        </div>

        <!-- BoH Summary Cards -->
        <div v-if="bohSummary" class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          <div class="bg-blue-50 rounded-lg p-3">
            <p class="text-xs text-blue-600 mb-1">Total Stock</p>
            <p class="text-lg font-bold text-blue-700">{{ bohSummary.totalStock }}</p>
            <p class="text-[10px] text-blue-500">units on hand</p>
          </div>
          <div class="bg-emerald-50 rounded-lg p-3">
            <p class="text-xs text-emerald-600 mb-1">Inventory Value</p>
            <p class="text-lg font-bold text-emerald-700">${{ (bohSummary.totalValue || 0).toLocaleString() }}</p>
            <p class="text-[10px] text-emerald-500">at cost price</p>
          </div>
          <div class="bg-amber-50 rounded-lg p-3">
            <p class="text-xs text-amber-600 mb-1">Healthy</p>
            <p class="text-lg font-bold text-amber-700">{{ bohSummary.healthyCount }}</p>
            <p class="text-[10px] text-amber-500">products OK</p>
          </div>
          <div :class="['rounded-lg p-3', bohSummary.needsReorderCount > 0 ? 'bg-red-50' : 'bg-emerald-50']">
            <p :class="['text-xs mb-1', bohSummary.needsReorderCount > 0 ? 'text-red-600' : 'text-emerald-600']">Needs Reorder</p>
            <p :class="['text-lg font-bold', bohSummary.needsReorderCount > 0 ? 'text-red-700' : 'text-emerald-700']">{{ bohSummary.needsReorderCount }}</p>
            <p :class="['text-[10px]', bohSummary.needsReorderCount > 0 ? 'text-red-500' : 'text-emerald-500']">products below ROP</p>
          </div>
        </div>

        <!-- BoH Product Table -->
        <div v-if="bohItems.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-zinc-200">
                <th class="text-left px-3 py-2 text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase">Product</th>
                <th class="text-center px-3 py-2 text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase hidden sm:table-cell">Desc</th>
                <th class="text-center px-3 py-2 text-[10px] sm:text-xs font-semibold text-amber-600 uppercase bg-amber-50/50 rounded-t">BoH</th>
                <th class="text-center px-3 py-2 text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase">Safety</th>
                <th class="text-center px-3 py-2 text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase">Reorder?</th>
                <th class="text-center px-3 py-2 text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase">EOQ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in bohItems" :key="item.product_id" class="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                <td class="px-3 py-2.5 text-xs sm:text-sm font-medium text-zinc-900">{{ item.product_name }}</td>
                <td class="px-3 py-2.5 text-xs text-zinc-500 text-center hidden sm:table-cell">{{ item.description }}</td>
                <td class="px-3 py-2.5 text-center">
                  <span :class="[
                    'text-xs sm:text-sm font-bold px-2 py-0.5 rounded-lg',
                    item.current_stock <= 0 ? 'text-red-700 bg-red-100' :
                    item.needs_reorder ? 'text-amber-700 bg-amber-100' :
                    'text-emerald-700 bg-emerald-50'
                  ]">{{ item.current_stock }}</span>
                </td>
                <td class="px-3 py-2.5 text-center text-xs text-zinc-600">{{ item.safety_stock }}</td>
                <td class="px-3 py-2.5 text-center">
                  <span :class="['text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full', item.needs_reorder ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700']">
                    {{ item.needs_reorder ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td class="px-3 py-2.5 text-center text-xs font-semibold text-zinc-700">{{ item.eoq }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-6">
          <p class="text-xs text-zinc-400">No stock data available. <NuxtLink to="/stock-reports" class="text-amber-600 hover:underline">Load stock reports</NuxtLink> first.</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-zinc-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-zap" class="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-zinc-900">Quick Actions</h3>
            <p class="text-xs text-zinc-500">Common operations</p>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <NuxtLink 
            to="/products/new" 
            class="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors no-underline"
          >
            <div class="w-9 h-9 sm:w-10 sm:h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-package-plus" class="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <span class="text-[10px] sm:text-xs md:text-sm font-medium text-zinc-700 text-center">Add Product</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/suppliers/new" 
            class="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors no-underline"
          >
            <div class="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-building-2" class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <span class="text-[10px] sm:text-xs md:text-sm font-medium text-zinc-700 text-center">Add Supplier</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/purchase-orders/new" 
            class="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors no-underline"
          >
            <div class="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-file-plus" class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <span class="text-[10px] sm:text-xs md:text-sm font-medium text-zinc-700 text-center">Create PO</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/sales/new" 
            class="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors no-underline"
          >
            <div class="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-receipt" class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <span class="text-[10px] sm:text-xs md:text-sm font-medium text-zinc-700 text-center">Add Sale</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <div 
      v-if="tooltip.show"
      class="fixed z-50 px-3 py-2 bg-zinc-900 text-white text-xs rounded-lg shadow-lg pointer-events-none"
      :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
    >
      {{ tooltip.text }}
    </div>
    
    <!-- Loading Overlay -->
    <div 
      v-if="isLoading && !isInitialized"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-amber-500 animate-spin" />
        <p class="text-sm text-zinc-600">Loading dashboard...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';

// Use the centralized dashboard composable for fast cached data
const {
  stats,
  isLoading,
  isInitialized,
  fetchStats,
  refresh,
  chartSegments,
  maxHourlyValue,
  hourlyChartData,
  trendLinePath,
  trendAreaPath,
  displayTopProducts,
  formatNumber,
  formatChartValue,
  getProfitColorClass,
  getProfitBadgeClass,
  getSalesColorClass,
} = useDashboard();

// BoH data
const { bohData: bohItems, bohSummary, fetchBoH } = useStockReports();

// Today's formatted date
const todayFormatted = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

// Tooltip state
const tooltip = ref({ show: false, x: 0, y: 0, text: '' });

const showTooltip = (event: MouseEvent, text: string) => {
  tooltip.value = {
    show: true,
    x: event.clientX + 10,
    y: event.clientY - 30,
    text
  };
};

const hideTooltip = () => {
  tooltip.value.show = false;
};

// Analytics computed from stats (for backward compatibility in template)
const analytics = computed(() => stats.value.analytics);

// Auto-refresh interval (every 60 seconds when page is visible)
let refreshInterval: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
  // Fetch data immediately (uses cache if available)
  await Promise.all([fetchStats(), fetchBoH()]);
  
  // Set up auto-refresh every 60 seconds
  refreshInterval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      fetchStats(true); // Force refresh
    }
  }, 60000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});

// Export functions
const handleExportExcel = () => {
  const { exportToExcel } = useExport();
  
  // Summary data
  const summaryData = [
    { metric: 'Total Products', value: stats.value.totalProducts },
    { metric: 'Total Suppliers', value: stats.value.totalSuppliers },
    { metric: 'Active POs', value: stats.value.activePOs },
    { metric: 'Today\'s Orders', value: stats.value.todayOrders || 0 },
    { metric: 'Today\'s Sales', value: stats.value.todaySales || 0 },
    { metric: 'Today\'s Profit', value: stats.value.todayProfit || 0 },
  ];
  
  const columns = [
    { header: 'Metric', key: 'metric', width: 20 },
    { header: 'Value', key: 'value', width: 15 },
  ];
  
  exportToExcel(summaryData, columns, 'dashboard_summary');
};

const handleExportPDF = () => {
  const { exportDashboardPDF } = useExport();
  
  const dashboardStats = {
    productCount: stats.value.totalProducts,
    supplierCount: stats.value.totalSuppliers,
    activePoCount: stats.value.activePOs,
    todaySales: stats.value.todaySales || 0,
    todayProfit: stats.value.todayProfit || 0,
    todayOrders: stats.value.todayOrders || 0,
    lowStockProducts: stats.value.lowStockProducts || [],
    topProducts: analytics.value.topProducts.map(p => ({
      product_name: p.name,
      total_sold: p.sold,
    })),
  };
  
  exportDashboardPDF(dashboardStats);
};
</script>
