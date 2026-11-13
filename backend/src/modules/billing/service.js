import {
  getTransactionConnection,
  insertBillRecord,
  insertBillItemRecord,
  deductProductStock,
} from "./query.js";
import { generateInvoiceNumber } from "../../utils/generateInvoice.js";
import { ApiError } from "../../utils/ApiError.js";

// Service: Process checkout & generate invoice with MySQL transaction
export const createBillService = async ({
  customerId = null,
  userId,
  items,
  taxAmount = 0,
  discountAmount = 0,
  paymentMethod = "cash",
}) => {
  if (!userId) {
    throw new ApiError(401, "User authentication required to generate a bill");
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Bill must contain at least one product item");
  }

  const validPaymentMethods = ["cash", "upi", "card"];
  if (!validPaymentMethods.includes(paymentMethod)) {
    throw new ApiError(
      400,
      `Invalid payment method '${paymentMethod}'. Allowed: ${validPaymentMethods.join(", ")}`
    );
  }

  const connection = await getTransactionConnection();

  try {
    // 1. Start atomic transaction
    await connection.beginTransaction();

    let calculatedSubtotal = 0;
    const verifiedItems = [];

    // 2. Validate all products and check stock availability
    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);

      if (!productId || isNaN(productId)) {
        throw new ApiError(400, "Invalid productId in bill items");
      }
      if (!quantity || isNaN(quantity) || quantity <= 0) {
        throw new ApiError(400, `Quantity for product ID ${productId} must be greater than 0`);
      }

      // Lock row for update to prevent concurrent race conditions
      const [productRows] = await connection.execute(
        "SELECT id, name, sku, price, stock_quantity FROM products WHERE id = ? FOR UPDATE",
        [productId]
      );

      const product = productRows[0];
      if (!product) {
        throw new ApiError(404, `Product ID ${productId} does not exist`);
      }

      if (product.stock_quantity < quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for '${product.name}' (SKU: ${product.sku}). Available: ${product.stock_quantity}, requested: ${quantity}`
        );
      }

      const unitPrice = Number(product.price);
      const lineSubtotal = unitPrice * quantity;
      calculatedSubtotal += lineSubtotal;

      verifiedItems.push({
        productId,
        productName: product.name,
        sku: product.sku,
        quantity,
        unitPrice,
        subtotal: lineSubtotal,
      });
    }

    const numericTax = Number(taxAmount) || 0;
    const numericDiscount = Number(discountAmount) || 0;

    if (numericTax < 0 || numericDiscount < 0) {
      throw new ApiError(400, "Tax and discount cannot be negative");
    }

    const calculatedTotal = calculatedSubtotal + numericTax - numericDiscount;
    if (calculatedTotal < 0) {
      throw new ApiError(400, "Total amount after discount cannot be negative");
    }

    const invoiceNumber = generateInvoiceNumber();

    // 3. Insert bill header record
    const billId = await insertBillRecord(connection, {
      invoiceNumber,
      customerId: customerId ? Number(customerId) : null,
      userId: Number(userId),
      subtotal: calculatedSubtotal,
      taxAmount: numericTax,
      discountAmount: numericDiscount,
      totalAmount: calculatedTotal,
      paymentMethod,
    });

    // 4. Insert each line item and deduct stock
    for (const item of verifiedItems) {
      await insertBillItemRecord(connection, {
        billId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      });

      const stockDeducted = await deductProductStock(
        connection,
        item.productId,
        item.quantity
      );

      if (!stockDeducted) {
        throw new ApiError(
          500,
          `Failed to update stock for product '${item.productName}'`
        );
      }
    }

    // 5. Commit atomic transaction
    await connection.commit();

    return {
      billId,
      invoiceNumber,
      subtotal: calculatedSubtotal,
      taxAmount: numericTax,
      discountAmount: numericDiscount,
      totalAmount: calculatedTotal,
      paymentMethod,
      items: verifiedItems,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    // If any error occurs, rollback all database changes to preserve data consistency
    await connection.rollback();
    throw error;
  } finally {
    // Always release the connection back to the pool
    connection.release();
  }
};

