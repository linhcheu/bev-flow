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

// Professional Color Palette
const COLORS = {
  primary: [30, 64, 175] as [number, number, number],      // Deep blue
  primaryLight: [219, 234, 254] as [number, number, number], // Light blue bg
  secondary: [245, 158, 11] as [number, number, number],   // Amber/Gold
  secondaryLight: [254, 243, 199] as [number, number, number], // Light amber
  success: [22, 163, 74] as [number, number, number],      // Green
  successLight: [220, 252, 231] as [number, number, number], // Light green
  danger: [220, 38, 38] as [number, number, number],       // Red
  dangerLight: [254, 226, 226] as [number, number, number], // Light red
  dark: [39, 39, 42] as [number, number, number],          // Dark text
  medium: [82, 82, 91] as [number, number, number],        // Medium text
  light: [113, 113, 122] as [number, number, number],      // Light text
  muted: [161, 161, 170] as [number, number, number],      // Muted text
  border: [209, 213, 219] as [number, number, number],     // Border gray
  bgLight: [249, 250, 251] as [number, number, number],    // Light background
  white: [255, 255, 255] as [number, number, number],
};

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

// Helper to draw section header with blue background
const drawSectionHeader = (doc: jsPDF, text: string, y: number, margin: number, pageWidth: number) => {
  doc.setFillColor(...COLORS.primary);
  doc.rect(margin, y, pageWidth - margin * 2, 10, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.white);
  doc.text(text, pageWidth / 2, y + 6.5, { align: 'center' });
  return y + 12; // Return position after header + small gap
};

// Helper to draw professional header
const drawHeader = async (
  doc: jsPDF,
  title: string,
  pageWidth: number,
  margin: number,
  startY: number,
  options?: { 
    docNumber?: string; 
    docLabel?: string;
    date?: string;
    dateLabel?: string;
  }
) => {
  let y = startY;
  const logoBase64 = await loadLogoAsBase64();
  const contentWidth = pageWidth - margin * 2;

  // Logo (RIGHT side - top corner) - Bigger size
  const logoSize = 45;
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', pageWidth - margin - logoSize, y - 5, logoSize, logoSize);
    } catch {
      // Continue without logo
    }
  }

  // Title (LEFT side) - positioned to not overlap with logo
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text(title, margin, y + 14);

  y += 24;

  // Company Information (LEFT side)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('H2O - KTV, Restaurant, Steam Sauna', margin, y);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.medium);
  doc.text('Takdol Village, Takhmao Town, Kandal Province', margin, y + 5);
  doc.text('Phone: 012 955 499', margin, y + 9);
  doc.text('Email: monkul-rest-bar@gmail.com', margin, y + 13);

  y += 20;

  // Document info (LEFT side - below company info, no box)
  if (options?.docNumber || options?.date) {
    doc.setFontSize(10);
    
    if (options?.dateLabel && options?.date) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.dark);
      doc.text(options.dateLabel, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.secondary);
      doc.text(options.date, margin + 22, y);
    }
    
    if (options?.docLabel && options?.docNumber) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.dark);
      doc.text(options.docLabel, margin, y + 8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.secondary);
      doc.text(options.docNumber, margin + 22, y + 8);
    }
    y += 18;
  }

  // Draw separator line
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentWidth, y);

  return y + 8;
};

