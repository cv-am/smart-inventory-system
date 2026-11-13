import pool from "../../config/db.js";

// Fetch all customers with optional search by name or phone
export const selectAllCustomers = async (search = "") => {
  let query = `
    SELECT 
      c.id,
      c.name,
      c.phone,
      c.email,
      c.address,
      c.created_at,
      COUNT(b.id) AS total_orders,
      COALESCE(SUM(b.total_amount), 0) AS total_spent
    FROM customers c
    LEFT JOIN bills b ON c.id = b.customer_id
    WHERE 1=1
  `;
  const params = [];

  if (search && search.trim()) {
    query += ` AND (c.name LIKE ? OR c.phone LIKE ?)`;
    const term = `%${search.trim()}%`;
    params.push(term, term);
  }

  query += ` GROUP BY c.id ORDER BY c.id DESC`;

  const [rows] = await pool.execute(query, params);
  return rows;
};

// Fetch single customer by ID
export const selectCustomerById = async (id) => {
  const query = `
    SELECT id, name, phone, email, address, created_at 
    FROM customers 
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
};

// Fetch customer purchase history (bills)
export const selectCustomerBills = async (customerId) => {
  const query = `
    SELECT 
      b.id,
      b.invoice_number,
      b.subtotal,
      b.tax_amount,
      b.discount_amount,
      b.total_amount,
      b.payment_method,
      b.created_at
    FROM bills b
    WHERE b.customer_id = ?
    ORDER BY b.id DESC
  `;
  const [rows] = await pool.execute(query, [customerId]);
  return rows;
};

// Find customer by phone
export const selectCustomerByPhone = async (phone) => {
  const [rows] = await pool.execute(
    "SELECT * FROM customers WHERE phone = ?",
    [phone]
  );
  return rows[0] || null;
};

// Insert a customer
export const insertCustomer = async ({ name, phone, email, address }) => {
  const [result] = await pool.execute(
    "INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)",
    [name, phone, email, address]
  );
  return result.insertId;
};

// Update a customer
export const updateCustomerQuery = async (id, { name, phone, email, address }) => {
  const [result] = await pool.execute(
    "UPDATE customers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?",
    [name, phone, email, address, id]
  );
  return result.affectedRows > 0;
};

// Delete a customer
export const deleteCustomerQuery = async (id) => {
  const [result] = await pool.execute(
    "DELETE FROM customers WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

