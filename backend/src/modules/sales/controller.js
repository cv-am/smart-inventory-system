import { getAllSalesService, getSaleByIdService } from "./service.js";

// GET /api/sales
export const getSales = async (req, res, next) => {
  try {
    const { search, fromDate, toDate } = req.query;
    const sales = await getAllSalesService({ search, fromDate, toDate });
    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/sales/:id
export const getSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoice = await getSaleByIdService(id);
    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

