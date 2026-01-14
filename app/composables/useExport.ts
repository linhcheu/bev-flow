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

    // Load and add logo
    const logoBase64 = await loadLogoAsBase64();
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 14, startY, 20, 20);
        startY += 2;
      } catch {
        // If logo fails, continue without it
      }
    }

    // Header - Company Name
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42); // zinc-800
    doc.text('BEV FLOW', logoBase64 ? 38 : 14, startY + 8);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122); // zinc-500
    doc.text('Karaoke Inventory Management System', logoBase64 ? 38 : 14, startY + 14);

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
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 14, y, 22, 22);
      } catch {
        // Continue without logo
      }
    }

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('Dashboard Report', logoBase64 ? 40 : 14, y + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text('BEV Flow - Karaoke Inventory Management', logoBase64 ? 40 : 14, y + 16);

    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    doc.text(`Generated: ${date}`, logoBase64 ? 40 : 14, y + 22);

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
  // Export single sale as receipt PDF with multi-item support
  const exportSaleReceipt = async (sale: any) => {
    const items = sale.items || [{ 
      product: sale.product, 
      quantity: sale.quantity, 
      unit_price: sale.unit_price,
      amount: sale.total_amount 
    }];
    
    // Calculate height based on number of items
    const baseHeight = 175;
    const itemHeight = 14;
    const pageHeight = Math.max(baseHeight + (items.length * itemHeight), 200);
    
    const doc = new jsPDF('portrait', 'mm', [80, pageHeight]); // Receipt size
    const pageWidth = 80;
    let y = 8;

    // Light header with amber accent bar
    doc.setFillColor(255, 255, 255); // white background
    doc.rect(0, 0, pageWidth, 28, 'F');
    
    // Amber accent bar at top
    doc.setFillColor(245, 158, 11); // amber-500
    doc.rect(0, 0, pageWidth, 3, 'F');
    
    // Try to add logo
    const logoBase64 = await loadLogoAsBase64();
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 5, 6, 14, 14);
        doc.setTextColor(39, 39, 42); // zinc-800
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('BEV FLOW', 22, 12);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(113, 113, 122); // zinc-500
        doc.text('Karaoke Inventory System', 22, 17);
      } catch {
        doc.setTextColor(39, 39, 42);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('BEV FLOW', pageWidth / 2, 12, { align: 'center' });
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(113, 113, 122);
        doc.text('Karaoke Inventory System', pageWidth / 2, 17, { align: 'center' });
      }
    } else {
      doc.setTextColor(39, 39, 42);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('BEV FLOW', pageWidth / 2, 12, { align: 'center' });
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(113, 113, 122);
      doc.text('Karaoke Inventory System', pageWidth / 2, 17, { align: 'center' });
    }
    
    // Bottom border line
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(4, 24, pageWidth - 4, 24);
    
    // Invoice badge
    doc.setFillColor(245, 158, 11); // amber-500
    doc.roundedRect(pageWidth / 2 - 18, 26, 36, 8, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('SALES INVOICE', pageWidth / 2, 31, { align: 'center' });
    
    y = 34;
    doc.setTextColor(63, 63, 70); // zinc-700

    // Invoice details box
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(4, y - 2, pageWidth - 8, 18, 2, 2, 'F');
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text('Sale No:', 8, y + 3);
    doc.text('Date:', 8, y + 8);
    doc.text('Customer:', 8, y + 13);
    
    doc.setTextColor(39, 39, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(sale.sale_number, pageWidth - 8, y + 3, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    const saleDate = new Date(sale.sale_date).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
    doc.text(saleDate, pageWidth - 8, y + 8, { align: 'right' });
    doc.text(sale.customer?.customer_name || 'Walk-in Customer', pageWidth - 8, y + 13, { align: 'right' });
    
    y += 22;

    // Items header with subtle styling
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(4, y, pageWidth - 4, y);
    y += 4;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(113, 113, 122);
    doc.text('ITEM', 6, y);
    doc.text('QTY', 44, y, { align: 'right' });
    doc.text('PRICE', 58, y, { align: 'right' });
    doc.text('AMOUNT', pageWidth - 6, y, { align: 'right' });
    y += 3;
    doc.line(4, y, pageWidth - 4, y);
    y += 5;

    // Items with alternating background
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(39, 39, 42);
    
    items.forEach((item: any, index: number) => {
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(4, y - 3, pageWidth - 8, 6, 'F');
      }
      
      const productName = item.product?.product_name || 'Product';
      const truncatedName = productName.length > 20 ? productName.substring(0, 17) + '...' : productName;
      const amount = item.amount || (item.quantity * item.unit_price);
      
      doc.text(truncatedName, 6, y);
      doc.text(String(item.quantity), 44, y, { align: 'right' });
      doc.text(`$${Number(item.unit_price).toFixed(2)}`, 58, y, { align: 'right' });
      doc.text(`$${Number(amount).toFixed(2)}`, pageWidth - 6, y, { align: 'right' });
      y += 6;
    });

    y += 2;
    doc.setDrawColor(228, 228, 231);
    doc.line(4, y, pageWidth - 4, y);
    y += 5;

    // Subtotal if multiple items
    if (items.length > 1) {
      doc.setFontSize(8);
      doc.setTextColor(113, 113, 122);
      doc.text('Subtotal:', 45, y, { align: 'right' });
      doc.setTextColor(39, 39, 42);
      doc.text(`$${Number(sale.subtotal || sale.total_amount).toFixed(2)}`, pageWidth - 6, y, { align: 'right' });
      y += 6;
    }

    // Total with highlight
    doc.setFillColor(245, 158, 11); // amber-500
    doc.roundedRect(35, y - 3, pageWidth - 39, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL', 42, y + 3);
    doc.text(`$${Number(sale.total_amount).toFixed(2)}`, pageWidth - 8, y + 3, { align: 'right' });
    y += 14;

    // Notes
    if (sale.notes) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(113, 113, 122);
      doc.text('Notes:', 6, y);
      y += 3;
      doc.setTextColor(63, 63, 70);
      const splitNotes = doc.splitTextToSize(sale.notes, pageWidth - 12);
      doc.text(splitNotes, 6, y);
      y += splitNotes.length * 3 + 4;
    }

    // Footer
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(4, y, pageWidth - 4, y);
    y += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(113, 113, 122);
    doc.text('Thank you for your business!', pageWidth / 2, y, { align: 'center' });
    y += 4;
    doc.setFontSize(6);
    doc.setTextColor(161, 161, 170);
    const printDate = new Date().toLocaleString('en-US');
    doc.text(`Printed: ${printDate}`, pageWidth / 2, y, { align: 'center' });

    doc.save(`sale_${sale.sale_number}.pdf`);
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
    let y = 10;

    // Modern header with logo
    doc.setFillColor(245, 158, 11); // amber-500
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Accent line - darker amber
    doc.setFillColor(217, 119, 6); // amber-600
    doc.rect(0, 45, pageWidth, 3, 'F');

    // Try to add logo
    const logoBase64 = await loadLogoAsBase64();
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 14, 8, 25, 25);
      } catch {
        // Continue without logo
      }
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Product Details', logoBase64 ? 45 : 20, 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(161, 161, 170);
    doc.text('BEV Flow - Karaoke Inventory System', logoBase64 ? 45 : 20, 30);
    
    y = 60;
    doc.setTextColor(39, 39, 42);

    // Product name with badge
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(product.product_name, 20, y);
    
    // Status badge
    const isLowStock = (product.current_stock || 0) <= (product.min_stock_level || 0);
    if (isLowStock) {
      doc.setFillColor(254, 202, 202); // red-200
      doc.roundedRect(pageWidth - 50, y - 8, 35, 10, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(153, 27, 27); // red-800
      doc.text('Low Stock', pageWidth - 33, y - 1, { align: 'center' });
    } else {
      doc.setFillColor(187, 247, 208); // green-200
      doc.roundedRect(pageWidth - 45, y - 8, 30, 10, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(22, 101, 52); // green-800
      doc.text('In Stock', pageWidth - 30, y - 1, { align: 'center' });
    }
    
    y += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 113, 122);
    doc.text(`SKU: ${product.sku || 'N/A'}  •  Category: ${product.category || 'Uncategorized'}`, 20, y);
    y += 15;

    // Info cards
    const cardData: { label: string; value: string; color: [number, number, number] }[] = [
      { label: 'Cost Price', value: `$${Number(product.cost_price || 0).toFixed(2)}`, color: [113, 113, 122] },
      { label: 'Selling Price', value: `$${Number(product.selling_price || 0).toFixed(2)}`, color: [39, 39, 42] },
      { label: 'Profit Margin', value: `$${(Number(product.selling_price || 0) - Number(product.cost_price || 0)).toFixed(2)}`, color: [34, 197, 94] },
    ];
    
    const cardWidth = (pageWidth - 52) / 3;
    cardData.forEach((card, index) => {
      const x = 20 + (index * (cardWidth + 6));
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(x, y, cardWidth, 28, 3, 3, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122);
      doc.text(card.label, x + 8, y + 10);
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(card.color[0], card.color[1], card.color[2]);
      doc.text(card.value, x + 8, y + 22);
      doc.setFont('helvetica', 'normal');
    });

    y += 40;

    // Details table
    doc.setTextColor(39, 39, 42);
    const details = [
      ['Supplier', product.supplier?.company_name || 'N/A'],
      ['Current Stock', String(product.current_stock || 0)],
      ['Min Stock Level', String(product.min_stock_level || 0)],
      ['Status', isLowStock ? 'Low Stock - Reorder Required' : 'Stock Level OK'],
    ];

    autoTable(doc, {
      body: details,
      startY: y,
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 6 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 55, textColor: [113, 113, 122] },
        1: { cellWidth: 110, textColor: [39, 39, 42] },
      },
    });

    // Description
    if (product.description) {
      y = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(39, 39, 42);
      doc.text('Description', 20, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(82, 82, 91); // zinc-600
      const splitDesc = doc.splitTextToSize(product.description, 170);
      doc.text(splitDesc, 20, y);
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, 14, footerY);
    doc.text('BEV Flow', pageWidth - 14, footerY, { align: 'right' });

    doc.save(`product_${product.sku || product.product_id}.pdf`);
  };

  // Export single supplier as detail PDF with logo
  const exportSupplierDetail = async (supplier: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 10;

    // Modern header
    doc.setFillColor(245, 158, 11); // amber-500
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setFillColor(217, 119, 6); // amber-600
    doc.rect(0, 45, pageWidth, 3, 'F');

    const logoBase64 = await loadLogoAsBase64();
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 14, 8, 25, 25);
      } catch {
        // Continue without logo
      }
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Supplier Profile', logoBase64 ? 45 : 20, 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(161, 161, 170);
    doc.text('BEV Flow - Karaoke Inventory System', logoBase64 ? 45 : 20, 30);
    
    y = 60;
    doc.setTextColor(39, 39, 42);

    // Company name with status
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(supplier.company_name, 20, y);
    
    // Status badge
    if (supplier.is_active) {
      doc.setFillColor(187, 247, 208);
      doc.roundedRect(pageWidth - 45, y - 8, 30, 10, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(22, 101, 52);
      doc.text('Active', pageWidth - 30, y - 1, { align: 'center' });
    } else {
      doc.setFillColor(254, 202, 202);
      doc.roundedRect(pageWidth - 45, y - 8, 30, 10, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(153, 27, 27);
      doc.text('Inactive', pageWidth - 30, y - 1, { align: 'center' });
    }
    
    y += 15;

    // Contact cards
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, y, pageWidth - 40, 35, 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('Contact Information', 28, y + 10);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(82, 82, 91);
    doc.text(`Contact: ${supplier.contact_person || 'N/A'}`, 28, y + 18);
    doc.text(`Phone: ${supplier.phone || 'N/A'}`, 28, y + 26);
    doc.text(`Email: ${supplier.email || 'N/A'}`, 110, y + 18);
    doc.text(`Lead Time: ${supplier.lead_time_days ? `${supplier.lead_time_days} days` : 'N/A'}`, 110, y + 26);

    y += 50;

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

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, 14, footerY);
    doc.text('BEV Flow', pageWidth - 14, footerY, { align: 'right' });

    doc.save(`supplier_${supplier.company_name.replace(/\s+/g, '_')}.pdf`);
  };

  // Export single purchase order as detail PDF with logo
  const exportPurchaseOrderDetail = async (po: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 10;

    // Modern header
    doc.setFillColor(245, 158, 11); // amber-500
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setFillColor(217, 119, 6); // amber-600
    doc.rect(0, 45, pageWidth, 3, 'F');

    const logoBase64 = await loadLogoAsBase64();
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 14, 8, 25, 25);
      } catch {
        // Continue without logo
      }
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Purchase Order', logoBase64 ? 45 : 20, 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(161, 161, 170);
    doc.text('BEV Flow - Karaoke Inventory System', logoBase64 ? 45 : 20, 30);
    
    y = 58;
    doc.setTextColor(39, 39, 42);

    // PO Number and Status
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`PO #${po.po_number}`, 20, y);
    
    // Status badge with modern colors
    const statusColors: Record<string, { bg: [number, number, number]; text: [number, number, number] }> = {
      'Pending': { bg: [254, 243, 199], text: [180, 83, 9] },
      'Ordered': { bg: [219, 234, 254], text: [30, 64, 175] },
      'Shipped': { bg: [243, 232, 255], text: [126, 34, 206] },
      'Received': { bg: [187, 247, 208], text: [22, 101, 52] },
      'Cancelled': { bg: [254, 202, 202], text: [153, 27, 27] },
    };
    const statusStyle = statusColors[po.status] || { bg: [228, 228, 231], text: [63, 63, 70] };
    
    doc.setFillColor(statusStyle.bg[0], statusStyle.bg[1], statusStyle.bg[2]);
    doc.roundedRect(pageWidth - 55, y - 8, 40, 12, 3, 3, 'F');
    doc.setTextColor(statusStyle.text[0], statusStyle.text[1], statusStyle.text[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(po.status, pageWidth - 35, y - 1, { align: 'center' });
    
    y += 15;

    // Info cards row
    const orderDate = po.order_date ? new Date(po.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    const etaDate = po.eta_date ? new Date(po.eta_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, y, pageWidth - 40, 25, 3, 3, 'F');
    
    const cardWidth = (pageWidth - 50) / 3;
    [
      { label: 'Supplier', value: po.supplier?.company_name || 'N/A' },
      { label: 'Order Date', value: orderDate },
      { label: 'ETA', value: etaDate },
    ].forEach((item, index) => {
      const x = 25 + (index * cardWidth);
      doc.setFontSize(8);
      doc.setTextColor(113, 113, 122);
      doc.text(item.label, x, y + 8);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(39, 39, 42);
      doc.text(item.value.substring(0, 20), x, y + 17);
      doc.setFont('helvetica', 'normal');
    });

    y += 35;

    // Additional details
    if (po.third_party_agent || po.truck_remark) {
      const details = [];
      if (po.third_party_agent) details.push(['Third Party Agent', `${po.third_party_agent}${po.agent_phone ? ' • ' + po.agent_phone : ''}`]);
      if (po.truck_remark) details.push(['Truck Remark', po.truck_remark]);
      
      autoTable(doc, {
        body: details,
        startY: y,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 45, textColor: [113, 113, 122] },
          1: { cellWidth: 120, textColor: [63, 63, 70] },
        },
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    // Items table
    if (po.items && po.items.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(39, 39, 42);
      doc.text('Order Items', 20, y);
      y += 6;

      const itemsData = po.items.map((item: any) => [
        item.product?.product_name || 'N/A',
        String(item.quantity),
        `$${Number(item.unit_cost).toFixed(2)}`,
        `$${Number(item.amount).toFixed(2)}`,
      ]);

      autoTable(doc, {
        head: [['Product', 'Qty', 'Unit Cost', 'Amount']],
        body: itemsData,
        startY: y,
        headStyles: { 
          fillColor: [39, 39, 42],
          textColor: [255, 255, 255],
          fontSize: 9,
        },
        styles: { fontSize: 9, cellPadding: 4 },
        alternateRowStyles: { fillColor: [250, 250, 250] },
      });
    }

    // Totals with modern styling
    y = (doc as any).lastAutoTable.finalY + 8;
    
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(pageWidth - 85, y, 70, 45, 3, 3, 'F');
    
    const totals = [
      { label: 'Subtotal', value: `$${Number(po.subtotal || 0).toFixed(2)}` },
      { label: 'Shipping', value: `$${Number(po.shipping_cost || 0).toFixed(2)}` },
      { label: 'Promotion', value: `-$${Number(po.promotion_amount || 0).toFixed(2)}` },
    ];
    
    let totalY = y + 8;
    totals.forEach(item => {
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122);
      doc.text(item.label, pageWidth - 80, totalY);
      doc.text(item.value, pageWidth - 20, totalY, { align: 'right' });
      totalY += 8;
    });
    
    // Total highlight
    doc.setDrawColor(228, 228, 231);
    doc.line(pageWidth - 80, totalY - 2, pageWidth - 20, totalY - 2);
    totalY += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 39, 42);
    doc.text('TOTAL', pageWidth - 80, totalY);
    doc.setTextColor(245, 158, 11);
    doc.text(`$${Number(po.total_amount || 0).toFixed(2)}`, pageWidth - 20, totalY, { align: 'right' });

    // Remarks
    if (po.overall_remark) {
      y += 55;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(39, 39, 42);
      doc.text('Remarks', 20, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(82, 82, 91);
      const splitRemark = doc.splitTextToSize(po.overall_remark, 170);
      doc.text(splitRemark, 20, y);
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, 14, footerY);
    doc.text('BEV Flow', pageWidth - 14, footerY, { align: 'right' });

    doc.save(`PO_${po.po_number}.pdf`);
  };

  // Export single forecast as detail PDF with logo
  const exportForecastDetail = async (forecast: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 10;

    // Modern header - purple for AI forecast theme
    doc.setFillColor(139, 92, 246); // purple-500
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setFillColor(124, 58, 237); // purple-600 accent
    doc.rect(0, 45, pageWidth, 3, 'F');

    const logoBase64 = await loadLogoAsBase64();
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 14, 8, 25, 25);
      } catch {
        // Continue without logo
      }
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Sales Forecast', logoBase64 ? 45 : 20, 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(161, 161, 170);
    doc.text('BEV Flow - AI-Powered Prediction', logoBase64 ? 45 : 20, 30);
    
    y = 60;
    doc.setTextColor(39, 39, 42);

    // Product name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(forecast.product?.product_name || 'Unknown Product', 20, y);
    y += 18;

    // Prediction cards
    const currentStock = forecast.product?.current_stock || 0;
    const predicted = forecast.predicted_quantity || 0;
    const confidence = forecast.confidence_score || 0;
    
    const getConfidenceColor = (conf: number): [number, number, number] => {
      if (conf >= 80) return [34, 197, 94];
      if (conf >= 50) return [245, 158, 11];
      return [239, 68, 68];
    };
    
    const cards: { label: string; value: string; color: [number, number, number] }[] = [
      { label: 'Predicted Demand', value: String(predicted), color: [139, 92, 246] },
      { label: 'Confidence', value: `${confidence}%`, color: getConfidenceColor(confidence) },
      { label: 'Current Stock', value: String(currentStock), color: [63, 63, 70] },
    ];
    
    const cardWidth = (pageWidth - 52) / 3;
    cards.forEach((card, index) => {
      const x = 20 + (index * (cardWidth + 6));
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(x, y, cardWidth, 32, 3, 3, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122);
      doc.text(card.label, x + 10, y + 12);
      
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(card.color[0], card.color[1], card.color[2]);
      doc.text(card.value, x + 10, y + 26);
      doc.setFont('helvetica', 'normal');
    });

    y += 45;

    // Details section
    const details = [
      ['Forecast Period', forecast.forecast_period || 'N/A'],
      ['Min Stock Level', String(forecast.product?.min_stock_level || 0)],
      ['Restock Needed', predicted > currentStock ? 'Yes' : 'No'],
      ['Forecast Date', forecast.forecast_date ? new Date(forecast.forecast_date).toLocaleDateString('en-US') : 'N/A'],
    ];

    autoTable(doc, {
      body: details,
      startY: y,
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 6 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 55, textColor: [113, 113, 122] },
        1: { cellWidth: 80, textColor: [39, 39, 42] },
      },
    });

    // AI Recommendation section
    y = (doc as any).lastAutoTable.finalY + 15;
    
    // Recommendation box
    const needsReorder = predicted > currentStock;
    if (needsReorder) {
      doc.setFillColor(254, 243, 199);
    } else {
      doc.setFillColor(220, 252, 231);
    }
    doc.roundedRect(20, y - 5, pageWidth - 40, 45, 3, 3, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    if (needsReorder) {
      doc.setTextColor(180, 83, 9);
    } else {
      doc.setTextColor(22, 101, 52);
    }
    doc.text('🤖 AI Recommendation', 28, y + 5);
    
    y += 12;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(82, 82, 91);
    
    const minLevel = forecast.product?.min_stock_level || 0;
    let recommendation = '';
    if (predicted > currentStock) {
      const reorderQty = predicted - currentStock + minLevel;
      recommendation = `Based on the AI forecast, it is recommended to order approximately ${reorderQty} units to meet the predicted demand of ${predicted} units and maintain a safety stock of ${minLevel} units.`;
    } else {
      recommendation = `Current stock levels of ${currentStock} units appear sufficient to meet the predicted demand of ${predicted} units. No immediate restocking is required.`;
    }
    
    const splitRec = doc.splitTextToSize(recommendation, pageWidth - 56);
    doc.text(splitRec, 28, y + 5);

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.3);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, 14, footerY);
    doc.text('BEV Flow', pageWidth - 14, footerY, { align: 'right' });

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
