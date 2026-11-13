import {
  selectInventoryList,
  updateProductStock,
  selectInventorySummary,
} from "./query.js";
import { selectProductById } from "../products/query.js";
import { ApiError } from "../../utils/ApiError.js";

// Service: Get full inventory list
export const getInventoryListService = async () => {
  return await selectInventoryList();
};

// Service: Get inventory summary statistics
export const getInventorySummaryService = async () => {
  return await selectInventorySummary();
};

// Service: Adjust stock quantity (add, subtract, or set)
export const adjustStockService = async ({ productId, type, quantity }) => {
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }
  if (quantity === undefined || isNaN(quantity) || Number(quantity) < 0) {
    throw new ApiError(400, "Quantity must be a positive number");
  }

  const product = await selectProductById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const currentStock = Number(product.stock_quantity);
  const qty = Number(quantity);
  let newStock = currentStock;

  if (type === "add") {
    newStock = currentStock + qty;
  } else if (type === "subtract") {
    if (currentStock < qty) {
      throw new ApiError(
        400,
        `Cannot subtract ${qty} units. Current stock is only ${currentStock}`
      );
    }
    newStock = currentStock - qty;
  } else if (type === "set") {
    newStock = qty;
  } else {
    throw new ApiError(400, "Invalid adjustment type. Must be 'add', 'subtract', or 'set'");
  }

  await updateProductStock(productId, newStock);

  return {
    productId,
    productName: product.name,
    sku: product.sku,
    previousStock: currentStock,
    currentStock: newStock,
    adjustmentType: type,
  };
};

