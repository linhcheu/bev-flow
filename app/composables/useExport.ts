// Export composable for Excel and PDF
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

// Logo as base64 - will be loaded from public folder
const LOGO_PATH = '/images/logo-1.png';

// Helper to load logo as base64
const loadLogoAsBase64 = async (): Promise<string | null> => {
  try {
    const response = await fetch(LOGO_PATH);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const useExport = () => {
  // Export data to Excel with professional formatting
  const exportToExcel = (
    data: any[],
    columns: ExportColumn[],
    filename: string = 'export',
    options?: { title?: string; summary?: Record<string, string | number> }
  ) => {
    const title = options?.title || filename.replace(/_/g, ' ').toUpperCase();
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    // Create header rows with branding
    const headerRows: any[][] = [
      ['BEV FLOW'],
      ['Karaoke Inventory Management System'],
      [''],
      [title],
      [`Generated: ${date}`],
      [`Total Records: ${data.length}`],
      [''],
    ];
    
    // Add summary stats if provided
    if (options?.summary) {
      headerRows.push(['Summary']);
      Object.entries(options.summary).forEach(([key, value]) => {
        headerRows.push([key, typeof value === 'number' ? value.toLocaleString() : value]);
      });
      headerRows.push(['']);
    }

    // Add data headers
    const headers = columns.map(col => col.header);
    headerRows.push(headers);
    
    // Prepare data rows
    const rows = data.map(item => 
      columns.map(col => {
        const value = item[col.key];
        if (value === null || value === undefined) return '';
        if (typeof value === 'number') return value;
        return String(value);
      })
    );

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([...headerRows, ...rows]);
    
    // Set column widths
    ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));
    
    // Merge header cells for title
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: Math.min(columns.length - 1, 3) } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: Math.min(columns.length - 1, 3) } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: Math.min(columns.length - 1, 3) } },
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    // Download
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `${filename}_${dateStr}.xlsx`);
  };

  // Export data to PDF with professional header and logo
  const exportToPDF = async (
    data: any[],
    columns: ExportColumn[],
    title: string,
    filename: string = 'export',
    options?: { summary?: Record<string, string | number> }
  ) => {
    const doc = new jsPDF({
      orientation: columns.length > 5 ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    let startY = 10;

    // Load and add logo - CENTERED
    const logoBase64 = await loadLogoAsBase64();
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', (pageWidth - 25) / 2, startY, 25, 25);
      } catch {
        // If logo fails, continue without it
      }
    }

    // Header - Company Name (LEFT side)
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42); // zinc-800
    doc.text('BEV FLOW', 14, startY + 8);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122); // zinc-500
    doc.text('Karaoke Inventory Management System', 14, startY + 14);

    // Company Information (RIGHT side)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('H2O - KTV, Restaurant, Steam Sauna', pageWidth - 14, startY + 4, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(82, 82, 91);
    doc.text('Takdol Village, Takhmao Town, Kandal Province', pageWidth - 14, startY + 10, { align: 'right' });
    doc.text('Phone: 012 955 499 | Email: h2oktv99@gmail.com', pageWidth - 14, startY + 15, { align: 'right' });

    // Subtle line separator
    startY += 25;
    doc.setDrawColor(228, 228, 231); // zinc-200
    doc.setLineWidth(0.5);
    doc.line(14, startY, pageWidth - 14, startY);
    startY += 8;

    // Report Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text(title, 14, startY);
    startY += 6;

    // Date and record count
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    doc.text(`Generated: ${date}`, 14, startY);
    doc.text(`Total Records: ${data.length}`, pageWidth - 14, startY, { align: 'right' });
    startY += 8;

    // Summary section if provided
    if (options?.summary && Object.keys(options.summary).length > 0) {
      doc.setFillColor(250, 250, 250); // zinc-50
      doc.roundedRect(14, startY, pageWidth - 28, 22, 2, 2, 'F');
      
      const summaryEntries = Object.entries(options.summary);
      const colWidth = (pageWidth - 28) / Math.min(summaryEntries.length, 4);
      
      summaryEntries.slice(0, 4).forEach(([key, value], index) => {
        const x = 18 + (index * colWidth);
        doc.setFontSize(8);
        doc.setTextColor(113, 113, 122);
        doc.text(key, x, startY + 8);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(39, 39, 42);
        const displayValue = typeof value === 'number' ? value.toLocaleString() : String(value);
        doc.text(displayValue, x, startY + 16);
        doc.setFont('helvetica', 'normal');
      });
      
      startY += 28;
    }

    // Table data
    const headers = columns.map(col => col.header);
    const rows = data.map(item => 
      columns.map(col => {
        const value = item[col.key];
        if (value === null || value === undefined) return '';
        if (typeof value === 'number') {
          if (col.key.includes('price') || col.key.includes('amount') || col.key.includes('cost') || col.key.includes('total') || col.key.includes('revenue') || col.key.includes('profit')) {
            return `$${value.toFixed(2)}`;
          }
          return String(value);
        }
        return String(value);
      })
    );

    // Add table with modern professional styling
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: startY,
      styles: { 
        fontSize: 9, 
        cellPadding: 5,
        textColor: [63, 63, 70], // zinc-700
        lineColor: [228, 228, 231], // zinc-200
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [245, 158, 11], // amber-500 - professional warm color
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      alternateRowStyles: { 
        fillColor: [254, 252, 232] // amber-50 - subtle warm tint
      },
      margin: { left: 14, right: 14 },
    });

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const footerY = doc.internal.pageSize.getHeight() - 10;
      
      // Footer line
      doc.setDrawColor(228, 228, 231);
      doc.setLineWidth(0.3);
      doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
      
      // Footer text
      doc.setFontSize(8);
      doc.setTextColor(161, 161, 170); // zinc-400
      doc.text('BEV Flow - Karaoke Inventory Management', 14, footerY);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, footerY, { align: 'right' });
    }

    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`${filename}_${dateStr}.pdf`);
  };

  // Export dashboard summary with professional layout
  const exportDashboardPDF = async (stats: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 10;

    // Load and add logo
    const logoBase64 = await loadLogoAsBase64();
    
    // Title (LEFT side)
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('Dashboard Report', 14, y + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text('BEV Flow - Karaoke Inventory Management', 14, y + 16);

    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    doc.text(`Generated: ${date}`, 14, y + 22);

    // Logo (CENTER)
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', (pageWidth - 25) / 2, y, 25, 25);
      } catch {
        // Continue without logo
      }
    }

    // Company Information (RIGHT side)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('H2O - KTV, Restaurant, Steam Sauna', pageWidth - 14, y + 6, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(82, 82, 91);
    doc.text('Takdol Village, Takhmao Town, Kandal Province', pageWidth - 14, y + 12, { align: 'right' });
    doc.text('Phone: 012 955 499 | Email: h2oktv99@gmail.com', pageWidth - 14, y + 18, { align: 'right' });

    // Separator line
    y += 30;
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.5);
    doc.line(14, y, pageWidth - 14, y);
    y += 12;

    // Stats cards row
    doc.setFillColor(250, 250, 250);
    
    const statsData = [
      { label: 'Total Products', value: stats.productCount || 0, icon: '📦' },
      { label: 'Total Suppliers', value: stats.supplierCount || 0, icon: '🏢' },
      { label: 'Active POs', value: stats.activePoCount || 0, icon: '📋' },
    ];

    const cardWidth = (pageWidth - 42) / 3;
    statsData.forEach((stat, index) => {
      const x = 14 + (index * (cardWidth + 7));
      doc.roundedRect(x, y, cardWidth, 28, 2, 2, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122);
      doc.text(stat.label, x + 10, y + 10);
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(39, 39, 42);
      doc.text(String(stat.value), x + 10, y + 22);
      doc.setFont('helvetica', 'normal');
    });

    y += 38;

    // Today's Performance section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text("Today's Performance", 14, y);
    y += 8;

    const todayStats = [
      ['Total Sales', `$${(stats.todaySales || 0).toFixed(2)}`],
      ['Total Profit', `$${(stats.todayProfit || 0).toFixed(2)}`],
      ['Orders Completed', String(stats.todayOrders || 0)],
      ['Profit Margin', stats.todaySales > 0 ? `${((stats.todayProfit / stats.todaySales) * 100).toFixed(1)}%` : '0%'],
    ];

    autoTable(doc, {
      body: todayStats,
      startY: y,
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 6 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 70, textColor: [113, 113, 122] },
        1: { cellWidth: 50, halign: 'right', textColor: [39, 39, 42] },
      },
    });

    // Low stock alerts
    if (stats.lowStockProducts?.length > 0) {
      y = (doc as any).lastAutoTable.finalY + 15;
      
      // Section header with warning indicator
      doc.setFillColor(254, 243, 199); // amber-100
      doc.roundedRect(14, y - 5, pageWidth - 28, 10, 2, 2, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(180, 83, 9); // amber-700
      doc.text('⚠️ Low Stock Alerts', 20, y + 2);
      y += 12;

      autoTable(doc, {
        head: [['Product', 'Current Stock', 'Min Level', 'Status']],
        body: stats.lowStockProducts.map((p: any) => [
          p.product_name, 
          String(p.current_stock), 
          String(p.min_stock_level),
          'Restock Needed'
        ]),
        startY: y,
        headStyles: { 
          fillColor: [217, 119, 6], // amber-600
          textColor: [255, 255, 255],
          fontSize: 9,
        },
        styles: { fontSize: 9, cellPadding: 4 },
        alternateRowStyles: { fillColor: [254, 252, 232] }, // amber-50
      });
    }

    // Top products
    if (stats.topProducts?.length > 0) {
      y = (doc as any).lastAutoTable.finalY + 15;
      
      doc.setFillColor(220, 252, 231); // green-100
      doc.roundedRect(14, y - 5, pageWidth - 28, 10, 2, 2, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 101, 52); // green-800
      doc.text('🏆 Top Selling Products', 20, y + 2);
      y += 12;

      autoTable(doc, {
        head: [['Rank', 'Product', 'Total Sold']],
        body: stats.topProducts.map((p: any, i: number) => [
          `#${i + 1}`,
          p.product_name, 
          String(p.total_sold)
        ]),
        startY: y,
        headStyles: { 
          fillColor: [34, 197, 94], // green-500
          textColor: [255, 255, 255],
          fontSize: 9,
        },
        styles: { fontSize: 9, cellPadding: 4 },
        alternateRowStyles: { fillColor: [240, 253, 244] }, // green-50
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const footerY = doc.internal.pageSize.getHeight() - 10;
      
      doc.setDrawColor(228, 228, 231);
      doc.setLineWidth(0.3);
      doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
      
      doc.setFontSize(8);
      doc.setTextColor(161, 161, 170);
      doc.text('BEV Flow - Karaoke Inventory Management', 14, footerY);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, footerY, { align: 'right' });
    }

    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`dashboard_report_${dateStr}.pdf`);
  };

  return {
    exportToExcel,
    exportToPDF,
    exportDashboardPDF,
  };
};

