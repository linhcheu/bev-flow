import type { SalesForecast } from '~/types';

export const useForecasts = () => {
  const forecasts = ref<SalesForecast[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchForecasts = async (month?: string) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      const params = month ? `?month=${month}` : '';
      const response = await $fetch<SalesForecast[]>(`/api/forecasts${params}`);
      forecasts.value = response;
    } catch (e) {
      error.value = 'Failed to fetch forecasts';
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const generateForecast = async (productId: number, forecastMonth: string) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      const response = await $fetch<SalesForecast>('/api/forecasts/generate', {
        method: 'POST',
        body: { product_id: productId, forecast_month: forecastMonth },
      });
      forecasts.value.push(response);
      return response;
    } catch (e) {
      error.value = 'Failed to generate forecast';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    forecasts,
    loading,
    error,
    fetchForecasts,
    generateForecast,
  };
};
