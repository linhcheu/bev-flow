<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-zinc-50">
    <div class="max-w-5xl mx-auto">
      <!-- Back Button & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <NuxtLink 
          to="/purchase-orders" 
          class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 no-underline"
        >
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Purchase Orders
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

      <!-- Receipt Card -->
      <div v-else-if="order" id="receipt-content" class="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <!-- Receipt Header -->
        <div class="bg-gradient-to-r from-amber-500 to-amber-600 px-6 sm:px-8 py-6 sm:py-8 text-white">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <img src="/images/logo-1.png" alt="BEV Flow" class="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl font-bold">BEV Flow</h1>
                <p class="text-amber-100 text-sm">Beverage Inventory Management</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-amber-100 text-xs uppercase tracking-wider mb-1">Purchase Order</p>
              <p class="text-xl sm:text-2xl font-bold">{{ order.po_number }}</p>
            </div>
          </div>
        </div>

        <!-- Status Bar -->
        <div class="px-6 sm:px-8 py-4 border-b border-zinc-100 bg-zinc-50">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="text-sm text-zinc-600">Status:</span>
              <select 
                v-model="currentStatus" 
                @change="updateStatus"
                class="px-3 py-1.5 text-sm font-medium rounded-full border-2 cursor-pointer transition-all"
                :class="getStatusSelectClass(currentStatus)"
              >
                <option value="Pending">Pending</option>
                <option value="Ordered">Ordered</option>
                <option value="Shipped">Shipped</option>
                <option value="Received">Received</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div class="text-xs sm:text-sm text-zinc-500">
              Created: {{ formatDateTime(order.created_at) }}
            </div>
          </div>
        </div>

        <!-- Order & Supplier Info -->
        <div class="px-6 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-zinc-100">
          <!-- Order Details -->
          <div>
            <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Order Details</h3>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm">
                <UIcon name="i-lucide-calendar" class="w-4 h-4 text-zinc-400" />
                <span class="text-zinc-500">Order Date:</span>
                <span class="font-medium text-zinc-900">{{ formatDate(order.order_date) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <UIcon name="i-lucide-truck" class="w-4 h-4 text-zinc-400" />
                <span class="text-zinc-500">Expected Delivery:</span>
                <span class="font-medium text-zinc-900">{{ formatDate(order.eta_date) }}</span>
              </div>
              <div v-if="order.truck_remark" class="flex items-center gap-2 text-sm">
                <UIcon name="i-lucide-info" class="w-4 h-4 text-zinc-400" />
                <span class="text-zinc-500">Truck:</span>
                <span class="font-medium text-zinc-900">{{ order.truck_remark }}</span>
              </div>
            </div>
          </div>

          <!-- Supplier Info -->
          <div>
            <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Supplier Information</h3>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm">
                <UIcon name="i-lucide-building-2" class="w-4 h-4 text-zinc-400" />
                <span class="font-medium text-zinc-900">{{ order.supplier?.company_name }}</span>
              </div>
              <div v-if="order.supplier?.contact_person" class="flex items-center gap-2 text-sm">
                <UIcon name="i-lucide-user" class="w-4 h-4 text-zinc-400" />
                <span class="text-zinc-600">{{ order.supplier.contact_person }}</span>
              </div>
              <div v-if="order.supplier?.phone" class="flex items-center gap-2 text-sm">
                <UIcon name="i-lucide-phone" class="w-4 h-4 text-zinc-400" />
                <span class="text-zinc-600">{{ order.supplier.phone }}</span>
              </div>
              <div v-if="order.supplier?.email" class="flex items-center gap-2 text-sm">
                <UIcon name="i-lucide-mail" class="w-4 h-4 text-zinc-400" />
                <span class="text-zinc-600">{{ order.supplier.email }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Third Party Agent (if any) -->
        <div v-if="order.third_party_agent" class="px-6 sm:px-8 py-4 border-b border-zinc-100 bg-amber-50/50">
          <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Third Party Agent</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-user" class="w-4 h-4 text-amber-600" />
              <span class="text-zinc-900">{{ order.third_party_agent }}</span>
            </div>
            <div v-if="order.agent_phone" class="flex items-center gap-2">
              <UIcon name="i-lucide-phone" class="w-4 h-4 text-amber-600" />
              <span class="text-zinc-600">{{ order.agent_phone }}</span>
            </div>
            <div v-if="order.agent_email" class="flex items-center gap-2">
              <UIcon name="i-lucide-mail" class="w-4 h-4 text-amber-600" />
              <span class="text-zinc-600">{{ order.agent_email }}</span>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="px-6 sm:px-8 py-6">
          <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Order Items</h3>
          
          <!-- Desktop Table -->
          <div class="hidden sm:block overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b-2 border-zinc-200">
                  <th class="pb-3 text-left text-xs font-semibold text-zinc-500 uppercase">#</th>
                  <th class="pb-3 text-left text-xs font-semibold text-zinc-500 uppercase">Product</th>
                  <th class="pb-3 text-left text-xs font-semibold text-zinc-500 uppercase">SKU</th>
                  <th class="pb-3 text-right text-xs font-semibold text-zinc-500 uppercase">Qty</th>
                  <th class="pb-3 text-right text-xs font-semibold text-zinc-500 uppercase">Unit Cost</th>
                  <th class="pb-3 text-right text-xs font-semibold text-zinc-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100">
                <tr v-for="(item, index) in order.items" :key="item.item_id" class="hover:bg-zinc-50">
                  <td class="py-3 text-sm text-zinc-500">{{ index + 1 }}</td>
                  <td class="py-3">
                    <p class="text-sm font-medium text-zinc-900">{{ item.product?.product_name }}</p>
                    <p v-if="item.product?.description" class="text-xs text-zinc-500">{{ item.product.description }}</p>
                  </td>
                  <td class="py-3 text-sm text-zinc-500">{{ item.product?.sku }}</td>
                  <td class="py-3 text-sm text-zinc-900 text-right font-medium">{{ item.quantity }}</td>
                  <td class="py-3 text-sm text-zinc-600 text-right">${{ Number(item.unit_cost).toFixed(2) }}</td>
                  <td class="py-3 text-sm font-semibold text-zinc-900 text-right">${{ Number(item.amount).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div class="sm:hidden space-y-3">
            <div v-for="(item, index) in order.items" :key="item.item_id" class="bg-zinc-50 rounded-lg p-3">
              <div class="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p class="text-sm font-medium text-zinc-900">{{ item.product?.product_name }}</p>
                  <p class="text-xs text-zinc-500">{{ item.product?.sku }}</p>
                </div>
                <span class="text-xs bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded">#{{ index + 1 }}</span>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p class="text-zinc-500">Qty</p>
                  <p class="font-medium text-zinc-900">{{ item.quantity }}</p>
                </div>
                <div>
                  <p class="text-zinc-500">Unit</p>
                  <p class="font-medium text-zinc-900">${{ Number(item.unit_cost).toFixed(2) }}</p>
                </div>
                <div>
                  <p class="text-zinc-500">Amount</p>
                  <p class="font-semibold text-amber-600">${{ Number(item.amount).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="px-6 sm:px-8 py-6 bg-zinc-50 border-t border-zinc-200">
          <div class="max-w-xs ml-auto space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-zinc-500">Subtotal</span>
              <span class="font-medium text-zinc-900">${{ Number(order.subtotal || 0).toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-zinc-500">Shipping ({{ order.shipping_rate || 3 }}%)</span>
              <span class="font-medium text-zinc-900">${{ Number(order.shipping_cost || 0).toFixed(2) }}</span>
            </div>
            <div v-if="order.promotion_amount" class="flex items-center justify-between text-sm">
              <span class="text-zinc-500">Promotion</span>
              <span class="font-medium text-emerald-600">-${{ Number(order.promotion_amount).toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between pt-3 border-t border-zinc-300">
              <span class="text-base font-semibold text-zinc-900">Total</span>
              <span class="text-xl font-bold text-amber-600">${{ Number(order.total_amount || 0).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Remarks -->
        <div v-if="order.overall_remark" class="px-6 sm:px-8 py-4 border-t border-zinc-100">
          <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Remarks</h3>
          <p class="text-sm text-zinc-600">{{ order.overall_remark }}</p>
        </div>

        <!-- Footer -->
        <div class="px-6 sm:px-8 py-4 bg-zinc-100 text-center">
          <p class="text-xs text-zinc-500">Thank you for your business!</p>
          <p class="text-xs text-zinc-400 mt-1">Generated by BEV Flow - {{ new Date().toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PurchaseOrder } from '~/types';

const route = useRoute();
const id = route.params.id as string;

const order = ref<PurchaseOrder | null>(null);
const loading = ref(true);
const currentStatus = ref('Pending');

onMounted(async () => {
  try {
    const data = await $fetch<PurchaseOrder>(`/api/purchase-orders/${id}`);
    order.value = data;
    currentStatus.value = data.status || 'Pending';
  } catch (error) {
    console.error('Failed to fetch PO:', error);
  } finally {
    loading.value = false;
  }
});

const formatDate = (date?: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatDateTime = (date?: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-US', { 
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const getStatusSelectClass = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-amber-50 border-amber-300 text-amber-700';
    case 'Ordered': return 'bg-blue-50 border-blue-300 text-blue-700';
    case 'Shipped': return 'bg-purple-50 border-purple-300 text-purple-700';
    case 'Received': return 'bg-emerald-50 border-emerald-300 text-emerald-700';
    case 'Cancelled': return 'bg-red-50 border-red-300 text-red-700';
    default: return 'bg-zinc-50 border-zinc-300 text-zinc-700';
  }
};

const updateStatus = async () => {
  try {
    await $fetch(`/api/purchase-orders/${id}`, {
      method: 'PUT',
      body: { status: currentStatus.value }
    });
  } catch (error) {
    console.error('Failed to update status:', error);
  }
};

const printReceipt = () => {
  window.print();
};

const exportToPDF = () => {
  // Create a printable version and trigger print dialog for PDF
  const printWindow = window.open('', '_blank');
  if (!printWindow || !order.value) return;
  
  const content = generatePrintHTML();
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
};

const exportToExcel = () => {
  if (!order.value) return;
  
  // Create CSV content
  const items = order.value.items || [];
  let csv = 'Purchase Order Export\n\n';
  csv += `PO Number,${order.value.po_number}\n`;
  csv += `Supplier,${order.value.supplier?.company_name || ''}\n`;
  csv += `Order Date,${order.value.order_date}\n`;
  csv += `ETA Date,${order.value.eta_date || ''}\n`;
  csv += `Status,${order.value.status}\n\n`;
  csv += 'Items\n';
  csv += 'Product,SKU,Quantity,Unit Cost,Amount\n';
  
  items.forEach(item => {
    csv += `"${item.product?.product_name || ''}","${item.product?.sku || ''}",${item.quantity},${item.unit_cost},${item.amount}\n`;
  });
  
  csv += `\nSubtotal,,,,${order.value.subtotal || 0}\n`;
  csv += `Shipping,,,,${order.value.shipping_cost || 0}\n`;
  csv += `Promotion,,,,${order.value.promotion_amount || 0}\n`;
  csv += `Total,,,,${order.value.total_amount || 0}\n`;
  
  // Download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `PO-${order.value.po_number}.csv`;
  link.click();
};

const generatePrintHTML = () => {
  if (!order.value) return '';
  
  const items = order.value.items || [];
  const itemsHTML = items.map((item, index) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${index + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${item.product?.product_name || ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${item.product?.sku || ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: right;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: right;">$${Number(item.unit_cost).toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: 600;">$${Number(item.amount).toFixed(2)}</td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>PO-${order.value.po_number}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { border: 1px solid #e5e5e5; border-top: none; padding: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { text-align: left; padding: 10px; background: #f5f5f5; border-bottom: 2px solid #e5e5e5; font-size: 12px; text-transform: uppercase; }
        .totals { margin-left: auto; width: 250px; }
        .totals div { display: flex; justify-content: space-between; padding: 8px 0; }
        .totals .total { border-top: 2px solid #333; font-size: 18px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; background: #f5f5f5; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1>BEV Flow</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Beverage Inventory Management</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">PURCHASE ORDER</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;">${order.value.po_number}</p>
          </div>
        </div>
      </div>
      <div class="content">
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h3 style="margin: 0 0 10px 0; font-size: 12px; color: #888; text-transform: uppercase;">Order Details</h3>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(order.value.order_date)}</p>
            <p style="margin: 5px 0;"><strong>ETA:</strong> ${formatDate(order.value.eta_date)}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${order.value.status}</p>
          </div>
          <div>
            <h3 style="margin: 0 0 10px 0; font-size: 12px; color: #888; text-transform: uppercase;">Supplier</h3>
            <p style="margin: 5px 0; font-weight: 600;">${order.value.supplier?.company_name || ''}</p>
            <p style="margin: 5px 0;">${order.value.supplier?.contact_person || ''}</p>
            <p style="margin: 5px 0;">${order.value.supplier?.phone || ''}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>SKU</th>
              <th style="text-align: right;">Qty</th>
              <th style="text-align: right;">Unit Cost</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        
        <div class="totals">
          <div><span>Subtotal</span><span>$${Number(order.value.subtotal || 0).toFixed(2)}</span></div>
          <div><span>Shipping</span><span>$${Number(order.value.shipping_cost || 0).toFixed(2)}</span></div>
          ${order.value.promotion_amount ? `<div><span>Promotion</span><span>-$${Number(order.value.promotion_amount).toFixed(2)}</span></div>` : ''}
          <div class="total"><span>Total</span><span style="color: #f59e0b;">$${Number(order.value.total_amount || 0).toFixed(2)}</span></div>
        </div>
      </div>
      <div class="footer">
        <p>Thank you for your business!</p>
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
