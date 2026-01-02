import type { Customer } from '~/types';

export const useCustomers = () => {
  const customers = ref<Customer[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchCustomers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<Customer[]>('/api/customers');
      customers.value = response;
    } catch (e) {
      error.value = 'Failed to fetch customers';
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const createCustomer = async (customer: Partial<Customer>) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<Customer>('/api/customers', {
        method: 'POST',
        body: customer,
      });
      customers.value.push(response);
      return response;
    } catch (e) {
      error.value = 'Failed to create customer';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
  };
};
