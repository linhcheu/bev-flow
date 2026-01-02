<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-zinc-50">
    <div class="max-w-2xl mx-auto">
      <!-- Back Button & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <NuxtLink 
          to="/sales" 
          class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 no-underline"
        >
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Sales
        </NuxtLink>
        
        <div class="flex items-center gap-2">
          <button 
            @click="exportToPDF" 
            class="inline-flex items-center gap-2 px-3 py-2 bg-red-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            <UIcon name="i-lucide-file-text" class="w-4 h-4" />
            Export PDF
          </button>
          <button 
            @click="exportToExcel" 
            class="inline-flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <UIcon name="i-lucide-table" class="w-4 h-4" />
            Export Excel
          </button>
          <button 
            @click="printReceipt" 
            class="inline-flex items-center gap-2 px-3 py-2 bg-zinc-700 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <UIcon name="i-lucide-printer" class="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-amber-500 animate-spin" />
      </div>

      <!-- Sales Receipt Card -->
      <div v-else-if="sale" id="receipt-content" class="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <!-- Receipt Header -->
        <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 sm:px-8 py-6 sm:py-8 text-white">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <img src="/images/logo-1.png" alt="BEV Flow" class="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl font-bold">BEV Flow</h1>
                <p class="text-emerald-100 text-sm">Beverage Inventory Management</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-emerald-100 text-xs uppercase tracking-wider mb-1">Sales Receipt</p>
              <p class="text-xl sm:text-2xl font-bold">{{ sale.invoice_number }}</p>
            </div>
          </div>
        </div>

        <!-- Receipt Details -->
        <div class="px-6 sm:px-8 py-6 border-b border-zinc-100">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Transaction Info -->
            <div>
              <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Transaction Details</h3>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-sm">
                  <UIcon name="i-lucide-calendar" class="w-4 h-4 text-zinc-400" />
                  <span class="text-zinc-500">Date:</span>
                  <span class="font-medium text-zinc-900">{{ formatDate(sale.sale_date) }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <UIcon name="i-lucide-clock" class="w-4 h-4 text-zinc-400" />
                  <span class="text-zinc-500">Time:</span>
                  <span class="font-medium text-zinc-900">{{ formatTime(sale.created_at) }}</span>
                </div>
              </div>
            </div>

            <!-- Customer Info -->
            <div>
              <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Customer</h3>
              <div class="flex items-center gap-2 text-sm">
                <UIcon name="i-lucide-user" class="w-4 h-4 text-zinc-400" />
                <span class="font-medium text-zinc-900">{{ sale.customer_name || 'Walk-in Customer' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Item Details -->
        <div class="px-6 sm:px-8 py-6">
          <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Item Details</h3>
          
          <!-- Product Card -->
          <div class="bg-zinc-50 rounded-xl p-4 sm:p-5">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-package" class="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-base sm:text-lg font-semibold text-zinc-900">{{ sale.product?.product_name }}</h4>
                <p class="text-sm text-zinc-500">SKU: {{ sale.product?.sku }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-zinc-200">
              <div class="text-center">
                <p class="text-xs text-zinc-500 mb-1">Quantity</p>
                <p class="text-lg sm:text-xl font-bold text-zinc-900">{{ sale.quantity }}</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-zinc-500 mb-1">Unit Price</p>
                <p class="text-lg sm:text-xl font-bold text-zinc-900">${{ Number(sale.unit_price).toFixed(2) }}</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-zinc-500 mb-1">Amount</p>
                <p class="text-lg sm:text-xl font-bold text-emerald-600">${{ Number(sale.total_amount).toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="px-6 sm:px-8 py-6 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-t border-emerald-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-emerald-700 font-medium">Total Amount</p>
              <p class="text-xs text-emerald-600">Thank you for your purchase!</p>
            </div>
            <p class="text-2xl sm:text-3xl font-bold text-emerald-600">${{ Number(sale.total_amount).toFixed(2) }}</p>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="sale.notes" class="px-6 sm:px-8 py-4 border-t border-zinc-100">
          <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Notes</h3>
          <p class="text-sm text-zinc-600">{{ sale.notes }}</p>
        </div>

        <!-- Footer -->
        <div class="px-6 sm:px-8 py-4 bg-zinc-100 text-center">
          <p class="text-xs text-zinc-500">Thank you for shopping with us!</p>
          <p class="text-xs text-zinc-400 mt-1">Generated by BEV Flow - {{ new Date().toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sale } from '~/types';

const route = useRoute();
const id = route.params.id as string;

const sale = ref<Sale | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await $fetch<Sale>(`/api/sales/${id}`);
    sale.value = data;
  } catch (error) {
    console.error('Failed to fetch sale:', error);
  } finally {
    loading.value = false;
  }
});

const formatDate = (date?: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = (date?: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const printReceipt = () => {
  window.print();
};

const exportToPDF = () => {
  const printWindow = window.open('', '_blank');
  if (!printWindow || !sale.value) return;
  
  const content = generatePrintHTML();
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
};

const exportToExcel = () => {
  if (!sale.value) return;
  
  let csv = 'Sales Receipt Export\n\n';
  csv += `Invoice Number,${sale.value.invoice_number}\n`;
  csv += `Date,${sale.value.sale_date}\n`;
  csv += `Customer,${sale.value.customer_name || 'Walk-in Customer'}\n\n`;
  csv += 'Item Details\n';
  csv += 'Product,SKU,Quantity,Unit Price,Total\n';
  csv += `"${sale.value.product?.product_name || ''}","${sale.value.product?.sku || ''}",${sale.value.quantity},${sale.value.unit_price},${sale.value.total_amount}\n`;
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Receipt-${sale.value.invoice_number}.csv`;
  link.click();
};

const generatePrintHTML = () => {
  if (!sale.value) return '';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt-${sale.value.invoice_number}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; color: #333; max-width: 400px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 25px; border-radius: 10px 10px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; }
        .header .invoice { font-size: 24px; font-weight: bold; margin-top: 10px; }
        .content { border: 1px solid #e5e5e5; border-top: none; padding: 25px; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .product-card { background: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center; }
        .product-name { font-size: 18px; font-weight: 600; margin-bottom: 5px; }
        .product-sku { font-size: 12px; color: #666; }
        .stats { display: flex; justify-content: space-between; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        .stat { text-align: center; }
        .stat-label { font-size: 10px; color: #888; }
        .stat-value { font-size: 20px; font-weight: bold; }
        .total { background: linear-gradient(135deg, #d1fae5, #a7f3d0); padding: 20px; text-align: center; border-radius: 10px; margin-top: 20px; }
        .total-label { font-size: 14px; color: #059669; }
        .total-value { font-size: 32px; font-weight: bold; color: #059669; }
        .footer { text-align: center; padding: 20px; background: #f5f5f5; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>BEV Flow</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 12px;">Sales Receipt</p>
        <p class="invoice">${sale.value.invoice_number}</p>
      </div>
      <div class="content">
        <div class="section">
          <p class="section-title">Transaction Details</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(sale.value.sale_date)}</p>
          <p style="margin: 5px 0;"><strong>Customer:</strong> ${sale.value.customer_name || 'Walk-in Customer'}</p>
        </div>
        
        <div class="product-card">
          <p class="product-name">${sale.value.product?.product_name || ''}</p>
          <p class="product-sku">SKU: ${sale.value.product?.sku || ''}</p>
          <div class="stats">
            <div class="stat">
              <p class="stat-label">Quantity</p>
              <p class="stat-value">${sale.value.quantity}</p>
            </div>
            <div class="stat">
              <p class="stat-label">Unit Price</p>
              <p class="stat-value">$${Number(sale.value.unit_price).toFixed(2)}</p>
            </div>
            <div class="stat">
              <p class="stat-label">Amount</p>
              <p class="stat-value" style="color: #059669;">$${Number(sale.value.total_amount).toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div class="total">
          <p class="total-label">Total Amount</p>
          <p class="total-value">$${Number(sale.value.total_amount).toFixed(2)}</p>
        </div>
      </div>
      <div class="footer">
        <p>Thank you for shopping with us!</p>
        <p>Generated by BEV Flow - ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `;
};
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #receipt-content, #receipt-content * {
    visibility: visible;
  }
  #receipt-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
