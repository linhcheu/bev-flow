import type { Forecast } from '~/types';

export const useForecasts = () => {
  const forecasts = ref<Forecast[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const generating = ref(false);

  const fetchForecasts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<Forecast[]>('/api/forecasts');
      forecasts.value = response;
    } catch (e) {
      error.value = 'Failed to fetch forecasts';
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const generateForecasts = async () => {
    generating.value = true;
    error.value = null;
    try {
      const response = await $fetch<{ message: string; forecasts: Forecast[] }>('/api/forecasts/generate', {
        method: 'POST',
      });
      forecasts.value = response.forecasts;
      return response;
    } catch (e) {
      error.value = 'Failed to generate forecasts';
      console.error(e);
      return null;
    } finally {
      generating.value = false;
    }
  };

  const createForecast = async (forecast: Partial<Forecast>) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<Forecast>('/api/forecasts', {
        method: 'POST',
        body: forecast,
      });
      forecasts.value.push(response);
      return response;
    } catch (e) {
      error.value = 'Failed to create forecast';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteForecast = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`/api/forecasts/${id}`, {
        method: 'DELETE',
      });
      forecasts.value = forecasts.value.filter(f => f.forecast_id !== id);
      return true;
    } catch (e) {
      error.value = 'Failed to delete forecast';
      console.error(e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    forecasts,
    loading,
    generating,
    error,
    fetchForecasts,
    generateForecasts,
    createForecast,
    deleteForecast,
  };
};
