// Export utility functions for Excel and PDF
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

// Export data to Excel
export const exportToExcel = (
  data: any[],
  columns: ExportColumn[],
  filename: string = 'export'
) => {
  // Prepare data with headers
  const headers = columns.map(col => col.header);
  const rows = data.map(item => 
    columns.map(col => {
      const value = item[col.key];
      // Format values
      if (value === null || value === undefined) return '';
      if (typeof value === 'number') return value;
      return String(value);
    })
  );

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Set column widths
  ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  // Generate filename with date
  const date = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${date}.xlsx`;

  // Download
  XLSX.writeFile(wb, fullFilename);
};

// Export data to PDF
export const exportToPDF = (
  data: any[],
  columns: ExportColumn[],
  title: string,
  filename: string = 'export'
) => {
  // Create PDF document (landscape for more columns)
  const doc = new jsPDF({
    orientation: columns.length > 5 ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add title
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 20);

  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Generated: ${date}`, 14, 28);

  // Prepare table data
  const headers = columns.map(col => col.header);
  const rows = data.map(item => 
    columns.map(col => {
      const value = item[col.key];
      if (value === null || value === undefined) return '';
      if (typeof value === 'number') {
        // Format currency
        if (col.key.includes('price') || col.key.includes('amount') || col.key.includes('cost') || col.key.includes('total') || col.key.includes('revenue')) {
          return `$${value.toFixed(2)}`;
        }
        return String(value);
      }
      return String(value);
    })
  );

  // Add table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 35,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [245, 158, 11], // amber-500
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // zinc-50
    },
    margin: { top: 35 },
  });

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | BEV Flow Inventory System`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${dateStr}.pdf`;

  // Download
  doc.save(fullFilename);
};

// Export dashboard summary to PDF
export const exportDashboardToPDF = (stats: any, title: string = 'Dashboard Report') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 20);

  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated: ${date}`, 14, 28);

  // Summary stats table
  let yPos = 40;
  
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Summary Statistics', 14, yPos);
  yPos += 8;

  const summaryData = [
    ['Total Products', String(stats.productCount || 0)],
    ['Total Suppliers', String(stats.supplierCount || 0)],
    ['Active Purchase Orders', String(stats.activePoCount || 0)],
    ['Today\'s Sales', `$${(stats.todaySales || 0).toFixed(2)}`],
    ['Today\'s Profit', `$${(stats.todayProfit || 0).toFixed(2)}`],
    ['Today\'s Orders', String(stats.todayOrders || 0)],
  ];

  autoTable(doc, {
    body: summaryData,
    startY: yPos,
    theme: 'grid',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 40, halign: 'right' },
    },
  });

  // Low stock products
  if (stats.lowStockProducts && stats.lowStockProducts.length > 0) {
    yPos = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(14);
    doc.text('Low Stock Alerts', 14, yPos);
    yPos += 8;

    autoTable(doc, {
      head: [['Product', 'Current Stock', 'Min Level']],
      body: stats.lowStockProducts.map((p: any) => [
        p.product_name,
        String(p.current_stock),
        String(p.min_stock_level)
      ]),
      startY: yPos,
      headStyles: {
        fillColor: [239, 68, 68], // red-500
        textColor: [255, 255, 255],
      },
    });
  }

  // Top products
  if (stats.topProducts && stats.topProducts.length > 0) {
    yPos = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(14);
    doc.text('Top Selling Products', 14, yPos);
    yPos += 8;

    autoTable(doc, {
      head: [['Product', 'Total Sold']],
      body: stats.topProducts.map((p: any) => [
        p.product_name,
        String(p.total_sold)
      ]),
      startY: yPos,
      headStyles: {
        fillColor: [34, 197, 94], // green-500
        textColor: [255, 255, 255],
      },
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | BEV Flow Inventory System`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`dashboard_report_${dateStr}.pdf`);
};
