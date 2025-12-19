import { ref } from 'vue';
import type { Product } from '~/types';

export const useProducts = () => {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      const response = await $fetch<Product[]>('/api/products');
      products.value = response.map(p => ({
        ...p,
        profit: p.selling_price - p.cost_price
      }));
    } catch (e) {
      error.value = 'Failed to fetch products';
      console.error(e);
    } finally {
      loading.value = false;
    }
  };
  
  const getProduct = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      const product = await $fetch<Product>(`/api/products/${id}`);
      return {
        ...product,
        profit: product.selling_price - product.cost_price
      };
    } catch (e) {
      error.value = 'Failed to fetch product';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createProduct = async (product: Product) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      const response = await $fetch<Product>('/api/products', {
        method: 'POST',
        body: product,
      });
      products.value.push({
        ...response,
        profit: response.selling_price - response.cost_price
      });
      return response;
    } catch (e) {
      error.value = 'Failed to create product';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateProduct = async (id: number, product: Product) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      const response = await $fetch<Product>(`/api/products/${id}`, {
        method: 'PUT',
        body: product,
      });
      const index = products.value.findIndex(p => p.product_id === id);
      if (index !== -1) {
        products.value[index] = {
          ...response,
          profit: response.selling_price - response.cost_price
        };
      }
      return response;
    } catch (e) {
      error.value = 'Failed to update product';
      console.error(e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteProduct = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API endpoint
      await $fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      products.value = products.value.filter(p => p.product_id !== id);
      return true;
    } catch (e) {
      error.value = 'Failed to delete product';
      console.error(e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
