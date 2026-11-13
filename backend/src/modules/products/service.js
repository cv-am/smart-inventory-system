import {
  selectAllProducts,
  selectProductById,
  selectProductBySku,
  insertProduct,
  updateProductQuery,
  deleteProductQuery,
  selectLowStockProducts,
} from "./query.js";
import { selectCategoryById } from "../categories/query.js";
import { ApiError } from "../../utils/ApiError.js";

// Service: Get all products
export const getAllProductsService = async (filters) => {
  return await selectAllProducts(filters);
};

// Service: Get product by ID
export const getProductByIdService = async (id) => {
  const product = await selectProductById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

// Service: Create product
export const createProductService = async ({
  categoryId,
  name,
  sku,
  description,
  price,
  stockQuantity = 0,
  lowStockThreshold = 5,
}) => {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Product name is required");
  }
  if (!sku || !sku.trim()) {
    throw new ApiError(400, "Product SKU is required");
  }
  if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
    throw new ApiError(400, "Price must be a valid non-negative number");
  }
  if (stockQuantity !== undefined && (isNaN(stockQuantity) || Number(stockQuantity) < 0)) {
    throw new ApiError(400, "Stock quantity cannot be negative");
  }
  if (!categoryId) {
    throw new ApiError(400, "Category ID is required");
  }

  // Verify category exists
  const category = await selectCategoryById(categoryId);
  if (!category) {
    throw new ApiError(404, `Category with ID ${categoryId} does not exist`);
  }

  const cleanSku = sku.trim().toUpperCase();

  // Check unique SKU
  const existingProduct = await selectProductBySku(cleanSku);
  if (existingProduct) {
    throw new ApiError(409, `Product with SKU '${cleanSku}' already exists`);
  }

  const productId = await insertProduct({
    categoryId: Number(categoryId),
    name: name.trim(),
    sku: cleanSku,
    description: description ? description.trim() : null,
    price: Number(price),
    stockQuantity: Number(stockQuantity) || 0,
    lowStockThreshold: Number(lowStockThreshold) || 5,
  });

  return await selectProductById(productId);
};

// Service: Update product
export const updateProductService = async (id, data) => {
  const existingProduct = await selectProductById(id);
  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  const categoryId = data.categoryId !== undefined ? Number(data.categoryId) : existingProduct.category_id;
  const name = data.name !== undefined ? data.name.trim() : existingProduct.name;
  const sku = data.sku !== undefined ? data.sku.trim().toUpperCase() : existingProduct.sku;
  const description = data.description !== undefined ? data.description : existingProduct.description;
  const price = data.price !== undefined ? Number(data.price) : Number(existingProduct.price);
  const stockQuantity = data.stockQuantity !== undefined ? Number(data.stockQuantity) : existingProduct.stock_quantity;
  const lowStockThreshold = data.lowStockThreshold !== undefined ? Number(data.lowStockThreshold) : existingProduct.low_stock_threshold;

  if (!name) {
    throw new ApiError(400, "Product name cannot be empty");
  }
  if (!sku) {
    throw new ApiError(400, "Product SKU cannot be empty");
  }
  if (isNaN(price) || price < 0) {
    throw new ApiError(400, "Price must be a valid non-negative number");
  }
  if (isNaN(stockQuantity) || stockQuantity < 0) {
    throw new ApiError(400, "Stock quantity cannot be negative");
  }

  // If category changed, verify it exists
  if (categoryId !== existingProduct.category_id) {
    const category = await selectCategoryById(categoryId);
    if (!category) {
      throw new ApiError(404, `Category with ID ${categoryId} does not exist`);
    }
  }

  // If SKU changed, verify not in use by another product
  if (sku !== existingProduct.sku) {
    const duplicateSku = await selectProductBySku(sku);
    if (duplicateSku && duplicateSku.id !== Number(id)) {
      throw new ApiError(409, `Product with SKU '${sku}' already exists`);
    }
  }

  await updateProductQuery(id, {
    categoryId,
    name,
    sku,
    description: description ? description.trim() : null,
    price,
    stockQuantity,
    lowStockThreshold,
  });

  return await selectProductById(id);
};

// Service: Delete product
export const deleteProductService = async (id) => {
  const existingProduct = await selectProductById(id);
  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  try {
    await deleteProductQuery(id);
    return true;
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new ApiError(
        400,
        "Cannot delete this product because it has associated invoice/billing history"
      );
    }
    throw error;
  }
};

// Service: Get low-stock alert products
export const getLowStockProductsService = async () => {
  return await selectLowStockProducts();
};

