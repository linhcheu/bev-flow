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

  // Generate next invoice number (sequential)
  const generateInvoiceNumber = () => {
    // Find the highest existing invoice number
    let maxNum = 0;
    sales.value.forEach(sale => {
      const match = sale.invoice_number?.match(/INV-(\d+)/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      } else {
        // Handle old format numbers
        const num = parseInt(sale.invoice_number || '0', 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const nextNum = maxNum + 1;
    return `INV-${String(nextNum).padStart(4, '0')}`;
  };

  return {
    sales,
    loading,
    error,
    fetchSales,
    getSale,
    createSale,
    deleteSale,
    generateInvoiceNumber,
  };
};
