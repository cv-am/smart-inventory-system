import bcrypt from "bcryptjs";
import { findUserByEmail, findUserById, createUser } from "./query.js";
import { generateToken } from "../../utils/generateToken.js";
import { ApiError } from "../../utils/ApiError.js";

// Service: Register User
export const registerUserService = async ({ name, email, password, role = "staff" }) => {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Full name is required");
  }
  if (!email || !email.trim()) {
    throw new ApiError(400, "Valid email address is required");
  }
  if (!password || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already registered
  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  // Hash password with salt rounds = 10
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const validRole = role === "admin" ? "admin" : "staff";
  const userId = await createUser(name.trim(), normalizedEmail, passwordHash, validRole);

  // Generate JWT token
  const token = generateToken({
    id: userId,
    email: normalizedEmail,
    role: validRole,
  });

  return {
    user: {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      role: validRole,
    },
    token,
  };
};

// Service: Login User
export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Compare password hash
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    },
    token,
  };
};

// Service: Get Current User Profile
export const getCurrentUserService = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

