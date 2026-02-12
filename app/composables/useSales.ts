import type { Sale, SaleFormData } from '~/types';

export const useSales = () => {
  const sales = ref<Sale[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchSales = async (startDate?: string, endDate?: string) => {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await $fetch<Sale[]>(`/api/sales?${params.toString()}`);
      sales.value = response;
    } catch (e) {
      error.value = 'Failed to fetch sales';
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const getSale = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      return await $fetch<Sale>(`/api/sales/${id}`);
    } catch (e) {
      error.value = 'Failed to fetch sale';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createSale = async (sale: SaleFormData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<Sale>('/api/sales', {
        method: 'POST',
        body: sale,
      });
      sales.value.push(response);
      return response;
    } catch (e) {
      error.value = 'Failed to create sale';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateSale = async (id: number, sale: SaleFormData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<Sale>(`/api/sales/${id}`, {
        method: 'PUT',
        body: sale,
      });
      const index = sales.value.findIndex(s => s.sale_id === id);
      if (index !== -1) {
        sales.value[index] = response;
      }
      return response;
    } catch (e) {
      error.value = 'Failed to update sale';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteSale = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`/api/sales/${id}`, {
        method: 'DELETE',
      });
      sales.value = sales.value.filter(s => s.sale_id !== id);
      return true;
    } catch (e) {
      error.value = 'Failed to delete sale';
      console.error(e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Generate next sale number (fetches from API for accuracy)
  const generateSaleNumber = async (): Promise<string> => {
    try {
      const response = await $fetch<{ next_number: string }>('/api/sales/next-number');
      return response.next_number;
    } catch (e) {
      console.error('Failed to get next sale number from API, using fallback:', e);
      // Fallback: calculate from loaded data
      let maxNum = 0;
      sales.value.forEach(sale => {
        // Handle INV-H20-XXXX format (new)
        const match = sale.sale_number?.match(/INV-H20-(\d+)/);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        } else {
          // Handle old SALE-YEAR-XXXX format
          const oldMatch = sale.sale_number?.match(/SALE-(\d{4})-(\d+)/);
          if (oldMatch && oldMatch[2]) {
            const num = parseInt(oldMatch[2], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      });
      return `INV-H20-${String(maxNum + 1).padStart(4, '0')}`;
    }
  };

  return {
    sales,
    loading,
    error,
    fetchSales,
    getSale,
    createSale,
    updateSale,
    deleteSale,
    generateSaleNumber,
  };
};
