<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-bar-chart-2" class="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900">Analytics</h1>
            <p class="text-xs sm:text-sm text-zinc-500">Business performance insights</p>
          </div>
        </div>
        
        <!-- Export Buttons and Date Range Filter -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
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
          <DateRangePicker v-model="dateRange" />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12 sm:py-20">
        <UIcon name="i-lucide-loader-2" class="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 animate-spin" />
      </div>

      <div v-else>
        <!-- KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <!-- Total Revenue -->
          <div class="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-zinc-200">
            <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-trending-up" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              </div>
              <span class="text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full">Revenue</span>
            </div>
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-zinc-900 truncate">${{ formatNumber(totalRevenue) }}</p>
            <p class="text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1 truncate">Total sales revenue</p>
          </div>

          <!-- Total Costs -->
          <div class="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-zinc-200">
            <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-receipt" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <span class="text-[10px] sm:text-xs font-medium text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full">Costs</span>
            </div>
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-zinc-900 truncate">${{ formatNumber(totalPOValue) }}</p>
            <p class="text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1 truncate">Purchase order costs</p>
          </div>

          <!-- Net Profit -->
          <div class="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-zinc-200">
            <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-wallet" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
              </div>
              <span :class="['text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full', grossProfit >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50']">
                {{ grossProfit >= 0 ? 'Profit' : 'Loss' }}
              </span>
            </div>
            <p :class="['text-base sm:text-lg md:text-xl lg:text-2xl font-semibold truncate', grossProfit >= 0 ? 'text-emerald-600' : 'text-red-600']">
              {{ grossProfit >= 0 ? '' : '-' }}${{ formatNumber(Math.abs(grossProfit)) }}
            </p>
            <p class="text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1 truncate">{{ profitMargin }}% margin</p>
          </div>

          <!-- Inventory Value -->
          <div class="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-zinc-200">
            <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-warehouse" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              </div>
              <span class="text-[10px] sm:text-xs font-medium text-amber-600 bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded-full">Inventory</span>
            </div>
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-zinc-900 truncate">${{ formatNumber(totalInventoryValue) }}</p>
            <p class="text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1 truncate">{{ formatNumber(totalStockUnits) }} units</p>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          <!-- Revenue Trend -->
          <div class="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-zinc-200">
            <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
              <div class="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                <UIcon name="i-lucide-line-chart" class="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 class="text-sm font-medium text-zinc-900">Revenue vs Costs</h3>
                <p class="text-xs text-zinc-500">Monthly comparison</p>
              </div>
            </div>
            
            <div class="relative overflow-x-auto">
              <svg class="w-full min-w-[400px] h-56" viewBox="0 0 800 250" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="revenueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.02" />
                  </linearGradient>
                  <linearGradient id="costGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.2" />
                    <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.02" />
                  </linearGradient>
                </defs>
                
                <!-- Grid -->
                <g stroke="#e4e4e7" stroke-width="1" stroke-dasharray="4,4">
                  <line x1="60" y1="30" x2="780" y2="30" />
                  <line x1="60" y1="130" x2="780" y2="130" />
                  <line x1="60" y1="230" x2="780" y2="230" />
                </g>
                
                <!-- Y-axis labels -->
                <g fill="#71717a" font-size="10">
                  <text x="50" y="34" text-anchor="end">${{ formatChartLabel(chartMaxValue) }}</text>
                  <text x="50" y="134" text-anchor="end">${{ formatChartLabel(chartMaxValue * 0.5) }}</text>
                  <text x="50" y="234" text-anchor="end">$0</text>
                </g>
                
                <!-- Cost area & line -->
                <path :d="costAreaPath" fill="url(#costGrad)" />
                <path :d="costLinePath" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="6,4" />
                
                <!-- Revenue area & line -->
                <path :d="revenueAreaPath" fill="url(#revenueGrad)" />
                <path :d="revenueLinePath" fill="none" stroke="#10b981" stroke-width="3" />
                
                <!-- Data points -->
                <g v-for="(point, idx) in chartData" :key="idx">
                  <circle 
                    :cx="point.x" :cy="point.revenueY" r="5" fill="white" stroke="#10b981" stroke-width="2"
                    class="cursor-pointer" 
                    @mouseenter="showTooltip($event, `${point.label}: $${formatNumber(point.revenue)}`)"
                    @mouseleave="hideTooltip"
                  />
                  <circle 
                    :cx="point.x" :cy="point.costY" r="4" fill="white" stroke="#3b82f6" stroke-width="2"
                    class="cursor-pointer"
                    @mouseenter="showTooltip($event, `${point.label} Costs: $${formatNumber(point.cost)}`)"
                    @mouseleave="hideTooltip"
                  />
                  <text :x="point.x" y="248" text-anchor="middle" fill="#71717a" font-size="10">{{ point.label }}</text>
                </g>
              </svg>
            </div>
            
            <div class="flex justify-center gap-6 mt-4">
              <span class="flex items-center gap-2 text-xs"><span class="w-3 h-3 bg-emerald-500 rounded-full"></span> Revenue</span>
              <span class="flex items-center gap-2 text-xs"><span class="w-3 h-3 bg-blue-500 rounded-full"></span> Costs</span>
            </div>
          </div>

          <!-- Inventory Health -->
          <div class="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-zinc-200">
            <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
              <div class="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                <UIcon name="i-lucide-warehouse" class="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 class="text-sm font-medium text-zinc-900">Inventory Health</h3>
                <p class="text-xs text-zinc-500">Stock levels overview</p>
              </div>
            </div>
            
            <!-- Stock Summary Cards -->
            <div class="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
              <div 
                class="flex items-center justify-between p-2.5 sm:p-3 bg-emerald-50 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors"
                @mouseenter="showTooltip($event, `${stockStats.inStockProducts} products with healthy stock (${formatNumber(stockStats.inStockUnits)} units)`)"
                @mouseleave="hideTooltip"
              >
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                    <UIcon name="i-lucide-check" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm font-semibold text-emerald-700">In Stock</p>
                    <p class="text-[10px] sm:text-xs text-emerald-600">{{ stockStats.inStockProducts }} products</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm sm:text-lg font-semibold text-emerald-700">{{ formatNumber(stockStats.inStockUnits) }}</p>
                  <p class="text-[10px] sm:text-xs text-emerald-600">units</p>
                </div>
              </div>
              
              <div 
                class="flex items-center justify-between p-2.5 sm:p-3 bg-amber-50 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
                @mouseenter="showTooltip($event, `${stockStats.lowStockProducts} products with low stock (${formatNumber(stockStats.lowStockUnits)} units)`)"
                @mouseleave="hideTooltip"
              >
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                    <UIcon name="i-lucide-alert-triangle" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm font-medium text-amber-700">Low Stock</p>
                    <p class="text-[10px] sm:text-xs text-amber-600">{{ stockStats.lowStockProducts }} products</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm sm:text-lg font-semibold text-amber-700">{{ formatNumber(stockStats.lowStockUnits) }}</p>
                  <p class="text-[10px] sm:text-xs text-amber-600">units</p>
                </div>
              </div>
              
              <div 
                class="flex items-center justify-between p-2.5 sm:p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                @mouseenter="showTooltip($event, `${stockStats.outOfStockProducts} products with zero stock`)"
                @mouseleave="hideTooltip"
              >
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <UIcon name="i-lucide-x" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm font-medium text-red-700">Out of Stock</p>
                    <p class="text-[10px] sm:text-xs text-red-600">{{ stockStats.outOfStockProducts }} products</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm sm:text-lg font-semibold text-red-700">0</p>
                  <p class="text-[10px] sm:text-xs text-red-600">units</p>
                </div>
              </div>
            </div>
            
            <!-- Stock Bar -->
            <div class="mt-4">
              <div class="flex h-3 rounded-full overflow-hidden bg-zinc-100">
                <div class="bg-emerald-500 transition-all" :style="{ width: `${stockStats.inStockPercent}%` }"></div>
                <div class="bg-amber-500 transition-all" :style="{ width: `${stockStats.lowStockPercent}%` }"></div>
                <div class="bg-red-500 transition-all" :style="{ width: `${stockStats.outOfStockPercent}%` }"></div>
              </div>
              <div class="flex justify-between mt-2 text-[10px] text-zinc-500">
                <span>{{ stockStats.inStockPercent }}% healthy</span>
                <span>{{ stockStats.lowStockPercent }}% low</span>
                <span>{{ stockStats.outOfStockPercent }}% empty</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Second Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          <!-- Top Products Donut -->
          <div class="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-zinc-200">
            <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
              <div class="w-8 h-8 sm:w-9 sm:h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                <UIcon name="i-lucide-pie-chart" class="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-medium text-zinc-900">Sales by Product</h3>
                <p class="text-[10px] sm:text-xs text-zinc-500">Top performing products</p>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div class="relative">
                <svg class="w-32 h-32 sm:w-44 sm:h-44" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#f4f4f5" stroke-width="24" />
                  <g v-for="(segment, idx) in productDonutSegments" :key="idx">
                    <circle 
                      cx="100" cy="100" r="80" fill="none"
                      :stroke="segment.color"
                      stroke-width="24"
                      :stroke-dasharray="`${segment.dashArray} 502.4`"
                      :stroke-dashoffset="segment.offset"
                      stroke-linecap="round"
                      class="cursor-pointer hover:opacity-80"
                      style="transform: rotate(-90deg); transform-origin: center;"
                      @mouseenter="showTooltip($event, `${segment.name}: $${formatNumber(segment.value)} (${segment.percent}%)`)"
                      @mouseleave="hideTooltip"
                    />
                  </g>
                  <circle cx="100" cy="100" r="56" fill="white" />
                  <text x="100" y="95" text-anchor="middle" class="text-2xl font-bold fill-zinc-900">{{ topProductsData.length }}</text>
                  <text x="100" y="115" text-anchor="middle" class="text-xs fill-zinc-500">Products</text>
                </svg>
              </div>
              
              <div class="w-full sm:flex-1 space-y-1.5 sm:space-y-2 max-h-44 overflow-y-auto">
                <div 
                  v-for="(item, idx) in topProductsData.slice(0, 6)" 
                  :key="idx"
                  class="flex items-center gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-zinc-50 cursor-pointer"
                  @mouseenter="showTooltip($event, `${item.name}: $${formatNumber(item.value)}`)"
                  @mouseleave="hideTooltip"
                >
                  <div class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: donutColors[idx] }"></div>
                  <span class="text-xs text-zinc-600 truncate flex-1">{{ item.name }}</span>
                  <span class="text-xs font-semibold text-zinc-900">${{ formatNumber(item.value) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- PO Status -->
          <div class="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-zinc-200">
            <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
              <div class="w-8 h-8 sm:w-9 sm:h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <UIcon name="i-lucide-clipboard-list" class="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-medium text-zinc-900">Purchase Order Status</h3>
                <p class="text-[10px] sm:text-xs text-zinc-500">Order pipeline</p>
              </div>
            </div>
            
            <div class="space-y-2 sm:space-y-3">
              <div 
                v-for="status in poStatusData" 
                :key="status.name"
                class="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors"
                @mouseenter="showTooltip($event, `${status.name}: ${status.count} orders worth $${formatNumber(status.value)}`)"
                @mouseleave="hideTooltip"
              >
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" :style="{ backgroundColor: status.color + '20' }">
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" :style="{ backgroundColor: status.color }"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs sm:text-sm font-medium text-zinc-700">{{ status.name }}</span>
                    <span class="text-xs sm:text-base font-semibold text-zinc-900">${{ formatNumber(status.value) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all" :style="{ width: `${status.percent}%`, backgroundColor: status.color }"></div>
                    </div>
                    <span class="text-xs text-zinc-500">{{ status.count }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-100">
              <div class="text-center">
                <p class="text-sm sm:text-lg font-semibold text-amber-600">{{ getPendingCount }}</p>
                <p class="text-[10px] sm:text-xs text-zinc-500">Pending</p>
              </div>
              <div class="text-center">
                <p class="text-sm sm:text-lg font-semibold text-emerald-600">{{ getReceivedCount }}</p>
                <p class="text-[10px] sm:text-xs text-zinc-500">Received</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Low Stock Alerts -->
        <div class="bg-white rounded-xl p-3 sm:p-4 md:p-5 border border-zinc-200">
          <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <UIcon name="i-lucide-alert-circle" class="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 class="text-xs sm:text-sm font-medium text-zinc-900">Low Stock Alerts</h3>
              <p class="text-[10px] sm:text-xs text-zinc-500">Products requiring attention</p>
            </div>
          </div>
          
          <!-- Mobile Cards -->
          <div v-if="lowStockProducts.length > 0" class="block md:hidden space-y-2">
            <div 
              v-for="product in lowStockProducts" 
              :key="'m-' + product.product_id"
              class="bg-zinc-50 border border-zinc-200 rounded-lg p-3"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <h4 class="text-sm font-medium text-zinc-900 truncate">{{ product.product_name }}</h4>
                <span :class="['text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0', getStockBadge(product.current_stock || 0, product.safety_stock)]">
                  {{ getStockStatus(product.current_stock || 0, product.safety_stock) }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-center">
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Stock</p>
                  <p class="text-xs font-bold" :class="getStockTextClass(product.current_stock || 0, product.safety_stock)">{{ product.current_stock || 0 }}</p>
                </div>
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Min Level</p>
                  <p class="text-xs font-medium text-zinc-700">{{ product.safety_stock || 10 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Table -->
          <div v-if="lowStockProducts.length > 0" class="hidden md:block overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-xs text-zinc-500 border-b border-zinc-100">
                  <th class="pb-3 font-medium">Product</th>
                  <th class="pb-3 font-medium text-right">Current Stock</th>
                  <th class="pb-3 font-medium text-right">Min Level</th>
                  <th class="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in lowStockProducts" :key="product.product_id" class="border-b border-zinc-50 hover:bg-zinc-50">
                  <td class="py-3 font-medium text-zinc-900">{{ product.product_name }}</td>
                  <td class="py-3 text-right">
                    <span class="text-sm font-bold" :class="getStockTextClass(product.current_stock || 0, product.safety_stock)">
                      {{ product.current_stock || 0 }}
                    </span>
                  </td>
                  <td class="py-3 text-right text-zinc-500">{{ product.safety_stock || 10 }}</td>
                  <td class="py-3 text-right">
                    <span :class="['text-xs font-medium px-2 py-1 rounded-full', getStockBadge(product.current_stock || 0, product.safety_stock)]">
                      {{ getStockStatus(product.current_stock || 0, product.safety_stock) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="lowStockProducts.length === 0" class="text-center py-6 sm:py-8">
            <UIcon name="i-lucide-check-circle-2" class="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500 mx-auto mb-2" />
            <p class="text-xs sm:text-sm text-zinc-600">All products have healthy stock levels!</p>
          </div>
        </div>
        <!-- ROP & EOQ Analytics Section -->
        <div class="mt-6 space-y-4">
          <!-- Section Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                <UIcon name="i-lucide-calculator" class="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 class="text-sm sm:text-base font-semibold text-zinc-900">Reorder Point & EOQ Analysis</h2>
                <p class="text-xs text-zinc-500">Inventory optimization metrics for all products</p>
              </div>
            </div>
          </div>

          <!-- Constants Cards -->
          <div v-if="ropConstants" class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div class="bg-indigo-50 rounded-xl p-3 sm:p-4 border border-indigo-100">
              <p class="text-[10px] sm:text-xs font-medium text-indigo-600 mb-1">Service Level</p>
              <p class="text-base sm:text-lg font-bold text-indigo-900">{{ (ropConstants.serviceLevel * 100).toFixed(0) }}%</p>
            </div>
            <div class="bg-violet-50 rounded-xl p-3 sm:p-4 border border-violet-100">
              <p class="text-[10px] sm:text-xs font-medium text-violet-600 mb-1">Z-Score</p>
              <p class="text-base sm:text-lg font-bold text-violet-900">{{ ropConstants.zScore }}</p>
            </div>
            <div class="bg-sky-50 rounded-xl p-3 sm:p-4 border border-sky-100">
              <p class="text-[10px] sm:text-xs font-medium text-sky-600 mb-1">Ordering Cost</p>
              <p class="text-base sm:text-lg font-bold text-sky-900">${{ ropConstants.orderingCost?.toFixed(2) }}</p>
            </div>
            <div class="bg-rose-50 rounded-xl p-3 sm:p-4 border border-rose-100">
              <p class="text-[10px] sm:text-xs font-medium text-rose-600 mb-1">Holding Cost/yr</p>
              <p class="text-base sm:text-lg font-bold text-rose-900">${{ ropConstants.holdingCost?.toFixed(2) }}</p>
            </div>
          </div>

          <!-- Summary Cards -->
          <div v-if="ropSummary" class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div class="bg-white rounded-xl p-3 sm:p-4 border border-zinc-200">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-7 h-7 bg-zinc-100 rounded-lg flex items-center justify-center">
                  <UIcon name="i-lucide-package" class="w-3.5 h-3.5 text-zinc-600" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-zinc-500">Products</span>
              </div>
              <p class="text-lg sm:text-xl font-bold text-zinc-900">{{ ropSummary.totalProducts }}</p>
            </div>
            <div class="bg-white rounded-xl p-3 sm:p-4 border border-zinc-200">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <UIcon name="i-lucide-check-circle" class="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-emerald-600">Healthy</span>
              </div>
              <p class="text-lg sm:text-xl font-bold text-emerald-600">{{ ropSummary.healthyCount }}</p>
            </div>
            <div class="bg-white rounded-xl p-3 sm:p-4 border border-zinc-200">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                  <UIcon name="i-lucide-alert-triangle" class="w-3.5 h-3.5 text-red-600" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-red-600">Needs Reorder</span>
              </div>
              <p class="text-lg sm:text-xl font-bold text-red-600">{{ ropSummary.needsReorderCount }}</p>
            </div>
            <div class="bg-white rounded-xl p-3 sm:p-4 border border-zinc-200">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                  <UIcon name="i-lucide-target" class="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-blue-600">Avg ROP</span>
              </div>
              <p class="text-lg sm:text-xl font-bold text-blue-600">{{ ropSummary.avgReorderPoint?.toFixed(0) }}</p>
            </div>
          </div>

          <!-- ROP/EOQ Mobile Cards -->
          <div class="block md:hidden space-y-2">
            <div 
              v-for="(item, idx) in ropEoqData" 
              :key="'m-' + item.product_id"
              :class="['bg-zinc-50 border border-zinc-200 rounded-lg p-3', item.needs_reorder ? 'border-red-200 bg-red-50/30' : '']"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 mb-0.5">
                    <span class="text-[10px] text-zinc-400">{{ idx + 1 }}.</span>
                    <span class="text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">{{ item.sku }}</span>
                  </div>
                  <h4 class="text-sm font-medium text-zinc-900 truncate">{{ item.product_name }}</h4>
                </div>
                <span 
                  :class="['inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap', 
                    item.needs_reorder ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700']"
                >
                  <UIcon :name="item.needs_reorder ? 'i-lucide-alert-triangle' : 'i-lucide-check'" class="w-3 h-3" />
                  {{ item.needs_reorder ? 'Re-order' : 'OK' }}
                </span>
              </div>
              <div class="grid grid-cols-3 gap-1.5 text-center mb-1.5">
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[10px] text-indigo-600 mb-0.5">ROP</p>
                  <p class="text-xs font-bold text-indigo-700">{{ item.reorder_point?.toFixed(0) }}</p>
                </div>
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[10px] text-violet-600 mb-0.5">EOQ</p>
                  <p class="text-xs font-bold text-violet-700">{{ item.eoq?.toFixed(0) }}</p>
                </div>
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[10px] text-zinc-500 mb-0.5">Stock</p>
                  <p :class="['text-xs font-bold', item.current_stock <= (item.safety_stock || 0) ? 'text-red-600' : 'text-emerald-600']">{{ item.current_stock }}</p>
                </div>
              </div>
              <div class="grid grid-cols-4 gap-1.5 text-center">
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[9px] text-zinc-400 mb-0.5">Lead</p>
                  <p class="text-[10px] font-medium text-zinc-700">{{ item.lead_time_days }}d</p>
                </div>
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[9px] text-zinc-400 mb-0.5">Safety</p>
                  <p class="text-[10px] font-semibold text-amber-700">{{ item.safety_stock?.toFixed(0) }}</p>
                </div>
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[9px] text-zinc-400 mb-0.5">Avg/Day</p>
                  <p class="text-[10px] font-medium text-zinc-600">{{ item.avg_daily_demand?.toFixed(1) }}</p>
                </div>
                <div class="bg-white rounded-lg p-1.5">
                  <p class="text-[9px] text-zinc-400 mb-0.5">Annual</p>
                  <p class="text-[10px] font-medium text-zinc-600">{{ item.annual_demand?.toFixed(0) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ROP/EOQ Desktop Table -->
          <div class="hidden md:block bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-zinc-50 text-left text-xs text-zinc-500 border-b border-zinc-200">
                    <th class="px-3 py-3 font-medium sticky left-0 bg-zinc-50 z-10">No.</th>
                    <th class="px-3 py-3 font-medium sticky left-8 bg-zinc-50 z-10 min-w-[120px]">Product</th>
                    <th class="px-3 py-3 font-medium text-center">SKU</th>
                    <th class="px-3 py-3 font-medium text-center whitespace-nowrap">Lead Time<br/><span class="text-[10px] text-zinc-400">(days)</span></th>
                    <th class="px-3 py-3 font-medium text-center whitespace-nowrap">Std Dev<br/><span class="text-[10px] text-zinc-400">(σ)</span></th>
                    <th class="px-3 py-3 font-medium text-center whitespace-nowrap">Safety<br/>Stock</th>
                    <th class="px-3 py-3 font-medium text-center whitespace-nowrap">Avg Daily<br/>Demand</th>
                    <th class="px-3 py-3 font-medium text-center whitespace-nowrap">Demand<br/>During LT</th>
                    <th class="px-3 py-3 font-medium text-center">
                      <span class="inline-flex items-center gap-1 text-indigo-600 font-semibold">
                        ROP
                      </span>
                    </th>
                    <th class="px-3 py-3 font-medium text-center whitespace-nowrap">Annual<br/>Demand</th>
                    <th class="px-3 py-3 font-medium text-center">
                      <span class="inline-flex items-center gap-1 text-violet-600 font-semibold">
                        EOQ
                      </span>
                    </th>
                    <th class="px-3 py-3 font-medium text-center whitespace-nowrap">Current<br/>Stock</th>
                    <th class="px-3 py-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(item, idx) in ropEoqData" 
                    :key="item.product_id"
                    :class="['border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors', item.needs_reorder ? 'bg-red-50/30' : '']"
                  >
                    <td class="px-3 py-2.5 sticky left-0 bg-inherit z-10 text-zinc-400 text-xs">{{ idx + 1 }}</td>
                    <td class="px-3 py-2.5 sticky left-8 bg-inherit z-10">
                      <span class="font-medium text-zinc-900 text-xs sm:text-sm">{{ item.product_name }}</span>
                    </td>
                    <td class="px-3 py-2.5 text-center text-xs text-zinc-500">{{ item.sku }}</td>
                    <td class="px-3 py-2.5 text-center text-xs font-medium text-zinc-700">{{ item.lead_time_days }}</td>
                    <td class="px-3 py-2.5 text-center text-xs text-zinc-600">{{ item.std_dev_daily_demand?.toFixed(2) }}</td>
                    <td class="px-3 py-2.5 text-center">
                      <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold">
                        {{ item.safety_stock?.toFixed(0) }}
                      </span>
                    </td>
                    <td class="px-3 py-2.5 text-center text-xs text-zinc-600">{{ item.avg_daily_demand?.toFixed(2) }}</td>
                    <td class="px-3 py-2.5 text-center text-xs text-zinc-600">{{ item.demand_during_lead_time?.toFixed(1) }}</td>
                    <td class="px-3 py-2.5 text-center">
                      <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                        {{ item.reorder_point?.toFixed(0) }}
                      </span>
                    </td>
                    <td class="px-3 py-2.5 text-center text-xs text-zinc-600">{{ item.annual_demand?.toFixed(0) }}</td>
                    <td class="px-3 py-2.5 text-center">
                      <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-xs font-bold">
                        {{ item.eoq?.toFixed(0) }}
                      </span>
                    </td>
                    <td class="px-3 py-2.5 text-center">
                      <span :class="['text-xs font-bold', item.current_stock <= (item.safety_stock || 0) ? 'text-red-600' : 'text-emerald-600']">
                        {{ item.current_stock }}
                      </span>
                    </td>
                    <td class="px-3 py-2.5 text-center">
                      <span 
                        :class="['inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap', 
                          item.needs_reorder ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700']"
                      >
                        <UIcon :name="item.needs_reorder ? 'i-lucide-alert-triangle' : 'i-lucide-check'" class="w-3 h-3" />
                        {{ item.needs_reorder ? 'Re-order' : 'OK' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Formula Reference -->
          <div class="bg-zinc-50 rounded-xl p-4 sm:p-5 border border-zinc-200">
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-book-open" class="w-4 h-4 text-zinc-500" />
              <h3 class="text-xs sm:text-sm font-medium text-zinc-700">Formula Reference</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div class="bg-white rounded-lg p-3 border border-zinc-100">
                <p class="font-semibold text-amber-700 mb-1">Safety Stock (SS)</p>
                <p class="text-zinc-600 font-mono text-[11px]">Z × σ × √(Lead Time)</p>
                <p class="text-zinc-400 mt-1">Z = {{ ropConstants?.zScore || 1.64 }} ({{ ((ropConstants?.serviceLevel || 0.95) * 100).toFixed(0) }}% service level)</p>
              </div>
              <div class="bg-white rounded-lg p-3 border border-zinc-100">
                <p class="font-semibold text-indigo-700 mb-1">Reorder Point (ROP)</p>
                <p class="text-zinc-600 font-mono text-[11px]">(Avg Daily Demand × LT) + SS</p>
                <p class="text-zinc-400 mt-1">When stock ≤ ROP → Place order</p>
              </div>
              <div class="bg-white rounded-lg p-3 border border-zinc-100">
                <p class="font-semibold text-violet-700 mb-1">Economic Order Qty (EOQ)</p>
                <p class="text-zinc-600 font-mono text-[11px]">√(2 × Annual Demand × OC / HC)</p>
                <p class="text-zinc-400 mt-1">OC = ${{ ropConstants?.orderingCost?.toFixed(2) || '100.83' }}, HC = ${{ ropConstants?.holdingCost?.toFixed(2) || '600.00' }}/yr</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tooltip -->
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="tooltip.show"
          class="fixed z-50 px-3 py-2 bg-zinc-900 text-white text-xs rounded-lg shadow-xl pointer-events-none max-w-xs"
          :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
        >
          {{ tooltip.text }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const { sales, fetchSales } = useSales();
const { purchaseOrders, fetchPurchaseOrders } = usePurchaseOrders();
const { products, fetchProducts } = useProducts();
const { analyticsData: ropEoqData, analyticsSummary: ropSummary, analyticsConstants: ropConstants, fetchAnalytics } = useStockReports();

const loading = ref(true);

// Default to "All" - no date filtering
const dateRange = ref<{ from: string | null; to: string | null }>({ from: null, to: null });

const donutColors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

// Tooltip
const tooltip = ref({ show: false, x: 0, y: 0, text: '' });
const showTooltip = (event: MouseEvent, text: string) => {
  tooltip.value = { show: true, x: event.clientX + 10, y: event.clientY - 30, text };
};
const hideTooltip = () => { tooltip.value.show = false; };

// Date filtering
const filteredSales = computed(() => {
  return sales.value.filter(s => {
    const date = new Date(s.sale_date);
    if (dateRange.value.from && date < new Date(dateRange.value.from)) return false;
    if (dateRange.value.to && date > new Date(dateRange.value.to + 'T23:59:59')) return false;
    return true;
  });
});

const filteredPOs = computed(() => {
  return purchaseOrders.value.filter(po => {
    const date = new Date(po.order_date);
    if (dateRange.value.from && date < new Date(dateRange.value.from)) return false;
    if (dateRange.value.to && date > new Date(dateRange.value.to + 'T23:59:59')) return false;
    return true;
  });
});

// KPI Calculations
const totalRevenue = computed(() => filteredSales.value.reduce((sum, s) => sum + Number(s.total_amount || 0), 0));
const totalPOValue = computed(() => filteredPOs.value.reduce((sum, po) => sum + Number(po.total_amount || 0), 0));
const grossProfit = computed(() => totalRevenue.value - totalPOValue.value);
const profitMargin = computed(() => totalRevenue.value > 0 ? Math.round((grossProfit.value / totalRevenue.value) * 100) : 0);

// Inventory stats
const totalStockUnits = computed(() => products.value.reduce((sum, p) => sum + (p.current_stock || 0), 0));
const totalInventoryValue = computed(() => products.value.reduce((sum, p) => sum + ((p.current_stock || 0) * (p.selling_price || 0)), 0));

// Stock Stats - Uses product's safety_stock for threshold
const stockStats = computed(() => {
  const inStockProds = products.value.filter(p => {
    const stock = p.current_stock || 0;
    const threshold = p.safety_stock || 10;
    return stock >= threshold;
  });
  const lowStockProds = products.value.filter(p => {
    const stock = p.current_stock || 0;
    const threshold = p.safety_stock || 10;
    return stock > 0 && stock < threshold;
  });
  const outOfStockProds = products.value.filter(p => (p.current_stock || 0) === 0);
  
  const inStockUnits = inStockProds.reduce((sum, p) => sum + (p.current_stock || 0), 0);
  const lowStockUnits = lowStockProds.reduce((sum, p) => sum + (p.current_stock || 0), 0);
  
  const total = products.value.length || 1;
  
  return {
    inStockProducts: inStockProds.length,
    inStockUnits,
    lowStockProducts: lowStockProds.length,
    lowStockUnits,
    outOfStockProducts: outOfStockProds.length,
    inStockPercent: Math.round((inStockProds.length / total) * 100),
    lowStockPercent: Math.round((lowStockProds.length / total) * 100),
    outOfStockPercent: Math.round((outOfStockProds.length / total) * 100),
  };
});

// Low stock products list (below safety_stock level)
const lowStockProducts = computed(() => {
  return products.value
    .filter(p => {
      const stock = p.current_stock || 0;
      const threshold = p.safety_stock || 10;
      return stock < threshold;
    })
    .sort((a, b) => (a.current_stock || 0) - (b.current_stock || 0))
    .slice(0, 10);
});

// Chart Data
const chartData = computed(() => {
  const monthlyData: { [key: string]: { revenue: number; cost: number } } = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  filteredSales.value.forEach(s => {
    const date = new Date(s.sale_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[key]) monthlyData[key] = { revenue: 0, cost: 0 };
    monthlyData[key].revenue += Number(s.total_amount || 0);
  });
  
  filteredPOs.value.forEach(po => {
    const date = new Date(po.order_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[key]) monthlyData[key] = { revenue: 0, cost: 0 };
    monthlyData[key].cost += Number(po.total_amount || 0);
  });
  
  const sortedKeys = Object.keys(monthlyData).sort();
  const maxVal = Math.max(...Object.values(monthlyData).map(d => Math.max(d.revenue, d.cost)), 1) * 1.1;
  
  return sortedKeys.map((key, idx) => {
    const data = monthlyData[key] || { revenue: 0, cost: 0 };
    const x = 80 + (idx * (700 / Math.max(sortedKeys.length - 1, 1)));
    const monthNum = parseInt(key.split('-')[1] || '1');
    return {
      x,
      revenueY: 230 - (data.revenue / maxVal * 200),
      costY: 230 - (data.cost / maxVal * 200),
      revenue: data.revenue,
      cost: data.cost,
      label: months[monthNum - 1] || key,
      maxVal
    };
  });
});

const chartMaxValue = computed(() => chartData.value[0]?.maxVal || 1000);

const revenueLinePath = computed(() => {
  if (chartData.value.length === 0) return '';
  return chartData.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.revenueY}`).join(' ');
});

const revenueAreaPath = computed(() => {
  if (chartData.value.length === 0) return '';
  const first = chartData.value[0];
  const last = chartData.value[chartData.value.length - 1];
  return `${revenueLinePath.value} L ${last?.x || 780} 230 L ${first?.x || 80} 230 Z`;
});

const costLinePath = computed(() => {
  if (chartData.value.length === 0) return '';
  return chartData.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.costY}`).join(' ');
});

const costAreaPath = computed(() => {
  if (chartData.value.length === 0) return '';
  const first = chartData.value[0];
  const last = chartData.value[chartData.value.length - 1];
  return `${costLinePath.value} L ${last?.x || 780} 230 L ${first?.x || 80} 230 Z`;
});

// Top Products
const topProductsData = computed(() => {
  const productSales: { [key: string]: { name: string; value: number } } = {};
  filteredSales.value.forEach(s => {
    // Each sale can have multiple items (products)
    if (s.items && s.items.length > 0) {
      s.items.forEach(item => {
        const name = item.product?.product_name || 'Unknown';
        if (!productSales[name]) productSales[name] = { name, value: 0 };
        productSales[name].value += Number(item.amount || 0);
      });
    }
  });
  return Object.values(productSales).sort((a, b) => b.value - a.value).slice(0, 7);
});

const productDonutSegments = computed(() => {
  const total = topProductsData.value.reduce((sum, p) => sum + p.value, 0) || 1;
  let cumulativePercent = 0;
  
  return topProductsData.value.map((product, idx) => {
    const percent = Math.round((product.value / total) * 100);
    const dashArray = (product.value / total) * 502.4;
    const offset = -cumulativePercent * 502.4 / 100;
    cumulativePercent += percent;
    
    return {
      name: product.name,
      value: product.value,
      percent,
      dashArray,
      offset,
      color: donutColors[idx] || '#94a3b8'
    };
  });
});

// PO Status
const poStatusData = computed(() => {
  const statusMap: { [key: string]: { count: number; value: number; color: string } } = {
    'Pending': { count: 0, value: 0, color: '#f59e0b' },
    'Shipped': { count: 0, value: 0, color: '#8b5cf6' },
    'Received': { count: 0, value: 0, color: '#10b981' }
  };
  
  filteredPOs.value.forEach(po => {
    const status = po.status || 'Pending';
    if (statusMap[status]) {
      statusMap[status].count++;
      statusMap[status].value += Number(po.total_amount || 0);
    }
  });
  
  const total = filteredPOs.value.length || 1;
  return Object.entries(statusMap).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value,
    color: data.color,
    percent: Math.round((data.count / total) * 100)
  }));
});

// Helper computed for pending/received counts
const getPendingCount = computed(() => poStatusData.value.find(s => s.name === 'Pending')?.count || 0);
const getReceivedCount = computed(() => poStatusData.value.find(s => s.name === 'Received')?.count || 0);

// Helpers
const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatChartLabel = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toFixed(0);
};

const getStockBadge = (stock: number, safetyStock?: number) => {
  const threshold = safetyStock || 10;
  if (stock === 0) return 'bg-red-100 text-red-700';
  if (stock < threshold) return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
};

const getStockTextClass = (stock: number, safetyStock?: number) => {
  const threshold = safetyStock || 10;
  if (stock === 0) return 'text-red-600';
  if (stock < threshold) return 'text-amber-600';
  return 'text-emerald-600';
};

const getStockStatus = (stock: number, safetyStock?: number) => {
  const threshold = safetyStock || 10;
  if (stock === 0) return 'Out of Stock';
  if (stock < Math.floor(threshold / 2)) return 'Critical';
  if (stock < threshold) return 'Low';
  return 'OK';
};

// Load data
onMounted(async () => {
  try {
    await Promise.all([fetchSales(), fetchPurchaseOrders(), fetchProducts(), fetchAnalytics()]);
  } finally {
    loading.value = false;
  }
});

// Export functions
const handleExportExcel = () => {
  const { exportToExcel } = useExport();
  
  // Format date range for display
  const fromDate = dateRange.value.from ? new Date(dateRange.value.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'All time';
  const toDate = dateRange.value.to ? new Date(dateRange.value.to).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Present';
  const dateRangeText = dateRange.value.from || dateRange.value.to ? `${fromDate} - ${toDate}` : 'All time';
  
  const analyticsData = [
    { metric: 'Date Range', value: dateRangeText },
    { metric: 'Total Revenue', value: totalRevenue.value },
    { metric: 'Total PO Costs', value: totalPOValue.value },
    { metric: 'Gross Profit', value: grossProfit.value },
    { metric: 'Total Sales', value: filteredSales.value.length },
    { metric: 'Products In Stock', value: stockStats.value.inStockProducts },
    { metric: 'Products Low Stock', value: stockStats.value.lowStockProducts },
    { metric: 'Products Out of Stock', value: stockStats.value.outOfStockProducts },
  ];
  
  const columns = [
    { header: 'Metric', key: 'metric', width: 25 },
    { header: 'Value', key: 'value', width: 15 },
  ];
  
  exportToExcel(analyticsData, columns, 'analytics_summary', {
    title: 'Analytics Summary',
    summary: {
      'Period': dateRangeText,
      'Revenue': `$${formatNumber(totalRevenue.value)}`,
      'Profit': `$${formatNumber(grossProfit.value)}`,
      'Sales': filteredSales.value.length,
    }
  });
};

const handleExportPDF = () => {
  const { exportToPDF } = useExport();
  
  // Format date range for display
  const fromDate = dateRange.value.from ? new Date(dateRange.value.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'All time';
  const toDate = dateRange.value.to ? new Date(dateRange.value.to).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Present';
  const dateRangeText = dateRange.value.from || dateRange.value.to ? `${fromDate} - ${toDate}` : 'All time';
  
  const analyticsData = [
    { metric: 'Date Range', value: dateRangeText },
    { metric: 'Total Revenue', value: `$${formatNumber(totalRevenue.value)}` },
    { metric: 'Total PO Costs', value: `$${formatNumber(totalPOValue.value)}` },
    { metric: 'Gross Profit', value: `$${formatNumber(grossProfit.value)}` },
    { metric: 'Total Sales', value: filteredSales.value.length },
    { metric: 'In Stock Products', value: stockStats.value.inStockProducts },
    { metric: 'Low Stock Products', value: stockStats.value.lowStockProducts },
    { metric: 'Out of Stock Products', value: stockStats.value.outOfStockProducts },
  ];
  
  const columns = [
    { header: 'Metric', key: 'metric' },
    { header: 'Value', key: 'value' },
  ];
  
  exportToPDF(analyticsData, columns, `Analytics Report (${dateRangeText})`, 'analytics', {
    summary: {
      'Period': dateRangeText,
      'Revenue': `$${formatNumber(totalRevenue.value)}`,
      'Profit': `$${formatNumber(grossProfit.value)}`,
      'Sales': filteredSales.value.length,
    }
  });
};
</script>
