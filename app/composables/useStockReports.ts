// Stock Reports composable - manages daily stock reports and analytics
import type { DailyStockReport, ProductAnalytics, BoHSummary } from '~/types';

const stockReports = ref<DailyStockReport[]>([]);
const bohData = ref<BoHSummary[]>([]);
const analyticsData = ref<ProductAnalytics[]>([]);
const reportSummary = ref<any>(null);
const bohSummary = ref<any>(null);
const analyticsSummary = ref<any>(null);
const analyticsConstants = ref<any>(null);
const isLoading = ref(false);

export const useStockReports = () => {
  // Fetch daily stock reports for a specific date
  const fetchDailyReport = async (date: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch<any>('/api/stock-reports', { query: { date } });
      stockReports.value = response.data || [];
      reportSummary.value = response.summary || null;
      return response;
    } catch (error) {
      console.error('Failed to fetch stock reports:', error);
      stockReports.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch monthly stock reports
  const fetchMonthlyReport = async (month: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch<any>('/api/stock-reports', { query: { month } });
      stockReports.value = response.data || [];
      return response;
    } catch (error) {
      console.error('Failed to fetch monthly reports:', error);
      stockReports.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch BoH data
  const fetchBoH = async () => {
    try {
      const response = await $fetch<any>('/api/stock-reports/boh');
      bohData.value = response.data || [];
      bohSummary.value = response.summary || null;
      return response;
    } catch (error) {
      console.error('Failed to fetch BoH:', error);
      bohData.value = [];
    }
  };

  // Fetch ROP/EOQ analytics
  const fetchAnalytics = async () => {
    try {
      const response = await $fetch<any>('/api/stock-reports/analytics');
      analyticsData.value = response.data || [];
      analyticsSummary.value = response.summary || null;
      analyticsConstants.value = response.constants || null;
      return response;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      analyticsData.value = [];
    }
  };

  // Seed Feb 2026 data
  const seedData = async () => {
    isLoading.value = true;
    try {
      const response = await $fetch<any>('/api/stock-reports/seed', { method: 'POST' });
      return response;
    } catch (error) {
      console.error('Failed to seed data:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    stockReports,
    bohData,
    analyticsData,
    reportSummary,
    bohSummary,
    analyticsSummary,
    analyticsConstants,
    isLoading,
    fetchDailyReport,
    fetchMonthlyReport,
    fetchBoH,
    fetchAnalytics,
    seedData,
  };
};
