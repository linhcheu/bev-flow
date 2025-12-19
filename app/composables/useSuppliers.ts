import type { Supplier } from '~/types';

export const useSuppliers = () => {
  const suppliers = ref<Supplier[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchSuppliers = async () => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      const response = await $fetch<Supplier[]>('/api/suppliers');
      suppliers.value = response;
    } catch (e) {
      error.value = 'Failed to fetch suppliers';
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const getSupplier = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      return await $fetch<Supplier>(`/api/suppliers/${id}`);
    } catch (e) {
      error.value = 'Failed to fetch supplier';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createSupplier = async (supplier: Supplier) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      const response = await $fetch<Supplier>('/api/suppliers', {
        method: 'POST',
        body: supplier,
      });
      suppliers.value.push(response);
      return response;
    } catch (e) {
      error.value = 'Failed to create supplier';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateSupplier = async (id: number, supplier: Supplier) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      const response = await $fetch<Supplier>(`/api/suppliers/${id}`, {
        method: 'PUT',
        body: supplier,
      });
      const index = suppliers.value.findIndex(s => s.supplier_id === id);
      if (index !== -1) {
        suppliers.value[index] = response;
      }
      return response;
    } catch (e) {
      error.value = 'Failed to update supplier';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteSupplier = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      await $fetch(`/api/suppliers/${id}`, {
        method: 'DELETE',
      });
      suppliers.value = suppliers.value.filter(s => s.supplier_id !== id);
      return true;
    } catch (e) {
      error.value = 'Failed to delete supplier';
      console.error(e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    suppliers,
    loading,
    error,
    fetchSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
};
