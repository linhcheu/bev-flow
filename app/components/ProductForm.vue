<template>
  <div class="w-full">
    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
      <!-- Product Image Section -->
      <div class="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
        <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2 sm:gap-3">
          <div class="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-image" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          </div>
          <span class="text-emerald-700">✓ Product Image</span>
        </h3>
        
        <div class="flex flex-col sm:flex-row items-start gap-4">
          <!-- Image Preview -->
          <div class="relative w-32 h-32 sm:w-40 sm:h-40 bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-xl flex items-center justify-center overflow-hidden group">
            <img 
              v-if="imagePreview || form.image_url" 
              :src="imagePreview || form.image_url" 
              alt="Product preview"
              class="w-full h-full object-contain"
            />
            <div v-else class="text-center p-4">
              <UIcon name="i-lucide-image-plus" class="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <span class="text-xs text-zinc-500">No image</span>
            </div>
            <!-- Remove button -->
            <button 
              v-if="imagePreview || form.image_url"
              type="button"
              @click="removeImage"
              class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <UIcon name="i-lucide-x" class="w-3 h-3" />
            </button>
          </div>
          
          <!-- Upload Controls -->
          <div class="flex-1 space-y-3">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5">Upload Image</label>
              <div class="flex items-center gap-2">
                <label class="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-100 cursor-pointer transition-colors">
                  <UIcon name="i-lucide-upload" class="w-4 h-4" />
                  Choose File
                  <input 
                    type="file" 
                    accept="image/*"
                    class="hidden"
                    @change="handleImageUpload"
                  />
                </label>
                <span v-if="selectedFileName" class="text-xs text-zinc-500">{{ selectedFileName }}</span>
              </div>
              <p class="mt-1.5 text-[10px] sm:text-xs text-zinc-500">
                Recommended: PNG or WEBP with transparent background. Max 5MB.
              </p>
            </div>
            
            <!-- Background Removal Toggle -->
            <div class="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <input 
                id="remove_bg"
                v-model="removeBackground"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
              />
              <label for="remove_bg" class="text-xs sm:text-sm text-blue-700">
                <span class="font-medium">Remove background</span>
                <span class="block text-[10px] text-blue-600">Automatically remove image background before saving</span>
              </label>
            </div>
            
            <!-- Or enter URL -->
            <div>
              <label class="block text-xs text-zinc-500 mb-1">Or enter image URL</label>
              <input 
                v-model="form.image_url"
                type="url"
                placeholder="https://example.com/image.png"
                class="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- SKU & Product Name -->
      <div class="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
        <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2 sm:gap-3">
          <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-package" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
          </div>
          Basic Information
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label for="sku" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5 sm:mb-2">SKU</label>
            <input 
              id="sku"
              v-model="form.sku" 
              type="text"
              placeholder="e.g. BEV001"
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-zinc-200 rounded-lg sm:rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          
          <div>
            <label for="product_name" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5 sm:mb-2">
              Product Name <span class="text-red-500">*</span>
            </label>
            <input 
              id="product_name"
              v-model="form.product_name" 
              type="text" 
              required
              placeholder="Enter product name"
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-zinc-200 rounded-lg sm:rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>
        
        <div>
          <label for="description" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5 sm:mb-2">Description</label>
          <textarea 
            id="description"
            v-model="form.description" 
            rows="3"
            placeholder="e.g. 330ml * 24c (centered on PO form)"
            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-zinc-200 rounded-lg sm:rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 min-h-[4rem] max-h-40 resize-y"
          ></textarea>
          <p class="mt-1 text-[10px] sm:text-xs text-zinc-500">Description will be centered in the PO form</p>
        </div>
      </div>
      
      <!-- Pricing -->
      <div class="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
        <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2 sm:gap-3">
          <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-banknote" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
          </div>
          Pricing
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label for="cost_price" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5 sm:mb-2">
              Cost Price <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">$</span>
              <input 
                id="cost_price"
                v-model.number="form.cost_price" 
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                class="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-zinc-200 rounded-lg sm:rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
          
          <div>
            <label for="selling_price" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5 sm:mb-2">
              Selling Price <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">$</span>
              <input 
                id="selling_price"
                v-model.number="form.selling_price" 
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                class="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-zinc-200 rounded-lg sm:rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
        </div>
        
        <!-- Profit Preview -->
        <div v-if="form.cost_price && form.selling_price" 
          :class="[
            'flex items-center justify-between p-3 sm:p-4 border rounded-lg sm:rounded-xl',
            profitMargin >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
          ]"
        >
          <span :class="['text-xs sm:text-sm font-medium', profitMargin >= 0 ? 'text-emerald-700' : 'text-red-700']">
            Profit Margin
          </span>
          <span :class="['text-lg sm:text-xl font-semibold', profitMargin >= 0 ? 'text-emerald-600' : 'text-red-600']">
            {{ profitMargin >= 0 ? '+' : '' }}${{ profitMargin.toFixed(2) }}
          </span>
        </div>
      </div>
      
      <!-- Inventory Management - Safety Stock & EOQ -->
      <div class="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
        <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2 sm:gap-3">
          <div class="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-warehouse" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          </div>
          <span class="text-emerald-700">✓ Inventory Management</span>
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label for="safety_stock" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5 sm:mb-2">
              Safety Stock
              <span class="text-zinc-400 font-normal ml-1">(Buffer)</span>
            </label>
            <input 
              id="safety_stock"
              v-model.number="form.safety_stock" 
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-zinc-200 rounded-lg sm:rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <p class="mt-1 text-[10px] sm:text-xs text-zinc-500">Minimum stock to maintain as buffer against stockouts</p>
          </div>
          
          <div>
            <label for="reorder_quantity" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5 sm:mb-2">
              Re-order Quantity (EOQ)
              <span class="text-zinc-400 font-normal ml-1">(Economic Order Qty)</span>
            </label>
            <input 
              id="reorder_quantity"
              v-model.number="form.reorder_quantity" 
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-zinc-200 rounded-lg sm:rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <p class="mt-1 text-[10px] sm:text-xs text-zinc-500">Optimal quantity to order each time stock runs low</p>
          </div>
        </div>
        
        <!-- Info Box -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div class="flex items-start gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div class="text-xs text-blue-700">
              <p class="font-medium mb-1">Inventory Tips:</p>
              <ul class="list-disc list-inside space-y-0.5">
                <li><strong>Safety Stock:</strong> Keep enough to cover demand during lead time variations</li>
                <li><strong>EOQ:</strong> Balance ordering costs vs holding costs for optimal efficiency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Supplier -->
      <div class="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
        <h3 class="text-sm font-medium text-zinc-900 flex items-center gap-2 sm:gap-3">
          <div class="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-building-2" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
          </div>
          Supplier
        </h3>
        
        <div>
          <label for="supplier_id" class="block text-xs sm:text-sm font-medium text-zinc-700 mb-1.5 sm:mb-2">Select Supplier</label>
          <select 
            id="supplier_id"
            v-model="form.supplier_id"
            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-zinc-200 rounded-lg sm:rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 appearance-none cursor-pointer"
          >
            <option :value="undefined">-- Select Supplier --</option>
            <option v-for="supplier in suppliers" :key="supplier.supplier_id" :value="supplier.supplier_id">
              {{ supplier.company_name }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
        <UIcon name="i-lucide-alert-circle" class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
        <p class="text-xs sm:text-sm text-red-700">{{ error }}</p>
      </div>
      
      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-2 sm:pt-4">
        <button 
          type="submit" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed" 
          :disabled="loading"
        >
          <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
          <UIcon v-else name="i-lucide-check" class="w-4 h-4" />
          {{ loading ? 'Saving...' : 'Save Product' }}
        </button>
        <NuxtLink 
          to="/products" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-xl hover:bg-zinc-200 no-underline"
        >
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types';

const props = defineProps<{
  product?: Product;
  isEdit?: boolean;
}>();

const emit = defineEmits<{
  submit: [product: Product];
}>();

const { loading, error } = useProducts();
const { suppliers, fetchSuppliers } = useSuppliers();

// Image handling
const imagePreview = ref<string | null>(null);
const selectedFileName = ref<string>('');
const removeBackground = ref(true);

const form = ref<Product>({
  sku: props.product?.sku || '',
  product_name: props.product?.product_name || '',
  description: props.product?.description || '',
  image_url: props.product?.image_url || '',
  cost_price: props.product?.cost_price || 0,
  selling_price: props.product?.selling_price || 0,
  supplier_id: props.product?.supplier_id,
  safety_stock: props.product?.safety_stock || 0,
  reorder_quantity: props.product?.reorder_quantity || 0,
});

// Computed profit margin with proper color logic
const profitMargin = computed(() => {
  return (form.value.selling_price || 0) - (form.value.cost_price || 0);
});

// Handle image upload
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    return;
  }
  
  selectedFileName.value = file.name;
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
    
    // If remove background is enabled, we would call an API here
    // For now, just use the original image
    if (removeBackground.value) {
      // TODO: Integrate with background removal API (e.g., remove.bg)
      // For now, just use the uploaded image
      form.value.image_url = imagePreview.value;
    } else {
      form.value.image_url = imagePreview.value;
    }
  };
  reader.readAsDataURL(file);
};

// Remove image
const removeImage = () => {
  imagePreview.value = null;
  selectedFileName.value = '';
  form.value.image_url = '';
};

onMounted(() => {
  fetchSuppliers();
});

const handleSubmit = () => {
  emit('submit', form.value);
};
</script>

