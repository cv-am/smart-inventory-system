import pool from "../../config/db.js";

// Fetch sales invoices with customer name and seller name
export const selectAllSales = async ({ search = "", fromDate = null, toDate = null } = {}) => {
  let query = `
    SELECT 
      b.id,
      b.invoice_number,
      b.customer_id,
      COALESCE(c.name, 'Walk-in Customer') AS customer_name,
      c.phone AS customer_phone,
      b.user_id,
      u.name AS billed_by,
      b.subtotal,
      b.tax_amount,
      b.discount_amount,
      b.total_amount,
      b.payment_method,
      b.created_at,
      COUNT(bi.id) AS total_items,
      COALESCE(SUM(bi.quantity), 0) AS total_units_sold
    FROM bills b
    LEFT JOIN customers c ON b.customer_id = c.id
    LEFT JOIN users u ON b.user_id = u.id
    LEFT JOIN bill_items bi ON b.id = bi.bill_id
    WHERE 1=1
  `;
  const params = [];

  if (search && search.trim()) {
    query += ` AND (b.invoice_number LIKE ? OR c.name LIKE ? OR c.phone LIKE ?)`;
    const term = `%${search.trim()}%`;
    params.push(term, term, term);
  }

  if (fromDate) {
    query += ` AND DATE(b.created_at) >= ?`;
    params.push(fromDate);
  }

  if (toDate) {
    query += ` AND DATE(b.created_at) <= ?`;
    params.push(toDate);
  }

  query += ` GROUP BY b.id ORDER BY b.id DESC`;

  const [rows] = await pool.execute(query, params);
  return rows;
};

// Fetch full invoice header
export const selectSaleById = async (id) => {
  const query = `
    SELECT 
      b.id,
      b.invoice_number,
      b.customer_id,
      COALESCE(c.name, 'Walk-in Customer') AS customer_name,
      c.phone AS customer_phone,
      c.email AS customer_email,
      c.address AS customer_address,
      b.user_id,
      u.name AS billed_by,
      u.email AS billed_by_email,
      b.subtotal,
      b.tax_amount,
      b.discount_amount,
      b.total_amount,
      b.payment_method,
      b.created_at
    FROM bills b
    LEFT JOIN customers c ON b.customer_id = c.id
    LEFT JOIN users u ON b.user_id = u.id
    WHERE b.id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
};

// Fetch bill line items
export const selectSaleItems = async (billId) => {
  const query = `
    SELECT 
      bi.id,
      bi.product_id,
      p.name AS product_name,
      p.sku,
      bi.quantity,
      bi.unit_price,
      bi.subtotal
    FROM bill_items bi
    LEFT JOIN products p ON bi.product_id = p.id
    WHERE bi.bill_id = ?
    ORDER BY bi.id ASC
  `;
  const [rows] = await pool.execute(query, [billId]);
  return rows;
};