// Professional receipt-style exports for individual items
export const useReceiptExport = () => {
  // Export single sale as professional invoice PDF - A4 format
  const exportSaleReceipt = async (sale: any) => {
    const items = sale.items || [{ 
      product: sale.product, 
      quantity: sale.quantity, 
      unit_price: sale.unit_price,
      amount: sale.total_amount 
    }];
    
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = margin;

    // === HEADER SECTION ===
    const logoBase64 = await loadLogoAsBase64();
    
    // Title (LEFT side)
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('Sales Invoice', margin, y + 8);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text('BEV Flow - Karaoke Inventory System', margin, y + 14);

    // Logo (CENTER)
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', (pageWidth - 25) / 2, y, 25, 25);
      } catch {
        // Continue without logo
      }
    }

    // Company Information (RIGHT side)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('H2O - KTV, Restaurant, Steam Sauna', pageWidth - margin, y + 4, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(82, 82, 91);
    doc.text('Takdol Village, Takhmao Town, Kandal Province', pageWidth - margin, y + 10, { align: 'right' });
    doc.text('Phone: 012 955 499 | Email: h2oktv99@gmail.com', pageWidth - margin, y + 15, { align: 'right' });

    y += 30;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Invoice Number and Date row
    const saleDate = new Date(sale.sale_date).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('DATE:', margin, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(saleDate, margin + 20, y + 5);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice No.:', pageWidth - margin - 55, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(245, 158, 11);
    doc.text(sale.sale_number || 'N/A', pageWidth - margin - 25, y + 5);
    
    y += 12;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // === CUSTOMER & PAYMENT INFO ===
    const halfWidth = (pageWidth - margin * 2 - 10) / 2;

    // Customer Info Box
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(34, 197, 94);
    doc.rect(margin, y, halfWidth, 40, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text('Customer Information', margin + 3, y + 7);
    
    let fieldY = y + 14;
    doc.setFontSize(8);
    const customerFields = [
      { label: 'Customer Name', value: sale.customer?.customer_name || 'Walk-in Customer' },
      { label: 'Phone', value: sale.customer?.phone || '-' },
      { label: 'Email', value: sale.customer?.email || '-' },
    ];
    
    customerFields.forEach(field => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(82, 82, 91);
      doc.text(field.label + ':', margin + 3, fieldY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(39, 39, 42);
      doc.text(field.value, margin + 35, fieldY);
      fieldY += 8;
    });

    // Payment Info Box
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(59, 130, 246);
    doc.rect(margin + halfWidth + 10, y, halfWidth, 40, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('Payment Information', margin + halfWidth + 13, y + 7);
    
    fieldY = y + 14;
    doc.setFontSize(8);
    const paymentFields = [
      { label: 'Payment Method', value: sale.payment_method || 'Cash' },
      { label: 'Status', value: 'Completed' },
      { label: 'Created By', value: sale.created_by || 'Admin' },
    ];
    
    paymentFields.forEach(field => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(82, 82, 91);
      doc.text(field.label + ':', margin + halfWidth + 13, fieldY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(39, 39, 42);
      doc.text(field.value, margin + halfWidth + 48, fieldY);
      fieldY += 8;
    });

    y += 48;

    // === ITEMS TABLE ===
    const itemsData = items.map((item: any, index: number) => {
      const amount = item.amount || (item.quantity * item.unit_price);
      return [
        String(index + 1),
        item.product?.product_name || 'Product',
        item.product?.description || '-',
        String(item.quantity),
        `$${Number(item.unit_price).toFixed(2)}`,
        `$${Number(amount).toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      head: [['No.', 'Product Name', 'Description', 'Qty', 'Unit Price', 'Amount']],
      body: itemsData,
      startY: y,
      margin: { left: margin, right: margin },
      headStyles: { 
        fillColor: [39, 39, 42],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      styles: { 
        fontSize: 8, 
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 45 },
        2: { cellWidth: 50 },
        3: { cellWidth: 18, halign: 'center' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 25, halign: 'right' },
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
    });
    
    y = (doc as any).lastAutoTable.finalY + 5;

    // === TOTALS SECTION ===
    const totalsX = pageWidth - margin - 70;
    
    doc.setFillColor(250, 250, 250);
    doc.rect(totalsX, y, 70, 40, 'F');
    
    let totalsY = y + 8;
    
    // Subtotal
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(82, 82, 91);
    doc.text('SUBTOTAL', totalsX + 5, totalsY);
    doc.setTextColor(39, 39, 42);
    doc.text(`$${Number(sale.subtotal || sale.total_amount).toFixed(2)}`, totalsX + 65, totalsY, { align: 'right' });
    totalsY += 8;
    
    // Discount if exists
    if (sale.discount_amount && sale.discount_amount > 0) {
      doc.setTextColor(82, 82, 91);
      doc.text('Discount', totalsX + 5, totalsY);
      doc.setTextColor(34, 197, 94);
      doc.text(`-$${Number(sale.discount_amount).toFixed(2)}`, totalsX + 65, totalsY, { align: 'right' });
      totalsY += 8;
    }
    
    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(totalsX + 5, totalsY - 2, totalsX + 65, totalsY - 2);
    totalsY += 6;
    
    // Total
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('TOTAL', totalsX + 5, totalsY);
    doc.setTextColor(245, 158, 11);
    doc.text(`$${Number(sale.total_amount).toFixed(2)}`, totalsX + 65, totalsY, { align: 'right' });

    // Notes section (left side)
    if (sale.notes) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(82, 82, 91);
      doc.text('Notes:', margin, y + 8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(39, 39, 42);
      const noteLines = doc.splitTextToSize(sale.notes, totalsX - margin - 10);
      doc.text(noteLines, margin, y + 16);
    }

    y += 50;

    // === SIGNATURE SECTION ===
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    // Prepared by / Received by section
    const signBoxWidth = (pageWidth - margin * 2 - 20) / 2;
    
    // Prepared by box (left)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(82, 82, 91);
    doc.text('Prepared by:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(39, 39, 42);
    doc.text(sale.created_by || 'Admin', margin + 28, y);
    
    // Signature line
    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y + 20, margin + signBoxWidth, y + 20);
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text('Signature', margin, y + 25);
    doc.text(`Date: ${new Date().toLocaleDateString('en-US')}`, margin + 40, y + 25);

    // Received by box (right)
    const rightX = margin + signBoxWidth + 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(82, 82, 91);
    doc.text('Received by:', rightX, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(39, 39, 42);
    doc.text(sale.customer?.customer_name || 'Customer', rightX + 28, y);
    
    // Signature line
    doc.line(rightX, y + 20, rightX + signBoxWidth, y + 20);
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text('Signature', rightX, y + 25);
    doc.text('Date: _______________', rightX + 40, y + 25);

    y += 35;

    // === THANK YOU MESSAGE ===
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(245, 158, 11);
    doc.text('Thank you for your business!', pageWidth / 2, y, { align: 'center' });

    // === FOOTER ===
    const footerY = pageHeight - 12;
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);
    
    doc.setFontSize(7);
    doc.setTextColor(161, 161, 170);
    doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, margin, footerY);
    doc.text('BEV Flow - Inventory Management System', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Page 1 of 1', pageWidth - margin, footerY, { align: 'right' });

    doc.save(`invoice_${sale.sale_number}.pdf`);
  };

  // Export single sale as Excel with professional formatting
  const exportSaleReceiptExcel = (sale: any) => {
    const items = sale.items || [{ 
      product: sale.product, 
      quantity: sale.quantity, 
      unit_price: sale.unit_price,
      amount: sale.total_amount 
    }];
    
    const saleDate = new Date(sale.sale_date).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
    const generatedDate = new Date().toLocaleString('en-US');
    
    // Create header rows with branding
    const headerData = [
      ['BEV FLOW'],
      ['Karaoke Inventory Management System'],
      [''],
      ['═══════════════════════════════════════════'],
      ['SALES RECEIPT'],
      ['═══════════════════════════════════════════'],
      [''],
      ['Sale Details'],
      ['Sale Number', sale.sale_number],
      ['Date', saleDate],
      ['Customer', sale.customer?.customer_name || 'Walk-in Customer'],
      [''],
      ['Items'],
      ['Product', 'SKU', 'Quantity', 'Unit Price', 'Amount'],
    ];
    
    // Add item rows
    const itemRows = items.map((item: any) => [
      item.product?.product_name || 'Product',
      item.product?.sku || 'N/A',
      item.quantity,
      `$${Number(item.unit_price).toFixed(2)}`,
      `$${Number(item.amount || item.quantity * item.unit_price).toFixed(2)}`,
    ]);
    
    // Add total rows
    const totalRows = [
      [''],
      ['', '', '', '─────────────', '─────────────'],
      ['', '', '', 'Subtotal', `$${Number(sale.subtotal || sale.total_amount).toFixed(2)}`],
      ['', '', '', 'TOTAL', `$${Number(sale.total_amount).toFixed(2)}`],
      [''],
    ];
    
    // Add notes if any
    if (sale.notes) {
      totalRows.push(['Notes', sale.notes, '', '', '']);
    }
    
    totalRows.push(['']);
    totalRows.push(['Generated', generatedDate, '', '', '']);
    totalRows.push(['', 'Thank you for your business!', '', '', '']);
    
    const allData = [...headerData, ...itemRows, ...totalRows];
    
    const ws = XLSX.utils.aoa_to_sheet(allData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 25 }, // Product
      { wch: 15 }, // SKU
      { wch: 10 }, // Quantity
      { wch: 12 }, // Unit Price
      { wch: 12 }, // Amount
    ];
    
    // Merge header cells
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 4 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 4 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 4 } },
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
    XLSX.writeFile(wb, `sale_${sale.sale_number}.xlsx`);
  };

  // Export single product as detail PDF with logo
  const exportProductDetail = async (product: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = margin;

    // === HEADER SECTION ===
    const logoBase64 = await loadLogoAsBase64();
    
    // Title (LEFT side)
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('Product Information Sheet', margin, y + 8);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text('BEV Flow - Karaoke Inventory System', margin, y + 14);

    // Logo (CENTER)
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', (pageWidth - 25) / 2, y, 25, 25);
      } catch {
        // Continue without logo
      }
    }

    // Company Information (RIGHT side)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('H2O - KTV, Restaurant, Steam Sauna', pageWidth - margin, y + 4, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(82, 82, 91);
    doc.text('Takdol Village, Takhmao Town, Kandal Province', pageWidth - margin, y + 10, { align: 'right' });
    doc.text('Phone: 012 955 499 | Email: h2oktv99@gmail.com', pageWidth - margin, y + 15, { align: 'right' });

    y += 30;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // === PRODUCT HEADER ===
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text(product.product_name, margin, y + 5);
    
    // Status badge
    const isLowStock = (product.current_stock || 0) <= (product.min_stock_level || 0);
    if (isLowStock) {
      doc.setFillColor(254, 202, 202);
      doc.roundedRect(pageWidth - margin - 35, y - 2, 35, 10, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(153, 27, 27);
      doc.setFont('helvetica', 'bold');
      doc.text('Low Stock', pageWidth - margin - 17.5, y + 5, { align: 'center' });
    } else {
      doc.setFillColor(187, 247, 208);
      doc.roundedRect(pageWidth - margin - 30, y - 2, 30, 10, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(22, 101, 52);
      doc.setFont('helvetica', 'bold');
      doc.text('In Stock', pageWidth - margin - 15, y + 5, { align: 'center' });
    }
    
    y += 12;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text(`SKU: ${product.sku || 'N/A'}  |  Category: ${product.category || 'Uncategorized'}`, margin, y);
    
    y += 12;

    // === PRICING & STOCK INFO BOXES ===
    const thirdWidth = (pageWidth - margin * 2 - 20) / 3;

    // Cost Price Box
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(34, 197, 94);
    doc.rect(margin, y, thirdWidth, 35, 'FD');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text('Cost Price', margin + 5, y + 10);
    doc.setFontSize(16);
    doc.text(`$${Number(product.cost_price || 0).toFixed(2)}`, margin + 5, y + 25);

    // Selling Price Box
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(245, 158, 11);
    doc.rect(margin + thirdWidth + 10, y, thirdWidth, 35, 'FD');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text('Selling Price', margin + thirdWidth + 15, y + 10);
    doc.setFontSize(16);
    doc.text(`$${Number(product.selling_price || 0).toFixed(2)}`, margin + thirdWidth + 15, y + 25);

    // Profit Margin Box
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(59, 130, 246);
    doc.rect(margin + (thirdWidth + 10) * 2, y, thirdWidth, 35, 'FD');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('Profit Margin', margin + (thirdWidth + 10) * 2 + 5, y + 10);
    doc.setFontSize(16);
    const profit = Number(product.selling_price || 0) - Number(product.cost_price || 0);
    doc.text(`$${profit.toFixed(2)}`, margin + (thirdWidth + 10) * 2 + 5, y + 25);

    y += 45;

    // === STOCK & SUPPLIER DETAILS ===
    const halfWidth = (pageWidth - margin * 2 - 10) / 2;

    // Stock Information Box
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y, halfWidth, 50, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('Stock Information', margin + 5, y + 10);
    
    let fieldY = y + 20;
    doc.setFontSize(8);
    const stockFields = [
      { label: 'Current Stock', value: String(product.current_stock || 0) },
      { label: 'Min Stock Level', value: String(product.min_stock_level || 0) },
      { label: 'Reorder Status', value: isLowStock ? 'Reorder Required' : 'Stock OK' },
    ];
    
    stockFields.forEach(field => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(82, 82, 91);
      doc.text(field.label + ':', margin + 5, fieldY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(39, 39, 42);
      doc.text(field.value, margin + 40, fieldY);
      fieldY += 9;
    });

    // Supplier Information Box
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin + halfWidth + 10, y, halfWidth, 50, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('Supplier Information', margin + halfWidth + 15, y + 10);
    
    fieldY = y + 20;
    doc.setFontSize(8);
    const supplierFields = [
      { label: 'Company', value: product.supplier?.company_name || 'N/A' },
      { label: 'Contact', value: product.supplier?.contact_person || '-' },
      { label: 'Phone', value: product.supplier?.phone || '-' },
    ];
    
    supplierFields.forEach(field => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(82, 82, 91);
      doc.text(field.label + ':', margin + halfWidth + 15, fieldY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(39, 39, 42);
      doc.text(field.value.substring(0, 25), margin + halfWidth + 40, fieldY);
      fieldY += 9;
    });

    y += 60;

    // === DESCRIPTION ===
    if (product.description) {
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(39, 39, 42);
      doc.text('Description', margin, y);
      y += 8;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(82, 82, 91);
      const descLines = doc.splitTextToSize(product.description, pageWidth - margin * 2);
      doc.text(descLines, margin, y);
      y += descLines.length * 5 + 10;
    }

    // === VERIFICATION SECTION ===
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    const signBoxWidth = (pageWidth - margin * 2 - 20) / 2;
    
    // Verified by (left)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(82, 82, 91);
    doc.text('Verified by:', margin, y);
    doc.line(margin, y + 15, margin + signBoxWidth, y + 15);
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text('Name & Signature', margin, y + 20);
    
    // Date (right)
    const rightX = margin + signBoxWidth + 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(82, 82, 91);
    doc.text('Date:', rightX, y);
    doc.line(rightX, y + 15, rightX + signBoxWidth, y + 15);

    // === FOOTER ===
    const footerY = pageHeight - 12;
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);
    
    doc.setFontSize(7);
    doc.setTextColor(161, 161, 170);
    doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, margin, footerY);
    doc.text('BEV Flow - Inventory Management System', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Page 1 of 1', pageWidth - margin, footerY, { align: 'right' });

    doc.save(`product_${product.sku || product.product_id}.pdf`);
  };

  // Export single supplier as detail PDF with logo
  const exportSupplierDetail = async (supplier: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = margin;

    // === HEADER SECTION ===
    const logoBase64 = await loadLogoAsBase64();
    
    // Title (LEFT side)
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(217, 119, 6);
    doc.text('Supplier Profile', margin, y + 8);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text('BEV Flow - Karaoke Inventory System', margin, y + 14);

    // Logo (CENTER)
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', (pageWidth - 25) / 2, y, 25, 25);
      } catch {
        // Continue without logo
      }
    }

    // Company Information (RIGHT side)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('H2O - KTV, Restaurant, Steam Sauna', pageWidth - margin, y + 4, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(82, 82, 91);
    doc.text('Takdol Village, Takhmao Town, Kandal Province', pageWidth - margin, y + 10, { align: 'right' });
    doc.text('Phone: 012 955 499 | Email: h2oktv99@gmail.com', pageWidth - margin, y + 15, { align: 'right' });
    
    y += 30;
    
    // Header divider
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.8);
    doc.line(margin, y, pageWidth - margin, y);
    
    y += 10;
    doc.setTextColor(39, 39, 42);

    // Company name with status
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(supplier.company_name, margin, y);
    
    // Status badge
    if (supplier.is_active) {
      doc.setFillColor(187, 247, 208);
      doc.roundedRect(pageWidth - margin - 30, y - 6, 30, 10, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(22, 101, 52);
      doc.text('Active', pageWidth - margin - 15, y + 1, { align: 'center' });
    } else {
      doc.setFillColor(254, 202, 202);
      doc.roundedRect(pageWidth - margin - 30, y - 6, 30, 10, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(153, 27, 27);
      doc.text('Inactive', pageWidth - margin - 15, y + 1, { align: 'center' });
    }
    
    y += 12;

    // Contact cards
    doc.setFillColor(255, 251, 235);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 30, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('Contact Information', margin + 5, y + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(82, 82, 91);
    doc.text(`Contact: ${supplier.contact_person || 'N/A'}`, margin + 5, y + 16);
    doc.text(`Phone: ${supplier.phone || 'N/A'}`, margin + 5, y + 24);
    doc.text(`Email: ${supplier.email || 'N/A'}`, 100, y + 16);
    doc.text(`Lead Time: ${supplier.lead_time_days ? `${supplier.lead_time_days} days` : 'N/A'}`, 100, y + 24);

    y += 40;

    // Details table
    doc.setTextColor(39, 39, 42);
    const details = [
      ['Sales Agent', supplier.sale_agent || 'N/A'],
      ['Address', supplier.address || 'N/A'],
      ['Products Supplied', supplier.products || 'N/A'],
    ];

    autoTable(doc, {
      body: details,
      startY: y,
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 6 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50, textColor: [113, 113, 122] },
        1: { cellWidth: 120, textColor: [39, 39, 42] },
      },
    });

    // === VERIFICATION SECTION ===
    y = (doc as any).lastAutoTable.finalY + 15;
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    const signBoxWidth = (pageWidth - margin * 2 - 20) / 2;
    
    // Verified by (left)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text('Verified by:', margin, y);
    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y + 15, margin + signBoxWidth, y + 15);
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text('Name & Signature', margin, y + 20);
    doc.text(`Date: _______________`, margin + 50, y + 20);
    
    // Approved by (right)
    const rightX = margin + signBoxWidth + 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text('Approved by:', rightX, y);
    doc.line(rightX, y + 15, rightX + signBoxWidth, y + 15);
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text('Name & Signature', rightX, y + 20);
    doc.text(`Date: _______________`, rightX + 50, y + 20);

    // Footer
    const footerY = pageHeight - 12;
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);
    
    doc.setFontSize(7);
    doc.setTextColor(161, 161, 170);
    doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, margin, footerY);
    doc.text('BEV Flow - Inventory Management System', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Page 1 of 1', pageWidth - margin, footerY, { align: 'right' });

    doc.save(`supplier_${supplier.company_name.replace(/\s+/g, '_')}.pdf`);
  };

  // Export single purchase order as detail PDF with logo - Professional Form Layout
  const exportPurchaseOrderDetail = async (po: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = margin;

    // === HEADER SECTION ===
    // Company Logo and Title
    const logoBase64 = await loadLogoAsBase64();
    
    // Title (LEFT side)
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('Purchasing Order Form', margin, y + 8);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text('BEV Flow - Karaoke Inventory System', margin, y + 14);

    // Logo (CENTER)
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', (pageWidth - 25) / 2, y, 25, 25);
      } catch {
        // Continue without logo
      }
    }

    // Company Information (RIGHT side)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('H2O - KTV, Restaurant, Steam Sauna', pageWidth - margin, y + 4, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(82, 82, 91);
    doc.text('Takdol Village, Takhmao Town, Kandal Province', pageWidth - margin, y + 10, { align: 'right' });
    doc.text('Phone: 012 955 499 | Email: h2oktv99@gmail.com', pageWidth - margin, y + 15, { align: 'right' });

    y += 30;

    // Date and PO Number row
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    const orderDate = po.order_date ? new Date(po.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('DATE:', margin, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(orderDate, margin + 20, y + 5);
    
    doc.setFont('helvetica', 'bold');
    doc.text('PO No.:', pageWidth - margin - 50, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(245, 158, 11);
    doc.text(po.po_number || 'N/A', pageWidth - margin - 25, y + 5);
    
    y += 12;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // === SUPPLIER INFORMATION SECTION ===
    const halfWidth = (pageWidth - margin * 2 - 10) / 2;

    // Supplier Info Box
    doc.setFillColor(240, 253, 244); // light green bg
    doc.setDrawColor(34, 197, 94);
    doc.rect(margin, y, halfWidth, 55, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text('Supplier Information', margin + 3, y + 7);
    
    const supplierFields = [
      { label: 'Company Name', value: po.supplier?.company_name || '-' },
      { label: 'Address', value: po.supplier?.address || '-' },
      { label: 'Phone', value: po.supplier?.phone || '-' },
      { label: 'Email', value: po.supplier?.email || '-' },
      { label: 'Contact Person', value: po.supplier?.contact_person || '-' },
    ];

    let fieldY = y + 14;
    doc.setFontSize(8);
    supplierFields.forEach(field => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(82, 82, 91);
      doc.text(field.label + ':', margin + 3, fieldY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(39, 39, 42);
      const valueText = doc.splitTextToSize(field.value, halfWidth - 35);
      doc.text(valueText[0] || '-', margin + 35, fieldY);
      fieldY += 8;
    });

    // Third Party Agent Box
    doc.setFillColor(254, 243, 199); // light amber bg
    doc.setDrawColor(245, 158, 11);
    doc.rect(margin + halfWidth + 10, y, halfWidth, 55, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text('Third Party Agent', margin + halfWidth + 13, y + 7);
    
    const agentFields = [
      { label: 'Co-Loader Name', value: po.third_party_agent || '-' },
      { label: 'Address', value: po.agent_address || '-' },
      { label: 'Phone', value: po.agent_phone || '-' },
      { label: 'Email', value: po.agent_email || '-' },
      { label: 'Agent Name', value: po.third_party_agent || '-' },
    ];

    fieldY = y + 14;
    doc.setFontSize(8);
    agentFields.forEach(field => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(82, 82, 91);
      doc.text(field.label + ':', margin + halfWidth + 13, fieldY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(39, 39, 42);
      const valueText = doc.splitTextToSize(field.value, halfWidth - 40);
      doc.text(valueText[0] || '-', margin + halfWidth + 48, fieldY);
      fieldY += 8;
    });

    y += 62;

    // === TRANSPORT / ETA / REMARK ROW ===
    doc.setFillColor(243, 244, 246);
    doc.rect(margin, y, pageWidth - margin * 2, 12, 'F');
    
    const etaDate = po.eta_date ? new Date(po.eta_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    const thirdWidth = (pageWidth - margin * 2) / 3;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(82, 82, 91);
    doc.text('Requested Arrival:', margin + 3, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(39, 39, 42);
    doc.text(etaDate, margin + 35, y + 7);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(82, 82, 91);
    doc.text('Transport Method:', margin + thirdWidth + 3, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(39, 39, 42);
    doc.text(po.truck_remark || 'Standard', margin + thirdWidth + 40, y + 7);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(82, 82, 91);
    doc.text('Remark:', margin + thirdWidth * 2 + 3, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(39, 39, 42);
    doc.text((po.overall_remark || '-').substring(0, 25), margin + thirdWidth * 2 + 20, y + 7);

    y += 18;

    // === ITEMS TABLE ===
    if (po.items && po.items.length > 0) {
      const itemsData = po.items.map((item: any, index: number) => [
        String(index + 1),
        item.product?.product_name || 'N/A',
        item.product?.description || '-',
        String(item.quantity),
        `$${Number(item.unit_cost).toFixed(2)}`,
        `$${Number(item.amount).toFixed(2)}`,
      ]);

      autoTable(doc, {
        head: [['No.', 'Product Name', 'Description', 'Qty', 'Unit Price', 'Amount']],
        body: itemsData,
        startY: y,
        margin: { left: margin, right: margin },
        headStyles: { 
          fillColor: [39, 39, 42],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center',
        },
        styles: { 
          fontSize: 8, 
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 45 },
          2: { cellWidth: 50, halign: 'center' },
          3: { cellWidth: 18, halign: 'center' },
          4: { cellWidth: 25, halign: 'right' },
          5: { cellWidth: 25, halign: 'right' },
        },
        alternateRowStyles: { fillColor: [250, 250, 250] },
      });
      
      y = (doc as any).lastAutoTable.finalY + 5;
    }

    // === TOTALS SECTION ===
    const totalsX = pageWidth - margin - 70;
    
    doc.setFillColor(250, 250, 250);
    doc.rect(totalsX, y, 70, 45, 'F');
    
    let totalsY = y + 8;
    
    // Subtotal
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(82, 82, 91);
    doc.text('SUBTOTAL', totalsX + 5, totalsY);
    doc.setTextColor(39, 39, 42);
    doc.text(`$${Number(po.subtotal || 0).toFixed(2)}`, totalsX + 65, totalsY, { align: 'right' });
    totalsY += 8;
    
    // Shipping Cost
    doc.setTextColor(82, 82, 91);
    doc.text('SHIPPING Cost 3%', totalsX + 5, totalsY);
    doc.setTextColor(39, 39, 42);
    doc.text(`$${Number(po.shipping_cost || 0).toFixed(2)}`, totalsX + 65, totalsY, { align: 'right' });
    totalsY += 8;
    
    // Promotion Amount
    doc.setTextColor(82, 82, 91);
    doc.text('Promotion Amount', totalsX + 5, totalsY);
    doc.setTextColor(34, 197, 94);
    doc.text(`-$${Number(po.promotion_amount || 0).toFixed(2)}`, totalsX + 65, totalsY, { align: 'right' });
    totalsY += 3;
    
    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(totalsX + 5, totalsY, totalsX + 65, totalsY);
    totalsY += 8;
    
    // Total
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('TOTAL', totalsX + 5, totalsY);
    doc.setTextColor(245, 158, 11);
    doc.text(`$${Number(po.total_amount || 0).toFixed(2)}`, totalsX + 65, totalsY, { align: 'right' });

    // Remark section (left side, same row as totals)
    if (po.overall_remark) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(82, 82, 91);
      doc.text('Remark:', margin, y + 8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(39, 39, 42);
      const remarkLines = doc.splitTextToSize(po.overall_remark, totalsX - margin - 10);
      doc.text(remarkLines, margin, y + 16);
    }

    y += 55;

    // === PAYMENT INFORMATION SECTION ===
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(59, 130, 246);
    doc.rect(margin, y, (pageWidth - margin * 2) / 2 - 5, 25, 'FD');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('Payment Information', margin + 5, y + 8);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(39, 39, 42);
    doc.text(`Method: ${po.payment_method || 'Collect'}`, margin + 5, y + 15);
    doc.text(`Status: ${po.payment_status || 'Unpaid'}`, margin + 5, y + 21);

    y += 32;

    // === AUTHORIZATION SECTION ===
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // If we have authorization data, show it
    if (po.authorized_by || po.authorized_signature) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(82, 82, 91);
      doc.text('Authorized by:', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(39, 39, 42);
      doc.text(po.authorized_by || 'N/A', margin + 30, y);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(82, 82, 91);
      doc.text('Date:', pageWidth - margin - 55, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(39, 39, 42);
      const authDate = po.authorization_date ? new Date(po.authorization_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
      doc.text(authDate, pageWidth - margin - 40, y);
      
      // If we have a signature image, add it
      if (po.authorized_signature && po.authorized_signature.startsWith('data:image')) {
        y += 8;
        doc.setFontSize(8);
        doc.setTextColor(82, 82, 91);
        doc.text('Signature:', margin, y);
        try {
          doc.addImage(po.authorized_signature, 'PNG', margin + 20, y - 3, 40, 20);
        } catch {
          // If signature fails, continue
        }
      }
    } else {
      // Show blank lines for manual signature
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(82, 82, 91);
      doc.text('Authorized by:', margin, y);
      doc.line(margin + 25, y + 1, margin + 80, y + 1);
      
      doc.text('Date:', pageWidth - margin - 55, y);
      doc.line(pageWidth - margin - 42, y + 1, pageWidth - margin, y + 1);
    }

    // === FOOTER ===
    const footerY = pageHeight - 12;
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);
    
    doc.setFontSize(7);
    doc.setTextColor(161, 161, 170);
    doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, margin, footerY);
    doc.text('BEV Flow - Inventory Management System', pageWidth / 2, footerY, { align: 'center' });
    doc.text(`Page 1 of 1`, pageWidth - margin, footerY, { align: 'right' });

    doc.save(`PO_${po.po_number}.pdf`);
  };

  // Export single forecast as detail PDF with logo
  const exportForecastDetail = async (forecast: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = margin;

    // === HEADER SECTION ===
    const logoBase64 = await loadLogoAsBase64();
    
    // Title (LEFT side)
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('AI Sales Forecast Report', margin, y + 8);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text('BEV Flow - Karaoke Inventory System', margin, y + 14);

    // Logo (CENTER)
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', (pageWidth - 25) / 2, y, 25, 25);
      } catch {
        // Continue without logo
      }
    }

    // Company Information (RIGHT side)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('H2O - KTV, Restaurant, Steam Sauna', pageWidth - margin, y + 4, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(82, 82, 91);
    doc.text('Takdol Village, Takhmao Town, Kandal Province', pageWidth - margin, y + 10, { align: 'right' });
    doc.text('Phone: 012 955 499 | Email: h2oktv99@gmail.com', pageWidth - margin, y + 15, { align: 'right' });

    y += 30;

    // Divider
    doc.setDrawColor(139, 92, 246);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Report date and period
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('Report Date:', margin, y + 5);
    doc.setFont('helvetica', 'normal');
    const reportDate = forecast.forecast_date ? new Date(forecast.forecast_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date().toLocaleDateString('en-US');
    doc.text(reportDate, margin + 30, y + 5);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Forecast Period:', pageWidth - margin - 55, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(forecast.forecast_period || 'Weekly', pageWidth - margin - 15, y + 5);
    
    y += 15;

    // === PRODUCT INFORMATION ===
    doc.setFillColor(243, 232, 255);
    doc.setDrawColor(139, 92, 246);
    doc.rect(margin, y, pageWidth - margin * 2, 25, 'FD');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(126, 34, 206);
    doc.text('Product: ' + (forecast.product?.product_name || 'Unknown Product'), margin + 5, y + 10);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(82, 82, 91);
    doc.text(`SKU: ${forecast.product?.sku || 'N/A'}  |  Category: ${forecast.product?.category || 'Uncategorized'}`, margin + 5, y + 18);

    y += 35;

    // === FORECAST METRICS ===
    const thirdWidth = (pageWidth - margin * 2 - 20) / 3;
    const currentStock = forecast.product?.current_stock || 0;
    const predicted = forecast.predicted_quantity || 0;
    const confidence = forecast.confidence_score || 0;
    
    // Predicted Demand Box
    doc.setFillColor(139, 92, 246);
    doc.rect(margin, y, thirdWidth, 45, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Predicted Demand', margin + 5, y + 12);
    doc.setFontSize(24);
    doc.text(String(predicted), margin + 5, y + 32);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('units', margin + 5, y + 40);

    // Confidence Score Box
    const confColor: [number, number, number] = confidence >= 80 ? [34, 197, 94] : confidence >= 50 ? [245, 158, 11] : [239, 68, 68];
    doc.setFillColor(confColor[0], confColor[1], confColor[2]);
    doc.rect(margin + thirdWidth + 10, y, thirdWidth, 45, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('AI Confidence', margin + thirdWidth + 15, y + 12);
    doc.setFontSize(24);
    doc.text(`${confidence}%`, margin + thirdWidth + 15, y + 32);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(confidence >= 80 ? 'High' : confidence >= 50 ? 'Medium' : 'Low', margin + thirdWidth + 15, y + 40);

    // Current Stock Box
    doc.setFillColor(63, 63, 70);
    doc.rect(margin + (thirdWidth + 10) * 2, y, thirdWidth, 45, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Current Stock', margin + (thirdWidth + 10) * 2 + 5, y + 12);
    doc.setFontSize(24);
    doc.text(String(currentStock), margin + (thirdWidth + 10) * 2 + 5, y + 32);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('units', margin + (thirdWidth + 10) * 2 + 5, y + 40);

    y += 55;

    // === STOCK ANALYSIS ===
    const halfWidth = (pageWidth - margin * 2 - 10) / 2;

    // Analysis Box
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y, halfWidth, 50, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('Stock Analysis', margin + 5, y + 10);
    
    let fieldY = y + 20;
    doc.setFontSize(8);
    const minLevel = forecast.product?.min_stock_level || 0;
    const stockDiff = currentStock - predicted;
    const analysisFields = [
      { label: 'Min Stock Level', value: String(minLevel) },
      { label: 'Stock Difference', value: `${stockDiff >= 0 ? '+' : ''}${stockDiff}` },
      { label: 'Restock Needed', value: predicted > currentStock ? 'Yes' : 'No' },
    ];
    
    analysisFields.forEach(field => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(82, 82, 91);
      doc.text(field.label + ':', margin + 5, fieldY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(39, 39, 42);
      doc.text(field.value, margin + 40, fieldY);
      fieldY += 9;
    });

    // Recommendation Box
    const needsReorder = predicted > currentStock;
    if (needsReorder) {
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(245, 158, 11);
    } else {
      doc.setFillColor(220, 252, 231);
      doc.setDrawColor(34, 197, 94);
    }
    doc.rect(margin + halfWidth + 10, y, halfWidth, 50, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    if (needsReorder) {
      doc.setTextColor(180, 83, 9);
      doc.text('⚠️ Action Required', margin + halfWidth + 15, y + 10);
    } else {
      doc.setTextColor(22, 101, 52);
      doc.text('✓ Stock Sufficient', margin + halfWidth + 15, y + 10);
    }
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(82, 82, 91);
    
    let recText = '';
    if (needsReorder) {
      const reorderQty = predicted - currentStock + minLevel;
      recText = `Recommended order quantity: ${reorderQty} units to meet demand and maintain safety stock.`;
    } else {
      recText = `Current stock of ${currentStock} units is sufficient to meet the predicted demand.`;
    }
    const recLines = doc.splitTextToSize(recText, halfWidth - 15);
    doc.text(recLines, margin + halfWidth + 15, y + 22);

    y += 60;

    // === AI INSIGHTS ===
    doc.setDrawColor(139, 92, 246);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('🤖 AI-Powered Insights', margin, y);
    y += 10;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(82, 82, 91);
    const insights = `This forecast is generated using machine learning algorithms that analyze historical sales data, seasonal patterns, and market trends. The confidence score of ${confidence}% indicates the model's certainty in this prediction. ${needsReorder ? 'Immediate action is recommended to prevent stockouts.' : 'No immediate action is required.'}`;
    const insightLines = doc.splitTextToSize(insights, pageWidth - margin * 2);
    doc.text(insightLines, margin, y);

    // === REVIEW SECTION ===
    y += insightLines.length * 4 + 10;
    doc.setDrawColor(139, 92, 246);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    const signBoxWidth = (pageWidth - margin * 2 - 20) / 2;
    
    // Reviewed by (left)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('Reviewed by:', margin, y);
    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y + 15, margin + signBoxWidth, y + 15);
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text('Name & Signature', margin, y + 20);
    doc.text(`Date: _______________`, margin + 50, y + 20);
    
    // Approved by (right)
    const rightX = margin + signBoxWidth + 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('Approved by:', rightX, y);
    doc.line(rightX, y + 15, rightX + signBoxWidth, y + 15);
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text('Name & Signature', rightX, y + 20);
    doc.text(`Date: _______________`, rightX + 50, y + 20);

    // === FOOTER ===
    const footerY = pageHeight - 12;
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);
    
    doc.setFontSize(7);
    doc.setTextColor(161, 161, 170);
    doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, margin, footerY);
    doc.text('BEV Flow - AI-Powered Inventory Management', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Page 1 of 1', pageWidth - margin, footerY, { align: 'right' });

    doc.save(`forecast_${forecast.product?.product_name?.replace(/\s+/g, '_') || forecast.forecast_id}.pdf`);
  };

  // Excel export for product detail with professional formatting
  const exportProductDetailExcel = (product: any) => {
    const generatedDate = new Date().toLocaleString('en-US');
    const isLowStock = (product.current_stock || 0) <= (product.min_stock_level || 0);
    
    const data = [
      ['BEV FLOW'],
      ['Karaoke Inventory Management System'],
      [''],
      ['═══════════════════════════════════════════'],
      ['PRODUCT DETAILS'],
      ['═══════════════════════════════════════════'],
      [''],
      ['Basic Information'],
      ['Product Name', product.product_name],
      ['SKU', product.sku || 'N/A'],
      ['Category', product.category || 'Uncategorized'],
      [''],
      ['Pricing'],
      ['Cost Price', `$${Number(product.cost_price || 0).toFixed(2)}`],
      ['Selling Price', `$${Number(product.selling_price || 0).toFixed(2)}`],
      ['Profit Margin', `$${(Number(product.selling_price || 0) - Number(product.cost_price || 0)).toFixed(2)}`],
      ['Margin %', `${(((Number(product.selling_price || 0) - Number(product.cost_price || 0)) / Number(product.selling_price || 1)) * 100).toFixed(1)}%`],
      [''],
      ['Inventory Status'],
      ['Current Stock', product.current_stock || 0],
      ['Min Stock Level', product.min_stock_level || 0],
      ['Status', isLowStock ? '⚠️ LOW STOCK - Reorder Required' : '✓ In Stock'],
      [''],
      ['Supplier'],
      ['Company', product.supplier?.company_name || 'N/A'],
      [''],
      ['Description'],
      [product.description || 'No description available'],
      [''],
      ['─────────────────────────────────────────────'],
      ['Generated', generatedDate],
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 25 }, { wch: 35 }];
    
    // Merge cells for headers
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Product');
    XLSX.writeFile(wb, `product_${product.sku || product.product_id}.xlsx`);
  };

  // Excel export for supplier detail with professional formatting
  const exportSupplierDetailExcel = (supplier: any) => {
    const generatedDate = new Date().toLocaleString('en-US');
    
    const data = [
      ['BEV FLOW'],
      ['Karaoke Inventory Management System'],
      [''],
      ['═══════════════════════════════════════════'],
      ['SUPPLIER PROFILE'],
      ['═══════════════════════════════════════════'],
      [''],
      ['Company Information'],
      ['Company Name', supplier.company_name],
      ['Status', supplier.is_active ? '✓ Active' : '✗ Inactive'],
      [''],
      ['Contact Details'],
      ['Contact Person', supplier.contact_person || 'N/A'],
      ['Sales Agent', supplier.sale_agent || 'N/A'],
      ['Phone', supplier.phone || 'N/A'],
      ['Email', supplier.email || 'N/A'],
      [''],
      ['Business Details'],
      ['Address', supplier.address || 'N/A'],
      ['Lead Time', supplier.lead_time_days ? `${supplier.lead_time_days} days` : 'N/A'],
      ['Products Supplied', supplier.products || 'N/A'],
      [''],
      ['─────────────────────────────────────────────'],
      ['Generated', generatedDate],
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 20 }, { wch: 45 }];
    
    // Merge cells for headers
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Supplier');
    XLSX.writeFile(wb, `supplier_${supplier.company_name.replace(/\s+/g, '_')}.xlsx`);
  };

  // Excel export for purchase order detail with professional formatting
  const exportPurchaseOrderDetailExcel = (po: any) => {
    const orderDate = po.order_date ? new Date(po.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    const etaDate = po.eta_date ? new Date(po.eta_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    const generatedDate = new Date().toLocaleString('en-US');
    
    const headerData = [
      ['BEV FLOW'],
      ['Karaoke Inventory Management System'],
      [''],
      ['═══════════════════════════════════════════════════════'],
      ['PURCHASE ORDER'],
      ['═══════════════════════════════════════════════════════'],
      [''],
      ['Order Information'],
      ['PO Number', po.po_number],
      ['Status', po.status],
      ['Supplier', po.supplier?.company_name || 'N/A'],
      ['Order Date', orderDate],
      ['ETA Date', etaDate],
      [''],
    ];
    
    // Add third party info if available
    if (po.third_party_agent) {
      headerData.push(['Third Party Agent', po.third_party_agent]);
      if (po.agent_phone) headerData.push(['Agent Phone', po.agent_phone]);
    }
    if (po.truck_remark) {
      headerData.push(['Truck Remark', po.truck_remark]);
    }
    
    headerData.push(['']);
    headerData.push(['Order Items']);
    headerData.push(['Product', 'Quantity', 'Unit Cost', 'Amount']);
    
    const items = po.items || [];
    const itemRows = items.map((item: any) => [
      item.product?.product_name || 'N/A',
      item.quantity,
      `$${Number(item.unit_cost).toFixed(2)}`,
      `$${Number(item.amount).toFixed(2)}`,
    ]);
    
    const totalRows = [
      [''],
      ['', '', '─────────────', '─────────────'],
      ['', '', 'Subtotal', `$${Number(po.subtotal || 0).toFixed(2)}`],
      ['', '', 'Shipping', `$${Number(po.shipping_cost || 0).toFixed(2)}`],
      ['', '', 'Promotion', `-$${Number(po.promotion_amount || 0).toFixed(2)}`],
      ['', '', 'TOTAL', `$${Number(po.total_amount || 0).toFixed(2)}`],
      [''],
    ];
    
    if (po.overall_remark) {
      totalRows.push(['Remarks', po.overall_remark, '', '']);
    }
    
    totalRows.push(['']);
    totalRows.push(['─────────────────────────────────────────────────────────']);
    totalRows.push(['Generated', generatedDate, '', '']);
    
    const allData = [...headerData, ...itemRows, ...totalRows];
    
    const ws = XLSX.utils.aoa_to_sheet(allData);
    ws['!cols'] = [{ wch: 35 }, { wch: 12 }, { wch: 15 }, { wch: 15 }];
    
    // Merge cells for headers
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 3 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 3 } },
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Purchase Order');
    XLSX.writeFile(wb, `PO_${po.po_number}.xlsx`);
  };

  // Excel export for forecast detail with professional formatting
  const exportForecastDetailExcel = (forecast: any) => {
    const generatedDate = new Date().toLocaleString('en-US');
    const currentStock = forecast.product?.current_stock || 0;
    const predicted = forecast.predicted_quantity || 0;
    const minLevel = forecast.product?.min_stock_level || 0;
    const needsReorder = predicted > currentStock;
    
    const data = [
      ['BEV FLOW'],
      ['Karaoke Inventory Management System'],
      [''],
      ['═══════════════════════════════════════════'],
      ['SALES FORECAST'],
      ['AI-Powered Prediction'],
      ['═══════════════════════════════════════════'],
      [''],
      ['Product Information'],
      ['Product', forecast.product?.product_name || 'Unknown'],
      ['Forecast Period', forecast.forecast_period || 'N/A'],
      ['Forecast Date', forecast.forecast_date ? new Date(forecast.forecast_date).toLocaleDateString('en-US') : 'N/A'],
      [''],
      ['Prediction Results'],
      ['Predicted Demand', predicted],
      ['Confidence Score', `${forecast.confidence_score || 0}%`],
      [''],
      ['Current Inventory Status'],
      ['Current Stock', currentStock],
      ['Min Stock Level', minLevel],
      ['Restock Needed', needsReorder ? '⚠️ YES' : '✓ NO'],
      [''],
      ['─────────────────────────────────────────────'],
      ['AI Recommendation'],
      [needsReorder 
        ? `Order approximately ${predicted - currentStock + minLevel} units to meet predicted demand and maintain safety stock.`
        : 'Current stock levels are sufficient to meet predicted demand.'
      ],
      [''],
      ['─────────────────────────────────────────────'],
      ['Generated', generatedDate],
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 25 }, { wch: 50 }];
    
    // Merge cells for headers
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Forecast');
    XLSX.writeFile(wb, `forecast_${forecast.product?.product_name?.replace(/\s+/g, '_') || forecast.forecast_id}.xlsx`);
  };

  return {
    exportSaleReceipt,
    exportSaleReceiptExcel,
    exportProductDetail,
    exportProductDetailExcel,
    exportSupplierDetail,
    exportSupplierDetailExcel,
    exportPurchaseOrderDetail,
    exportPurchaseOrderDetailExcel,
    exportForecastDetail,
    exportForecastDetailExcel,
  };
};
