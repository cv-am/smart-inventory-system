import {
  getAllUsersService,
  updateUserRoleService,
  deleteUserService,
} from "./service.js";

// GET /api/users
export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updatedUser = await updateUserRoleService(id, role, req.user.id);
    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteUserService(id, req.user.id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

