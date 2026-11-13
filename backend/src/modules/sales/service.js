import {
  selectAllSales,
  selectSaleById,
  selectSaleItems,
} from "./query.js";
import { ApiError } from "../../utils/ApiError.js";

// Service: List all sales transactions
export const getAllSalesService = async (filters) => {
  return await selectAllSales(filters);
};

// Service: Get full invoice details for printable view
export const getSaleByIdService = async (id) => {
  const invoice = await selectSaleById(id);
  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  const items = await selectSaleItems(id);

  return {
    ...invoice,
    items,
  };
};

