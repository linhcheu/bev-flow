import type { PurchaseOrder } from '~/types';

export const usePurchaseOrders = () => {
  const purchaseOrders = ref<PurchaseOrder[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchPurchaseOrders = async () => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
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
      // TODO: Replace with actual API endpoint
      return await $fetch<PurchaseOrder>(`/api/purchase-orders/${id}`);
    } catch (e) {
      error.value = 'Failed to fetch purchase order';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createPurchaseOrder = async (po: PurchaseOrder) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
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

  const updatePurchaseOrder = async (id: number, po: PurchaseOrder) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
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
      // TODO: Replace with actual API endpoint
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

  return {
    purchaseOrders,
    loading,
    error,
    fetchPurchaseOrders,
    getPurchaseOrder,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
  };
};
