// Dashboard data composable - centralized state management for dashboard
// Provides caching, auto-refresh, and optimistic updates
import { ref, computed, readonly } from 'vue';

export interface DashboardStats {
  totalProducts: number;
  totalSuppliers: number;
  activePOs: number;
  todaySales: number;
  todayProfit: number;
  todayOrders: number;
  lowStockProducts: LowStockProduct[];
  recentSales: RecentSale[];
  analytics: Analytics;
}

export interface LowStockProduct {
  product_id: number;
  product_name: string;
  current_stock: number;
  min_stock_level: number;
}

export interface RecentSale {
  sale_id: number;
  product_name: string;
  quantity: number;
  total_amount: number;
  sale_date: string;
}

export interface TopProduct {
  name: string;
  type: string;
  sold: number;
}

export interface Category {
  name: string;
  percentage: number;
  color: string;
  revenue: number;
}

export interface HourlySale {
  hour: string;
  total: number;
}

export interface Analytics {
  totalRevenue: number;
  topProducts: TopProduct[];
  categories: Category[];
  hourlySalesData: HourlySale[];
}

// Singleton state - shared across all components
const stats = ref<DashboardStats>({
  totalProducts: 0,
  totalSuppliers: 0,
  activePOs: 0,
  todaySales: 0,
  todayProfit: 0,
  todayOrders: 0,
  lowStockProducts: [],
  recentSales: [],
  analytics: {
    totalRevenue: 0,
    topProducts: [],
    categories: [],
    hourlySalesData: []
  }
});

const isLoading = ref(false);
const isInitialized = ref(false);
const lastFetchTime = ref<number | null>(null);
const error = ref<string | null>(null);

// Cache duration in milliseconds (30 seconds for dashboard data)
const CACHE_DURATION = 30 * 1000;

export const useDashboard = () => {
  // Check if cache is still valid
  const isCacheValid = computed(() => {
    if (!lastFetchTime.value || !isInitialized.value) return false;
    return Date.now() - lastFetchTime.value < CACHE_DURATION;
  });

  // Fetch dashboard stats with caching
  const fetchStats = async (force = false) => {
    // Return cached data if still valid and not forced
    if (isCacheValid.value && !force) {
      return stats.value;
    }

    // Prevent multiple simultaneous fetches
    if (isLoading.value) {
      return stats.value;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<DashboardStats>('/api/dashboard/stats');
      
      // Update stats with response
      stats.value = {
        totalProducts: response.totalProducts ?? 0,
        totalSuppliers: response.totalSuppliers ?? 0,
        activePOs: response.activePOs ?? 0,
        todaySales: response.todaySales ?? 0,
        todayProfit: response.todayProfit ?? 0,
        todayOrders: response.todayOrders ?? 0,
        lowStockProducts: response.lowStockProducts ?? [],
        recentSales: response.recentSales ?? [],
        analytics: {
          totalRevenue: response.analytics?.totalRevenue ?? 0,
          topProducts: response.analytics?.topProducts ?? [],
          categories: response.analytics?.categories ?? [],
          hourlySalesData: response.analytics?.hourlySalesData ?? []
        }
      };

      lastFetchTime.value = Date.now();
      isInitialized.value = true;

      return stats.value;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch dashboard stats';
      console.error('Dashboard fetch error:', err);
      return stats.value;
    } finally {
      isLoading.value = false;
    }
  };

  // Refresh data (force fetch)
  const refresh = () => fetchStats(true);

  // Clear cache
  const clearCache = () => {
    lastFetchTime.value = null;
    isInitialized.value = false;
  };

  // Computed values for charts
  const chartSegments = computed(() => {
    const categories = stats.value.analytics.categories;
    if (categories.length === 0) {
      return [{ category: 'No Data', percentage: 100, color: '#e4e4e7', offset: 0 }];
    }

    let cumulativePercentage = 0;
    return categories.map((category) => {
      const segment = {
        category: category.name,
        percentage: category.percentage,
        color: category.color,
        offset: -cumulativePercentage * 4.4,
      };
      cumulativePercentage += category.percentage;
      return segment;
    });
  });

  const maxHourlyValue = computed(() => {
    const data = stats.value.analytics.hourlySalesData;
    if (data.length === 0) return 1000;
    return Math.max(...data.map(d => d.total)) * 1.2;
  });

  const hourlyChartData = computed(() => {
    const data = stats.value.analytics.hourlySalesData;
    if (data.length === 0) return [];

    const chartWidth = 720;
    const chartHeight = 160;
    const startX = 80;
    const spacing = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;

    return data.map((d, i) => ({
      x: startX + (i * spacing),
      y: 190 - (d.total / maxHourlyValue.value) * chartHeight,
      value: d.total,
      label: d.hour
    }));
  });

  const trendLinePath = computed(() => {
    if (hourlyChartData.value.length === 0) return '';
    return hourlyChartData.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  });

  const trendAreaPath = computed(() => {
    if (hourlyChartData.value.length === 0) return '';
    const points = hourlyChartData.value;
    const firstX = points[0]?.x || 80;
    const lastX = points[points.length - 1]?.x || 760;
    return `${trendLinePath.value} L ${lastX} 190 L ${firstX} 190 Z`;
  });

  const displayTopProducts = computed(() => {
    const products = stats.value.analytics.topProducts;
    if (products.length > 0) {
      return products.slice(0, 5);
    }
    return [{ name: 'No sales today', type: 'N/A', sold: 0 }];
  });

  // Helper functions
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatChartValue = (value: number) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
    return value.toFixed(0);
  };

  const getProfitColorClass = (profit: number) => {
    if (profit > 0) return 'text-emerald-600';
    if (profit < 0) return 'text-red-600';
    return 'text-zinc-600';
  };

  const getProfitBadgeClass = (profit: number) => {
    if (profit > 0) return 'text-emerald-600 bg-emerald-50';
    if (profit < 0) return 'text-red-600 bg-red-50';
    return 'text-zinc-600 bg-zinc-50';
  };

  const getSalesColorClass = (sales: number) => {
    if (sales > 0) return 'text-emerald-600';
    return 'text-zinc-900';
  };

  return {
    // State (readonly to prevent external mutations)
    stats: readonly(stats),
    isLoading: readonly(isLoading),
    isInitialized: readonly(isInitialized),
    error: readonly(error),
    
    // Actions
    fetchStats,
    refresh,
    clearCache,
    
    // Computed chart data
    chartSegments,
    maxHourlyValue,
    hourlyChartData,
    trendLinePath,
    trendAreaPath,
    displayTopProducts,
    
    // Helpers
    formatNumber,
    formatChartValue,
    getProfitColorClass,
    getProfitBadgeClass,
    getSalesColorClass,
  };
};
