import {
  selectAllUsers,
  selectUserById,
  updateUserRoleQuery,
  deleteUserQuery,
} from "./query.js";
import { ApiError } from "../../utils/ApiError.js";

// Service: Get all users
export const getAllUsersService = async () => {
  return await selectAllUsers();
};

// Service: Update user role
export const updateUserRoleService = async (id, role, currentUserId) => {
  if (Number(id) === Number(currentUserId)) {
    throw new ApiError(400, "You cannot change your own role");
  }

  const validRoles = ["admin", "staff"];
  if (!validRoles.includes(role)) {
    throw new ApiError(400, `Invalid role. Allowed roles: ${validRoles.join(", ")}`);
  }

  const user = await selectUserById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await updateUserRoleQuery(id, role);
  return await selectUserById(id);
};

// Service: Delete user
export const deleteUserService = async (id, currentUserId) => {
  if (Number(id) === Number(currentUserId)) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const user = await selectUserById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await deleteUserQuery(id);
  return true;
};

