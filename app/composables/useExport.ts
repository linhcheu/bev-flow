// Export composable for Excel and PDF
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

export const useExport = () => {
  // Export data to Excel
  const exportToExcel = (
    data: any[],
    columns: ExportColumn[],
    filename: string = 'export'
  ) => {
    // Prepare data with headers
    const headers = columns.map(col => col.header);
    const rows = data.map(item => 
      columns.map(col => {
        const value = item[col.key];
        if (value === null || value === undefined) return '';
        if (typeof value === 'number') return value;
        return String(value);
      })
    );

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    // Download
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `${filename}_${date}.xlsx`);
  };

  // Export data to PDF
  const exportToPDF = (
    data: any[],
    columns: ExportColumn[],
    title: string,
    filename: string = 'export'
  ) => {
    const doc = new jsPDF({
      orientation: columns.length > 5 ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 20);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    doc.text(`Generated: ${date}`, 14, 28);

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

    // Add table
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 35,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: {
        fillColor: [245, 158, 11],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount} | BEV Flow`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`${filename}_${dateStr}.pdf`);
  };

  // Export dashboard summary
  const exportDashboardPDF = (stats: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');

    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Dashboard Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    doc.text(`Generated: ${date}`, 14, 28);

    let yPos = 40;
    
    // Summary stats
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Summary Statistics', 14, yPos);
    yPos += 8;

    const summaryData = [
      ['Total Products', String(stats.productCount || 0)],
      ['Total Suppliers', String(stats.supplierCount || 0)],
      ['Active POs', String(stats.activePoCount || 0)],
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

    // Low stock
    if (stats.lowStockProducts?.length > 0) {
      yPos = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text('Low Stock Alerts', 14, yPos);

      autoTable(doc, {
        head: [['Product', 'Stock', 'Min Level']],
        body: stats.lowStockProducts.map((p: any) => [
          p.product_name, String(p.current_stock), String(p.min_stock_level)
        ]),
        startY: yPos + 8,
        headStyles: { fillColor: [239, 68, 68] },
      });
    }

    // Top products
    if (stats.topProducts?.length > 0) {
      yPos = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text('Top Selling Products', 14, yPos);

      autoTable(doc, {
        head: [['Product', 'Total Sold']],
        body: stats.topProducts.map((p: any) => [p.product_name, String(p.total_sold)]),
        startY: yPos + 8,
        headStyles: { fillColor: [34, 197, 94] },
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount} | BEV Flow`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
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
  const exportSaleReceipt = (sale: any) => {
    const items = sale.items || [{ 
      product: sale.product, 
      quantity: sale.quantity, 
      unit_price: sale.unit_price,
      amount: sale.total_amount 
    }];
    
    // Calculate height based on number of items
    const baseHeight = 160;
    const itemHeight = 14;
    const pageHeight = Math.max(baseHeight + (items.length * itemHeight), 200);
    
    const doc = new jsPDF('portrait', 'mm', [80, pageHeight]); // Receipt size
    const pageWidth = 80;
    let y = 10;

    // Header with Logo Placeholder
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 0, pageWidth, 22, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BEV FLOW', pageWidth / 2, 10, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Karaoke Inventory System', pageWidth / 2, 16, { align: 'center' });
    
    y = 30;
    doc.setTextColor(0, 0, 0);

    // Invoice info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SALES INVOICE', pageWidth / 2, y, { align: 'center' });
    y += 6;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice: ${sale.invoice_number}`, 5, y);
    y += 4;
    const saleDate = new Date(sale.sale_date).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
    doc.text(`Date: ${saleDate}`, 5, y);
    y += 4;
    doc.text(`Customer: ${sale.customer_name || 'Walk-in Customer'}`, 5, y);
    y += 6;

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(5, y, pageWidth - 5, y);
    y += 5;

    // Item header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('Item', 5, y);
    doc.text('Qty', 42, y, { align: 'right' });
    doc.text('Price', 55, y, { align: 'right' });
    doc.text('Amount', pageWidth - 5, y, { align: 'right' });
    y += 3;
    doc.line(5, y, pageWidth - 5, y);
    y += 4;

    // Items
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    
    items.forEach((item: any) => {
      const productName = item.product?.product_name || 'Product';
      const truncatedName = productName.length > 22 ? productName.substring(0, 19) + '...' : productName;
      const amount = item.amount || (item.quantity * item.unit_price);
      
      doc.text(truncatedName, 5, y);
      doc.text(String(item.quantity), 42, y, { align: 'right' });
      doc.text(`$${Number(item.unit_price).toFixed(2)}`, 55, y, { align: 'right' });
      doc.text(`$${Number(amount).toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
      y += 5;
    });

    y += 2;
    doc.line(5, y, pageWidth - 5, y);
    y += 5;

    // Subtotal if multiple items
    if (items.length > 1) {
      doc.setFontSize(8);
      doc.text('Subtotal:', 40, y, { align: 'right' });
      doc.text(`$${Number(sale.subtotal || sale.total_amount).toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
      y += 5;
    }

    // Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TOTAL:', 40, y, { align: 'right' });
    doc.text(`$${Number(sale.total_amount).toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
    y += 8;

    // Notes
    if (sale.notes) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text('Notes:', 5, y);
      y += 3;
      const splitNotes = doc.splitTextToSize(sale.notes, pageWidth - 10);
      doc.text(splitNotes, 5, y);
      y += splitNotes.length * 3 + 3;
    }

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.line(5, y, pageWidth - 5, y);
    y += 4;
    doc.text('Thank you for your business!', pageWidth / 2, y, { align: 'center' });
    y += 3;
    const printDate = new Date().toLocaleString('en-US');
    doc.text(`Printed: ${printDate}`, pageWidth / 2, y, { align: 'center' });

    doc.save(`invoice_${sale.invoice_number}.pdf`);
  };

  // Export single sale as Excel
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
    
    // Create header rows
    const headerData = [
      ['BEV FLOW - Sales Invoice'],
      [''],
      ['Invoice Number:', sale.invoice_number],
      ['Date:', saleDate],
      ['Customer:', sale.customer_name || 'Walk-in Customer'],
      [''],
      ['Product', 'SKU', 'Quantity', 'Unit Price', 'Amount'],
    ];
    
    // Add item rows
    const itemRows = items.map((item: any) => [
      item.product?.product_name || 'Product',
      item.product?.sku || 'N/A',
      item.quantity,
      Number(item.unit_price).toFixed(2),
      Number(item.amount || item.quantity * item.unit_price).toFixed(2),
    ]);
    
    // Add total rows
    const totalRows = [
      [''],
      ['', '', '', 'Subtotal:', Number(sale.subtotal || sale.total_amount).toFixed(2)],
      ['', '', '', 'TOTAL:', Number(sale.total_amount).toFixed(2)],
    ];
    
    // Add notes if any
    if (sale.notes) {
      totalRows.push(['']);
      totalRows.push(['Notes:', sale.notes, '', '', '']);
    }
    
    const allData = [...headerData, ...itemRows, ...totalRows];
    
    const ws = XLSX.utils.aoa_to_sheet(allData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // Product
      { wch: 15 }, // SKU
      { wch: 10 }, // Quantity
      { wch: 12 }, // Unit Price
      { wch: 12 }, // Amount
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
    XLSX.writeFile(wb, `invoice_${sale.invoice_number}.xlsx`);
  };

  // Export single product as detail PDF
  const exportProductDetail = (product: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    let y = 20;

    // Header
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Product Details', 20, 25);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('BEV Flow Inventory System', 20, 33);
    
    y = 55;
    doc.setTextColor(40, 40, 40);

    // Product name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(product.product_name, 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`SKU: ${product.sku || 'N/A'}`, 20, y);
    y += 15;

    // Details table
    doc.setTextColor(40, 40, 40);
    const details = [
      ['Category', product.category || 'Uncategorized'],
      ['Supplier', product.supplier?.company_name || 'N/A'],
      ['Cost Price', `$${Number(product.cost_price || 0).toFixed(2)}`],
      ['Selling Price', `$${Number(product.selling_price || 0).toFixed(2)}`],
      ['Profit Margin', `$${(Number(product.selling_price || 0) - Number(product.cost_price || 0)).toFixed(2)}`],
      ['Current Stock', String(product.current_stock || 0)],
      ['Min Stock Level', String(product.min_stock_level || 0)],
      ['Status', (product.current_stock || 0) <= (product.min_stock_level || 0) ? 'Low Stock' : 'In Stock'],
    ];

    autoTable(doc, {
      body: details,
      startY: y,
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50, textColor: [100, 100, 100] },
        1: { cellWidth: 100 },
      },
    });

    // Description
    if (product.description) {
      y = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Description', 20, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      const splitDesc = doc.splitTextToSize(product.description, 170);
      doc.text(splitDesc, 20, y);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated: ${new Date().toLocaleString('en-US')} | BEV Flow`,
      105,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );

    doc.save(`product_${product.sku || product.product_id}.pdf`);
  };

  // Export single supplier as detail PDF
  const exportSupplierDetail = (supplier: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    let y = 20;

    // Header
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Supplier Profile', 20, 25);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('BEV Flow Inventory System', 20, 33);
    
    y = 55;
    doc.setTextColor(40, 40, 40);

    // Company name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(supplier.company_name, 20, y);
    y += 15;

    // Contact details
    doc.setTextColor(40, 40, 40);
    const details = [
      ['Contact Person', supplier.contact_person || 'N/A'],
      ['Sales Agent', supplier.sale_agent || 'N/A'],
      ['Phone', supplier.phone || 'N/A'],
      ['Email', supplier.email || 'N/A'],
      ['Address', supplier.address || 'N/A'],
      ['Lead Time', supplier.lead_time_days ? `${supplier.lead_time_days} days` : 'N/A'],
      ['Products Supplied', supplier.products || 'N/A'],
      ['Status', supplier.is_active ? 'Active' : 'Inactive'],
    ];

    autoTable(doc, {
      body: details,
      startY: y,
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50, textColor: [100, 100, 100] },
        1: { cellWidth: 120 },
      },
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated: ${new Date().toLocaleString('en-US')} | BEV Flow`,
      105,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );

    doc.save(`supplier_${supplier.company_name.replace(/\s+/g, '_')}.pdf`);
  };

  // Export single purchase order as detail PDF
  const exportPurchaseOrderDetail = (po: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    let y = 20;

    // Header
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Purchase Order', 20, 25);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('BEV Flow Inventory System', 20, 33);
    
    y = 55;
    doc.setTextColor(40, 40, 40);

    // PO Number
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`PO #${po.po_number}`, 20, y);
    
    // Status badge
    const statusColors: Record<string, [number, number, number]> = {
      'Pending': [234, 179, 8],
      'Ordered': [59, 130, 246],
      'Shipped': [168, 85, 247],
      'Received': [34, 197, 94],
      'Cancelled': [239, 68, 68],
    };
    const statusColor: [number, number, number] = statusColors[po.status] || [100, 100, 100];
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(140, y - 6, 50, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(po.status, 165, y, { align: 'center' });
    
    y += 15;
    doc.setTextColor(40, 40, 40);

    // Order details
    const orderDate = po.order_date ? new Date(po.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    const etaDate = po.eta_date ? new Date(po.eta_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    
    const details = [
      ['Supplier', po.supplier?.company_name || 'N/A'],
      ['Order Date', orderDate],
      ['ETA Date', etaDate],
      ['Third Party Agent', po.third_party_agent || 'N/A'],
      ['Agent Phone', po.agent_phone || 'N/A'],
      ['Truck Remark', po.truck_remark || 'N/A'],
    ];

    autoTable(doc, {
      body: details,
      startY: y,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 45, textColor: [100, 100, 100] },
        1: { cellWidth: 100 },
      },
    });

    // Items table
    if (po.items && po.items.length > 0) {
      y = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Order Items', 20, y);
      y += 5;

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
        headStyles: { fillColor: [245, 158, 11] },
        styles: { fontSize: 9 },
      });
    }

    // Totals
    y = (doc as any).lastAutoTable.finalY + 10;
    const totals = [
      ['Subtotal', `$${Number(po.subtotal || 0).toFixed(2)}`],
      ['Shipping', `$${Number(po.shipping_cost || 0).toFixed(2)}`],
      ['Promotion', `-$${Number(po.promotion_amount || 0).toFixed(2)}`],
      ['TOTAL', `$${Number(po.total_amount || 0).toFixed(2)}`],
    ];

    autoTable(doc, {
      body: totals,
      startY: y,
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 130, halign: 'right' },
        1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
      },
      didParseCell: (data: any) => {
        if (data.row.index === 3) {
          data.cell.styles.fontSize = 12;
          data.cell.styles.textColor = [245, 158, 11];
        }
      },
    });

    // Remarks
    if (po.overall_remark) {
      y = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Remarks:', 20, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      const splitRemark = doc.splitTextToSize(po.overall_remark, 170);
      doc.text(splitRemark, 20, y);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated: ${new Date().toLocaleString('en-US')} | BEV Flow`,
      105,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );

    doc.save(`PO_${po.po_number}.pdf`);
  };

  // Export single forecast as detail PDF
  const exportForecastDetail = (forecast: any) => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    let y = 20;

    // Header
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Sales Forecast', 20, 25);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('BEV Flow AI-Powered Prediction', 20, 33);
    
    y = 55;
    doc.setTextColor(40, 40, 40);

    // Product name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(forecast.product?.product_name || 'Unknown Product', 20, y);
    y += 15;

    // Forecast details
    const details = [
      ['Forecast Period', forecast.forecast_period || 'N/A'],
      ['Predicted Quantity', String(forecast.predicted_quantity || 0)],
      ['Confidence Score', `${forecast.confidence_score || 0}%`],
      ['Current Stock', String(forecast.product?.current_stock || 0)],
      ['Min Stock Level', String(forecast.product?.min_stock_level || 0)],
      ['Restock Needed', (forecast.predicted_quantity > (forecast.product?.current_stock || 0)) ? 'Yes' : 'No'],
      ['Forecast Date', forecast.forecast_date ? new Date(forecast.forecast_date).toLocaleDateString('en-US') : 'N/A'],
    ];

    autoTable(doc, {
      body: details,
      startY: y,
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 55, textColor: [100, 100, 100] },
        1: { cellWidth: 80 },
      },
    });

    // Recommendation section
    y = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Recommendation', 20, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    const currentStock = forecast.product?.current_stock || 0;
    const predicted = forecast.predicted_quantity || 0;
    const minLevel = forecast.product?.min_stock_level || 0;
    
    let recommendation = '';
    if (predicted > currentStock) {
      const reorderQty = predicted - currentStock + minLevel;
      recommendation = `Based on the forecast, consider ordering ${reorderQty} units to meet predicted demand and maintain safety stock.`;
    } else {
      recommendation = 'Current stock levels appear sufficient to meet predicted demand.';
    }
    
    const splitRec = doc.splitTextToSize(recommendation, 170);
    doc.text(splitRec, 20, y);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated: ${new Date().toLocaleString('en-US')} | BEV Flow`,
      105,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );

    doc.save(`forecast_${forecast.product?.product_name?.replace(/\s+/g, '_') || forecast.forecast_id}.pdf`);
  };

  // Excel export for product detail
  const exportProductDetailExcel = (product: any) => {
    const data = [
      ['BEV FLOW - Product Details'],
      [''],
      ['Product Name:', product.product_name],
      ['SKU:', product.sku || 'N/A'],
      ['Category:', product.category || 'Uncategorized'],
      [''],
      ['Pricing'],
      ['Cost Price:', `$${Number(product.cost_price || 0).toFixed(2)}`],
      ['Selling Price:', `$${Number(product.selling_price || 0).toFixed(2)}`],
      ['Profit Margin:', `$${(Number(product.selling_price || 0) - Number(product.cost_price || 0)).toFixed(2)}`],
      [''],
      ['Inventory'],
      ['Current Stock:', product.current_stock || 0],
      ['Min Stock Level:', product.min_stock_level || 0],
      ['Status:', (product.current_stock || 0) <= (product.min_stock_level || 0) ? 'Low Stock' : 'In Stock'],
      [''],
      ['Supplier:', product.supplier?.company_name || 'N/A'],
      ['Description:', product.description || 'N/A'],
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 20 }, { wch: 30 }];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Product');
    XLSX.writeFile(wb, `product_${product.sku || product.product_id}.xlsx`);
  };

  // Excel export for supplier detail
  const exportSupplierDetailExcel = (supplier: any) => {
    const data = [
      ['BEV FLOW - Supplier Profile'],
      [''],
      ['Company Name:', supplier.company_name],
      ['Contact Person:', supplier.contact_person || 'N/A'],
      ['Sales Agent:', supplier.sale_agent || 'N/A'],
      ['Phone:', supplier.phone || 'N/A'],
      ['Email:', supplier.email || 'N/A'],
      ['Address:', supplier.address || 'N/A'],
      ['Lead Time:', supplier.lead_time_days ? `${supplier.lead_time_days} days` : 'N/A'],
      ['Products Supplied:', supplier.products || 'N/A'],
      ['Status:', supplier.is_active ? 'Active' : 'Inactive'],
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 20 }, { wch: 40 }];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Supplier');
    XLSX.writeFile(wb, `supplier_${supplier.company_name.replace(/\s+/g, '_')}.xlsx`);
  };

  // Excel export for purchase order detail
  const exportPurchaseOrderDetailExcel = (po: any) => {
    const orderDate = po.order_date ? new Date(po.order_date).toLocaleDateString('en-US') : 'N/A';
    const etaDate = po.eta_date ? new Date(po.eta_date).toLocaleDateString('en-US') : 'N/A';
    
    const headerData = [
      ['BEV FLOW - Purchase Order'],
      [''],
      ['PO Number:', po.po_number],
      ['Status:', po.status],
      ['Supplier:', po.supplier?.company_name || 'N/A'],
      ['Order Date:', orderDate],
      ['ETA Date:', etaDate],
      [''],
      ['Order Items'],
      ['Product', 'Quantity', 'Unit Cost', 'Amount'],
    ];
    
    const items = po.items || [];
    const itemRows = items.map((item: any) => [
      item.product?.product_name || 'N/A',
      item.quantity,
      Number(item.unit_cost).toFixed(2),
      Number(item.amount).toFixed(2),
    ]);
    
    const totalRows = [
      [''],
      ['', '', 'Subtotal:', Number(po.subtotal || 0).toFixed(2)],
      ['', '', 'Shipping:', Number(po.shipping_cost || 0).toFixed(2)],
      ['', '', 'Promotion:', `-${Number(po.promotion_amount || 0).toFixed(2)}`],
      ['', '', 'TOTAL:', Number(po.total_amount || 0).toFixed(2)],
    ];
    
    if (po.overall_remark) {
      totalRows.push(['']);
      totalRows.push(['Remarks:', po.overall_remark, '', '']);
    }
    
    const allData = [...headerData, ...itemRows, ...totalRows];
    
    const ws = XLSX.utils.aoa_to_sheet(allData);
    ws['!cols'] = [{ wch: 30 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Purchase Order');
    XLSX.writeFile(wb, `PO_${po.po_number}.xlsx`);
  };

  // Excel export for forecast detail
  const exportForecastDetailExcel = (forecast: any) => {
    const data = [
      ['BEV FLOW - Sales Forecast'],
      [''],
      ['Product:', forecast.product?.product_name || 'Unknown'],
      ['Forecast Period:', forecast.forecast_period || 'N/A'],
      ['Predicted Quantity:', forecast.predicted_quantity || 0],
      ['Confidence Score:', `${forecast.confidence_score || 0}%`],
      [''],
      ['Current Inventory'],
      ['Current Stock:', forecast.product?.current_stock || 0],
      ['Min Stock Level:', forecast.product?.min_stock_level || 0],
      [''],
      ['Recommendation:', 
        (forecast.predicted_quantity > (forecast.product?.current_stock || 0)) 
          ? `Reorder ${forecast.predicted_quantity - (forecast.product?.current_stock || 0)} units` 
          : 'Stock levels sufficient'
      ],
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 20 }, { wch: 40 }];
    
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
