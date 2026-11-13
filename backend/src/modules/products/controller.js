import {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
  getLowStockProductsService,
} from "./service.js";

// GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { search, categoryId } = req.query;
    const products = await getAllProductsService({ search, categoryId });
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const {
      categoryId,
      name,
      sku,
      description,
      price,
      stockQuantity,
      lowStockThreshold,
    } = req.body;

    const product = await createProductService({
      categoryId,
      name,
      sku,
      description,
      price,
      stockQuantity,
      lowStockThreshold,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await updateProductService(id, req.body);
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteProductService(id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/alerts/low-stock
export const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await getLowStockProductsService();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

