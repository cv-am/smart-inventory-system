import {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "./service.js";

// GET all categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesService();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// GET category by ID
export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await getCategoryByIdService(id);
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// POST create category
export const addCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const categoryId = await createCategoryService(name, description);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      categoryId,
    });
  } catch (error) {
    next(error);
  }
};

// PUT update category
export const editCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await updateCategoryService(id, name, description);
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE category
export const removeCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteCategoryService(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