// Helper to draw footer
const drawFooter = (doc: jsPDF, pageWidth: number, pageHeight: number, margin: number, currentPage: number, totalPages: number) => {
  const footerY = pageHeight - 15;
  
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text('BEV Flow - Inventory Management System', margin, footerY);
  doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });
  doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, pageWidth / 2, footerY, { align: 'center' });
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

  // Export data to PDF with professional header and logo - LANDSCAPE for list exports
  const exportToPDF = async (
    data: any[],
    columns: ExportColumn[],
    title: string,
    filename: string = 'export',
    options?: { summary?: Record<string, string | number> }
  ) => {
    // Always use landscape for export all data
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const footerHeight = 20; // Reserve space for footer
    
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });

    let y = await drawHeader(doc, title, pageWidth, margin, 10, {
      dateLabel: 'DATE:',
      date: date,
    });

    y += 8;

    // Summary section if provided
    if (options?.summary && Object.keys(options.summary).length > 0) {
      y = drawSectionHeader(doc, 'Summary', y, margin, pageWidth);
      
      const summaryEntries = Object.entries(options.summary);
      const cols = Math.min(summaryEntries.length, 4);
      const colWidth = (pageWidth - margin * 2) / cols;
      const summaryBoxHeight = 22;
      
      doc.setFillColor(...COLORS.bgLight);
      doc.rect(margin, y, pageWidth - margin * 2, summaryBoxHeight, 'F');
      
      summaryEntries.slice(0, 4).forEach(([key, value], index) => {
        const x = margin + (index * colWidth) + 5;
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.light);
        doc.text(key, x, y + 8);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.dark);
        const displayValue = typeof value === 'number' ? value.toLocaleString() : String(value);
        doc.text(displayValue, x, y + 16);
        doc.setFont('helvetica', 'normal');
      });
      
      y += summaryBoxHeight + 5;
    }

    // Data section header
    y = drawSectionHeader(doc, `Data Records (${data.length} items)`, y, margin, pageWidth);

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

    // Add table with professional styling - with page break handling
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: y,
      tableWidth: pageWidth - margin * 2,
      styles: { 
        fontSize: 9, 
        cellPadding: 4,
        textColor: COLORS.dark,
        lineColor: COLORS.border,
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontStyle: 'bold',
        fontSize: 9,
      },
      alternateRowStyles: { 
        fillColor: COLORS.primaryLight
      },
      margin: { left: margin, right: margin, bottom: footerHeight + 5 },
      showHead: 'everyPage',
      didDrawPage: function(data) {
        // Draw footer on each page
        drawFooter(doc, pageWidth, pageHeight, margin, doc.getCurrentPageInfo().pageNumber, doc.getNumberOfPages());
      },
    });

    // Update footer page counts
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      drawFooter(doc, pageWidth, pageHeight, margin, i, pageCount);
    }

    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`${filename}_${dateStr}.pdf`);
  };

  // Export dashboard summary with professional layout - LANDSCAPE
  const exportDashboardPDF = async (stats: any) => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const footerHeight = 20;
    
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });

    let y = await drawHeader(doc, 'Dashboard Report', pageWidth, margin, 10, {
      dateLabel: 'DATE:',
      date: date,
    });

    y += 8;

    // Overview Stats Section
    y = drawSectionHeader(doc, 'Overview Statistics', y, margin, pageWidth);
    
    const statsData = [
      { label: 'Total Products', value: String(stats.productCount || 0) },
      { label: 'Total Suppliers', value: String(stats.supplierCount || 0) },
      { label: 'Active POs', value: String(stats.activePoCount || 0) },
    ];

    const cardWidth = (pageWidth - margin * 2 - 10) / 3;
    const cardHeight = 28;
    statsData.forEach((stat, index) => {
      const x = margin + (index * (cardWidth + 5));
      doc.setFillColor(...COLORS.bgLight);
      doc.setDrawColor(...COLORS.border);
      doc.rect(x, y, cardWidth, cardHeight, 'FD');
      
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.light);
      doc.text(stat.label, x + 5, y + 10);
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.primary);
      doc.text(stat.value, x + 5, y + 22);
      doc.setFont('helvetica', 'normal');
    });

    y += cardHeight + 8;

    // Today's Performance Section
    y = drawSectionHeader(doc, "Today's Performance", y, margin, pageWidth);

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
      tableWidth: pageWidth - margin * 2,
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 'auto', textColor: COLORS.medium },
        1: { cellWidth: 'auto', halign: 'right', textColor: COLORS.dark },
      },
      margin: { left: margin, right: margin, bottom: footerHeight + 5 },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // Check if we need a new page
    if (y > pageHeight - footerHeight - 50) {
      doc.addPage();
      y = margin + 10;
    }

    // Low stock alerts
    if (stats.lowStockProducts?.length > 0) {
      y = drawSectionHeader(doc, '⚠️ Low Stock Alerts', y, margin, pageWidth);

      autoTable(doc, {
        head: [['Product', 'Current Stock', 'Min Level', 'Status']],
        body: stats.lowStockProducts.map((p: any) => [
          p.product_name, 
          String(p.current_stock), 
          String(p.min_stock_level),
          'Restock Needed'
        ]),
        startY: y,
        tableWidth: pageWidth - margin * 2,
        headStyles: { 
          fillColor: COLORS.secondary,
          textColor: COLORS.white,
          fontSize: 9,
        },
        styles: { fontSize: 9, cellPadding: 4 },
        alternateRowStyles: { fillColor: COLORS.secondaryLight },
        margin: { left: margin, right: margin, bottom: footerHeight + 5 },
        showHead: 'everyPage',
      });

      y = (doc as any).lastAutoTable.finalY + 8;
    }

    // Check if we need a new page
    if (y > pageHeight - footerHeight - 50) {
      doc.addPage();
      y = margin + 10;
    }

    // Top products
    if (stats.topProducts?.length > 0) {
      y = drawSectionHeader(doc, '🏆 Top Selling Products', y, margin, pageWidth);

      autoTable(doc, {
        head: [['Rank', 'Product', 'Total Sold']],
        body: stats.topProducts.map((p: any, i: number) => [
          `#${i + 1}`,
          p.product_name, 
          String(p.total_sold)
        ]),
        startY: y,
        tableWidth: pageWidth - margin * 2,
        headStyles: { 
          fillColor: COLORS.success,
          textColor: COLORS.white,
          fontSize: 9,
        },
        styles: { fontSize: 9, cellPadding: 4 },
        alternateRowStyles: { fillColor: COLORS.successLight },
        margin: { left: margin, right: margin, bottom: footerHeight + 5 },
        showHead: 'everyPage',
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      drawFooter(doc, pageWidth, pageHeight, margin, i, pageCount);
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
  // Export single sale as professional invoice PDF
  const exportSaleReceipt = async (sale: any) => {
    const items = sale.items || [{ 
      product: sale.product, 
      quantity: sale.quantity, 
      unit_price: sale.unit_price,
      amount: sale.total_amount 
    }];
    
    // Portrait for individual receipt
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const footerHeight = 20;

    const saleDate = new Date(sale.sale_date).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'numeric', day: 'numeric' 
    });

    let y = await drawHeader(doc, 'Sales Invoice', pageWidth, margin, 10, {
      dateLabel: 'DATE:',
      date: saleDate,
      docLabel: 'Invoice No.',
      docNumber: sale.sale_number || 'N/A',
    });

    y += 8;

    // Customer Information Section
    y = drawSectionHeader(doc, 'Customer Information', y, margin, pageWidth);
    
    const halfWidth = (pageWidth - margin * 2 - 8) / 2;
    const infoBoxHeight = 32;
    
    // Customer details (left)
    doc.setFillColor(...COLORS.bgLight);
    doc.rect(margin, y, halfWidth, infoBoxHeight, 'F');
    
    let fieldY = y + 9;
    doc.setFontSize(8);
    const customerFields = [
      { label: 'Customer Name:', value: sale.customer?.customer_name || 'Walk-in Customer' },
      { label: 'Phone:', value: sale.customer?.phone || '-' },
      { label: 'Email:', value: sale.customer?.email || '-' },
    ];
    
    customerFields.forEach(field => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.light);
      doc.text(field.label, margin + 4, fieldY);
      doc.setTextColor(...COLORS.dark);
      doc.text(field.value.substring(0, 28), margin + 32, fieldY);
      fieldY += 8;
    });

    // Payment details (right)
    doc.setFillColor(...COLORS.primaryLight);
    doc.rect(margin + halfWidth + 8, y, halfWidth, infoBoxHeight, 'F');
    
    fieldY = y + 9;
    const paymentFields = [
      { label: 'Payment Method:', value: sale.payment_method || 'Cash' },
      { label: 'Status:', value: 'Completed' },
      { label: 'Created By:', value: sale.created_by || 'Admin' },
    ];
    
    paymentFields.forEach(field => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.light);
      doc.text(field.label, margin + halfWidth + 12, fieldY);
      doc.setTextColor(...COLORS.dark);
      doc.text(field.value.substring(0, 22), margin + halfWidth + 42, fieldY);
      fieldY += 8;
    });

    y += infoBoxHeight + 6;

    // Items Table Section
    y = drawSectionHeader(doc, 'Order Items', y, margin, pageWidth);

    const itemsData = items.map((item: any, index: number) => {
      const amount = item.amount || (item.quantity * item.unit_price);
      return [
        String(index + 1),
        item.product?.product_name || 'Product',
        item.product?.description?.substring(0, 22) || '-',
        String(item.quantity),
        `$${Number(item.unit_price).toFixed(2)}`,
        `$${Number(amount).toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      head: [['No.', 'Product Name', 'Description', 'Qty', 'UNIT PRICE', 'AMOUNT']],
      body: itemsData,
      startY: y,
      margin: { left: margin, right: margin, bottom: footerHeight + 5 },
      tableWidth: pageWidth - margin * 2,
      headStyles: { 
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      styles: { 
        fontSize: 9, 
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto', halign: 'center' },
        4: { cellWidth: 'auto', halign: 'right' },
        5: { cellWidth: 'auto', halign: 'right' },
      },
      alternateRowStyles: { fillColor: COLORS.primaryLight },
      showHead: 'everyPage',
    });
    
    y = (doc as any).lastAutoTable.finalY + 8;

    // Remark and Totals Row
    const totalsWidth = 65;
    const remarkWidth = pageWidth - margin * 2 - totalsWidth - 15;
    const totalsBoxHeight = 48;
    
    // Remark box (left)
    if (sale.notes) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.dark);
      doc.text('*Remark:', margin, y + 8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...COLORS.medium);
      const remarkLines = doc.splitTextToSize(sale.notes, remarkWidth - 5);
      doc.text(remarkLines, margin + 18, y + 8);
    }

    // Totals box (right)
    const totalsX = pageWidth - margin - totalsWidth;
    doc.setFillColor(...COLORS.bgLight);
    doc.rect(totalsX, y, totalsWidth, totalsBoxHeight, 'F');
    
    let totalsY = y + 10;
    
    // Subtotal
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.medium);
    doc.text('SUBTOTAL', totalsX + 4, totalsY);
    doc.setTextColor(...COLORS.dark);
    doc.text(`$${Number(sale.subtotal || sale.total_amount).toFixed(2)}`, totalsX + totalsWidth - 4, totalsY, { align: 'right' });
    totalsY += 10;
    
    // Discount if exists
    if (sale.discount_amount && sale.discount_amount > 0) {
      doc.setTextColor(...COLORS.success);
      doc.text('Discount', totalsX + 4, totalsY);
      doc.text(`-$${Number(sale.discount_amount).toFixed(2)}`, totalsX + totalsWidth - 4, totalsY, { align: 'right' });
      totalsY += 10;
    }
    
    // Divider line
    doc.setDrawColor(...COLORS.border);
    doc.line(totalsX + 4, totalsY - 3, totalsX + totalsWidth - 4, totalsY - 3);
    totalsY += 6;
    
    // Total
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.dark);
    doc.text('TOTAL', totalsX + 4, totalsY);
    doc.setTextColor(...COLORS.secondary);
    doc.text(`$${Number(sale.total_amount).toFixed(2)}`, totalsX + totalsWidth - 4, totalsY, { align: 'right' });

    y += totalsBoxHeight + 8;

    // Check if authorization section will overlap with footer - add new page if needed
    const authSectionHeight = 60; // Height needed for authorization + thank you message
    if (y + authSectionHeight > pageHeight - footerHeight - 10) {
      doc.addPage();
      y = margin + 20;
    }

    // Authorization Section
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;
    
    const signatureWidth = (pageWidth - margin * 2 - 40) / 2;
    
    // Left side - Authorized by with signature line
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.medium);
    doc.text('Authorized by:', margin, y);
    
    // Signature line
    doc.setDrawColor(...COLORS.dark);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 18, margin + signatureWidth, y + 18);
    
    // Name under signature
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(sale.created_by || '(Signature)', margin + signatureWidth / 2, y + 25, { align: 'center' });
    
    // Right side - Date
    const rightX = pageWidth - margin - signatureWidth;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.medium);
    doc.text('Date:', rightX, y);
    
    // Date line
    doc.line(rightX, y + 18, pageWidth - margin, y + 18);
    
    // Date value
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.dark);
    doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }), rightX + signatureWidth / 2, y + 25, { align: 'center' });

    y += 35;

    // Thank you message
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.secondary);
    doc.text('Thank you for your business!', pageWidth / 2, y, { align: 'center' });

    // Footer
    drawFooter(doc, pageWidth, pageHeight, margin, 1, 1);

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
    
    const itemRows = items.map((item: any) => [
      item.product?.product_name || 'Product',
      item.product?.sku || 'N/A',
      item.quantity,
      `$${Number(item.unit_price).toFixed(2)}`,
      `$${Number(item.amount || item.quantity * item.unit_price).toFixed(2)}`,
    ]);
    
    const totalRows = [
      [''],
      ['', '', '', '─────────────', '─────────────'],
      ['', '', '', 'Subtotal', `$${Number(sale.subtotal || sale.total_amount).toFixed(2)}`],
      ['', '', '', 'TOTAL', `$${Number(sale.total_amount).toFixed(2)}`],
      [''],
    ];
    
    if (sale.notes) {
      totalRows.push(['Notes', sale.notes, '', '', '']);
    }
    
    totalRows.push(['']);
    totalRows.push(['Generated', generatedDate, '', '', '']);
    totalRows.push(['', 'Thank you for your business!', '', '', '']);
    
    const allData = [...headerData, ...itemRows, ...totalRows];
    
    const ws = XLSX.utils.aoa_to_sheet(allData);
    ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 12 }];
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

  // Export single product as detail PDF - PORTRAIT for individual
  const exportProductDetail = async (product: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const footerHeight = 20;

    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'numeric', day: 'numeric' 
    });

    let y = await drawHeader(doc, 'Product Information Sheet', pageWidth, margin, 10, {
      dateLabel: 'DATE:',
      date: date,
      docLabel: 'SKU:',
      docNumber: product.sku || 'N/A',
    });

    y += 8;

    // Product Header Section
    y = drawSectionHeader(doc, 'Product Details', y, margin, pageWidth);
    
    // Product name and status box
    const productNameBoxHeight = 22;
    doc.setFillColor(...COLORS.bgLight);
    doc.rect(margin, y, pageWidth - margin * 2, productNameBoxHeight, 'F');
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.dark);
    doc.text(product.product_name, margin + 5, y + 13);
    
    // Status badge
    const isLowStock = (product.current_stock || 0) <= (product.min_stock_level || 0);
    if (isLowStock) {
      doc.setFillColor(...COLORS.dangerLight);
      doc.roundedRect(pageWidth - margin - 28, y + 6, 24, 10, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.danger);
      doc.text('Low Stock', pageWidth - margin - 16, y + 13, { align: 'center' });
    } else {
      doc.setFillColor(...COLORS.successLight);
      doc.roundedRect(pageWidth - margin - 26, y + 6, 22, 10, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.success);
      doc.text('In Stock', pageWidth - margin - 15, y + 13, { align: 'center' });
    }
    
    y += productNameBoxHeight + 6;

    // Pricing Section
    y = drawSectionHeader(doc, 'Pricing Information', y, margin, pageWidth);
    
    const thirdWidth = (pageWidth - margin * 2 - 10) / 3;
    const priceBoxHeight = 28;
    const priceData = [
      { label: 'Cost Price', value: `$${Number(product.cost_price || 0).toFixed(2)}`, color: COLORS.success },
      { label: 'Selling Price', value: `$${Number(product.selling_price || 0).toFixed(2)}`, color: COLORS.secondary },
      { label: 'Profit Margin', value: `$${(Number(product.selling_price || 0) - Number(product.cost_price || 0)).toFixed(2)}`, color: COLORS.primary },
    ];

    priceData.forEach((item, index) => {
      const x = margin + (index * (thirdWidth + 5));
      doc.setFillColor(...item.color);
      doc.rect(x, y, thirdWidth, priceBoxHeight, 'F');
      
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.white);
      doc.text(item.label, x + 5, y + 10);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(item.value, x + 5, y + 22);
      doc.setFont('helvetica', 'normal');
    });

    y += priceBoxHeight + 6;

    // Stock & Supplier Section
    y = drawSectionHeader(doc, 'Stock & Supplier Information', y, margin, pageWidth);
    
    const halfWidth = (pageWidth - margin * 2 - 8) / 2;
    const infoBoxHeight = 36;
    
    // Stock info (left)
    doc.setFillColor(...COLORS.bgLight);
    doc.rect(margin, y, halfWidth, infoBoxHeight, 'F');
    
    let fieldY = y + 10;
    const stockFields = [
      { label: 'Current Stock:', value: String(product.current_stock || 0) },
      { label: 'Min Stock Level:', value: String(product.min_stock_level || 0) },
      { label: 'Reorder Status:', value: isLowStock ? 'Reorder Required' : 'Stock OK' },
    ];
    
    doc.setFontSize(8);
    stockFields.forEach(field => {
      doc.setTextColor(...COLORS.light);
      doc.text(field.label, margin + 5, fieldY);
      doc.setTextColor(...COLORS.dark);
      doc.text(field.value, margin + 38, fieldY);
      fieldY += 9;
    });

    // Supplier info (right)
    doc.setFillColor(...COLORS.primaryLight);
    doc.rect(margin + halfWidth + 8, y, halfWidth, infoBoxHeight, 'F');
    
    fieldY = y + 10;
    const supplierFields = [
      { label: 'Company:', value: product.supplier?.company_name || 'N/A' },
      { label: 'Contact:', value: product.supplier?.contact_person || '-' },
      { label: 'Phone:', value: product.supplier?.phone || '-' },
    ];
    
    supplierFields.forEach(field => {
      doc.setTextColor(...COLORS.light);
      doc.text(field.label, margin + halfWidth + 12, fieldY);
      doc.setTextColor(...COLORS.dark);
      doc.text(field.value.substring(0, 18), margin + halfWidth + 32, fieldY);
      fieldY += 9;
    });

    y += infoBoxHeight + 6;

    // Description Section
    if (product.description) {
      y = drawSectionHeader(doc, 'Description', y, margin, pageWidth);
      
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.medium);
      const descLines = doc.splitTextToSize(product.description, pageWidth - margin * 2);
      doc.text(descLines, margin, y + 6);
      y += descLines.length * 4 + 12;
    }

    // Check if verification section will overlap with footer - add new page if needed
    const verificationHeight = 50;
    if (y + verificationHeight > pageHeight - footerHeight - 10) {
      doc.addPage();
      y = margin + 20;
    }

    // Verification Section
    y = drawSectionHeader(doc, 'Verification', y, margin, pageWidth);
    y += 8;
    
    const signatureWidth = (pageWidth - margin * 2 - 40) / 2;
    
    // Left side - Verified by
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.medium);
    doc.text('Verified by:', margin, y);
    
    doc.setDrawColor(...COLORS.dark);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 15, margin + signatureWidth, y + 15);
    
    // Right side - Date
    const rightX = pageWidth - margin - signatureWidth;
    doc.text('Date:', rightX, y);
    doc.line(rightX, y + 15, pageWidth - margin, y + 15);

    // Footer
    drawFooter(doc, pageWidth, pageHeight, margin, 1, 1);

    doc.save(`product_${product.sku || product.product_id}.pdf`);
  };

  // Export single supplier as detail PDF - PORTRAIT for individual
  const exportSupplierDetail = async (supplier: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const footerHeight = 20;

    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'numeric', day: 'numeric' 
    });

    let y = await drawHeader(doc, 'Supplier Profile', pageWidth, margin, 10, {
      dateLabel: 'DATE:',
      date: date,
    });

    y += 8;

    // Supplier Header
    y = drawSectionHeader(doc, 'Supplier Information', y, margin, pageWidth);
    
    // Company name and status box
    const supplierNameBoxHeight = 20;
    doc.setFillColor(...COLORS.bgLight);
    doc.rect(margin, y, pageWidth - margin * 2, supplierNameBoxHeight, 'F');
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.dark);
    doc.text(supplier.company_name, margin + 5, y + 13);
    
    // Status badge
    if (supplier.is_active) {
      doc.setFillColor(...COLORS.successLight);
      doc.roundedRect(pageWidth - margin - 22, y + 5, 18, 10, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.success);
      doc.text('Active', pageWidth - margin - 13, y + 12, { align: 'center' });
    } else {
      doc.setFillColor(...COLORS.dangerLight);
      doc.roundedRect(pageWidth - margin - 24, y + 5, 20, 10, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.danger);
      doc.text('Inactive', pageWidth - margin - 14, y + 12, { align: 'center' });
    }
    
    y += supplierNameBoxHeight + 6;

    // Contact Information
    y = drawSectionHeader(doc, 'Contact Information', y, margin, pageWidth);
    
    const contactData = [
      ['Contact Person', supplier.contact_person || 'N/A'],
      ['Phone', supplier.phone || 'N/A'],
      ['Email', supplier.email || 'N/A'],
      ['Sales Agent', supplier.sale_agent || 'N/A'],
    ];

    autoTable(doc, {
      body: contactData,
      startY: y,
      theme: 'striped',
      tableWidth: pageWidth - margin * 2,
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 'auto', textColor: COLORS.medium },
        1: { cellWidth: 'auto', textColor: COLORS.dark },
      },
      alternateRowStyles: { fillColor: COLORS.bgLight },
      margin: { left: margin, right: margin, bottom: footerHeight + 5 },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // Address & Business Details
    y = drawSectionHeader(doc, 'Business Details', y, margin, pageWidth);
    
    const businessData = [
      ['Address', supplier.address || 'N/A'],
      ['Lead Time', supplier.lead_time_days ? `${supplier.lead_time_days} days` : 'N/A'],
      ['Products Supplied', supplier.products || 'N/A'],
    ];

    autoTable(doc, {
      body: businessData,
      startY: y,
      theme: 'striped',
      tableWidth: pageWidth - margin * 2,
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 'auto', textColor: COLORS.medium },
        1: { cellWidth: 'auto', textColor: COLORS.dark },
      },
      alternateRowStyles: { fillColor: COLORS.primaryLight },
      margin: { left: margin, right: margin, bottom: footerHeight + 5 },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // Check if verification section will overlap with footer - add new page if needed
    const verificationHeight = 50;
    if (y + verificationHeight > pageHeight - footerHeight - 10) {
      doc.addPage();
      y = margin + 20;
    }

    // Verification Section
    y = drawSectionHeader(doc, 'Verification', y, margin, pageWidth);
    y += 10;
    
    const signBoxWidth = (pageWidth - margin * 2 - 40) / 2;
    
    // Left side - Verified by
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.medium);
    doc.text('Verified by:', margin, y);
    
    doc.setDrawColor(...COLORS.dark);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 15, margin + signBoxWidth, y + 15);
    doc.setFontSize(8);
    doc.text('Date: _______________', margin, y + 25);
    
    // Right side - Approved by
    const rightX = pageWidth - margin - signBoxWidth;
    doc.setFontSize(9);
    doc.text('Approved by:', rightX, y);
    doc.line(rightX, y + 15, pageWidth - margin, y + 15);
    doc.setFontSize(8);
    doc.text('Date: _______________', rightX, y + 25);

    // Footer
    drawFooter(doc, pageWidth, pageHeight, margin, 1, 1);

    doc.save(`supplier_${supplier.company_name.replace(/\s+/g, '_')}.pdf`);
  };

  // Export single purchase order as detail PDF - Professional Form Layout - PORTRAIT for individual
  const exportPurchaseOrderDetail = async (po: any) => {
    // Use A3 portrait for larger size
    const doc = new jsPDF('portrait', 'mm', 'a3');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    const footerHeight = 20;

    const orderDate = po.order_date ? new Date(po.order_date).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'numeric', day: 'numeric' 
    }) : 'N/A';

    let y = await drawHeader(doc, 'Purchasing Order Form', pageWidth, margin, 15, {
      dateLabel: 'DATE:',
      date: orderDate,
      docLabel: 'PO No.',
      docNumber: po.po_number || 'N/A',
    });

    y += 15;

    // ============ SUPPLIER INFORMATION SECTION ============
    // Section header
    doc.setFillColor(...COLORS.primary);
    doc.rect(margin, y, contentWidth, 10, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.white);
    doc.text('Supplier Information', pageWidth / 2, y + 7, { align: 'center' });
    y += 10;

    // Supplier content box - two columns
    const supplierBoxHeight = 40;
    doc.setFillColor(...COLORS.primaryLight);
    doc.rect(margin, y, contentWidth, supplierBoxHeight, 'F');
    
    // Column positions for equal width
    const leftColX = margin + 8;
    const leftValX = margin + 45;
    const rightColX = pageWidth / 2 + 10;
    const rightValX = pageWidth / 2 + 55;
    
    doc.setFontSize(10);
    let rowY = y + 10;
    
    // Row 1
    doc.setTextColor(...COLORS.medium);
    doc.setFont('helvetica', 'normal');
    doc.text('Company Name:', leftColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text(po.supplier?.company_name || '-', leftValX, rowY);
    
    doc.setTextColor(...COLORS.medium);
    doc.text('Phone:', rightColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text(po.supplier?.phone || '-', rightValX, rowY);
    
    rowY += 10;
    
    // Row 2
    doc.setTextColor(...COLORS.medium);
    doc.text('Address 1:', leftColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text((po.supplier?.address || '-').substring(0, 40), leftValX, rowY);
    
    doc.setTextColor(...COLORS.medium);
    doc.text('Email:', rightColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text(po.supplier?.email || '-', rightValX, rowY);
    
    rowY += 10;
    
    // Row 3
    doc.setTextColor(...COLORS.medium);
    doc.text('Address 2:', leftColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text('-', leftValX, rowY);
    
    doc.setTextColor(...COLORS.medium);
    doc.text('Contact Person:', rightColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text(po.supplier?.contact_person || '-', rightValX, rowY);
    
    rowY += 10;
    
    // Row 4
    doc.setTextColor(...COLORS.medium);
    doc.text('Address 3:', leftColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text('-', leftValX, rowY);
    
    y += supplierBoxHeight + 8;

    // ============ THIRD PARTY AGENT SECTION ============
    // Section header
    doc.setFillColor(...COLORS.primary);
    doc.rect(margin, y, contentWidth, 10, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.white);
    doc.text('Third Party Agent', pageWidth / 2, y + 7, { align: 'center' });
    y += 10;

    // Agent content box - two columns (same width as supplier)
    const agentBoxHeight = 40;
    doc.setFillColor(...COLORS.secondaryLight);
    doc.rect(margin, y, contentWidth, agentBoxHeight, 'F');
    
    doc.setFontSize(10);
    rowY = y + 10;
    
    // Row 1
    doc.setTextColor(...COLORS.medium);
    doc.setFont('helvetica', 'normal');
    doc.text('Co-Loader Name:', leftColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text(po.third_party_agent || '-', leftValX, rowY);
    
    doc.setTextColor(...COLORS.medium);
    doc.text('Phone:', rightColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text(po.agent_phone || '-', rightValX, rowY);
    
    rowY += 10;
    
    // Row 2
    doc.setTextColor(...COLORS.medium);
    doc.text('Address 1:', leftColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text((po.agent_address || '-').substring(0, 40), leftValX, rowY);
    
    doc.setTextColor(...COLORS.medium);
    doc.text('Email:', rightColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text(po.agent_email || '-', rightValX, rowY);
    
    rowY += 10;
    
    // Row 3
    doc.setTextColor(...COLORS.medium);
    doc.text('Address 2:', leftColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text('-', leftValX, rowY);
    
    doc.setTextColor(...COLORS.medium);
    doc.text('Agent Name:', rightColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text(po.third_party_agent || '-', rightValX, rowY);
    
    rowY += 10;
    
    // Row 4
    doc.setTextColor(...COLORS.medium);
    doc.text('Address 3:', leftColX, rowY);
    doc.setTextColor(...COLORS.dark);
    doc.text('-', leftValX, rowY);
    
    y += agentBoxHeight + 8;

    // ============ DELIVERY INFORMATION SECTION ============
    // Section header (same width as supplier/agent)
    doc.setFillColor(...COLORS.primary);
    doc.rect(margin, y, contentWidth, 10, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.white);
    doc.text('Delivery Information', pageWidth / 2, y + 7, { align: 'center' });
    y += 10;

    // Delivery content - 3 columns (same total width)
    const deliveryBoxHeight = 22;
    doc.setFillColor(...COLORS.primaryLight);
    doc.rect(margin, y, contentWidth, deliveryBoxHeight, 'F');
    
    const colWidth = contentWidth / 3;
    const etaDate = po.eta_date ? new Date(po.eta_date).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'numeric', day: 'numeric' 
    }) : 'N/A';
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('Requested Arrival', margin + 8, y + 8);
    doc.text('Transport Method', margin + colWidth + 8, y + 8);
    doc.text('Remark', margin + colWidth * 2 + 8, y + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.dark);
    doc.text(etaDate, margin + 8, y + 18);
    doc.text(po.truck_remark || 'Truck', margin + colWidth + 8, y + 18);
    doc.text((po.overall_remark || '-').substring(0, 35), margin + colWidth * 2 + 8, y + 18);
    
    y += deliveryBoxHeight + 6;

    // Note about PO timing
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.danger);
    doc.text('*Make PO 2 days before arrival time. (Avoid ordering & ETA on weekend). Cut off: 5pm', margin, y + 4);
    y += 12;

    // ============ ITEMS TABLE (Only actual items, no empty rows) ============
    const itemsData = (po.items || []).map((item: any, index: number) => [
      String(index + 1),
      item.product?.product_name || 'N/A',
      item.product?.description?.substring(0, 25) || '-',
      String(item.quantity),
      `$${Number(item.unit_cost).toFixed(2)}`,
      `$${Number(item.amount).toFixed(2)}`,
    ]);

    // Only show actual items - NO empty rows
    if (itemsData.length === 0) {
      itemsData.push(['1', 'No items', '-', '0', '$0.00', '$0.00']);
    }

    // Calculate balanced column widths - all proportional to contentWidth
    const noWidth = contentWidth * 0.06;        // 6% for No.
    const productWidth = contentWidth * 0.30;   // 30% for Product Name
    const descWidth = contentWidth * 0.30;      // 30% for Description (equal to product)
    const qtyWidth = contentWidth * 0.10;       // 10% for Qty
    const priceWidth = contentWidth * 0.12;     // 12% for Unit Price
    const amountWidth = contentWidth * 0.12;    // 12% for Amount

    autoTable(doc, {
      head: [['No.', 'Product Name', 'Description', 'Qty', 'UNIT PRICE', 'AMMOUNT']],
      body: itemsData,
      startY: y,
      margin: { left: margin, right: margin, bottom: footerHeight + 5 },
      tableWidth: contentWidth,
      headStyles: { 
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
      },
      styles: { 
        fontSize: 10, 
        cellPadding: 5,
        lineColor: COLORS.border,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: noWidth, halign: 'center' },
        1: { cellWidth: productWidth },
        2: { cellWidth: descWidth },
        3: { cellWidth: qtyWidth, halign: 'center' },
        4: { cellWidth: priceWidth, halign: 'right' },
        5: { cellWidth: amountWidth, halign: 'right' },
      },
      alternateRowStyles: { fillColor: COLORS.white },
      bodyStyles: { fillColor: COLORS.white },
      showHead: 'everyPage',
    });
    
    y = (doc as any).lastAutoTable.finalY + 15;

    // ============ REMARK AND TOTALS SECTION ============
    const totalsStartX = pageWidth - margin - 120;
    
    // Remark on left
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.danger);
    doc.text('*Remark:', margin, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.dark);
    const remarkText = po.overall_remark || 'give latest expiry';
    doc.text(remarkText.substring(0, 60), margin + 22, y);
    
    // Totals on right
    let totalsY = y - 5;
    
    // SUBTOTAL
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.dark);
    doc.text('SUBTOTAL', totalsStartX, totalsY + 5);
    doc.text(`$${Number(po.subtotal || 0).toFixed(2)}`, pageWidth - margin, totalsY + 5, { align: 'right' });
    
    totalsY += 10;
    
    // Shipping note
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.danger);
    doc.text('*Shipping cost is 3% of total cost.', totalsStartX, totalsY + 4);
    
    totalsY += 10;
    
    // SHIPPING Cost
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.dark);
    doc.text('SHIPPING', totalsStartX, totalsY);
    doc.text('Cost', totalsStartX, totalsY + 5);
    doc.text(`$${Number(po.shipping_cost || 0).toFixed(2)}`, pageWidth - margin, totalsY + 3, { align: 'right' });
    
    totalsY += 15;
    
    // Promotion Amount
    doc.text('Promotion', totalsStartX, totalsY);
    doc.text('Amount', totalsStartX, totalsY + 5);
    doc.setTextColor(...COLORS.success);
    doc.text(`$${Number(po.promotion_amount || 0).toFixed(2)}`, pageWidth - margin, totalsY + 3, { align: 'right' });
    
    totalsY += 18;
    
    // TOTAL
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.dark);
    doc.text('TOTAL', totalsStartX, totalsY);
    doc.setTextColor(...COLORS.secondary);
    doc.text(`$${Number(po.total_amount || 0).toFixed(2)}`, pageWidth - margin, totalsY, { align: 'right' });

    // Update y to be after totals (with plenty of space before authorization)
    y = Math.max(y + 50, totalsY + 25);

    // ============ AUTHORIZATION SECTION ============
    // Calculate authorization section height and position it well above footer
    const authSectionHeight = 60; // Height needed for authorization section
    const minSpaceAboveFooter = 30; // Minimum space between auth section and footer
    const footerYPos = pageHeight - 15; // Footer is drawn at this Y position
    
    // Check if authorization section will overlap with footer - add new page if needed
    if (y + authSectionHeight + minSpaceAboveFooter > footerYPos) {
      doc.addPage();
      y = margin + 20;
    }

    // Draw separator line
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += 10;

    // Signature section with proper spacing
    const signatureWidth = (contentWidth - 60) / 2;
    
    // Left side - Authorized by label above line
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.medium);
    doc.text('Authorized by', margin, y);
    
    // Signature line (below label)
    const signatureLineY = y + 25;
    doc.setDrawColor(...COLORS.dark);
    doc.setLineWidth(0.5);
    doc.line(margin, signatureLineY, margin + signatureWidth, signatureLineY);
    
    // Name under signature line
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(po.authorized_by || '________________', margin + signatureWidth / 2, signatureLineY + 8, { align: 'center' });
    
    // Right side - Date label above line
    const rightX = pageWidth - margin - signatureWidth;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.medium);
    doc.text('Date', rightX, y);
    
    // Date line
    doc.line(rightX, signatureLineY, pageWidth - margin, signatureLineY);
    
    // Date value under line
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.dark);
    doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }), rightX + signatureWidth / 2, signatureLineY + 8, { align: 'center' });

    // Footer at bottom
    drawFooter(doc, pageWidth, pageHeight, margin, 1, 1);

    doc.save(`PO_${po.po_number}.pdf`);
  };

  // Export single forecast as detail PDF - PORTRAIT for individual
  const exportForecastDetail = async (forecast: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const footerHeight = 20;

    const reportDate = forecast.forecast_date 
      ? new Date(forecast.forecast_date).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }) 
      : new Date().toLocaleDateString('en-US');

    let y = await drawHeader(doc, 'AI Sales Forecast Report', pageWidth, margin, 10, {
      dateLabel: 'DATE:',
      date: reportDate,
      docLabel: 'Period:',
      docNumber: forecast.forecast_period || 'Weekly',
    });

    y += 8;

    // Product Information Section
    y = drawSectionHeader(doc, 'Product Information', y, margin, pageWidth);
    
    const productInfoBoxHeight = 20;
    doc.setFillColor(...COLORS.bgLight);
    doc.rect(margin, y, pageWidth - margin * 2, productInfoBoxHeight, 'F');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.dark);
    doc.text(forecast.product?.product_name || 'Unknown Product', margin + 5, y + 10);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.light);
    doc.text(`SKU: ${forecast.product?.sku || 'N/A'}  |  Category: ${forecast.product?.category || 'Uncategorized'}`, margin + 5, y + 17);

    y += productInfoBoxHeight + 6;

    // Forecast Metrics Section
    y = drawSectionHeader(doc, 'Forecast Metrics', y, margin, pageWidth);
    
    const thirdWidth = (pageWidth - margin * 2 - 10) / 3;
    const metricsBoxHeight = 38;
    const currentStock = forecast.product?.current_stock || 0;
    const predicted = forecast.predicted_quantity || 0;
    const confidence = forecast.confidence_score || 0;
    
    // Predicted Demand Box
    doc.setFillColor(139, 92, 246); // Purple
    doc.rect(margin, y, thirdWidth, metricsBoxHeight, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.white);
    doc.text('Predicted Demand', margin + 5, y + 12);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(String(predicted), margin + 5, y + 26);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('units', margin + 5, y + 34);

    // Confidence Score Box
    const confColor: [number, number, number] = confidence >= 80 ? COLORS.success : confidence >= 50 ? COLORS.secondary : COLORS.danger;
    doc.setFillColor(...confColor);
    doc.rect(margin + thirdWidth + 5, y, thirdWidth, metricsBoxHeight, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.white);
    doc.text('AI Confidence', margin + thirdWidth + 10, y + 12);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${confidence}%`, margin + thirdWidth + 10, y + 26);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(confidence >= 80 ? 'High' : confidence >= 50 ? 'Medium' : 'Low', margin + thirdWidth + 10, y + 34);

    // Current Stock Box
    doc.setFillColor(...COLORS.dark);
    doc.rect(margin + (thirdWidth + 5) * 2, y, thirdWidth, metricsBoxHeight, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.white);
    doc.text('Current Stock', margin + (thirdWidth + 5) * 2 + 5, y + 12);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(String(currentStock), margin + (thirdWidth + 5) * 2 + 5, y + 26);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('units', margin + (thirdWidth + 5) * 2 + 5, y + 34);

    y += metricsBoxHeight + 6;

    // Analysis Section
    y = drawSectionHeader(doc, 'Stock Analysis', y, margin, pageWidth);
    
    const halfWidth = (pageWidth - margin * 2 - 8) / 2;
    const analysisBoxHeight = 32;
    const needsReorder = predicted > currentStock;
    const minLevel = forecast.product?.min_stock_level || 0;
    
    // Analysis info (left)
    doc.setFillColor(...COLORS.bgLight);
    doc.rect(margin, y, halfWidth, analysisBoxHeight, 'F');
    
    let fieldY = y + 10;
    const analysisFields = [
      { label: 'Min Stock Level:', value: String(minLevel) },
      { label: 'Stock Difference:', value: `${currentStock - predicted >= 0 ? '+' : ''}${currentStock - predicted}` },
      { label: 'Restock Needed:', value: needsReorder ? 'Yes' : 'No' },
    ];
    
    doc.setFontSize(8);
    analysisFields.forEach(field => {
      doc.setTextColor(...COLORS.light);
      doc.text(field.label, margin + 5, fieldY);
      doc.setTextColor(...COLORS.dark);
      doc.text(field.value, margin + 38, fieldY);
      fieldY += 8;
    });

    // Recommendation (right)
    if (needsReorder) {
      doc.setFillColor(...COLORS.secondaryLight);
    } else {
      doc.setFillColor(...COLORS.successLight);
    }
    doc.rect(margin + halfWidth + 8, y, halfWidth, analysisBoxHeight, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    if (needsReorder) {
      doc.setTextColor(...COLORS.secondary);
      doc.text('⚠️ Action Required', margin + halfWidth + 12, y + 10);
    } else {
      doc.setTextColor(...COLORS.success);
      doc.text('✓ Stock Sufficient', margin + halfWidth + 12, y + 10);
    }
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.medium);
    
    let recText = '';
    if (needsReorder) {
      const reorderQty = predicted - currentStock + minLevel;
      recText = `Order ${reorderQty} units to meet demand.`;
    } else {
      recText = `Stock is sufficient for demand.`;
    }
    doc.text(recText, margin + halfWidth + 12, y + 22);

    y += analysisBoxHeight + 6;

    // AI Insights Section
    y = drawSectionHeader(doc, '🤖 AI-Powered Insights', y, margin, pageWidth);
    
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.medium);
    const insights = `This forecast is generated using machine learning algorithms analyzing historical sales data and seasonal patterns. Confidence: ${confidence}%. ${needsReorder ? 'Immediate action recommended.' : 'No action required.'}`;
    const insightLines = doc.splitTextToSize(insights, pageWidth - margin * 2);
    doc.text(insightLines, margin, y + 6);

    y += insightLines.length * 4 + 12;

    // Review Section
    y = drawSectionHeader(doc, 'Review & Approval', y, margin, pageWidth);
    y += 4;
    
    const signBoxWidth = (pageWidth - margin * 2 - 20) / 2;
    
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.medium);
    doc.text('Reviewed by:', margin, y + 5);
    doc.setDrawColor(...COLORS.border);
    doc.line(margin + 22, y + 5, margin + signBoxWidth, y + 5);
    doc.text('Date: _______________', margin + 5, y + 14);
    
    doc.text('Approved by:', margin + signBoxWidth + 25, y + 5);
    doc.line(margin + signBoxWidth + 48, y + 5, pageWidth - margin, y + 5);
    doc.text('Date: _______________', margin + signBoxWidth + 30, y + 14);

    // Footer
    drawFooter(doc, pageWidth, pageHeight, margin, 1, 1);

    doc.save(`forecast_${forecast.product?.product_name?.replace(/\s+/g, '_') || forecast.forecast_id}.pdf`);
  };

  // Excel export for product detail
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
      [''],
      ['Inventory Status'],
      ['Current Stock', product.current_stock || 0],
      ['Min Stock Level', product.min_stock_level || 0],
      ['Status', isLowStock ? '⚠️ LOW STOCK' : '✓ In Stock'],
      [''],
      ['Supplier'],
      ['Company', product.supplier?.company_name || 'N/A'],
      [''],
      ['─────────────────────────────────────────────'],
      ['Generated', generatedDate],
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 25 }, { wch: 35 }];
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

  // Excel export for supplier detail
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

  // Excel export for purchase order detail
  const exportPurchaseOrderDetailExcel = (po: any) => {
    const orderDate = po.order_date ? new Date(po.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    const etaDate = po.eta_date ? new Date(po.eta_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    const generatedDate = new Date().toLocaleString('en-US');
    
    const headerData: any[][] = [
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
    
    const totalRows: any[][] = [
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

  // Excel export for forecast detail
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
        ? `Order approximately ${predicted - currentStock + minLevel} units to meet predicted demand.`
        : 'Current stock levels are sufficient.'
      ],
      [''],
      ['─────────────────────────────────────────────'],
      ['Generated', generatedDate],
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 25 }, { wch: 50 }];
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
