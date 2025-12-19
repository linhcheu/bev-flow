<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Categories Section -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <!-- Header -->
        <div class="mb-6">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Categories</h2>
          <p class="text-xs sm:text-sm text-gray-500">Indulge in our Most Popular Dishes</p>
        </div>

        <!-- Search Bar -->
        <div class="mb-6 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search menu here..."
            class="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <!-- Category Pills -->
        <div class="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0',
              selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-100'
            ]"
          >
            <span class="text-lg sm:text-xl">{{ category.icon }}</span>
            <span>{{ category.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-800">{{ getCategoryName(selectedCategory) }} Category</h3>
          <p class="text-xs sm:text-sm text-gray-500 mt-1">Every dish is a testament to the culinary expertise and dedication of the team</p>
        </div>
        <button
          @click="toggleSort"
          class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors self-start sm:self-auto shadow-sm"
        >
          <svg class="w-4 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
          <span class="text-sm font-medium text-gray-700">{{ sortAscending ? 'A-Z' : 'Z-A' }} Sort</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p class="mt-4 text-gray-500">Loading products...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div class="text-red-600 text-lg">{{ error }}</div>
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.product_id"
          class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group"
        >
          <!-- Product Image -->
          <div class="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3]">
            <img
              :src="getProductImage(product)"
              :alt="product.product_name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              @error="(e) => handleImageError(e, product)"
            />
            <!-- Cart Button -->
            <button
              @click="addToCart(product)"
              class="absolute top-3 right-3 w-11 h-11 sm:w-12 sm:h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>

          <!-- Product Info -->
          <div class="p-4 sm:p-5">
            <h4 class="text-base sm:text-lg font-bold text-gray-800 mb-2 line-clamp-1">{{ product.product_name }}</h4>
            <p class="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2 min-h-[2.5rem]">
              {{ product.description || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' }}
            </p>

            <!-- Rating -->
            <div class="flex items-center gap-1 mb-3">
              <span v-for="i in 5" :key="i" class="text-yellow-400">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </span>
            </div>

            <!-- Price -->
            <div class="flex items-center gap-2 mb-3">
              <span class="text-lg sm:text-xl font-bold text-blue-600">${{ product.selling_price.toFixed(2) }}</span>
              <span class="text-xs sm:text-sm text-gray-400 line-through">${{ product.cost_price.toFixed(2) }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 pt-3 border-t border-gray-100">
              <NuxtLink
                :to="`/products/${product.product_id}/edit`"
                class="flex-1 px-3 py-2 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium no-underline"
              >
                Edit
              </NuxtLink>
              <button
                @click="handleDelete(product.product_id!)"
                class="flex-1 px-3 py-2 text-xs sm:text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && filteredProducts.length === 0" class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
        <p class="text-gray-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
        <NuxtLink
          to="/products/new"
          class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors no-underline font-medium"
        >
          Add New Product
        </NuxtLink>
      </div>
    </div>

    <!-- Floating Add Button -->
    <NuxtLink
      to="/products/new"
      class="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 transition-all duration-200 flex items-center justify-center group no-underline z-50"
    >
      <svg class="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types';
import { useProducts } from '~/composables/useProducts';

const { products, loading, error, fetchProducts, deleteProduct } = useProducts();

const searchQuery = ref('');
const selectedCategory = ref('all');
const sortAscending = ref(true);

const categories = [

  { id: 'coffee', name: 'Beverage', icon: '☕' },
];

onMounted(() => {
  fetchProducts();
});

const filteredProducts = computed(() => {
  let filtered = products.value || [];

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((product: Product) =>
      product.product_name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query)
    );
  }

  // Sort products
  filtered = [...filtered].sort((a: Product, b: Product) => {
    const nameA = a.product_name.toLowerCase();
    const nameB = b.product_name.toLowerCase();
    return sortAscending.value
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  return filtered;
});

const getCategoryName = (categoryId: string) => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : 'All Products';
};

const toggleSort = () => {
  sortAscending.value = !sortAscending.value;
};

const addToCart = (product: Product) => {
  // Add your cart logic here
  alert(`Added ${product.product_name} to cart!`);
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await deleteProduct(id);
  }
};

// Array of local images to cycle through for products
const localImages: string[] = ['/ABC.jpg', '/Anchor.webp'];
let imageIndex = 0;

const getProductImage = (product: Product): string => {
  if (product.image) {
    return product.image;
  }
  // Cycle through local images based on product_id
  const index = product.product_id ? (product.product_id % localImages.length) : 0;
  return localImages[index] || '/ABC.jpg';
};

const handleImageError = (e: Event, _product: Product) => {
  const target = e.target as HTMLImageElement;
  // Try next local image, or fall back to placeholder
  imageIndex = (imageIndex + 1) % localImages.length;
  if (imageIndex === 0) {
    // If all local images failed, use a placeholder
    target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
  } else {
    const nextImage = localImages[imageIndex];
    if (nextImage) {
      target.src = nextImage;
    }
  }
};
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
