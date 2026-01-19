import type { PurchaseOrder, PurchaseOrderFormData } from '~/types';

export const usePurchaseOrders = () => {
  const purchaseOrders = ref<PurchaseOrder[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchPurchaseOrders = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<PurchaseOrder[]>('/api/purchase-orders');
      purchaseOrders.value = response;
    } catch (e) {
      error.value = 'Failed to fetch purchase orders';
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const getPurchaseOrder = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      return await $fetch<PurchaseOrder>(`/api/purchase-orders/${id}`);
    } catch (e) {
      error.value = 'Failed to fetch purchase order';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createPurchaseOrder = async (po: PurchaseOrderFormData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<PurchaseOrder>('/api/purchase-orders', {
        method: 'POST',
        body: po,
      });
      purchaseOrders.value.push(response);
      return response;
    } catch (e) {
      error.value = 'Failed to create purchase order';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updatePurchaseOrder = async (id: number, po: Partial<PurchaseOrderFormData> & { status?: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<PurchaseOrder>(`/api/purchase-orders/${id}`, {
        method: 'PUT',
        body: po,
      });
      const index = purchaseOrders.value.findIndex(p => p.po_id === id);
      if (index !== -1) {
        purchaseOrders.value[index] = response;
      }
      return response;
    } catch (e) {
      error.value = 'Failed to update purchase order';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deletePurchaseOrder = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`/api/purchase-orders/${id}`, {
        method: 'DELETE',
      });
      purchaseOrders.value = purchaseOrders.value.filter(p => p.po_id !== id);
      return true;
    } catch (e) {
      error.value = 'Failed to delete purchase order';
      console.error(e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Generate next PO number (fetches from API for accuracy)
  const generatePONumber = async (): Promise<string> => {
    try {
      const response = await $fetch<{ next_number: string }>('/api/purchase-orders/next-number');
      return response.next_number;
    } catch (e) {
      console.error('Failed to get next PO number from API, using fallback:', e);
      // Fallback: calculate from loaded data
      let maxNum = 0;
      purchaseOrders.value.forEach(po => {
        // Handle PO-XXX-XXX format
        let match = po.po_number?.match(/PO-(\d+)-(\d+)/);
        if (match && match[1] && match[2]) {
          const num = parseInt(match[1], 10) * 1000 + parseInt(match[2], 10);
          if (num > maxNum) maxNum = num;
        } else {
          // Handle old PO-XXXX format
          match = po.po_number?.match(/PO-(\d+)/);
          if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      });
      const nextNum = maxNum + 1;
      const prefix = String(Math.floor(nextNum / 1000) || 1).padStart(3, '0');
      const suffix = String(nextNum % 1000 || nextNum).padStart(3, '0');
      return `PO-${prefix}-${suffix}`;
    }
  };

  return {
    purchaseOrders,
    loading,
    error,
    fetchPurchaseOrders,
    getPurchaseOrder,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    generatePONumber,
  };
};
