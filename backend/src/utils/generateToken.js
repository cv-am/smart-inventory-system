import jwt from "jsonwebtoken";

export const generateToken = (payload, expiresIn = "7d") => {
  const secret = process.env.JWT_SECRET || "smart_inventory_jwt_secret_key_2026";
  return jwt.sign(payload, secret, { expiresIn });
};

export default generateToken;

