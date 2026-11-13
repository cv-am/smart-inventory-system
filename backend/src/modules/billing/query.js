import pool from "../../config/db.js";

// Helper to get connection from pool for transactions
export const getTransactionConnection = async () => {
  return await pool.getConnection();
};

// Insert a bill header record (inside connection transaction)
export const insertBillRecord = async (
  connection,
  {
    invoiceNumber,
    customerId,
    userId,
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount,
    paymentMethod,
  }
) => {
  const [result] = await connection.execute(
    `INSERT INTO bills 
      (invoice_number, customer_id, user_id, subtotal, tax_amount, discount_amount, total_amount, payment_method) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      invoiceNumber,
      customerId,
      userId,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      paymentMethod,
    ]
  );
  return result.insertId;
};

// Insert a single line item for a bill (inside connection transaction)
export const insertBillItemRecord = async (
  connection,
  { billId, productId, quantity, unitPrice, subtotal }
) => {
  const [result] = await connection.execute(
    `INSERT INTO bill_items 
      (bill_id, product_id, quantity, unit_price, subtotal) 
     VALUES (?, ?, ?, ?, ?)`,
    [billId, productId, quantity, unitPrice, subtotal]
  );
  return result.insertId;
};

// Deduct product stock within a transaction
export const deductProductStock = async (connection, productId, quantity) => {
  const [result] = await connection.execute(
    `UPDATE products 
     SET stock_quantity = stock_quantity - ? 
     WHERE id = ? AND stock_quantity >= ?`,
    [quantity, productId, quantity]
  );
  return result.affectedRows > 0;
};

