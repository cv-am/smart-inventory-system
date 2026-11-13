import {
  selectAllCategories,
  selectCategoryById,
  insertCategory,
  updateCategoryQuery,
  deleteCategoryQuery,
} from "./query.js";
import { ApiError } from "../../utils/ApiError.js";

// Service: Get all categories
export const getAllCategoriesService = async () => {
  return await selectAllCategories();
};

// Service: Get single category by ID
export const getCategoryByIdService = async (id) => {
  const category = await selectCategoryById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return category;
};

// Service: Create a category
export const createCategoryService = async (name, description) => {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  try {
    const categoryId = await insertCategory(
      name.trim(),
      description ? description.trim() : null
    );
    return categoryId;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new ApiError(409, "Category already exists");
    }
    throw error;
  }
};

// Service: Update category
export const updateCategoryService = async (id, name, description) => {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  try {
    const updated = await updateCategoryQuery(
      id,
      name.trim(),
      description ? description.trim() : null
    );
    if (!updated) {
      throw new ApiError(404, "Category not found");
    }
    return true;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new ApiError(409, "Category already exists");
    }
    throw error;
  }
};

// Service: Delete category
export const deleteCategoryService = async (id) => {
  try {
    const deleted = await deleteCategoryQuery(id);
    if (!deleted) {
      throw new ApiError(404, "Category not found");
    }
    return true;
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new ApiError(400, "Cannot delete category because products are associated with it");
    }
    throw error;
  }
};

