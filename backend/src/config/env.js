import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory or workspace root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const isAiven = process.env.DB_HOST && process.env.DB_HOST.includes("aivencloud.com");

export const config = {
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET || "smart_inventory_jwt_secret_key_2026",
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "defaultdb",
    port: Number(process.env.DB_PORT) || 3306,
    ssl: process.env.DB_SSL === "true" || isAiven ? { rejectUnauthorized: false } : undefined,
  },
};
