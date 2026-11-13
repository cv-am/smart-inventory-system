import { getDashboardDataService } from "./service.js";

// GET /api/dashboard
export const getDashboardData = async (req, res, next) => {
  try {
    const data = await getDashboardDataService();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

