// Sample API endpoint for products
// This demonstrates the structure - you'll need to connect to your actual MySQL database

export default defineEventHandler(async (event) => {
  // TODO: Replace with actual database connection
  
  /*
  const db = await connectToDatabase();
  
  const [rows] = await db.query(`
    SELECT p.*, s.company_name as supplier_name,
           (p.selling_price - p.cost_price) as profit
    FROM Products p
    LEFT JOIN Suppliers s ON p.supplier_id = s.supplier_id
  `);
  
  return rows;
  */
  
  // Mock data for development
  return [
    {
      product_id: 1,
      sku: 'A005',
      product_name: 'Sample Product 1',
      description: 'Product description here',
      cost_price: 10.00,
      selling_price: 15.00,
      supplier_id: 1,
      supplier: {
        supplier_id: 1,
        company_name: 'ABC Suppliers Inc.'
      }
    },
    {
      product_id: 2,
      sku: 'A002',
      product_name: 'Sample Product 2',
      description: 'Another product',
      cost_price: 20.00,
      selling_price: 30.00,
      supplier_id: 2,
      supplier: {
        supplier_id: 2,
        company_name: 'XYZ Wholesale'
      }
    }
  ];
});
