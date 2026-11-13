import {
  getInventoryListService,
  getInventorySummaryService,
  adjustStockService,
} from "./service.js";

// GET /api/inventory
export const getInventory = async (req, res, next) => {
  try {
    const items = await getInventoryListService();
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/inventory/summary
export const getInventorySummary = async (req, res, next) => {
  try {
    const summary = await getInventorySummaryService();
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/inventory/adjust
export const adjustStock = async (req, res, next) => {
  try {
    const { productId, type, quantity } = req.body;
    const result = await adjustStockService({ productId, type, quantity });
    res.status(200).json({
      success: true,
      message: "Stock adjusted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

