import { createBillService } from "./service.js";

// POST /api/billing
export const createBill = async (req, res, next) => {
  try {
    const {
      customerId,
      items,
      taxAmount,
      discountAmount,
      paymentMethod,
    } = req.body;

    const result = await createBillService({
      customerId,
      userId: req.user.id,
      items,
      taxAmount,
      discountAmount,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      message: "Invoice generated successfully and stock deducted",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

